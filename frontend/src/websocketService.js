// src/websocketService.js
import socketIOClient from 'socket.io-client';

const ENDPOINT = 'http://localhost:5000'; // Replace with your server URL

class WebSocketService {
    constructor() {
        this.socket = null;
    }

    connect() {
        this.socket = socketIOClient(ENDPOINT);
        this.socket.on('connect', () => {
            console.log('Connected to server via WebSocket');
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    subscribeToStockUpdates(callback) {
        if (!this.socket) {
            this.connect();
        }
        this.socket.on('stockData', callback);
    }
}

const webSocketService = new WebSocketService();
export default webSocketService;
