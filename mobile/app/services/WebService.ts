import axios from 'axios';

class WebService {
  private baseURL: string;

  constructor() {
    this.baseURL = '';
  }

  setBaseURL(ip: string): void {
    this.baseURL = `http://${ip}:8080`;
  }

  async sendButtonAction(buttonName: string): Promise<void> {
    if (!this.baseURL) return;
    
    try {
      await axios.get(`${this.baseURL}/boton/${buttonName}`);
    } catch (error) {
      console.error("Error al enviar la acción del botón:", error);
    }
  }
}

export default new WebService();
