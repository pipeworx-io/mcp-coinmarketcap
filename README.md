# mcp-coinmarketcap

CoinMarketCap MCP — crypto prices, market cap, rankings

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `listings_latest` | Top-ranked coins by market cap. |
| `metadata` | Static coin metadata — logo, description, website, social links. |
| `global_metrics` | Total market cap, 24h volume, BTC/ETH dominance, active cryptos. |
| `categories` | List meta-categories (DeFi, L1, NFTs, Memes, …). |
| `category` | Coins belonging to a specific category. |

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

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
