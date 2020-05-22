import {WatchingPartyEventHandler} from "../event-handler";
import {PartyMemberSocket} from "../../model/party-member-socket";
import {WebsocketEvent} from "../../model/websocket-event";
import {StartVideoData} from "../../model/messages/start-video-data";
import {WatchingParty} from "../../model/party";

/**
 * Resumes / plays a new video for all users
 */
export class PlayVideoEventHandler extends WatchingPartyEventHandler {
    handleEvents = ['play-video'];

    async handleEvent(socket: PartyMemberSocket, event: WebsocketEvent<StartVideoData>, party: WatchingParty) {
        this.emitToParty('play-video', {
            byMemberName: socket.displayName,
            byMember: this.getSingleMemberInfo(socket)
        }, party, socket.id);

        console.log('Video played for party ' + socket.partyId);
    }
}