import xs from "xstream";
import UserContainer from "./UserContainer";
import LoginForm from "./LoginForm";

function intent({ storage, loginForm, userContainer }) {
    const token$ = storage
        .local
        .getItem("token")

    const loginToken$ = loginForm.loginData$
        .map(({ token }) => token)

    const tokenError$ = userContainer.tokenError$
    const logoutAction$ = userContainer.logoutAction$

    return {
        token$,
        loginToken$,
        tokenError$,
        logoutAction$: logoutAction$
    };
}

function render(token$, userContainerView, loginFormView) {
    return token$
        .map(token => token ? userContainerView : loginFormView)
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

    const tokenProxy$ = xs.createWithMemory();

    const loginForm = buildComponent(LoginForm, {DOM, api}, "login-form")
    const userContainer = buildComponent(UserContainer, { DOM, api, props: { buildComponent, token$: tokenProxy$ } }, "user-container")

    const {
        token$,
        loginToken$,
        tokenError$,
        logoutAction$
    } = intent({ storage, loginForm, userContainer });

    const apiRequest$ = xs
        .merge(loginForm.api, userContainer.api)
        .combine(
            (request, token) => Object.assign({}, request, { token }),
            tokenProxy$
        )


    const tokenSaveRequest$ = loginToken$
        .map(token => ({ key: "token", value: token }));

    const tokenRemoveRequest$ = xs.merge(logoutAction$, tokenError$)
        .mapTo({ action: "removeItem", key: "token" });

    const vtree$ = render(tokenProxy$, userContainer.DOM, loginForm.DOM);
    tokenProxy$.imitate(token$);

    return {
        DOM: vtree$,
        api: apiRequest$,
        storage: xs.merge(tokenRemoveRequest$, tokenSaveRequest$),
        error$: tokenError$
    }
}

export default AuthContainer;
