import {PartyEventHandler} from "../event-handler";
import {PartyMemberSocket} from "../../model/party-member-socket";
import {WebsocketEvent} from "../../model/websocket-event";
import {Party} from "../../model/party";

/**
 * Informs the party that this member is watching a trailer.
 * The rest of the party must wait for the member to finish/skip the trailer.
 */
export class WatchingTrailerEventHandler extends PartyEventHandler {
    handleEvents = ['watching-trailer'];

    async handleEvent(socket: PartyMemberSocket, event: WebsocketEvent<undefined>, party: Party) {
        this.emitToParty('watching-trailer', {
            byMemberName: socket.displayName,
            byMember: this.getSingleMemberInfo(socket)
        }, party, socket.id);

        console.log('A member is watching a trailer in party ' + socket.partyId);
    }
}