import {EventHandler} from "../event-handler";
import {PartyMemberSocket} from "../../model/party-member-socket";
import {WebsocketEvent} from "../../model/websocket-event";
import {PauseVideoData} from "../../model/messages/pause-video-data";

/**
 * Pauses a new video for all members
 * Also resets the currentTime.
 */
export class PauseVideoEventHandler extends EventHandler {
    handleEvents = ['pause-video'];

    async handleEvent(socket: PartyMemberSocket, event: WebsocketEvent<PauseVideoData>) {
        if (!socket.partyId) return;
        const party = this.getActiveParties().get(socket.partyId);
        if (!party || !party.currentVideo) return;

        this.emitToParty(
            'pause-video',
            this.constructPauseVideoData(socket, event),
            party,
            socket.id
        );

        console.log('Video paused for party ' + socket.partyId);
    }

    private constructPauseVideoData(socket: PartyMemberSocket, event: WebsocketEvent<PauseVideoData>) {
        return {
            time: event.data.time,
            isLegacyPlayer: event.data.isLegacyPlayer,
            reason: event.data.reason,
            byMemberName: socket.displayName,
            byMember: this.getSingleMemberInfo(socket)
        }
    }
}