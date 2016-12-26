import React, {Component} from 'react';
import {render, renderComponent} from 'Dep/turboRender';
import configAPP from 'configAPP';
// import socket from 'Dep/socket';
import Form from 'Dep/reactForm';

let config = {
    url: configAPP.API.prefix + '/auth/local',
    method: 'POST',
    redirect: '/',
    // socket: socket,
    elements: [
        {
            input: 'textArea',
            name: 'username',
            placeholder: 'Username or email'
        }, {
            type: 'password',
            name: 'password',
            placeholder: 'Password'
        }
    ]
    // debug: true
};

renderComponent((id) => {
    render(
        <div>
        <Form config={config} submit-block/>
        <p>Don't have an account?{' '}
            <a href='/auth/signup'>Sign Up</a>
        </p>
    </div>, id);

}, 'login');
