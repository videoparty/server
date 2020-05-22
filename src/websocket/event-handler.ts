import {PartyMemberSocket} from "../model/party-member-socket";
import {WebsocketEvent} from "../model/websocket-event";
import {Party, WatchingParty} from "../model/party";
import {PartyMemberInfo} from "../model/party-member-info";

export abstract class EventHandler {
    nextHandlers: EventHandler[] = [];
    abstract handleEvents: string[];

    constructor(protected activePartiesGetter: () => Map<string, Party>) { }

    public getActiveParties(): Map<string, Party> {
        return this.activePartiesGetter();
    }

    /**
     * Handle an event
     */
    public async handle(socket: PartyMemberSocket, event: WebsocketEvent<any>, ...optionalArgs: any[]) {
        if (this.handleEvents.includes(event.name)) {
            await this.handleEvent(socket, event, ...optionalArgs);
        }

        await this.handleNext(socket, event, ...optionalArgs);
    }

    /**
     * Add another handler to the chain
     */
    public setNext(handler: EventHandler): EventHandler {
        this.nextHandlers.push(handler);
        return this;
    }

    /**
     * Call the next handlers, if present
     * Only to be used for the abstract classes!
     */
    protected async handleNext(socket: PartyMemberSocket, event: WebsocketEvent<any>, ...optionalArgs: any[]) {
        for (const nextHandler of this.nextHandlers) {
            await nextHandler.handle(socket, event, ...optionalArgs);
        }
    }

    /**
     * PRIVATE - internal handling of en event.
     * Only to be used by the implementation!
     */
    protected abstract async handleEvent(
        socket: PartyMemberSocket,
        event: WebsocketEvent<any>,
        ...optionalArgs: any[]
    ): Promise<void>;

    /**
     * Emits a socket event to all members in the party.
     * Possibility to exclude the sender.
     */
    protected emitToParty(event: string, args: any, party: Party, senderId?: string) {
        for (const client of party.connectedClients) {
            if (client.id === senderId) continue;
            client.emit(event, args);
        }
    }

    /**
     * Returns the id and displayName for all members.
     * If the displayName is undefined, 'Unkown' will be returned.
     */
    protected getMembersInfo(members: PartyMemberSocket[]): PartyMemberInfo[] {
        return members.map((m => this.getSingleMemberInfo(m)))
    }

    /**
     * Returns the id and displayname for the given member.
     * If the displayName is undefined, 'Unkown' will be returned.
     */
    protected getSingleMemberInfo(m: PartyMemberSocket): PartyMemberInfo {
        return {id: m.id, displayName: m.displayName || 'Unknown'}
    }
}

/**
 * An eventhandler which requires the socket to be in a valid
 * party. Otherwise the message will not be handled.
 */
export abstract class PartyEventHandler extends EventHandler {
    /**
     * Make sure the socket is in an active party
     */
    public async handle(socket: PartyMemberSocket, event: WebsocketEvent<any>, ...optionalArgs: any[]) {
        if (!socket.partyId)
            return await this.handleNext(socket, event, ...optionalArgs);

        const party = this.getActiveParties().get(socket.partyId);

        if (!party)
            return await this.handleNext(socket, event, ...optionalArgs);

        super.handle(socket, event, party);
    }

    /**
     * PRIVATE - internal handling of en event.
     * Only to be used by the implementation!
     */
    protected abstract async handleEvent(
        socket: PartyMemberSocket,
        event: WebsocketEvent<any>,
        party: Party
    ): Promise<void>;
}

/**
 * An eventhandler which requires the socket to be in a valid
 * party AND currently watching a video. Otherwise the message
 * will not be handled.
 */
export abstract class WatchingPartyEventHandler extends EventHandler {
    /**
     * Make sure the socket is in an active party
     */
    public async handle(socket: PartyMemberSocket, event: WebsocketEvent<any>, ...optionalArgs: any[]) {
        if (!socket.partyId)
            return await this.handleNext(socket, event, ...optionalArgs);

        const party = this.getActiveParties().get(socket.partyId);

        if (!party || !party.currentVideo)
            return await this.handleNext(socket, event, ...optionalArgs);

        super.handle(socket, event, party);
    }

    /**
     * PRIVATE - internal handling of en event.
     * Only to be used by the implementation!
     */
    protected abstract async handleEvent(
        socket: PartyMemberSocket,
        event: WebsocketEvent<any>,
        party: WatchingParty
    ): Promise<void>;
}