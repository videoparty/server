import {PartyEventHandler} from "../event-handler";
import {PartyMemberSocket} from "../../model/party-member-socket";
import {WebsocketEvent} from "../../model/websocket-event";
import {Party} from "../../model/party";

/**
 * Handle displayname change by sending it
 * to the rest of the party
 */
export class UpdateDisplayNameEventHandler extends PartyEventHandler {
    handleEvents = ['update-displayname'];

    async handleEvent(socket: PartyMemberSocket, event: WebsocketEvent<{displayName: string}>, party: Party) {
        if (event.data.displayName.length === 0 || event.data.displayName.length > 30) return;

        this.emitToParty('update-displayname', {
            old: this.getSingleMemberInfo(socket).displayName,
            new: event.data.displayName
        }, party, socket.id);

        console.log(this.getSingleMemberInfo(socket).displayName + ' updated their display name to ' + event.data.displayName);

        socket.displayName = event.data.displayName;
    }
}