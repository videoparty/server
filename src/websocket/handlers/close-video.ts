import {EventHandler} from "../event-handler";
import {PartyMemberSocket} from "../../model/party-member-socket";
import {WebsocketEvent} from "../../model/websocket-event";

/**
 * Closes the webplayer for all members
 */
export class CloseVideoEventHandler extends EventHandler {
    handleEvents = ['close-video'];

    async handleEvent(socket: PartyMemberSocket, event: WebsocketEvent<undefined>) {
        if (!socket.partyId) return;
        const party = this.getActiveParties().get(socket.partyId);
        if (!party) return;
        party.currentVideo = undefined;

        this.emitToParty('close-video', {
            byMemberName: socket.displayName,
            byMember: this.getSingleMemberInfo(socket)
        }, party, socket.id);

        console.log('Video closed for party ' + socket.partyId);
    }
}