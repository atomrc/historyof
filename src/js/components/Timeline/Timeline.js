import {Subject} from "rx";
import model from "./model";
import view from "./view";
import intent from "./intent";

function Timeline({DOM, stories$}) {
    const proxyAction$ = new Subject();
    const storiesModel$ = model(proxyAction$, stories$);
    const { actions$, components } = intent(storiesModel$, DOM);
    const vTree$ = view(components.storyItems$, components.storyForm.DOM);

    actions$.subscribe(proxyAction$);

    return {
        DOM: vTree$,
        action$: proxyAction$
    };
}

export default Timeline;
