export interface StartVideoData {
    videoId: string
    ref: string
    time: number
    byMemberName?: string
}

export interface StartVideoForMemberData {
    time: number,
    forMemberId: string
}