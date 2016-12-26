import React from 'react';
import socket from 'Dep/socket';

import moment from 'moment';
import differenceWith from 'lodash/differenceWith';
import isEqual from 'lodash/isEqual';
import some from 'lodash/some';

// import {differenceWith} from 'lodash/array';
// import {isEqual} from 'lodash/lang';

import anchor from 'sails/node_modules/anchor';
import configAPP, {timeAgoFormatter, capitalizeFirstLetter} from 'configAPP';

import {getPaths} from 'Dep/urlParams';
import {
    Modal,
    Button,
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
    HelpBlock,
    // Checkbox,
    ButtonInput
} from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';

import Datetime from 'react-datetime';

import Checkbox from 'Dep/react-awesome-boostrap-checkbox';

export default class ModalItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleHide = this.handleHide.bind(this);
        this.delete = this.delete.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleTypeahead = this.handleTypeahead.bind(this);
        this.getValidationState = this.getValidationState.bind(this);

        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);

        this.state = {
            form: {},
            formErrors: {},
            formSearchData: {},
            data: {},
            isCreateModal: true,
            disabled: true,
            model: window.___definition
        };
    }

    delete() {
        // If the modal is not to create a new entry
        if (!this.state.isCreateModal) {
            return socket.delete(configAPP.API.prefix + '/' + getPaths()[1] + '/' + this.props.data.id, (data) => {
                this.handleHide();
            });
        }
    }

    handleHide() {
        // If onHide is a function call that function
        // to hide the modal
        if (typeof this.props.onHide === 'function') {
            this.props.onHide();
        }
    }

    handleSubmit(e) {
        // prevent to reload the website
        e.preventDefault();

        // If the modal is not to create a new entry
        if (!this.state.isCreateModal)
            return socket.put(configAPP.API.prefix + '/' + getPaths()[1] + '/' + this.props.data.id, this.state.form, (resData, jwr) => {
                // console.log(resData, jwr);
                if (resData.invalidAttributes) {
                    this.setState({formErrors: resData.invalidAttributes})
                } else {
                    this.setState({formErrors: {}})
                }

                this.setState({disabled: true});
            });

        // else if the modal is to create a new entry
        // we make a post to the this.state.model url
        return socket.post(configAPP.API.prefix + '/' + getPaths()[1], this.state.form, (resData, jwr) => {
            // console.log(resData, jwr);
            if (resData.invalidAttributes) {
                this.setState({formErrors: resData.invalidAttributes})
            } else {
                this.setState({formErrors: {}})
            }

            if (jwr.statusCode === 201) {
                this.handleHide();
            }
        });

    }

    handleChange(e, key, collection, toWeb) {
        let searchBy = toWeb && toWeb.searchBy;

        if (collection && searchBy) {
            // if(some(this.state.data[key], e[i])) return e.splice(e[i]);
            let difference = differenceWith(this.state.data[key], e, isEqual),
                next = (e) => {
                    for (let i in e) {
                        // console.log(some(this.state.data[key], e[i]));
                        // console.log(this.state.data[key], e[i]);
                        if (e[i] && !some(this.state.data[key], e[i])) {
                            let id = (e[i][collection])
                                ? e[i][collection].id
                                : e[i].id;

                            socket.post(configAPP.API.prefix + '/' + getPaths()[1] + '/' + this.props.data.id + '/' + key + '/' + id,
                            (resData, jwr) => {
                                // console.log(resData, jwr.statusCode);
                            });
                        }
                    }
                }

                if (difference.length > 0) {
                    for (let i in difference) {
                        let id = (difference[i][collection])
                            ? difference[i][collection].id
                            : difference[i].id;

                        if (id) {
                            socket.delete(configAPP.API.prefix + '/' + getPaths()[1] + '/' + this.props.data.id + '/' + key + '/' + id,
                            (resData, jwr) => {
                                // console.log(resData, jwr.statusCode);
                                if (i == difference.length - 1) {
                                    next(e);
                                }
                            });
                        }
                    }
                } else {
                    next(e);
                }
            }
            // when any of the inputs change
            // we enable the buttons (like submit)
            // that are disabled by default
            this.setState({disabled: false});
            if (e) {
                // if it is a date picker
                if (e._d) {
                    return this.state.form[e.name] = new Date(e._d);
                }
                // if there is key, the e is an array and first child
                // of array contains id means that it is a Typeahead
                if (key && e[0]) {
                    if (this.state.model[key].collection)
                        return;

                    return this.state.form[key] = e[0].id;
                }

                if (e.target) {
                    // if it is a checkbox
                    if (e.target.type === 'checkbox') {
                        // We need to create a json if the this.state.model is an object
                        // we get the parent by spliting ':{' from the value
                        // of the input then we get the name of the parent key
                        let jsonParents = e.target.value.split(':{'),
                            firstJsonName = jsonParents[0];

                        if (jsonParents.length === 1) {
                            // and then we create the object from the parent key name
                            // and return the form ready to submit
                            return this.state.form[firstJsonName] = e.target.checked;
                        }

                        // if name of the object doesn't exist on the form json
                        // we create a new empty object
                        if (!this.state.form[firstJsonName]) {
                            this.state.form[firstJsonName] = {};
                        }

                        // and then we create the object from the parent key name
                        // and return the form ready to submit
                        return this.state.form[firstJsonName][jsonParents[1]] = e.target.checked;
                        // console.log(JSON.stringify('{'+jsonParents[0]+': '+e.target.checked+'}'))
                    }
                    // console.log(e.target.value);
                    // Then we return the form json ready to submit
                    return this.state.form[e.target.name] = e.target.value;
                }
            }
            return;
        }

        handleTypeahead(text, key, model, toWeb) {
            let searchBy = (toWeb && toWeb.searchBy)
                ? toWeb.searchBy
                : null;

            // if there's the key parameter passed to the function
            // it means that is a Typeahead input
            if (key) {
                delete this.state.formErrors[key];

                var data = {
                    q: text
                };

                if (searchBy) {
                    data.where = {};
                    data.where[model] = {
                        "!": [null]
                    };
                } else {
                    searchBy = model;
                }

                socket.request({
                    method: 'GET',
                    url: configAPP.API.prefix + '/' + searchBy + '/search',
                    data: data
                }, (data, res) => {
                    // console.log(data, res);
                    if (res.error) {
                        return;
                    }

                    let formSearchData = this.state.formSearchData;
                    formSearchData[key] = data;
                    this.setState({formSearchData: formSearchData});
                });
            }
        }

        getValidationState(key) {
            if (this.state.form && this.state.form[key]) {
                let rules = this.state.model[key];
                delete rules.unique;
                delete rules.model;
                delete rules.collection;
                delete rules.toWeb;

                let isInvalid = anchor(this.state.form[key]).to(rules);
                if (isInvalid) {
                    this.state.formErrors[key] = isInvalid;
                    return 'error';
                }

                delete this.state.formErrors[key];
                return 'success';
            }
            delete this.state.formErrors[key];
            return null;
        }

        componentWillReceiveProps(nextProps) {
            // perform any preparations for an upcoming update
            this.setState({
                data: (nextProps.data['id'])
                    ? nextProps.data
                    : window.___definition,
                isCreateModal: (nextProps.data && !nextProps.data['id'])
            });
        }

        render() {
            // the body function take two parameters
            // nodes that it's the object coming from the this.state.model
            // this function create all the inputs depending on
            // the object parameters
            // and the parentKey is the name if there is an object
            // inside the main object coming from the this.state.model

            let body = (nodes, parentKey) => {
                // the output array is the one that
                // is going to let react render the form inputs
                let output = [],
                    nodesToMap = (parentKey)
                        ? nodes
                        : this.state.model;

                // we map the nodes object coming from the this.state.model
                // and we extract the key
                Object.keys(nodesToMap).map((key) => {
                    // the identifier variable is to create at string
                    // if this object is inside another object
                    // if not the identifier it's going to be just the key
                    // the identifier then it's going to be passed
                    // to the react key for identification
                    let value,
                        identifier = (parentKey)
                            ? parentKey + ':{' + key
                            : key;

                    // if the key is id, createdAt or updatedAt
                    // we do not create a input because this data
                    // is create and updated by the server automaticly
                    // so the user can't change it
                    if (key === 'id' || key === 'createdAt' || key === 'updatedAt' || (!this.state.isCreateModal && nodesToMap[key].toWeb && nodesToMap[key].toWeb.encrypted)) {
                        return output.push(
                            <FormGroup key={key}>
                                <ControlLabel>{capitalizeFirstLetter(key)}</ControlLabel>
                                <FormControl.Static>
                                    {(!this.state.isCreateModal && nodesToMap[key].toWeb && nodesToMap[key].toWeb.encrypted)
                                        ? '********'
                                        : (!this.state.isCreateModal)
                                            ? nodes[key].toString()
                                            : '???'}
                                </FormControl.Static>
                            </FormGroup>
                        );
                    }

                    if (nodesToMap[key]) {
                        if (nodesToMap[key].enum) {
                            let options = nodesToMap[key].enum.map((value) => {
                                return (
                                    <option value={value} selected={(nodes[key] === value)}>{value}</option>
                                );
                            });

                            return output.push(
                                <FormGroup key={key}>
                                    <ControlLabel>{capitalizeFirstLetter(key)}</ControlLabel>
                                    <FormControl componentClass="select" placeholder="select" name={key} onChange={this.handleChange}>
                                        {options}
                                    </FormControl>
                                </FormGroup>
                            );
                        }

                        if (nodesToMap[key].collection || nodesToMap[key].model) {
                            if ((nodesToMap[key].collection && nodesToMap[key].toWeb.notEditable) || (nodesToMap[key].collection && this.state.isCreateModal)) {
                                return output.push(
                                    <FormGroup key={key}>
                                        <ControlLabel>{capitalizeFirstLetter(key)}</ControlLabel>
                                        <FormControl.Static>
                                            {(nodes[key] && nodes[key].length > 0)
                                                ? 'Total: ' + nodes[key].length
                                                : 'N/A'}
                                        </FormControl.Static>
                                    </FormGroup>
                                );
                            }

                            if (nodesToMap[key].toWeb && ((nodesToMap[key].toWeb.notEditable) || (nodesToMap[key].toWeb.editableOnCreate && !this.state.isCreateModal))) {
                                return output.push(
                                    <FormGroup key={key}>
                                        <ControlLabel>{capitalizeFirstLetter(key)}</ControlLabel>
                                        <FormControl.Static>
                                            {(nodes[key] && nodesToMap[key].toWeb.primary && nodes[key][nodesToMap[key].toWeb.primary])
                                                ? nodes[key][nodesToMap[key].toWeb.primary]
                                                : (nodes[key] && (nodes[key].id || nodes[key].length))
                                                    ? 'Yes'
                                                    : 'No'}
                                        </FormControl.Static>
                                    </FormGroup>
                                );
                            }
                            // nodesToMap[key].collection
                            // {(this.state.model[key] && this.state.model[key].toWeb)
                            // ? this.state.model[key].toWeb.primary
                            // : null}
                            return output.push(
                                <FormGroup key={key} className={(!this.state.formErrors[key] && this.state.formSearchData[key])
                                    ? 'has-success'
                                    : '' +
                                        ' ' + (this.state.formErrors[key]
                                        ? 'has-error'
                                        : '')}>
                                    {/* validationState={this.getValidationState(key)} */}
                                    <ControlLabel>{capitalizeFirstLetter(key)}</ControlLabel>
                                    <Typeahead onChange={e => this.handleChange(e, key, (nodesToMap[key].collection), this.state.model[key].toWeb)} onInputChange={text => this.handleTypeahead(text, key, this.state.model[key].model || this.state.model[key].collection || key, this.state.model[key].toWeb)} labelKey={o => (this.state.model[key].toWeb && this.state.model[key].toWeb.primary && o[this.state.model[key].toWeb.primary])
                                        ? `${o[this.state.model[key].toWeb.primary]}`
                                        : (this.state.model[key].toWeb && this.state.model[key].toWeb.primary && this.state.model[key].toWeb.searchBy && o[this.state.model[key].toWeb.searchBy][this.state.model[key].toWeb.primary])
                                            ? `${o[this.state.model[key].toWeb.searchBy][this.state.model[key].toWeb.primary]}`
                                            : `${o.id}`} multiple={(nodesToMap[key].collection)} options={(this.state.formSearchData[key])
                                        ? this.state.formSearchData[key]
                                        : []} defaultSelected={(nodesToMap[key].collection && nodes[key] && nodes[key][0])
                                        ? nodes[key]
                                        : (nodes[key] && nodes[key].id)
                                            ? [nodes[key]]
                                            : []}/>
                                    <FormControl.Feedback/> {this.state.formErrors[key] && this.state.formErrors[key].map((error) => {
                                        return (
                                            <HelpBlock >{error.message}</HelpBlock>
                                        )
                                    })}
                                </FormGroup>
                            );
                        }

                        if (nodesToMap[key].type === 'datetime') {
                            let valid = (current) => {
                                    return current.isAfter(Datetime.moment().subtract(1, 'day'));
                                },
                                changeDate = (moment) => {
                                    moment.name = key;
                                    return this.handleChange(moment);
                                };

                            return output.push(
                                <FormGroup key={key}>
                                    <ControlLabel>{capitalizeFirstLetter(key)}</ControlLabel>
                                    <Datetime input={false} isValidDate={valid} name={key} defaultValue={value || nodes[key]} onChange={changeDate}/>
                                </FormGroup>
                            );
                        }
                    }

                    if (moment(nodes[key], moment.ISO_8601, true).isValid()) {
                        return output.push(
                            <div key={key}>
                                {capitalizeFirstLetter(key)}
                                {nodes[key]}
                            </div>
                        );
                    }

                    // if the node is a boolean means that it is a Checkbox
                    // or if instead this is a create modal
                    // we check the object of the modal to check
                    // if the type of the node is a boolean
                    // if any is true we create a Checkbox with the value
                    if (typeof nodes[key] === 'boolean' || (nodesToMap[key] && nodesToMap[key].type === 'boolean')) {
                        let defaultChecked = nodes[key];
                        if (typeof defaultChecked === 'object') {
                            defaultChecked = false;
                        }

                        return output.push(
                            <Checkbox key={identifier} inline defaultChecked={defaultChecked} defaultValue={identifier} onChange={this.handleChange}>
                                {' ' + capitalizeFirstLetter(key) + ' '}
                            </Checkbox>
                        );
                    }

                    // if the node from the map is an object and it's not
                    // a create modal we call the body function again
                    // but just with this object so it can map this object
                    // and get all the inputs inside the object
                    //////////////////////////////////////////////////////
                    // this is the case were we pass parentKey
                    // to the body function
                    if (nodesToMap[key] && typeof nodesToMap[key].defaultsTo === 'object') {
                        return output.push(
                            <FormGroup key={key}>
                                <ControlLabel>{capitalizeFirstLetter(key)}</ControlLabel>
                                <FormGroup key={key} type={key}>
                                    {body(nodesToMap[key].defaultsTo, key)}
                                </FormGroup>
                            </FormGroup>
                        );
                    }

                    // if any of the if statements below we get here
                    // were we create a normal input
                    return output.push(
                        <FormGroup key={identifier} validationState={this.getValidationState(key)}>
                            <ControlLabel>{capitalizeFirstLetter(key)}</ControlLabel>
                            <FormControl type={key} defaultValue={(!this.state.isCreateModal)
                                ? value || nodes[key]
                                : ''} onChange={this.handleChange} name={key}/>
                            <FormControl.Feedback/> {this.state.formErrors[key] && this.state.formErrors[key].map((error) => {
                                return (
                                    <HelpBlock >{error.message}</HelpBlock>
                                )
                            })}
                        </FormGroup>
                    );
                });
                // after all we return the output to react to render
                return output;
            }

            // we create a deleteButton that by default is null
            // if this is not a create modal we create a delete Button
            // that it onClick it calls the delete function
            let deleteButton = null;
            if (!this.state.isCreateModal) {
                deleteButton = <Button bsStyle="danger" onClick={this.delete}>
                    Delete
                </Button>
            }

            // we render the modal from boostrap
            // passing all the corresponding parameters
            // and we call the body function to create the Form
            // and we just pass the data coming from the props
            return (
                <Modal show={this.props.show} onHide={this.handleHide}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={this.handleSubmit}>
                        <Modal.Body>
                            {body(this.state.data)}
                        </Modal.Body>
                        <Modal.Footer style={{
                            textAlign: 'left'
                        }}>
                            {deleteButton}
                            <span style={{
                                float: 'right'
                            }}>
                                <Button bsStyle="primary" type="submit" disabled={this.state.disabled}>
                                    Submit
                                </Button>
                                <Button onClick={this.handleHide}>Close</Button>
                            </span>
                        </Modal.Footer>
                    </Form>
                </Modal>
            );
        }
    }
