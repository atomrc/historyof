/*global require, module */
(function () {
    "use strict";

    var React = require("react"),
        debounce = require("debounce");

    module.exports = React.createClass({

        getInitialState: () => {
            return {
                checking: false
            };
        },

        checkValidity: debounce(function (input, context) {
            context.setState({ checking: true });

            context
                .props
                .onRequestValidation(input.value)
                .then(function (result) {
                    input.setCustomValidity(result);
                    context.setState({ checking: false });
                    return !result ? context.props.onValid() : context.props.onInvalid();
                });
        }),


        onChange: function (e) {
            var input = this.refs.loginInput;

            //only perform check if custom validity is available
            if (input.setCustomValidity) {
                //invalidate the input before the async check
                input.setCustomValidity(false);
                this.checkValidity(input, this);
            }

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
                        type={this.props.type}
                        name={this.props.name}
                        placeholder={this.props.placeholder}
                        value={this.props.value}
                        onChange={this.onChange}
                        required={this.props.required}/>
                    <i className="loader fa fa-spinner fa-spin"></i>
                </div>
            );
        }
    });

}());
