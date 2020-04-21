import {PartyMemberSocket} from "./party-member-socket";

export interface Party {
    connectedClients: PartyMemberSocket[]
    videoId?: string
    currentVideo?: {
        videoId: string,
        ref: string,
        seekToTime?: number
    }
}