import { WebSocketServer, WebSocket } from 'ws';

export class MCPWebSocketServer {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();

  constructor(port: number = 27042) {
    this.wss = new WebSocketServer({ port });
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.error('Client connected to WebSocket');
      this.clients.add(ws);

      ws.on('close', () => {
        console.error('Client disconnected from WebSocket');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  public broadcast(message: any) {
    const messageStr = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  public close() {
    this.wss.close();
  }
}
