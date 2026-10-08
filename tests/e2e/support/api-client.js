/**
 * API Client - Centralized HTTP Request Management
 * 
 * Handles all API communication with:
 * - Request/response logging
 * - Error handling & retries
 * - Authentication headers
 * - Base URL management
 * 
 * Usage:
 *   const apiClient = new ApiClient('http://localhost:3000/api');
 *   const products = await apiClient.get('/products');
 */

class ApiClient {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL;
    this.timeout = options.timeout || 30000;
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    this.token = options.token || null;
  }

  /**
   * Set authentication token for subsequent requests
   */
  setAuthToken(token) {
    this.token = token;
    if (token) {
      this.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  /**
   * GET request with retry logic
   */
  async get(endpoint, options = {}) {
    return this.request('GET', endpoint, null, options);
  }

  /**
   * POST request with retry logic
   */
  async post(endpoint, data, options = {}) {
    return this.request('POST', endpoint, data, options);
  }

  /**
   * PUT request with retry logic
   */
  async put(endpoint, data, options = {}) {
    return this.request('PUT', endpoint, data, options);
  }

  /**
   * DELETE request with retry logic
   */
  async delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, null, options);
  }

  /**
   * Core request method with exponential backoff retry
   */
  async request(method, endpoint, data, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const retries = options.retries !== undefined ? options.retries : this.maxRetries;
    
    let lastError;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await this._makeRequest(method, url, data, options);
        
        // Log successful request
        console.log(`✓ ${method} ${endpoint} - ${response.status}`);
        
        return {
          status: response.status,
          data: response.data || (response.text ? JSON.parse(response.text) : null),
          headers: response.headers
        };
      } catch (error) {
        lastError = error;
        
        if (attempt < retries) {
          const delay = this.retryDelay * Math.pow(2, attempt); // Exponential backoff
          console.warn(`⚠ ${method} ${endpoint} - Attempt ${attempt + 1}/${retries + 1} failed. Retrying in ${delay}ms...`);
          await new Promise(r => setTimeout(r, delay));
        } else {
          console.error(`✗ ${method} ${endpoint} - Failed after ${retries + 1} attempts`);
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Make actual HTTP request (implement with fetch, axios, or http library)
   */
  async _makeRequest(method, url, data, options = {}) {
    // This would use fetch, axios, or Node.js http library
    // For now, demonstrating the pattern
    try {
      const fetchOptions = {
        method,
        headers: this.headers,
        timeout: options.timeout || this.timeout
      };

      if (data) {
        fetchOptions.body = JSON.stringify(data);
      }

      const response = await fetch(url, fetchOptions);
      
      if (!response.ok) {
        const errorData = await response.text();
        const error = new Error(`HTTP ${response.status}: ${errorData}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      const text = await response.text();
      const parsedData = text ? JSON.parse(text) : null;

      return {
        status: response.status,
        data: parsedData,
        text,
        headers: response.headers
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ApiClient;
