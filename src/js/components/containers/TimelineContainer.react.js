/*global require, module*/
var React = require("react"),
    connect = require("react-redux").connect,
    Timeline = require("../Timeline.react"),
    storyActions = require("../../actions/storyActions");

/**
 * Will handle and display all the stories of the timeline
 *
 * @return {undefined}
 */
var TimelineContainer = React.createClass({

    componentWillMount: function () {
        let { dispatch, token } = this.props;
        dispatch(storyActions.getAll(token));
    },

    handleEditStory: function (story) {
        this.props.dispatch(storyActions.edit(story));
    },

    handleSaveStory: function (story) {
        let {dispatch, token} = this.props;

        return story.id ?
            dispatch(storyActions.update(token, story)) :
            dispatch(storyActions.create(token, story));
    },

    handleRemoveStory: function (story) {
        this.props.dispatch(storyActions.remove(this.props.token, story));
    },

    render: function render() {
        let { user, stories } = this.props;

        if (!stories.length) {
            return (<div>loading...</div>);
        }

        return (
            <Timeline
                user={user}
                stories={stories}
                onEditStory={this.handleEditStory}
                onRemoveStory={this.handleRemoveStory}
                onSaveStory={this.handleSaveStory}
            />
        );
    }
});


function select(state) {
    return {
        user: state.user,
        stories: state.stories,
        token: state.token
    }
}

module.exports = connect(select)(TimelineContainer);
