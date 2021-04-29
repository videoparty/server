import {Server, Socket} from "socket.io";
import {Party} from "../model/party";
import {LeavePartyEventHandler} from "./handlers/leave-party";
import {WebsocketEvent} from "../model/websocket-event";
import {NextEpisodeEventHandler} from "./handlers/next-episode";
import {PlayerReadyEventHandler} from "./handlers/player-ready";
import {CloseVideoEventHandler} from "./handlers/close-video";
import {JoinPartyEventHandler} from "./handlers/join-party";
import {PauseVideoEventHandler} from "./handlers/pause-video";
import {PlayVideoEventHandler} from "./handlers/play-video";
import {SeekTimeEventHandler} from "./handlers/seek-time";
import {StartVideoEventHandler} from "./handlers/start-video";
import {StartVideoForMemberEventHandler} from "./handlers/start-video-for-member";
import {WatchingTrailerEventHandler} from "./handlers/watching-trailer";
import {StateUpdateEventHandler} from "./handlers/state-update";
import {ChatEventHandler} from "./handlers/chat";
import {UpdateDisplayNameEventHandler} from "./handlers/update-displayname";
import { WebRtcEventHandler } from "./handlers/webrtc";

export class Websocket {

    private activeParties = new Map<string, Party>();

    constructor(private ioServer: Server) {
        ioServer.on('connection', (socket) => {
            this.setupClientListener(socket);
        });
    }

    /**
     * Assign eventhandlers for each separate socket
     */
    private setupClientListener(socket: Socket) {
        console.log('New client connected');

        // Chain of Responsibility pattern: Chain all event handlers
        const partiesGetter = () => this.activeParties;
        const eventHandlerChain =
            new ChatEventHandler(partiesGetter)
                .setNext(new CloseVideoEventHandler(partiesGetter))
                .setNext(new JoinPartyEventHandler(partiesGetter))
                .setNext(new LeavePartyEventHandler(partiesGetter))
                .setNext(new NextEpisodeEventHandler(partiesGetter))
                .setNext(new PauseVideoEventHandler(partiesGetter))
                .setNext(new PlayVideoEventHandler(partiesGetter))
                .setNext(new PlayerReadyEventHandler(partiesGetter))
                .setNext(new SeekTimeEventHandler(partiesGetter))
                .setNext(new StartVideoEventHandler(partiesGetter))
                .setNext(new StartVideoForMemberEventHandler(partiesGetter))
                .setNext(new StateUpdateEventHandler(partiesGetter))
                .setNext(new UpdateDisplayNameEventHandler(partiesGetter))
                .setNext(new WatchingTrailerEventHandler(partiesGetter))
                .setNext(new WebRtcEventHandler(partiesGetter));

        // Any incoming message will be handled by the chained event handlers
        socket.use(async (packet, next) => {
            await eventHandlerChain.handle(socket, new WebsocketEvent<any>(packet[0], packet[1]));
            next();
        });

        // Only the disconnect message is not picked up by the middleware above
        socket.on('disconnect', async (ev) => {
            await eventHandlerChain.handle(socket, new WebsocketEvent<any>('disconnect', ev));
        })
    }
}
