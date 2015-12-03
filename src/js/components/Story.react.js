/*global module, require*/
"use strict";
var React = require("react"),
    moment = require("moment");

var Story = React.createClass({

    getInitialState: function () {
        return { open: false };
    },

    toggle: function () {
        this.setState({ open: !this.state.open });
    },

    edit: function (e) {
        e.stopPropagation();
        this.props.onEditStory(this.props.story);
    },

    remove: function (e) {
        e.stopPropagation();
        if (window.confirm("confirm delete?")) {
            this.props.onRemoveStory(this.props.story);
        }
    },

    render: function () {

        var story = this.props.story,
            classes = this.state.open ? "" : "closed";

        return (
            <div className={"story " + classes}>
                <header onClick={this.toggle}>
                    <div className="infos">
                        <div>
                            <em className="date">
                                {moment(story.date).format("DD MMM")}
                            </em>
                        </div>
                        <div>
                            <strong>{story.title || (story.description || "").substr(0, 100).concat("...")}</strong>
                        </div>
                        <div className="actions">
                            <a onClick={this.edit}><i className="fa fa-pencil"></i></a>&nbsp;
                            <a onClick={this.remove}><i className="fa fa-trash"></i></a>
                        </div>
                    </div>
                </header>
                <p className={"toggle " + classes} dangerouslySetInnerHTML={{__html: (story.description || "").replace(/\n/g, "<br>")}}></p>
            </div>
        );
    }
});

Story.propTypes = {
    story: React.PropTypes.object.isRequired
};

module.exports = Story;
