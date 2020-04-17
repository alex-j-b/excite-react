//React
import React, { createContext } from 'react'
import { useDispatch } from 'react-redux';
import { setMessageSent, setMessageReceived } from './actions';
//WebSocket
import config from './config';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
const WebSocketContext = createContext(null);
export { WebSocketContext };
//Var
let socket;
let ws;


export default ({ children, ...props }) => {
    if (!props.userId) return <>{children}</>;

    const dispatch = useDispatch();

    const sendMessage = (body, action) => {
        body.action = action;
        body = JSON.stringify(body);
        socket.send(body);
        dispatch(setMessageSent(body));
    }

    if (!socket) {
        socket = new W3CWebSocket(config.apiGateway.WS_ENDPOINT);

        socket.onerror = (e) => {
            console.log(`Connection Error: ${JSON.stringify(e)}`);
        };
        socket.onopen = () => {
            console.log('WebSocket socket Connected');
            sendMessage({ userId: props.userId }, 'setUserId');
        }
        socket.onmessage = (message) => {
            const body = JSON.parse(message.data);
            dispatch(setMessageReceived(body));
        };
        socket.onclose = function(e) {
            console.log(`Connection Closed: ${JSON.stringify(e)}`);
        };

        ws = {
            socket: socket,
            sendMessage
        }
    }

    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    )
}