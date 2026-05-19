import { CONSTANTS } from '../utils/constants.js';

export class ProductApiClient {
  constructor(request) {
    this.request = request;
    this.baseUrl = CONSTANTS.API_BASE_URL;
  }

  async getAll() {
    const res = await this.request.get(`${this.baseUrl}/products`);
    return res.json();
  }

  async getById(id) {
    const res = await this.request.get(`${this.baseUrl}/products/${id}`);
    return res.json();
  }

  async expectProductsLoaded() {
    const products = await this.getAll();
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error('No products returned from API - is the backend running?');
    }
    return products;
  }
}