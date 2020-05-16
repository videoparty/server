import {PartyMemberSocket} from "./party-member-socket";

export interface Party {
    connectedClients: PartyMemberSocket[]
    currentVideo?: {
        videoId: string,
        ref: string,
        season?: number,
        episode?: number,
    }
}