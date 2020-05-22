import {WatchingPartyEventHandler} from "../event-handler";
import {PartyMemberSocket} from "../../model/party-member-socket";
import {WebsocketEvent} from "../../model/websocket-event";
import {SeekTimeData} from "../../model/messages/seek-time-data";
import {WatchingParty} from "../../model/party";

/**
 * Jump to a new time for all members.
 * Every member will signal with 'player-ready' when
 * the seeking (and buffering) is done.
 */
export class SeekTimeEventHandler extends WatchingPartyEventHandler {
    handleEvents = ['seek-video', 'seek-time'];

    async handleEvent(socket: PartyMemberSocket, event: WebsocketEvent<SeekTimeData>, party: WatchingParty) {
        socket.readyToPlay = true;
        for (const client of party.connectedClients) {
            if (client.id === socket.id) continue;
            client.readyToPlay = false;
            client.emit('seek-video', {
                time: event.data.time,
                isLegacyPlayer: event.data.isLegacyPlayer,
                byMemberName: socket.displayName,
                byMember: this.getSingleMemberInfo(socket)
            });
        }

        console.log('Video seek to ' + event.data.time + 's for party ' + socket.partyId);
    }
}