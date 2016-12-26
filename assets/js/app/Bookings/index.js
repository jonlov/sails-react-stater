import React, {Component} from 'react';
import {render, renderComponent} from 'Dep/turboRender';
import CommentList from './CommentList';
import socket from 'Dep/socket';

renderComponent((id) => {
    // initialize the view with the data property
    render(
        <CommentList/>, id);

},'Bookings');
