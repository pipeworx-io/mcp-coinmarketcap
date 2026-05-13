interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * CoinMarketCap MCP — crypto prices, market cap, rankings
 *
 * Auth: X-CMC_PRO_API_KEY header.
 * Basic plan: 10k credits/mo, 30 calls/min.
 * Docs: https://coinmarketcap.com/api/documentation/v1/
 */


const BASE = 'https://pro-api.coinmarketcap.com';

const tools: McpToolExport['tools'] = [
  {
    name: 'quotes',
    description:
      'Latest market quotes for one or more cryptocurrencies. Identify by symbol (e.g. "BTC,ETH") OR by id (CMC numeric IDs).',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Comma-separated tickers (e.g. "BTC,ETH,SOL")' },
        id: { type: 'string', description: 'Comma-separated CMC IDs' },
        convert: { type: 'string', description: 'Target currency (default USD)' },
      },
    },
  },
  {
    name: 'listings_latest',
    description: 'Top-ranked coins by market cap.',
    inputSchema: {
      type: 'object',
      properties: {
        start: { type: 'number', description: '1-based rank offset (default 1)' },
        limit: { type: 'number', description: '1-5000 (default 20)' },
        sort: { type: 'string', description: 'market_cap | volume_24h | percent_change_24h | name | symbol' },
        convert: { type: 'string', description: 'Quote currency (default USD)' },
      },
    },
  },
  {
    name: 'metadata',
    description: 'Static coin metadata — logo, description, website, social links.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Comma-separated tickers' },
        id: { type: 'string', description: 'Comma-separated CMC IDs' },
      },
    },
  },
  {
    name: 'global_metrics',
    description: 'Total market cap, 24h volume, BTC/ETH dominance, active cryptos.',
    inputSchema: {
      type: 'object',
      properties: { convert: { type: 'string', description: 'Default USD' } },
    },
  },
  {
    name: 'categories',
    description: 'List meta-categories (DeFi, L1, NFTs, Memes, …).',
    inputSchema: {
      type: 'object',
      properties: {
        start: { type: 'number' },
        limit: { type: 'number', description: '1-5000 (default 100)' },
      },
    },
  },
  {
    name: 'category',
    description: 'Coins belonging to a specific category.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Category id (from `categories`)' },
        convert: { type: 'string' },
      },
      required: ['id'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = (args._apiKey as string | undefined)?.trim();
  if (!apiKey) {
    throw new Error(
      'CoinMarketCap requires an API key. Contact the operator about platform credentials, or BYO via ?_apiKey=<key> after registering at https://pro.coinmarketcap.com/signup.',
    );
  }
  switch (name) {
    case 'quotes': {
      const params = new URLSearchParams();
      if (args.symbol) params.set('symbol', String(args.symbol).toUpperCase());
      if (args.id) params.set('id', String(args.id));
      if (!params.has('symbol') && !params.has('id')) {
        throw new Error('Provide symbol or id.');
      }
      params.set('convert', String(args.convert ?? 'USD'));
      return cmcGet(apiKey, `/v2/cryptocurrency/quotes/latest?${params}`);
    }
    case 'listings_latest': {
      const params = new URLSearchParams({
        start: String(Math.max(1, (args.start as number) ?? 1)),
        limit: String(Math.min(5000, Math.max(1, (args.limit as number) ?? 20))),
        convert: String(args.convert ?? 'USD'),
      });
      if (args.sort) params.set('sort', String(args.sort));
      return cmcGet(apiKey, `/v1/cryptocurrency/listings/latest?${params}`);
    }
    case 'metadata': {
      const params = new URLSearchParams();
      if (args.symbol) params.set('symbol', String(args.symbol).toUpperCase());
      if (args.id) params.set('id', String(args.id));
      if (!params.has('symbol') && !params.has('id')) {
        throw new Error('Provide symbol or id.');
      }
      return cmcGet(apiKey, `/v2/cryptocurrency/info?${params}`);
    }
    case 'global_metrics': {
      const params = new URLSearchParams({ convert: String(args.convert ?? 'USD') });
      return cmcGet(apiKey, `/v1/global-metrics/quotes/latest?${params}`);
    }
    case 'categories': {
      const params = new URLSearchParams({
        start: String(Math.max(1, (args.start as number) ?? 1)),
        limit: String(Math.min(5000, Math.max(1, (args.limit as number) ?? 100))),
      });
      return cmcGet(apiKey, `/v1/cryptocurrency/categories?${params}`);
    }
    case 'category': {
      const params = new URLSearchParams({
        id: reqStr(args, 'id', '"6051a82166fc1b42617d6dc6"'),
        convert: String(args.convert ?? 'USD'),
      });
      return cmcGet(apiKey, `/v1/cryptocurrency/category?${params}`);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function cmcGet(apiKey: string, path: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'X-CMC_PRO_API_KEY': apiKey, Accept: 'application/json' },
  });
  if (res.status === 401) throw new Error('CMC: unauthorized — check key');
  if (res.status === 402) throw new Error('CMC: plan does not include this endpoint');
  if (res.status === 429) throw new Error('CMC: rate-limit (HTTP 429)');
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`CMC error: ${res.status} ${t.slice(0, 200)}`);
  }
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
