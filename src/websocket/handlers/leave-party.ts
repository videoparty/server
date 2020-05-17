import {EventHandler} from "../event-handler";
import {PartyMemberSocket} from "../../model/party-member-socket";
import {WebsocketEvent} from "../../model/websocket-event";

/**
 * A member disconnects or leaves the party.
 * The party will removed if there are no members left.
 */
export class LeavePartyEventHandler extends EventHandler {
    handleEvents = ['disconnect', 'leave-party'];

    async handleEvent(socket: PartyMemberSocket) {
        if (!socket.partyId) return;
        const party = this.getActiveParties().get(socket.partyId);
        if (!party) return;

        // Remove member from party
        const i = party.connectedClients.indexOf(socket);
        party.connectedClients.splice(i, 1);

        // Inform party that the member left
        this.emitToParty('left-party', {
            currentMembers: this.getMembersInfo(party.connectedClients),
            member: {id: socket.id, displayName: socket.displayName}
        }, party);

        console.log('Client left party ' + socket.partyId);

        // Remove party if there are no members
        if (party.connectedClients.length === 0) {
            this.getActiveParties().delete(socket.partyId);
            console.log('Removed party ' + socket.partyId);
        }
    }
}