(function () {
    "use strict";
    var React = require("react"),
        Month = require("./Month.react"),
        EventsStats = require("./EventsStats.react"),
        moment = require("moment");

    var Year = React.createClass({
        getInitialState: function () {
            return { open: false };
        },

        requestEdition: function (event) {
            return this.props.onRequestEdition && this.props.onRequestEdition(event);
        },

        requestCreation: function (type, date) {
            date.setYear(this.props.year);
            return this.props.onRequestCreation && this.props.onRequestCreation("email", date);
        },

        toggle: function () {
            this.setState({ open: !this.state.open });
        },

        render: function () {
            var monthNodes = [],
                groupedEvents = !this.state.open ?
                    {} :
                    this
                        .props
                        .events
                        .sort(function (e1, e2) {
                            if (e1.date === e2.date) { return 0; }
                            return e1.date < e2.date ? -1 : 1;
                        })
                        .reduce(function (obj, e) {
                            var key = moment(e.date).format("MMMM");
                            if (!obj[key]) { obj[key] = [] }
                            obj[key].push(e);
                            return obj;
                        }, {});

            for (var i in groupedEvents) {
                monthNodes.push((
                    <Month
                        key={"month-" + i}
                        events={groupedEvents[i]}
                        month={i}
                        onRequestEdition={this.requestEdition}
                        onRequestCreation={this.requestCreation}
                        />
                ));
            }

            return (
                <div className="year">
                    <h2 onClick={this.toggle}>
                        {this.props.year}
                    </h2>
                    <EventsStats events={this.props.events}/>
                    <div>{monthNodes}</div>
                </div>
            );
        }
    });

    module.exports = Year;
}());
