import xs from "xstream";

function wrap(Component) {
    return function protectedInstanciation(sources) {
        const { storage } = sources;
        const sinks = Component(Object.assign({}, sources, { props: { user$: xs.empty() }}));

        const token$ = storage
            .local
            .getItem("token")

        const redirectToLogin$ = token$
            .filter(token => !token)
            .mapTo("/login");

        return Object.assign({}, sinks, {
            router: xs
                .merge(redirectToLogin$, sinks.router || xs.empty()),

            //decorate all the component api requests with
            //the current token
            api: xs
                .combine(sinks.api, token$)
                .map(([apiRequest, token]) => Object.assign({}, apiRequest, { token }))
        });


    }
}
export default wrap;
