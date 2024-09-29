const API_BASE_URL = 'https://api.xeggex.com/api/v2';

class XeggexAPI {
  private async fetchFromAPI(endpoint: string, params: any[] = []) {
    const url = `${API_BASE_URL}/${endpoint}/${params.join('/')}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching ${endpoint}: ${response.statusText}`);
    }

    return await response.json();
  }

  public async getMarketData() {
    return await this.fetchFromAPI('marketdata');
  }

  public async getTicker(symbol: string) {
    return await this.fetchFromAPI('ticker', [symbol]);
  }

  public async getOrderBook(symbol: string) {
    return await this.fetchFromAPI('orderbook', [symbol]);
  }

  public async getTrades(symbol: string) {
    return await this.fetchFromAPI('trades', [symbol]);
  }

  public async getCurrencies() {
    return await this.fetchFromAPI('currencies');
  }

  public async getCurrencyInfo(symbol: string) {
    return await this.fetchFromAPI('currency', [symbol]);
  }
}

export default XeggexAPI;
