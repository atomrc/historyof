/*global module, require*/
var React = require("react"),
    connect = require("react-redux").connect,
    storyActions = require("../actions/storyActions"),
    Pikaday = require("./Pikaday.react"),
    editedStoryActions = require("../actions/editedStoryActions"),
    ReactCSSTransitionGroup = require("react-addons-css-transition-group"),
    TagsInput = require("react-tagsinput");

var StoryForm = React.createClass({

    handleChange: function (e) {
        var target = e.target;
        var updates = {};
        updates[target.name] = target.value;

        this.props.dispatch(editedStoryActions.update(updates));
    },

    handleDateChange: function (timestamp) {
        this.props.dispatch(editedStoryActions.update({ date: new Date(+timestamp) }));
    },

    handleTagChange: function (tags) {
        this.props.dispatch(editedStoryActions.update({ tags: tags.map((tag) => { return {title: tag};}) }));
    },

    handleSave: function (e) {
        e.preventDefault();
        let {storyEditor, onSave} = this.props;
        return onSave(storyEditor.story);
    },

    handleCancel: function () {
        this.props.dispatch(storyActions.cancelEdit());
    },

    render: function () {
        let { story, isActive } = this.props.storyEditor;

        let content = !isActive ?
            (<span></span>) :
            (
                <div id="form-container" key="story-form">
                    <form id="story-form" onSubmit={this.handleSave}>
                        <div>
                            <input
                                type="text"
                                placeholder="Title"
                                name="title"
                                value={story.title || ""}
                                onChange={this.handleChange}
                                autoComplete="off"/>
                        </div>
                        <div>
                            <Pikaday onChange={this.handleDateChange} value={story.date}/>
                        </div>
                        <div>
                            <textarea
                                rows="2"
                                name="description"
                                placeholder="Your Story"
                                value={story.description || ""}
                                onChange={this.handleChange}/>

                        </div>
                        <div>
                            <TagsInput
                                value={(story.tags || []).map(tag => tag.title)}
                                onChange={this.handleTagChange}
                                addKeys={[32, 13]}/>
                        </div>
                        <div className="actions">
                            <a href="javascript:void(0)" onClick={this.handleCancel}>cancel</a>&nbsp;
                            <button className="flat-button">{ story.id ? "save" : "add" }</button>
                        </div>
                    </form>
                </div>
            )

        return (
            <ReactCSSTransitionGroup transitionName="fade" transitionEnterTimeout={500} transitionLeaveTimeout={1}>
                {content}
            </ReactCSSTransitionGroup>
        );
    }
});

StoryForm.PropTypes = {
    onSave: React.PropTypes.func.isRequired
};

function select(state) {
    return {
        storyEditor: state.storyEditor
    }
}
module.exports = connect(select)(StoryForm);
