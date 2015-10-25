/*global require, module*/
"use strict";
var React = require("react");

/**
 * compute and display stats on the given timeline
 *
 * @return {undefined}
 */
var TimelineStats = function ({stories}) {
    var nbStories = stories.length;

    var yearStats = stories
        .sort((e1, e2) => {
            if (e1.date === e2.date) { return 0; }
            return e1.date > e2.date ? 1 : -1;
        })
        .reduce((previous, story) => {
            var key = story.date.getFullYear().toString();
            previous[key] = previous[key] || 0;
            previous[key]++;
            return previous;
        }, {});
    var maxstoryPerYear = Math.max.apply(null, Object.keys(yearStats).map((year) => yearStats[year]));

    var yearStatsViews = [];
    for (var i in yearStats) {
        var percent = (yearStats[i] / maxstoryPerYear) * 100;
        yearStatsViews.push((
            <div key={i} className="year-stat">
                <div className="stat-filler" title={ yearStats[i] + " stories" }>
                    <div className="stat" style={{ height: percent + "%" }}></div>
                </div> {i}
            </div>
        ));
    }
    return (
        <div>
            <div>{nbStories} stories</div>
            {yearStatsViews}
        </div>
    );
};

module.exports = TimelineStats;
