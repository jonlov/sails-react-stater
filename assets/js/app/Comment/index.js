import React from 'react';
import {render, renderComponent} from 'Dep/turboRender';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import socket from 'Dep/socket';

renderComponent((id) => {
    render(
        <CommentForm/>, 'commentForm');

    // initialize the view with the data property
    render(
        <CommentList/>, 'commentList');

}, 'Comment');
