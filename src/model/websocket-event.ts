export class WebsocketEvent<T> {
    name: string;
    data: T;

    constructor (eventName: string, eventData: any) {
        this.name = eventName;
        this.data = eventData as T;
    }
}