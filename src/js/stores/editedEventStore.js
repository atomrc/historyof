/*global require, module*/
var appDispatcher = require("../dispatcher/appDispatcher"),
    eventActions = require("../constants/constants").actions,
    assign = require("object-assign"),
    FluxStore = require("flux/utils").Store;


var editedEvent = {};

function update(updates) {
    editedEvent = assign({}, editedEvent, updates);
}

class EditedEventStore extends FluxStore {
    get() {
        return editedEvent;
    }

    isEditing() { return !!editedEvent.date }

    __onDispatch(payload) {
        var action = payload.action,
            data = payload.data;

        switch (action) {

            case eventActions.EDIT_EVENT:
                editedEvent = data.event;
                this.__emitChange();
                break;

            case eventActions.CREATE_EVENT:
            case eventActions.CANCEL_EDIT_EVENT:
            case eventActions.UPDATE_EVENT:
                editedEvent = {};
                this.__emitChange();
                break;

            case eventActions.UPDATE_EDITED_EVENT:
                update(data.updates);
                this.__emitChange();
                break;

            default:
                break;
        }
    }
}

module.exports = new EditedEventStore(appDispatcher);
