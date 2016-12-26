import React, {Component} from 'react';
import {render, renderComponent} from 'Dep/turboRender';
import List from './List';
import socket from 'Dep/socket';
import {getPaths} from 'Dep/urlParams';

renderComponent((id) => {
    // initialize the view with the data property
    render(
        <List api={getPaths()[1]}/>, id);

}, 'Admin/*');
