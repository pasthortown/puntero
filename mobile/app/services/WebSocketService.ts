export default class WebSocketService {
  private socket: WebSocket | null = null;
  private onConnectionChange: (connected: boolean) => void;

  constructor(onConnectionChange: (connected: boolean) => void) {
    this.onConnectionChange = onConnectionChange;
  }

  connect(ip: string) {
    this.socket = new WebSocket(`ws://${ip}:6789`);

    this.socket.onopen = () => {
      this.onConnectionChange(true);
    };

    this.socket.onclose = () => {
      this.onConnectionChange(false);
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.onConnectionChange(false);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  sendData(data: { yaw: number; pitch: number, roll: number, x: number, y: number, z: number }) {
    const Ax = (data.x * Math.cos(data.pitch) * Math.cos(data.roll)) + (data.y * Math.sin(data.roll)) + (data.z * Math.sin(data.pitch) * Math.cos(data.roll));
    const Ay = (data.x * Math.sin(data.pitch) * Math.cos(data.roll)) + (data.y * Math.cos(data.roll)) - (data.z * Math.sin(data.roll));
        
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({Ax: Ax * (180 / Math.PI), Ay: Ay * (180 / Math.PI)}));
    }
  }
}
