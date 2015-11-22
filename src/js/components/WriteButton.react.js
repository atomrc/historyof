/*global module, require*/
"use strict";
var React = require("react");

var WriteButton = (props) => {
    return (
        <button className="flat-button" onClick={props.onClick}>
            <i className="fa fa-book"></i> I feel like writting :)
        </button>
    );
};

WriteButton.propTypes = {
    onClick: React.PropTypes.func.isRequired
}

module.exports = WriteButton;
