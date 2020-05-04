import {PartyMemberSocket} from "./party-member-socket";

export interface Party {
    connectedClients: PartyMemberSocket[]
    currentVideo?: {
        videoId: string,
        ref: string,
        seekToTime?: number,
        season?: number,
        episode?: number,
    }
}