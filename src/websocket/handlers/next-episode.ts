import {WatchingPartyEventHandler} from "../event-handler";
import {PartyMemberSocket} from "../../model/party-member-socket";
import {WebsocketEvent} from "../../model/websocket-event";
import {NextEpisodeData} from "../../model/messages/next-episode-data";
import {WatchingParty} from "../../model/party";

/**
 * Triggers all clients to go to the next episode.
 * Only broadcasts when the current party season&episode are
 * different than what the party member signals.
 * This is because many party members could signal 'next episode'
 * for the same episode simultaneously.
 */
export class NextEpisodeEventHandler extends WatchingPartyEventHandler {
    handleEvents = ['next-episode'];

    async handleEvent(socket: PartyMemberSocket, event: WebsocketEvent<NextEpisodeData>, party: WatchingParty) {
        const currentSeason = party.currentVideo.season;
        const currentEpisode = party.currentVideo.episode;

        if (this.isValidNextEpisodeData(event.data)
            && this.isDifferentEpisode(event.data, currentSeason, currentEpisode)) {
            party.currentVideo.season = event.data.season;
            party.currentVideo.episode = event.data.episode;

            this.emitToParty('next-episode', {
                season: event.data.season,
                episode: event.data.episode,
                byMemberName: socket.displayName,
                byMember: this.getSingleMemberInfo(socket)
            }, party, socket.id);

            console.log('Next episode for party ' + socket.partyId);
        }
    }

    /**
     * NextEpisodeData object validation
     */
    private isValidNextEpisodeData(data: NextEpisodeData) {
        return data.season
            && data.season > 0
            && data.episode
            && data.episode > 0;
    }

    /**
     * Whether the current party episode & season
     * is different from the given NextEpisodeData
     */
    private isDifferentEpisode(data: NextEpisodeData, currentEpisode?: number, currentSeason?: number) {
        return currentSeason !== data.season || currentEpisode !== data.episode
    }
}