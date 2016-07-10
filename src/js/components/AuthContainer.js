import xs from "xstream";
import UserContainer from "./UserContainer";
import LoginForm from "./LoginForm";

function intent({ storage, loginForm }) {
    const token$ = storage
        .local
        .getItem("token")

    const loginToken$ = loginForm.loginData$
        .map(({ token }) => token)

    return {
        token$,
        loginToken$
    };
}

function render(token$, userContainerView, loginFormView) {
    return token$
        .map(token => token ? userContainerView : loginFormView)
        .flatten()
}

/**
 * is responsible for the logged part of the app.
 * Depending on the token it gets from the local storage
 * it will display the login form or the app
 *
 * @param {DOMSource} DOM the DOM source
 * @param {apiSource} api the api source
 * @param {storageSource} storage the storage source
 * @returns {object} streams
 */
function AuthContainer({DOM, api, storage, props}) {

    const {buildComponent} = props;

    const loginForm = buildComponent(LoginForm, {DOM, api}, "login-form")

    const {
        token$,
        loginToken$
    } = intent({ storage, loginForm });

    const userContainer = buildComponent(UserContainer, { DOM, api, props: { buildComponent, token$: token$ } }, "user-container")

    const apiRequest$ = xs
        .combine(
            xs.merge(loginForm.api, userContainer.api),
            token$
        )
        .map(([request, token]) => Object.assign({}, request, { token }));

    const logoutAction$ = userContainer
        .action$
        .filter(action => action.type === "logout")

    const tokenSaveRequest$ = loginToken$
        .map(token => ({ key: "token", value: token }));

    const tokenError$ = userContainer.error$
        .filter(error => error.type === "tokenError");

    const tokenRemoveRequest$ = xs.merge(logoutAction$, tokenError$)
        .mapTo({ action: "removeItem", key: "token" });

    return {
        DOM: render(token$, userContainer.DOM, loginForm.DOM),
        api: apiRequest$,
        storage: xs.merge(tokenRemoveRequest$, tokenSaveRequest$),
        error$: tokenError$
    }
}

export default AuthContainer;
