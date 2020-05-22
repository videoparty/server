import {PartyMemberInfo} from "../party-member-info";

export interface StartVideoData {
    videoId: string
    ref: string
    time: number,
    isLegacyPlayer?: boolean,
    /**
     * Set by server
     * @deprecated use byMember instad for extension version higher than v0.5.3
     */
    byMemberName?: string
    /**
     * Set by server
     */
    byMember?: PartyMemberInfo
}

export interface StartVideoForMemberData {
    time: number,
    isLegacyPlayer?: boolean,
    forMemberId: string
}