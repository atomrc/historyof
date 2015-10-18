/*global require, module*/
(function () {
    "use strict";
    var React = require("react"),
        WriteButton = require("./WriteButton.react"),
        EventForm = require("./EventForm.react"),
        Year = require("./Year.react");

    /**
     * Will handle and display all the event of the timeline
     *
     * @return {undefined}
     */
    var Timeline = function({user, events}) {
        var yearNodes = [],
            groupedEvents = events
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

        for (var i in groupedEvents) {
            yearNodes.push((
                <Year
                    key={"year-" + i}
                    year={i}
                    events={groupedEvents[i]}/>
            ));
        }

        var content = yearNodes.length === 0 ?
            (<div>No event yet</div>) :
            (<div className="events-container fluid-content">{yearNodes}</div>);

        return (
            <div className="timeline">
                <div className="timeline-header">
                    <table className="fluid-content">
                        <tbody>
                            <tr>
                                <td>
                                <h1>{user.pseudo}'s timeline</h1>
                                <span>{events.length} events</span>
                                </td>
                                <td>
                                <WriteButton/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {content}
                <EventForm/>
            </div>
        );
    };

    module.exports = Timeline;
}());
