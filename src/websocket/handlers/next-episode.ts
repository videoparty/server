import {EventHandler} from "../event-handler";
import {PartyMemberSocket} from "../../model/party-member-socket";
import {WebsocketEvent} from "../../model/websocket-event";
import {NextEpisodeData} from "../../model/messages/next-episode-data";

/**
 * Triggers all clients to go to the next episode.
 * Only broadcasts when the current party season&episode are
 * different than what the party member signals.
 * This is because many party members could signal 'next episode'
 * for the same episode simultaneously.
 */
export class NextEpisodeEventHandler extends EventHandler {
    handleEvents = ['next-episode'];

    async handleEvent(socket: PartyMemberSocket, event: WebsocketEvent<NextEpisodeData>) {
        if (!socket.partyId) return;
        const party = this.getActiveParties().get(socket.partyId);
        if (!party || !party.currentVideo || !party.currentVideo.season
            || !party.currentVideo.episode) return;
        const currentSeason = party.currentVideo.season;
        const currentEpisode = party.currentVideo.episode;

        if (this.isValidNextEpisodeData(event.data)
            && this.isDifferentEpisode(currentSeason, currentEpisode, event.data)) {
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
            && typeof data.season === 'number'
            && data.season > 0
            && data.episode
            && typeof data.episode === 'number'
            && data.episode > 0;
    }

    /**
     * Whether the current party episode & season
     * is different from the given NextEpisodeData
     */
    private isDifferentEpisode(currentEpisode: number, currentSeason: number, data: NextEpisodeData) {
        return currentSeason !== data.season || currentEpisode !== data.episode
    }
}