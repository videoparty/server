import {PartyEventHandler} from "../event-handler";
import {PartyMemberSocket} from "../../model/party-member-socket";
import {WebsocketEvent} from "../../model/websocket-event";
import {Party} from "../../model/party";

/**
 * A member disconnects or leaves the party.
 * The party will removed if there are no members left.
 */
export class LeavePartyEventHandler extends PartyEventHandler {
    handleEvents = ['disconnect', 'leave-party'];

    async handleEvent(socket: PartyMemberSocket, ev: WebsocketEvent<undefined>, party: Party) {
        // Remove member from party
        const i = party.connectedClients.indexOf(socket);
        party.connectedClients.splice(i, 1);

        // Inform party that the member left
        this.emitToParty('left-party', {
            currentMembers: this.getMembersInfo(party.connectedClients),
            member: {id: socket.id, displayName: socket.displayName}
        }, party);

        console.log('Client left party ' + party.id);

        // Remove party if there are no members
        if (party.connectedClients.length === 0) {
            this.getActiveParties().delete(party.id);
            console.log('Removed party ' + party.id);
        }
    }
}