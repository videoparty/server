import {WatchingPartyEventHandler} from "../event-handler";
import {PartyMemberSocket} from "../../model/party-member-socket";
import {WebsocketEvent} from "../../model/websocket-event";
import {PauseVideoData} from "../../model/messages/pause-video-data";
import {WatchingParty} from "../../model/party";

/**
 * Pauses a new video for all members
 * Also resets the currentTime.
 */
export class PauseVideoEventHandler extends WatchingPartyEventHandler {
    handleEvents = ['pause-video'];

    async handleEvent(socket: PartyMemberSocket, event: WebsocketEvent<PauseVideoData>, party: WatchingParty) {
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