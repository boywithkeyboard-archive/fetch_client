## fetch

#### Setup

```bash
npm i @azury/fetch
```

#### Usage

```ts
import fetch from '@azury/fetch'

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
