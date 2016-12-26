import React from 'react';
import socket from 'Dep/socket';
import Showdown from 'showdown';

import moment from 'moment';
import TimeAgo from 'react-timeago';
import {timeAgoFormatter, capitalizeFirstLetter} from 'configAPP';

import Checkbox from 'Dep/react-awesome-boostrap-checkbox';
// import {Checkbox} from 'react-bootstrap';

let converter = new Showdown.Converter();

export default class Node extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let nodes = (nodes) => {
            let output = [];
            output.push(
                <td key="">
                    <Checkbox className="checkbox-no-label" defaultChecked={false} defaultValue={nodes.id} onChange={this.props.onSelect} />
                </td>
            );

            Object.keys(window.___definition).map((key) => {
                if (window.___definition[key].defaultsTo && !nodes[key]) {
                    nodes[key] = window.___definition[key].defaultsTo;
                }

                if (window.___definition[key].toWeb && window.___definition[key].toWeb.encrypted) {
                    return output.push(
                        <td key={key} onClick={this.props.onClick} role="button">********</td>
                    )
                }

                if (window.___definition[key].type === 'boolean') {
                    return output.push(
                        <td key={key} onClick={this.props.onClick} role="button">{(nodes[key])
                                ? 'Yes'
                                : 'No'}</td>
                    );
                }

                if (window.___definition[key].collection || window.___definition[key].model) {
                    if (nodes[key]) {
                        if (typeof nodes[key].length === 'number') {
                            return output.push(
                                <td key={key} onClick={this.props.onClick} role="button">
                                    {(nodes[key].length > 0)
                                        ? 'Total: ' + nodes[key].length
                                        : 'N/A'}
                                    </td>
                            );
                        }

                        if (window.___definition[key].toWeb && nodes[key][window.___definition[key].toWeb.primary]) {
                            return output.push(
                                <td key={key} onClick={this.props.onClick} role="button">{nodes[key][window.___definition[key].toWeb.primary]}
                                </td>
                            );
                        }
                    }

                    return output.push(
                        <td key={key} onClick={this.props.onClick} role="button">{(nodes[key])
                                ? 'Yes'
                                : 'No'}
                        </td>
                    );
                }

                if (!nodes[key]) {
                    return output.push(
                        <td key={key} onClick={this.props.onClick} role="button"></td>
                    );
                }

                if (typeof nodes[key] === 'object') {
                    return output.push(
                        <td key={key} onClick={this.props.onClick} role="button">{Object.keys(nodes[key]).map((key2) => {
                                return (
                                    <span key={key2}>{capitalizeFirstLetter(key2) + ': '} {(nodes[key][key2])
                                            ? 'Yes'
                                            : 'No'}<br/></span>
                                );
                            })}</td>
                    );
                }

                if (moment(nodes[key], moment.ISO_8601, true).isValid()) {
                    return output.push(
                        <td key={key} onClick={this.props.onClick} role="button">
                            <TimeAgo date={nodes[key]} formatter={timeAgoFormatter}/>
                        </td>
                    );
                }

                return output.push(
                    <td key={key} onClick={this.props.onClick} role="button" dangerouslySetInnerHTML={{
                        __html: new Showdown.Converter().makeHtml(nodes[key].toString())
                    }}></td>
                );
            });
            return output;
        };
        return (
            <tr>
                {nodes(this.props.data)}
            </tr>
        );
    }
}
