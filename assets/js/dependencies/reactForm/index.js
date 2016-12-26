import React from 'react';
// import axios from 'axios';

export default class Form extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.config = {};
    }

    handleSubmit(e) {
        e.preventDefault();
        let formToSend = {};
        this.props.config.elements.map((element, index) => {
            formToSend[element.name] = this.refs[element.name].value.trim();
        });

        this.onSubmit(formToSend);
        return false;
    }

    onSubmit(formToSend) {
        let config = this.props.config,
            _this = this;

        if (!config.method) {
            config.method = 'get';
        } else {
            config.method = config.method.toLowerCase();
        }

        if (config.socket)
            return config.socket[config.method](config.url, formToSend, (data, res) => {
                _this.responseHandler(res);
            });

        $[config.method](config.url, formToSend, (data, res, xhr) => {
            _this.responseHandler(xhr);
        });

        // axios({method: config.method, url: config.url, responseType: 'json', data: formToSend}).then(res => {
        //     _this.responseHandler(res);
        //
        // }).catch(error => {
        //     _this.responseHandler(error.response);
        // });
    }

    responseHandler(res) {
        console.log(res);
        let config = this.props.config;

        if (res) {
            if ((res.status == 200 || res.statusCode == 200) && config.redirect && !config.debug) {
                if (Turbolinks)
                    return Turbolinks.visit(config.redirect);
                else
                    return window.location.href = config.redirect;
                }
            }

        if (config.debug && res) {
            console.log('Response :: ', res);
        }
    }

    render() {
        let formElements = this.props.config.elements.map((element, index) => {
                return (
                    <div key={index} className="form-group">
                        <label>{element.placeholder || "Input " + index}</label>
                        <input className="form-control" type={element.type || "text"} placeholder={element.placeholder || "Input " + index} ref={element.name}/>
                    </div>
                //<div key={index} className="station">{station.call}</div>
                );
            }),
            submitClass = 'btn btn-primary';

        if (this.props['submit-block'])
            submitClass += ' btn-block';

        return (
            <form className="commentForm" onSubmit={this.handleSubmit} role="form">
                {formElements}
                <div className="form-group">
                    <button type="submit" className={submitClass} value="Submit">Submit</button>
                </div>
            </form>

        );
        // return (
        //     <form className="commentForm" onSubmit={this.handleSubmit} role="form">
        //         <div className="form-group">
        //           {this.username}
        //             <label>Email or username</label>
        //             <input className="form-control" type="text" placeholder="Email or username" ref="identifier"/>
        //         </div>
        //         <div className="form-group">
        //             <label>Password</label>
        //             <input className="form-control" placeholder="Password" ref="password"/>
        //         </div>
        //         <button type="submit" className="btn btn-default" value="Submit">Submit</button>
        //     </form>
        // );
    }
}
