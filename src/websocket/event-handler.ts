import {PartyMemberSocket} from "../model/party-member-socket";
import {WebsocketEvent} from "../model/websocket-event";
import {Party} from "../model/party";
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
    public async handle(socket: PartyMemberSocket, event: WebsocketEvent<any>) {
        if (this.handleEvents.includes(event.name)) {
            await this.handleEvent(socket, event);
        }

        // Call next handler, if present
        for (const nextHandler of this.nextHandlers) {
            await nextHandler.handle(socket, event);
        }
    }

    /**
     * Add another handler to the chain
     */
    public setNext(handler: EventHandler): EventHandler {
        this.nextHandlers.push(handler);
        return this;
    }

    /**
     * PRIVATE - internal handling of en event.
     * Only to be used by the implementation!
     */
    protected abstract async handleEvent(socket: PartyMemberSocket, event: WebsocketEvent<any>): Promise<void>;

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