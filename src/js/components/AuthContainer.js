import xs from "xstream";
import UserContainer from "./UserContainer";
import LoginForm from "./LoginForm";

function intent({ storage, loginForm$, userContainer$ }) {
    const token$ = storage
        .local
        .getItem("token");

    const loginToken$ = loginForm$
        .map(loginForm => loginForm.loginData$)
        .flatten()
        .map(({ token }) => token);

    const tokenError$ = userContainer$
        .map(userContainer => userContainer.tokenError$)
        .flatten();

    const logoutAction$ = userContainer$
        .map(userContainer => userContainer.logoutAction$)
        .flatten();

    return {
        token$,
        loginToken$,
        logoutAction$: xs.merge(tokenError$, logoutAction$)
    };
}

function render(userContainer$, loginForm$) {

    return xs
        .merge(userContainer$, loginForm$)
        .map(component => component.DOM)
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

    const tokenProxy$ = xs.createWithMemory();

    const loginForm$ = tokenProxy$
        .filter(token => !token)
        .mapTo(buildComponent(LoginForm, {DOM, api}, "login-form"))

    const userContainer$ = tokenProxy$
        .filter(token => !!token)
        .map(token => buildComponent(UserContainer, { DOM, api, token$: xs.of(token) }, "user-container"))

    const {
        token$,
        loginToken$,
        logoutAction$
    } = intent({ storage, loginForm$, userContainer$ });

    const apiRequest$ = xs
        .merge(loginForm$, userContainer$)
        .map(component => component.api)
        .flatten()

    const tokenSaveRequest$ = loginToken$
        .map(token => ({ key: "token", value: token }));

    const tokenRemoveRequest$ = logoutAction$
        .map(() => ({ action: "removeItem", key: "token" }));

    const vtree$ = render(userContainer$, loginForm$);
    tokenProxy$.imitate(token$);

    return {
        DOM: vtree$,
        api: apiRequest$,
        storage: xs.merge(tokenRemoveRequest$, tokenSaveRequest$),
        error$: userContainer$.map(userContainer => userContainer.tokenError$).flatten()
    }
}

export default AuthContainer;
