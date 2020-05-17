import * as socketio from "socket.io";
import {Websocket} from "./websocket/websocket";
require('dotenv').config();

const port = process.env.PORT || 3000;
const ioserver = socketio(port,  { origins: '*:*'});
new Websocket(ioserver);

console.log('server up and running on port %s', port);