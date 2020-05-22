import {PartyEventHandler} from "../event-handler";
import {PartyMemberSocket} from "../../model/party-member-socket";
import {WebsocketEvent} from "../../model/websocket-event";
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
export class StateUpdateEventHandler extends PartyEventHandler {
    handleEvents = ['state-update'];

    async handleEvent(socket: PartyMemberSocket, event: WebsocketEvent<{state: string}>, party: Party) {
        this.emitToParty('state-update', {
            state: event.data.state,
            byMember: this.getSingleMemberInfo(socket)
        }, party, socket.id);

        console.log('state update for ' + socket.displayName + ': ' + event.data.state);
    }
}