(function () {
    "use strict";
    var React = require("react"),
        moment = require("moment"),
        appDispatcher = require("../dispatcher/appDispatcher"),
        eventActions = require("../dispatcher/eventActions"),
        PureRenderMixin = require('react/addons').addons.PureRenderMixin,
        eventTypes = require("../config/eventTypes");

    var Event = React.createClass({

        mixins: [PureRenderMixin],

        getInitialState: function () {
            return { open: false };
        },

        toggle: function () {
            this.setState({ open: !this.state.open });
        },

        remove: function (e) {
            if (window.confirm("confirm delete?")) {
                appDispatcher.dispatch(eventActions.remove, this.props.event);
            }
        },

        edit: function () {
            document.dispatchEvent(new CustomEvent("edit", { detail: this.props.event }));
        },

        render: function () {
            var event = this.props.event,
                classes = this.state.open ? "" : "closed",
                icon = (eventTypes.getType(this.props.event.type) || {}).icon;

            if (event.frontId) {
                classes += " saving";
            }

            return (
                <div className={"event " + classes}>
                    <header>
                        <span className="title-bar" onClick={this.toggle}>
                            <span>
                                <i className={"fa " + icon}></i>&nbsp;
                                <em>{moment(event.date).format("DD-MM-YYYY")}</em> -&nbsp;
                                <strong>{event.title || event.text.substr(0, 40).concat("...")}</strong>
                            </span>
                        </span>
                        <span className="actions">
                            <a href="javascript:void(0)" onClick={this.edit}><i className="fa fa-pencil"></i></a>&nbsp;
                            <a href="javascript:void(0)" onClick={this.remove}><i className="fa fa-times"></i></a>
                        </span>
                    </header>
                    <p className={"toggle " + classes} dangerouslySetInnerHTML={{__html: event.text.replace(/\n/g, "<br>")}}></p>
                </div>
            );
        }
    });

    module.exports = Event;
}());
