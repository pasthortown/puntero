import axios from 'axios';

class WebService {
  private baseURL: string;

  constructor() {
    this.baseURL = 'http://172.16.43.23:8080';
  }

  async sendButtonAction(buttonName: string): Promise<void> {
    try {
      const url = `${this.baseURL}/boton/${buttonName}`;
      await axios.get(url);
    } catch (error) {
      //ignored
    }
  }
}

export default new WebService();
