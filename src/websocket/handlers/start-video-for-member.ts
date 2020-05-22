import {WatchingPartyEventHandler} from "../event-handler";
import {PartyMemberSocket} from "../../model/party-member-socket";
import {WebsocketEvent} from "../../model/websocket-event";
import {StartVideoForMemberData} from "../../model/messages/start-video-data";
import {WatchingParty} from "../../model/party";

/**
 * When a new member joins during a video being played,
 * the currentTime will be provided by the first member of the party.
 */
export class StartVideoForMemberEventHandler extends WatchingPartyEventHandler {
    handleEvents = ['start-video-for-member'];

    async handleEvent(socket: PartyMemberSocket, event: WebsocketEvent<StartVideoForMemberData>, party: WatchingParty) {
        const targetMember = party.connectedClients.filter((m) => m.id === event.data.forMemberId);
        if (targetMember.length === 0) return;

        targetMember[0].emit('start-video', {
            videoId: party.currentVideo.videoId,
            ref: party.currentVideo.ref,
            time: event.data.time,
            isLegacyPlayer: event.data.isLegacyPlayer,
            byMemberName: socket.displayName,
            byMember: this.getSingleMemberInfo(socket),
            season: party.currentVideo.season,
            episode: party.currentVideo.episode
        });

        console.log('Video started for a specific member in party ' + socket.partyId);
    }
}