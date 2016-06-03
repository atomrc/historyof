import xs from "xstream";
import UserContainer from "./UserContainer";
import LoginForm from "./LoginForm";

function intent({ storage, loginForm, userContainerAction$, userContainerError$ }) {
    const token$ = storage
        .local
        .getItem("token")

    const loginToken$ = loginForm.loginData$
        .map(({ token }) => token)

    const tokenError$ = userContainerError$
        .filter(error => error.type === "tokenError");

    const logoutAction$ = userContainerAction$
        .filter(action => action.type === "logout")

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

    const userContainerActionProxy$ = xs.createMimic();
    const userContainerErrorProxy$ = xs.createMimic();

    const loginForm = buildComponent(LoginForm, {DOM, api}, "login-form")

    const {
        token$,
        loginToken$,
        tokenError$,
        logoutAction$
    } = intent({
        storage,
        loginForm,
        userContainerAction$: userContainerActionProxy$,
        userContainerError$: userContainerErrorProxy$
    });

    const userContainer = buildComponent(UserContainer, { DOM, api, props: { buildComponent, token$: token$ } }, "user-container")

    const apiRequest$ = xs
        .combine(
            (request, token) => Object.assign({}, request, { token }),
            xs.merge(loginForm.api, userContainer.api),
            token$
        )

    const tokenSaveRequest$ = loginToken$
        .map(token => ({ key: "token", value: token }));

    const tokenRemoveRequest$ = xs.merge(logoutAction$, tokenError$)
        .mapTo({ action: "removeItem", key: "token" });

    userContainerActionProxy$.imitate(userContainer.action$);
    userContainerErrorProxy$.imitate(userContainer.error$);

    return {
        DOM: render(token$, userContainer.DOM, loginForm.DOM),
        api: apiRequest$,
        storage: xs.merge(tokenRemoveRequest$, tokenSaveRequest$),
        error$: tokenError$
    }
}

export default AuthContainer;
