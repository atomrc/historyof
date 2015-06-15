/*global require, module */
(function () {
    "use strict";

    var React = require("react");

    var UserLoginInput = React.createClass({

        getInitialState: () => {
            return {
                checking: false
            };
        },

        onChange: (e) => {
            var input = React.findDOMNode(this.refs.loginInput);
            this.setState({ checking: true });

            //invalidate the input before the async check
            input.setCustomValidity(false);

            window.setTimeout(function () {
                //tell the parent to recheck the validity of the form
                input.setCustomValidity("");
                this.setState({ checking: false });
                this.props.onValid();
            }.bind(this), 1000);

            //udpate the parent model
            this.props.onChange(e);
        },

        render: function () {

            var loadingClass = this.state.checking ?
                "loading" :
                "";

            return (
                <div className={loadingClass + " async-input"}>
                    <input
                        ref="loginInput"
                        type="email"
                        name={this.props.name}
                        value={this.props.value}
                        onChange={this.onChange}
                        required/>
                    <i className="loader fa fa-spinner fa-spin"></i>
                </div>
            );
        }
    });

    module.exports = UserLoginInput;

}());
