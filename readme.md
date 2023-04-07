## fetch

### Setup

#### Deno

```ts
import fetch from 'https://deno.land/x/fetch_client@v0.6.0/mod.ts'
```

#### Node.js

```bash
npm i @azury/fetch
```

```ts
import fetch from '@azury/fetch'
```

### Usage

```ts
const client = new fetch()

// optionally, you can specify global headers and a base path
const client = new fetch({
  base: 'https://',
  headers: {
    authorization: 'bearer token'
  }
})

const { data, error, code, ... } = await client.get('example.com', { type: 'json' }) // fetches 'https://example.com' and parses the response body as json
```
