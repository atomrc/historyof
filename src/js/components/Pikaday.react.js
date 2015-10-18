/*global require*/
(function () {
    "use strict";
    var React = require("react"),
        Pikaday = require("pikaday"),
        moment = require("moment");

    var PikadayReact = React.createClass({

        componentDidMount: function () {
            var input = this.refs.dateInput;
            new Pikaday({
                field: input,
                onSelect: this.props.onChange,
                defaultDate: this.props.value,
                setDefaultDate: true
            });
        },

        render: function () {
            return (<span>
                <button className="pikaday-button" type="button" ref="dateInput"><i className="fa fa-calendar"></i></button>
                <span>{moment(this.props.value).format("DD MMM YYYY")}</span>
            </span>);
        }
    });

    module.exports = PikadayReact;
}());
