import {EventHandler} from "../event-handler";
import {PartyMemberSocket} from "../../model/party-member-socket";
import {WebsocketEvent} from "../../model/websocket-event";
import {JoinPartyData} from "../../model/messages/join-party-data";
import {Party} from "../../model/party";

/**
 * A member's state has changed:
 * - idle
 * - loading
 * - playing
 * - paused
 * - next-episode
 * - watching-trailer
 * - player-ready
 */
export class StateUpdateEventHandler extends EventHandler {
    handleEvents = ['state-update'];

    async handleEvent(socket: PartyMemberSocket, event: WebsocketEvent<{state: string}>) {
        if (!socket.partyId) return;
        const party = this.getActiveParties().get(socket.partyId);
        if (!party) return;

        this.emitToParty('state-update', {
            state: event.data.state,
            byMember: this.getSingleMemberInfo(socket)
        }, party, socket.id);

        console.log('state update for ' + socket.displayName + ': ' + event.data.state);
    }
}