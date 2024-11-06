export default class WebSocketService {
    private socket: WebSocket | null = null;
  
    connect() {
      this.socket = new WebSocket('ws://172.16.43.23:6789');
  
      this.socket.onopen = () => {
        //ignored
      };
  
      this.socket.onclose = () => {
        //ignored
      };
  
      this.socket.onerror = (error) => {
        //ignored
      };
    }
  
    disconnect() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    }
  
    sendData(data: { x: number; y: number; z: number }) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(data));
      }
    }
  }
  