import {PartyEventHandler} from "../event-handler";
import {PartyMemberSocket} from "../../model/party-member-socket";
import {WebsocketEvent} from "../../model/websocket-event";
import {Party} from "../../model/party";

/**
 * Handle chat message by sending it
 * to the rest of the message
 */
export class ChatEventHandler extends PartyEventHandler {
    handleEvents = ['chat'];

    async handleEvent(socket: PartyMemberSocket, event: WebsocketEvent<{message: string}>, party: Party) {
        this.emitToParty('chat', {
            message: event.data.message,
            byMember: this.getSingleMemberInfo(socket)
        }, party); // Also send it back as confirmation to the sender

        console.log(socket.displayName + ' chatted');
    }
}