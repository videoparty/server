import {EventHandler} from "../event-handler";
import {PartyMemberSocket} from "../../model/party-member-socket";
import {WebsocketEvent} from "../../model/websocket-event";

/**
 * Party member signals it is ready to start watching
 */
export class PlayerReadyEventHandler extends EventHandler {
    handleEvents = ['player-ready'];

    async handleEvent(socket: PartyMemberSocket, event: WebsocketEvent<undefined>) {
        if (!socket.partyId) return;
        const party = this.getActiveParties().get(socket.partyId);
        if (!party || !party.currentVideo) return;
        socket.readyToPlay = true;
        console.log('Member is ready to play in party ' + socket.partyId);

        // Inform other members that the state of this member changed
        this.emitToParty('state-update', {
            byMember: this.getSingleMemberInfo(socket),
            state: 'player-ready'
        }, party, socket.id);

        // Check readiness for everyone
        for (const client of party.connectedClients) {
            if (!client.readyToPlay) return; // Not everyone is ready yet
        }

        console.log('All members are ready to play the video in party ' + socket.partyId);

        setTimeout(() => {
            // Everyone is ready to play, let's go!
            this.emitToParty('play-video', {coordinated: true}, party);
        }, 100);
    }
}