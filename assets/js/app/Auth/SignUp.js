import React, {Component} from 'react';
import {render, renderComponent} from 'Dep/turboRender';
import configAPP from 'configAPP';
// import socket from 'Dep/socket';
import Form from 'Dep/reactForm';

let config = {
    url: configAPP.API.prefix + '/user/',
    method: 'POST',
    redirect: '/',
    // socket: socket,
    elements: [
        {
            input: 'textArea',
            name: 'username',
            placeholder: 'Username'
        }, {
            input: 'textArea',
            name: 'email',
            placeholder: 'Email'
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
        <p>Already have an account?{' '}
            <a href='/auth/login'>Log In</a>
        </p>
    </div>, id);

}, 'signup');
