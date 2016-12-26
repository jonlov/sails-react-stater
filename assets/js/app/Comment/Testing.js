import React from 'react';

export default class Testing extends React.Component {
    constructor(props) {
        super(props)
    }
    componentWillMount() {
        console.log("Yay!");
    }
    render() {
        return (
            <span>beath</span>
        );
    }
}

// var elements = document.querySelectorAll('.item-list__child-item');
//
// var initialvalues = Array.prototype.slice
//   .call(elements)
//   .map(function (div) {
//     return div.innerHTML;
//   });
//
// React.render(<Page items={initialvalues} />, document.body);
