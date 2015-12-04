/*global module, require*/
"use strict";
var React = require("react");

var Tag = function ({tag}) {
    return (
        <a className="tag" href={"#" + tag.title}><em>{tag.title}</em></a>
    );
};

Tag.PropTypes = {
    tag: React.PropTypes.object.isRequired
};

module.exports = Tag;
