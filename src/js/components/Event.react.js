(function () {
    "use strict";
    var React = require("react"),
        moment = require("moment"),
        eventTypes = require("../config/eventTypes");

    var Event = React.createClass({

        getInitialState: function () {
            return { open: false };
        },

        toggle: function () {
            this.setState({ open: !this.state.open });
        },

        render: function () {
            var event = this.props.event,
                classes = this.state.open ? "" : "closed",
                icon = (eventTypes.getType(this.props.event.type) || {}).icon;

            return (
                <div className={"event " + classes}>
                    <header>
                        <span className="title-bar" onClick={this.toggle}>
                            <span>
                                <i className={"fa " + icon}></i>&nbsp;
                                <em>{moment(event.date).format("DD-MM-YYYY")}</em> -&nbsp;
                                <strong>{event.title}</strong>
                            </span>
                        </span>
                        <span className="actions">
                            <a href="#" onClick={this.edit}><i className="fa fa-pencil"></i></a>&nbsp;
                            <a href="#" onClick={this.remove}><i className="fa fa-times"></i></a>
                        </span>
                    </header>
                    <p className={"toggle " + classes} dangerouslySetInnerHTML={{__html: event.text.replace(/\n/g, "<br>")}}></p>
                </div>
            );
        }
    });

    module.exports = Event;
}());
