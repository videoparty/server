import {PartyEventHandler} from "../event-handler";
import {PartyMemberSocket} from "../../model/party-member-socket";
import {WebsocketEvent} from "../../model/websocket-event";
import {StartVideoData} from "../../model/messages/start-video-data";
import {Party} from "../../model/party";

/**
 * One member starts a new video for the rest of the party
 */
export class StartVideoEventHandler extends PartyEventHandler {
    handleEvents = ['start-video'];

    async handleEvent(socket: PartyMemberSocket, event: WebsocketEvent<StartVideoData>, party: Party) {
        // Reset the party's current video info
        party.currentVideo = {
            videoId: event.data.videoId,
            ref: event.data.ref
        };

        event.data.byMemberName = socket.displayName; // Deprecated starting from extension v0.6
        event.data.byMember = this.getSingleMemberInfo(socket);

        // Reset readiness for all members to set up a coordinated resume
        for (const client of party.connectedClients) {
            client.readyToPlay = false;
        }

        // Inform all other members to start a video
        this.emitToParty('start-video', event.data, party, socket.id);

        console.log('Video started for party ' + socket.partyId);
    }
}