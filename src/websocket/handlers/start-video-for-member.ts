import {EventHandler} from "../event-handler";
import {PartyMemberSocket} from "../../model/party-member-socket";
import {WebsocketEvent} from "../../model/websocket-event";
import {StartVideoForMemberData} from "../../model/messages/start-video-data";

/**
 * When a new member joins during a video being played,
 * the currentTime will be provided by the first member of the party.
 */
export class StartVideoForMemberEventHandler extends EventHandler {
    handleEvents = ['start-video-for-member'];

    async handleEvent(socket: PartyMemberSocket, event: WebsocketEvent<StartVideoForMemberData>) {
        if (!socket.partyId) return;
        const party = this.getActiveParties().get(socket.partyId);
        if (!party || !party.currentVideo) return;

        for (const client of party.connectedClients) {
            if (client.id == event.data.forMemberId) {
                client.emit('start-video', {
                    videoId: party.currentVideo.videoId,
                    ref: party.currentVideo.ref,
                    time: event.data.time,
                    isLegacyPlayer: event.data.isLegacyPlayer,
                    byMemberName: socket.displayName,
                    byMember: this.getSingleMemberInfo(socket),
                    season: party.currentVideo.season,
                    episode: party.currentVideo.episode
                });
                return;
            }
        }
        console.log('Video started for a specific member in party ' + socket.partyId);
    }
}