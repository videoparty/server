import {WatchingPartyEventHandler} from "../event-handler";
import {PartyMemberSocket} from "../../model/party-member-socket";
import {WebsocketEvent} from "../../model/websocket-event";
import {Party} from "../../model/party";

/**
 * Closes the webplayer for all members
 */
export class CloseVideoEventHandler extends WatchingPartyEventHandler {
    handleEvents = ['close-video'];

    async handleEvent(socket: PartyMemberSocket, event: WebsocketEvent<undefined>, party: Party) {
        party.currentVideo = undefined;

        this.emitToParty('close-video', {
            byMemberName: socket.displayName,
            byMember: this.getSingleMemberInfo(socket)
        }, party, socket.id);

        console.log('Video closed for party ' + socket.partyId);
    }
}