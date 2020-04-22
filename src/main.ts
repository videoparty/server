import * as socketio from "socket.io";
import {SocketEvents} from "./websocket/socket-events";
require('dotenv').config();

const port = process.env.PORT || 3000;
const ioserver = socketio(port,  { origins: '*:*'});
new SocketEvents(ioserver);

console.log('server up and running on port %s', port);