/*global require*/
(function () {
    "use strict";
    var React = require("react"),
        Pikaday = require("pikaday");

    var PikadayReact = React.createClass({

        componentDidMount: function () {
            var input = this.refs.dateInput;
            var picker = new Pikaday({
                field: input,
                onSelect: this.props.onChange,
                defaultDate: this.props.value,
                setDefaultDate: true
            });
        },

        render: function () {
            return (<input type="text" ref="dateInput"/>);
        }
    });

    module.exports = PikadayReact;
}());
