import {Socket} from "socket.io";

export interface PartyMemberSocket extends Socket {
    partyId?: string
    readyToPlay?: boolean
}