import {Server, Socket} from "socket.io";
import {StartVideoData, StartVideoForMemberData} from "../model/messages/start-video-data";
import {JoinPartyData} from "../model/messages/join-party-data";
import {PartyMemberSocket} from "../model/party-member-socket";
import {Party} from "../model/party";

export class SocketEvents {

    private activeParties = new Map<string, Party>();

    constructor(private ioServer: Server) {
        ioServer.on('connection', (socket) => {
            this.setupClientListener(socket)
        });
    }

    /**
     * Assign all events for each separate socket to the methods below
     */
    private setupClientListener(socket: Socket) {
        console.log('New client connected');
        socket.on('disconnect', () => this.onSocketDisconnect(socket));
        socket.on('join-party', (data) => this.onJoinParty(data, socket));
        socket.on('leave-party', () => this.onLeaveParty(socket));
        socket.on('player-ready', () => this.onPlayerReady(socket));
        socket.on('start-video', (data) => this.onStartVideo(data, socket));
        socket.on('seek-video', (data) => this.onSeekVideo(data, socket));
        socket.on('start-video-for-member', (data) => this.onStartVideoForMember(data, socket));
        socket.on('play-video', () => this.onPlayVideo(socket));
        socket.on('pause-video', (data) => this.onPauseVideo(data, socket));
        socket.on('close-video', () => this.onCloseVideo(socket));
    }

    /**
     * Join a (new) party
     */
    private onJoinParty(data: JoinPartyData, socket: PartyMemberSocket) {
        if (!data.partyId || data.partyId.length > 5 || data.partyId.length <= 0) {
            return; // Invalid party code
        }

        socket.partyId = data.partyId;
        socket.readyToPlay = false;
        const party = this.activeParties.get(socket.partyId);
        if (!party) { // Create new party
            this.activeParties.set(socket.partyId, {
                connectedClients: [socket],
                videoId: data.videoId
            })
        } else { // Join existing party and inform all members
            for (const client of party.connectedClients) {
                client.emit('join-party', {member: socket.id});
                // Pause video for all members until new member signals it's ready to play
                client.emit('pause-video');
            }
            party.connectedClients.push(socket);
            // Getting current time from first party member
            party.connectedClients[0].emit('start-video-for-member', {forMemberId: socket.id});
        }

        console.log('New member joined party ' + socket.partyId);
    }

    /**
     * Starts a new video for all users
     */
    private onStartVideo(data: StartVideoData, socket: PartyMemberSocket) {
        const party = this.activeParties.get(socket.partyId);
        if (!party) return;
        party.currentVideo = {videoId: data.videoId, ref: data.ref};

        for (const client of party.connectedClients) {
            if (client.id === socket.id) continue;
            client.emit('start-video', data);
        }
        console.log('Video started for party ' + socket.partyId);
    }

    /**
     * When a new member joins during a video being played,
     * the currentTime will be provided by the first member of the party.
     */
    private onStartVideoForMember(data: StartVideoForMemberData, socket: PartyMemberSocket) {
        const party = this.activeParties.get(socket.partyId);
        if (!party.currentVideo) return;

        for (const client of party.connectedClients) {
            if (client.id == data.forMemberId) {
                client.emit('start-video', {
                    videoId: party.currentVideo.videoId,
                    ref: party.currentVideo.ref,
                    time: data.time
                });
                return;
            }
        }
        console.log('Video started for a specific member in party ' + socket.partyId);
    }

    /**
     * Seek the video to a new time for all members.
     * Every member will signal with 'player-ready' when
     * the seeking (and buffering) is done.
     */
    private onSeekVideo(data: {time: number}, socket: PartyMemberSocket) {
        const party = this.activeParties.get(socket.partyId);
        if (!party.currentVideo || party.currentVideo.seekToTime) return;
        socket.readyToPlay = true;

        for (const client of party.connectedClients) {
            if (client.id === socket.id) continue;
            client.readyToPlay = false;
            client.emit('seek-video', data);
        }
        console.log('Video seek to '+ data.time +'s for party ' + socket.partyId);
    }

    /**
     * Party member signals it has loaded the player and is ready to start watching
     */
    private onPlayerReady(socket: PartyMemberSocket) {
        const party = this.activeParties.get(socket.partyId);
        if (!party.currentVideo) return;
        socket.readyToPlay = true;
        console.log('Member is ready to play in party ' + socket.partyId);

        for (const client of party.connectedClients) {
            if (!client.readyToPlay) return;
        }

        console.log('All members are ready to play the video in party ' + socket.partyId);
        party.currentVideo.seekToTime = undefined;

        setTimeout(() => {
            // Everyone is ready to play, let's go!
            for (const client of party.connectedClients) {
                client.emit('play-video');
            }
        }, 100);
    }

    /**
     * Resumes / plays a new video for all users
     */
    private onPlayVideo(socket: PartyMemberSocket) {
        const party = this.activeParties.get(socket.partyId);
        if (!party.currentVideo) return;
        for (const client of party.connectedClients) {
            if (client.id === socket.id) continue;
            client.emit('play-video');
        }
        console.log('Video played for party ' + socket.partyId);
    }

    /**
     * Pauses a new video for all members
     * Also resets the currentTime.
     */
    private onPauseVideo(data: {time: number}, socket: PartyMemberSocket) {
        const party = this.activeParties.get(socket.partyId);
        if (!party.currentVideo) return;
        for (const client of party.connectedClients) {
            if (client.id === socket.id) continue;
            client.emit('pause-video', {time: data.time});
        }
        console.log('Video paused for party ' + socket.partyId);
    }

    /**
     * Closes the webplayer for all members
     */
    private onCloseVideo(socket: PartyMemberSocket) {
        const party = this.activeParties.get(socket.partyId);
        party.currentVideo = undefined;
        for (const client of party.connectedClients) {
            if (client.id === socket.id) continue;
            client.emit('close-video');
        }
        console.log('Video closed for party ' + socket.partyId);
    }

    /**
     * Clean up after a client disconnected
     */
    private onSocketDisconnect(socket: PartyMemberSocket) {
        this.onLeaveParty(socket);
        console.log('Client disconnected');
    }

    /**
     * Leave a party and clean up if that was the last member
     */
    private onLeaveParty(socket: PartyMemberSocket) {
        if (!socket.partyId) {
            return;
        }

        const party = this.activeParties.get(socket.partyId);
        if (party) {
            const i = party.connectedClients.indexOf(socket);
            party.connectedClients.splice(i, 1);
            for (const client of party.connectedClients) {
                client.emit('left-party', {user: socket.id});
            }
            console.log('Client left party ' + socket.partyId);

            if (party.connectedClients.length === 0) {
                this.activeParties.delete(socket.partyId);
                console.log('Removed party ' + socket.partyId);
            }
        }
    }
}