# @pipeworx/coinmarketcap

CoinMarketCap MCP — crypto prices, market cap, rankings. Free Basic plan: 10k credits/month.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1683+ live data sources.

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/coinmarketcap/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1683+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## No MCP client? Call it over HTTP

```bash
curl -X POST https://gateway.pipeworx.io/v1/tools/coinmarketcap_quotes \
  -H 'Content-Type: application/json' \
  -d '{"symbol":"BTC,ETH,SOL"}'
```

No account needed for the first calls. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/coinmarketcap_quotes`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

## Standalone (no gateway account)

This package also runs as a local stdio MCP server — no Pipeworx account, no
gateway round-trip:

```json
{
  "mcpServers": {
    "coinmarketcap": {
      "command": "npx",
      "args": ["-y", "@pipeworx/mcp-coinmarketcap"]
    }
  }
}
```

Or run it directly to confirm it starts:

```bash
npx -y @pipeworx/mcp-coinmarketcap
```

It speaks MCP over stdin/stdout and answers `initialize`/`tools/list`/`tools/call`
for **only** this pack's tools — none of the shared meta-tools the gateway
connection above adds. Same source, same tools, no ask_pipeworx routing.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Coinmarketcap data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
