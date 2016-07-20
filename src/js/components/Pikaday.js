import xs from "xstream";
import {input} from "@cycle/dom";
import pikaday from "pikaday";

function view(date$, update$) {
    var picker;
    return date$
        .map(date => input(".date", {
            hook: {
                insert: vnode => {
                    picker = new pikaday({
                        field: vnode.elm,
                        onSelect: (selectedDate) => {
                            if (selectedDate !== date) {
                                update$.shamefullySendNext(selectedDate);
                            }
                        },
                        defaultDate: date,
                        setDefaultDate: true
                    });
                },
                update: () => {
                    var currentDate = picker.getDate();
                    if ( (currentDate || "").toString() == (date || "").toString() ) {
                        return;
                    }
                    picker.setDate(date);
                }
            }
        }))
}

function Pikaday({ props }) {
    const update$ = xs.create();

    const { date$ } = props;

    return {
        DOM: view(date$, update$),
        update$
    }
}

export default Pikaday;
