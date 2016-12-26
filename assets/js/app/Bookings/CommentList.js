import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import CommentItem from './CommentItem';
import socket from 'Dep/socket';
import Pagination from 'react-bootstrap/lib/Pagination';
import {changeUrlParam, getUrlParam} from 'Dep/urlParams';
// import axios from 'axios';
// import $ from 'jquery';

export default class CommentList extends React.Component {
    constructor(props) {
        super(props);
        this.loadCommentsFromServer = this.loadCommentsFromServer.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.state = {
            data: [],
            skip: 0,
            perPage: 10,
            pageNum: 1,
            totalItems: 1,
            changePage: (page) => {
                page = page - 1;
                this.state.skip = page * this.state.perPage;
                this.state.selected = page;

                this.loadCommentsFromServer();
            },
            selected: (getUrlParam('page') > 0)
                ? (getUrlParam('page') * 1)
                : 1
        };
    }

    loadCommentsFromServer(pageNum) {
        // Subscribe to updates (a ?limit=5 sails get or post will auto subscribe to updates)
        socket.request({
            method: 'GET',
            url: '/api/comment',
            data: {
                limit: this.state.perPage,
                skip: pageNum || this.state.skip,
                sort: 'createdAt DESC'
            },
            headers: {
                'count': true
            }
        }, (data, res) => {
            if (res.error) {
                return;
            }

            this.setState({
                totalItems: res.headers.count || this.state.totalItems
            });

            this.setState({
                data: data,
                pageNum: Math.ceil(this.state.totalItems / this.state.perPage)
            });
        });

        // axios.get('/api/comment').then(res => {
        //     console.log('ho',res);
        //     this.setState({data: res.data});
        //
        // }).catch(error => {
        //     console.log(error);
        //     // this.setState({data: data});
        //
        // });
    }

    componentDidMount() {
        this.loadCommentsFromServer(((getUrlParam('page') - 1) * this.state.perPage));

        // Listen for Comment messages from Sails
        socket.on('comment', (message) => {
            this.loadCommentsFromServer();

            if (message && message.verb) {
                if (message.verb == "created" || message.verb == "destroyed") {

                    this.setState({
                        totalItems: this.state.totalItems + ((message.verb == "created") || -1)
                    });

                    let totalPages = Math.ceil(this.state.totalItems / this.state.perPage);
                    if (this.state.selected > totalPages) {
                        this.state.changePage(totalPages);
                    }
                }

                // if (message.verb == "created")
                //     data.push(message.data);
                // else if (message.verb == "destroyed")
                //     data.splice(data.indexOf(message.data));
                //
                // this.setState({data: data});
            }
        }, () => {
            socket.off('comment');
        });
    }

    handlePageClick(data) {
        changeUrlParam('page', data);

        // this.setState({
        //     selected: data.selected,
        //     skip: Math.ceil(data.selected * this.state.perPage)
        // }, () => {
        //     this.loadCommentsFromServer();
        // });
    };

    render() {
        let url = this.props.url,
            commentNodes = this.state.data.map((comment, index) => {
                return (
                    <CommentItem key={comment.id} author={comment.author} time={comment.createdAt} url={url} commentid={comment.id}>
                        {comment.text}
                    </CommentItem>
                );
            });
        return (
            <div className="commentList">
                <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                    {commentNodes}
                    <Pagination prev next first last ellipsis boundaryLinks maxButtons={5} bsSize="md" items={this.state.pageNum} activePage={this.state.selected} onSelect={this.handlePageClick}/>
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}
