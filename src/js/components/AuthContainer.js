import {Observable, ReplaySubject} from "rx";
import UserContainer from "./UserContainer";
import LoginForm from "./LoginForm";


function intent({ storage, loginForm$, userContainer$ }) {
    const token$ = storage
        .local
        .getItem("token");

    const loginToken$ = loginForm$
        .flatMapLatest(loginForm => loginForm.loginData$)
        .map(({ token }) => token);

    const tokenError$ = userContainer$
        .flatMapLatest(userContainer => userContainer.tokenError$);

    const logoutAction$ = userContainer$
        .flatMapLatest(userContainer => userContainer.logoutAction$);

    return {
        token$,
        loginToken$,
        logoutAction$: Observable.merge(tokenError$, logoutAction$)
    };
}

function render(userContainer$, loginForm$) {
    return Observable
        .merge(userContainer$, loginForm$)
        .flatMapLatest(component => component.DOM);
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

    const tokenProxy$ = new ReplaySubject();

    const loginForm$ = tokenProxy$
        .filter(token => !token)
        .map(() => buildComponent(LoginForm, {DOM, api}, "login-form"))
        .shareReplay(1);

    const userContainer$ = tokenProxy$
        .filter(token => !!token)
        .map(token => buildComponent(UserContainer, { DOM, api, token$: Observable.just(token) }, "user-container"))
        .shareReplay(1);

    const {
        token$,
        loginToken$,
        logoutAction$
    } = intent({ storage, loginForm$, userContainer$ });

    const apiRequest$ = Observable
        .merge(loginForm$, userContainer$)
        .flatMapLatest(component => component.api);

    const tokenSaveRequest$ = loginToken$
        .map(token => ({ key: "token", value: token }));

    const tokenRemoveRequest$ = logoutAction$
        .map(() => ({ action: "removeItem", key: "token" }));

    token$.subscribe(tokenProxy$);

    return {
        DOM: render(userContainer$, loginForm$),
        api: apiRequest$,
        storage: Observable.merge(tokenRemoveRequest$, tokenSaveRequest$)
    }
}

export default AuthContainer;
