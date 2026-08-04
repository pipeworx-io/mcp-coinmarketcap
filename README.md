# @pipeworx/coinmarketcap

CoinMarketCap MCP — crypto prices, market cap, rankings. Free Basic plan: 10k credits/month.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `quotes(symbol?, id?, convert?)` — latest price/volume/cap for one or more coins
- `listings_latest(start?, limit?, sort?, convert?)` — top-ranked coins
- `metadata(symbol?, id?)` — coin profile, logo, social links
- `global_metrics(convert?)` — total market cap, BTC/ETH dominance, active cryptos
- `categories(start?, limit?)` — meta-categories (DeFi, L1, NFTs, etc.)
- `category(id, convert?)` — coins within a category

## Auth

- **Platform key:** gateway env `PLATFORM_CMC_KEY`
- **BYO:** `?_apiKey=<key>` after registering at https://pro.coinmarketcap.com/signup

## Data source

`https://pro-api.coinmarketcap.com/v1/` and `/v2/` — `X-CMC_PRO_API_KEY` header.

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "coinmarketcap": {
      "url": "https://gateway.pipeworx.io/coinmarketcap/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Coinmarketcap data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
