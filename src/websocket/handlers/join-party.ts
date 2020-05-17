import {EventHandler} from "../event-handler";
import {PartyMemberSocket} from "../../model/party-member-socket";
import {WebsocketEvent} from "../../model/websocket-event";
import {JoinPartyData} from "../../model/messages/join-party-data";
import {Party} from "../../model/party";

/**
 * A new member joins a party.
 * If the party ID is unknown, a new party will be created.
 */
export class JoinPartyEventHandler extends EventHandler {
    handleEvents = ['join-party'];

    async handleEvent(socket: PartyMemberSocket, event: WebsocketEvent<JoinPartyData>) {
        const data = event.data;
        if (!event.data.partyId || data.partyId.length !== 5) {
            return; // Invalid party code
        }

        // Update socket
        socket.partyId = data.partyId;
        socket.readyToPlay = false;
        socket.displayName = data.displayName && data.displayName !== 'You' && data.displayName.length < 21 ? data.displayName : socket.id;

        const party = this.getActiveParties().get(socket.partyId);

        if (!party) {
            this.createNewParty(socket, data);
        } else {
            this.joinExistingParty(socket, party)
        }
    }

    /**
     * Create a new party for a member
     */
    private createNewParty(socket: PartyMemberSocket, data: JoinPartyData) {
        const newMemberInfo = this.getSingleMemberInfo(socket); // id and displayname
        let newParty: Party = {connectedClients: [socket]};

        // If the member is already playing a video, update our state
        if (data.videoId) {
            newParty.currentVideo = {videoId: data.videoId, ref: 'unknown'};
        }

        // Join party
        if (socket.partyId != null) {
            this.getActiveParties().set(socket.partyId, newParty);
        }

        // Sending confirm message to member
        socket.emit('join-party', {
            currentMembers: [newMemberInfo],
            member: newMemberInfo, // The new member
        });

        console.log('New member joined and created party ' + socket.partyId);
    }

    /**
     * Let a member join an existing party
     */
    private joinExistingParty(socket: PartyMemberSocket, party: Party) {
        const newMemberInfo = this.getSingleMemberInfo(socket); // id and displayname
        // Join existing party
        party.connectedClients.push(socket);

        // Inform all members
        this.emitToParty('join-party', {
            currentMembers: this.getMembersInfo(party.connectedClients),
            member: newMemberInfo, // The new member
            pause: true // Pause video for all members until new member signals it's ready to play
        }, party);

        // Getting current time from first party member
        party.connectedClients[0].emit('start-video-for-member', {forMemberId: socket.id});

        console.log('New member joined party ' + socket.partyId);
    }
}