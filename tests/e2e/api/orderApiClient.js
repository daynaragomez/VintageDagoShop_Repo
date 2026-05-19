import { CONSTANTS } from '../utils/constants.js';

export class OrderApiClient {
  constructor(request) {
    this.request = request;
    this.baseUrl = CONSTANTS.API_BASE_URL;
  }

  async placeOrder({ name, email, address, items }) {
    const res = await this.request.post(`${this.baseUrl}/orders`, {
      data: { name, email, address, items },
    });
    return { status: res.status(), body: await res.json() };
  }

  async placeOrderExpectSuccess(orderData) {
    const { status, body } = await this.placeOrder(orderData);
    if (status !== 201) throw new Error(`Order failed with status ${status}`);
    return body;
  }
}