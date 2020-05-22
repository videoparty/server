import {PartyMemberSocket} from "./party-member-socket";

export interface Party {
    id: string, // 5-character code
    connectedClients: PartyMemberSocket[]
    currentVideo?: {
        videoId: string,
        ref: string,
        season?: number,
        episode?: number,
    }
}

export interface WatchingParty extends Party {
    currentVideo: {
        videoId: string,
        ref: string,
        season?: number,
        episode?: number,
    }
}