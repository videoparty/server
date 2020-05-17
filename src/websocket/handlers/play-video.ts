import {EventHandler} from "../event-handler";
import {PartyMemberSocket} from "../../model/party-member-socket";
import {WebsocketEvent} from "../../model/websocket-event";
import {StartVideoData} from "../../model/messages/start-video-data";

/**
 * Resumes / plays a new video for all users
 */
export class PlayVideoEventHandler extends EventHandler {
    handleEvents = ['play-video'];

    async handleEvent(socket: PartyMemberSocket, event: WebsocketEvent<StartVideoData>) {
        if (!socket.partyId) return;
        const party = this.getActiveParties().get(socket.partyId);
        if (!party || !party.currentVideo) return;

        this.emitToParty('play-video', {
            byMemberName: socket.displayName,
            byMember: this.getSingleMemberInfo(socket)
        }, party, socket.id);

        console.log('Video played for party ' + socket.partyId);
    }
}