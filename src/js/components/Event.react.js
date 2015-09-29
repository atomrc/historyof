/*global module, require*/
(function () {
    "use strict";
    var React = require("react"),
        moment = require("moment"),
        eventActions = require("../actions/eventActions"),
        PureRenderMixin = require("react-addons-pure-render-mixin");

    var Event = React.createClass({

        mixins: [PureRenderMixin],

        getInitialState: function () {
            return { open: false };
        },

        toggle: function () {
            this.setState({ open: !this.state.open });
        },

        edit: function (/*e*/) {
            eventActions.edit(this.props.event);
        },

        remove: function (e) {
            e.stopPropagation();
            if (window.confirm("confirm delete?")) {
                eventActions.remove(this.props.event);
            }
        },

        render: function () {

            var event = this.props.event,
                classes = this.state.open ? "" : "closed";

            return (
                <div className={"event " + classes}>
                    <header onClick={this.toggle}>
                        <div className="infos">
                            <div>
                                <em className="date">
                                    {moment(event.date).format("DD MMM")}
                                </em>
                            </div>
                            <div>
                                <strong>{event.title || (event.description || "").substr(0, 100).concat("...")}</strong>
                            </div>
                            <div className="actions">
                                <a onClick={this.edit}><i className="fa fa-pencil"></i></a>&nbsp;
                                <a onClick={this.remove}><i className="fa fa-trash"></i></a>
                            </div>
                        </div>
                    </header>
                    <p className={"toggle " + classes} dangerouslySetInnerHTML={{__html: (event.description || "").replace(/\n/g, "<br>")}}></p>
                </div>
            );
        }
    });

    module.exports = Event;
}());
