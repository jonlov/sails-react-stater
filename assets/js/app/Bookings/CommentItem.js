import React from 'react';
import socket from 'Dep/socket';
import Showdown from 'showdown';

import TimeAgo from 'react-timeago'
import {timeAgoFormatter} from 'configAPP';

export default class CommentItem extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e) {
        socket.delete('/api/comment/' + this.props.commentid, (data) => {
            // console.log('Message deleted :: ', data);
        });
    }

    render() {
        let rawMarkup = new Showdown.Converter().makeHtml(this.props.children.toString()),
            t = new Date(this.props.time);
        return (
            <div className="comment">
                <hr/>
                <h4 className="commentAuthor">{this.props.author}
                    <small>{' '}commented{' '}
                        <TimeAgo date={t} formatter={timeAgoFormatter}/></small>
                    <button type="button" className="close" aria-hidden="true" onClick={this.handleClick}>&times;</button>
                </h4>
                <span dangerouslySetInnerHTML={{
                    __html: rawMarkup
                }}/>
            </div>
        );
    }
}
