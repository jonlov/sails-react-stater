import React from 'react';
import socket from 'Dep/socket';

export default class CommentForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        let author = this.refs.author.value.trim();
        let text = this.refs.text.value.trim();
        this.onCommentSubmit({author: author, text: text});
        this.refs.text.value = '';
        return false;
    }

    onCommentSubmit(comment) {
        socket.post('/api/comment', comment, function whenServerResponds(data) {
            // console.log('Message posted :: ', data);
        });
    }

    render() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit} role="form">
                <div className="form-group">
                    <label>Name</label>
                    <input className="form-control" type="text" placeholder="Your name" ref="author"/>
                </div>
                <div className="form-group">
                    <label>Comment</label>
                    <input className="form-control" placeholder="Markdown something..." ref="text"/>
                </div>
                <button type="submit" className="btn btn-default" value="Submit">Submit</button>
            </form>
        );
    }
}
