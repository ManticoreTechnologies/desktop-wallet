const API_URL = 'https://api.manticore.exchange/evrmore/rpc/';

const fetchFromAPI = async (endpoint: string, params: any[]) => {
  try {
    const body = params.length ? JSON.stringify(params) : undefined; 
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`Error fetching ${endpoint}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in ${endpoint}:`, error);
    throw error;
  }
};

const getBlockCount = async () => {
  return await fetchFromAPI('getblockcount', []);
};

const getBlockHash = async (blockHeight: number) => {
  return await fetchFromAPI('getblockhash', [blockHeight]);
};

const getBlockHeader = async (blockHash: string) => {
  return await fetchFromAPI('getblockheader', [blockHash]);
};

const getBlockTime = async (blockHash: string) => {
  const blockHeader = await getBlockHeader(blockHash);
  return blockHeader.time;
};

const getBalance = async (address: string) => {
  return await fetchFromAPI('getbalance', [address]);
};

const getAddressBalance = async (address: string[]) => {
  return await fetchFromAPI('getaddressbalance', [{addresses: address}]);
};

const getAddressMempool = async (address: string[]) => {
  return await fetchFromAPI('getaddressmempool', [{addresses: address}]);
};

const getReceivedByAddress = async (address: string) => {
  return (await (fetchFromAPI('getaddressbalance', [{addresses: [address]}]))).received;
};

const getReceivedByAddresses = async (addresses: string[]) => {
  return (await (fetchFromAPI('getaddressbalance', [{addresses: addresses}]))).received;
};

const getAssetBalances = async (address: string) => {
  return await (fetchFromAPI('getaddressbalance', [{addresses: [address]}, true]));
};


const getAddressAssetBalances = async (addresses: string[]) => {
  return await (fetchFromAPI('getaddressbalance', [{addresses: addresses}, true]));
};

export { 
  getBlockCount, 
  getBlockHash, 
  getBlockHeader, 
  getBlockTime, 
  getBalance, 
  getAddressBalance, 
  getReceivedByAddress, 
  getReceivedByAddresses,
  getAssetBalances,
  getAddressAssetBalances,
  getAddressMempool
};