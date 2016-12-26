import React from 'react';

import configAPP, {capitalizeFirstLetter} from 'configAPP';

import Node from './Node';
import ModalItem from './ModalItem';

import {changeUrlParam, getUrlParam, getPaths} from 'Dep/urlParams';
import socket from 'Dep/socket';

import {
    Table,
    Pagination,
    Button,
    Form,
    FormGroup,
    FormControl,
    ControlLabel
} from 'react-bootstrap';

export default class List extends React.Component {
    constructor(props) {
        super(props);
        this.loadDataFromServer = this.loadDataFromServer.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteItemsToAction = this.deleteItemsToAction.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.setSort = this.setSort.bind(this);

        this.state = {
            showModal: false,
            dataModal: {},
            itemsToAction: [],
            disableItemsToAction: true,
            searchQuery: getUrlParam('search') || '',
            data: [],
            skip: 0,
            perPage: 10,
            pageNum: 1,
            totalItems: 1,
            sort: getUrlParam('sort') || 'createdAt DESC',
            changePage: (page) => {
                // page = page - 1;
                this.state.skip = (page - 1) * this.state.perPage;
                this.state.selected = page;

                this.loadDataFromServer();
            },
            selected: (getUrlParam('page') > 0)
                ? (getUrlParam('page') * 1)
                : 1
        };
    }

    loadDataFromServer(pageNum) {
        let data = {
                limit: this.state.perPage,
                skip: pageNum || this.state.skip,
                sort: this.state.sort
            },
            or = [];

        // if (window.___definition)
        //     Object.keys(window.___definition).map((key) => {
        //         if (key != 'id' && key != 'updatedAt' && key != 'createdAt') {
        //             let obj = {};
        //             obj[key] = {
        //                 'contains': this.state.searchQuery
        //             };
        //             or.push(obj);
        //         }
        //     });
        //
        // if (or.length > 0)
        //     data['or'] = or;

        if (window.___definition)
            Object.keys(window.___definition).map((key) => {
                if (window.___definition[key].toWeb && window.___definition[key].toWeb.populate) {
                    if (!data['populate']) {
                        data['populate'] = '';
                    } else {
                        data['populate'] += ',';
                    }
                    data['populate'] += window.___definition[key].toWeb.populate;
                }
            });

        // Subscribe to updates (a ?limit=5 sails get or post will auto subscribe to updates)
        socket.request({
            method: 'GET',
            url: configAPP.API.prefix + '/' + this.props.api,
            data: data,
            headers: {
                'count': true
            }
        }, (data, res) => {
            if (res.error) {
                return;
            }
            // console.log(data, res);
            this.setState({
                totalItems: res.headers.count || this.state.totalItems
            });

            this.setState({
                data: data,
                pageNum: Math.ceil(this.state.totalItems / this.state.perPage)
            });
        });
    }

    componentDidMount() {
        this.loadDataFromServer(((getUrlParam('page') - 1) * this.state.perPage));

        // Listen for changes from backend
        socket.on(this.props.api, (message) => {
            this.loadDataFromServer();

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
            }
        }, () => {
            socket.off(this.props.api);
        });
    }

    handlePageClick(data) {
        changeUrlParam('page', data);
    }

    handleChange(e) {
        return this.setState({searchQuery: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        changeUrlParam({'search': this.state.searchQuery, page: 1});
    }

    toggleModal(e, dataModal) {
        this.setState({
            showModal: !this.state.showModal,
            dataModal: (typeof dataModal === 'object')
                ? dataModal
                : {}
        });
    }

    deleteItemsToAction() {
        if (this.state.itemsToAction.length > 0) {
            return socket.delete(configAPP.API.prefix + '/' + getPaths()[1] + '/' + this.state.itemsToAction[0], (data) => {
                this.state.itemsToAction.splice(0, 1);
                this.deleteItemsToAction();
            });
        }

        this.setState({
            disableItemsToAction: (this.state.itemsToAction.length === 0)
        });

    }

    handleSelect(e) {
        let found = this.state.itemsToAction.indexOf(e.target.value);
        if (found > -1) {
            // Element was found, remove it.
            this.state.itemsToAction.splice(found, 1);
        } else {
            // Element was not found, add it.
            this.state.itemsToAction.push(e.target.value);
        }

        this.setState({
            disableItemsToAction: (this.state.itemsToAction.length === 0)
        });
    }
    itemsToActionEmpty() {
        return (this.state.itemsToAction.length === 0);
    }

    setSort(e) {
        let sortValue = e.target.id + ' DESC',
            sortState = this.state.sort.split(' ');

        if (sortState[0] === sortValue.split(' ')[0]) {
            if (sortState[1] === 'DESC') {
                sortState[1] = 'ASC';
            } else {
                sortState[1] = 'DESC';
            }
            sortValue = sortState.join(' ');
        }

        changeUrlParam('sort', sortValue);
    }

    render() {
        let url = this.props.url,
            keys = (window.___definition)
                ? Object.keys(window.___definition).map((key) => {
                    let sort = this.state.sort.split(' ');
                    return (
                        <th key={key} id={key} className={(sort[0] === key)
                            ? 'sorting_' + sort[1].toLowerCase()
                            : 'sorting'} onClick={this.setSort} role="button">{capitalizeFirstLetter(key)}</th>
                    );
                })
                : null,
            nodeList = this.state.data.map((data, index) => {
                return (<Node key={data.id} data={data} onSelect={this.handleSelect} onClick={e => this.toggleModal(e, data)}/>);
            });
        return (
            <div>
                <Form onSubmit={this.handleSubmit} inline>
                    <a className="btn btn-default" href="/admin">
                        <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                    </a>
                    {/* PATH NAME */}
                    {/* <span className="h2">{' ' + capitalizeFirstLetter(getPaths()[1]) + ' '}</span> */}
                    <Button bsStyle="primary" onClick={this.toggleModal}>Create new</Button>
                    <FormGroup validationState={'success'} style={{
                        float: 'right'
                    }}>
                        <FormControl type="text" name="search" onChange={this.handleChange} defaultValue={this.state.searchQuery}/>
                        <Button type="submit">
                            Search
                        </Button>
                    </FormGroup>
                </Form>
                <Table responsive className="table  display table-hover contact-list dataTable">
                    <thead>
                        <tr>
                            <th></th>
                            {keys}
                        </tr>
                    </thead>
                    <tbody>
                        {nodeList}
                    </tbody>
                </Table>
                <ModalItem show={this.state.showModal} onHide={this.toggleModal} data={this.state.dataModal}/>
                <Button bsStyle="danger" onClick={this.deleteItemsToAction} disabled={this.state.disableItemsToAction}>
                    Delete selected
                </Button>
                <Pagination style={{
                    float: 'right',
                    margin: 0
                }} prev next first last ellipsis boundaryLinks maxButtons={5} bsSize="md" items={this.state.pageNum} activePage={this.state.selected} onSelect={this.handlePageClick}/>
            </div>
        );
    }
}
