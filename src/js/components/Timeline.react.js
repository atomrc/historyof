/*global require, module*/
"use strict";
var React = require("react"),
    WriteButton = require("./WriteButton.react"),
    StoryForm = require("./StoryForm.react"),
    TimelineStats = require("./TimelineStats.react"),
    Year = require("./Year.react");

/**
 * Will handle and display all the story of the timeline
 *
 * @return {undefined}
 */
var Timeline = function(props) {
    let {user, stories, onEditStory, onSaveStory} = props;
    var yearNodes = [],
        groupedStories = stories
            .sort(function (e1, e2) {
                if (e1.date === e2.date) { return 0; }
                return e1.date > e2.date ? -1 : 1;
            })
            .reduce(function (obj, e) {
                var key = e.date.getFullYear().toString();
                if (!obj[key]) { obj[key] = []; }
                obj[key].push(e);
                return obj;
            }, {});

    for (var i in groupedStories) {
        yearNodes.push((
            <Year
                {...props}
                key={"year-" + i}
                year={i}
                stories={groupedStories[i]}/>
        ));
    }

    var content = yearNodes.length === 0 ?
        (<div>No story yet</div>) :
        (<div className="stories-container fluid-content">{yearNodes}</div>);

    return (
        <div className="timeline">
            <div className="timeline-header">
                <table className="fluid-content">
                    <tbody>
                        <tr>
                            <td>
                                <h1>{user.pseudo}'s timeline</h1>
                                <TimelineStats stories={stories}/>
                            </td>
                            <td>
                                <WriteButton onClick={() => onEditStory({date: new Date()})}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {content}
            <StoryForm onSave={(story) => onSaveStory(story)}/>
        </div>
    );
};

Timeline.propTypes = {
    stories: React.PropTypes.array.isRequired,
    onEditStory: React.PropTypes.func.isRequired,
    onSaveStory: React.PropTypes.func.isRequired
}

module.exports = Timeline;
