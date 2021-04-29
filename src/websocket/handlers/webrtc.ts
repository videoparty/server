import {PartyEventHandler} from "../event-handler";
import {PartyMemberSocket} from "../../model/party-member-socket";
import {WebsocketEvent} from "../../model/websocket-event";
import {Party} from "../../model/party";

/**
 * Handle webrtc signaling messages
 */
export class WebRtcEventHandler extends PartyEventHandler {
    handleEvents = ['rtc:candidate', 'rtc:desc'];

    async handleEvent(socket: PartyMemberSocket, event: WebsocketEvent<{toMemberId: string, candidate?: any, desc?: any}>, party: Party) {
        if (socket.id === event.data.toMemberId) return;
        let eventPayload = event.data.candidate ? {candidate: event.data.candidate} : {desc: event.data.desc}
        this.emitToPartyMember(event.name, event.data.toMemberId, {...eventPayload, fromMemberId: socket.id}, party);
        console.log(socket.displayName + ' sent an ' + event.name + ' message to member ID ' + event.data.toMemberId + ': ' + JSON.stringify(event.data));
    }
}
