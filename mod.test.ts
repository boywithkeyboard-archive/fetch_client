import { assertEquals } from 'https://deno.land/std@0.192.0/testing/asserts.ts'
import fetch from './mod.ts'

Deno.test('client', async () => {
  const client = new fetch()

  const customClient = new fetch({
    base: 'https://gist.githubusercontent.com/boywithkeyboard',
  })

  // invalid
  const invalid = await client.get('http/invalid', { type: 'text' })

  assertEquals(invalid.data, undefined)
  assertEquals(invalid.code, 0)
  assertEquals(invalid.ok, false)
  assertEquals(invalid.error, { code: 0, message: 'Network Error' })

  // json
  const json = await customClient.get(
    '/6c83bf66f9210a5be30cf200bb58cb72/raw/767503c2ef8dba39b1f4d2be186a9f1fee005ac7/hello_world.json',
    { type: 'json' },
  )

  assertEquals(json.data, { hello: 'world' })
  assertEquals(json.code, 200)
  assertEquals(json.ok, true)
  assertEquals(json.error, undefined)

  // text
  const text = await customClient.get(
    '/860490a5fc765eb737024a054c5436f1/raw/47d40dfcc39217ff5ce6bbce352a078dbc37d9aa/hello_world.txt',
    { type: 'text' },
  )

  assertEquals(text.data, 'hello world')
  assertEquals(text.code, 200)
  assertEquals(text.ok, true)
  assertEquals(text.error, undefined)

  // array buffer
  const arrayBuffer = await customClient.get(
    '/860490a5fc765eb737024a054c5436f1/raw/47d40dfcc39217ff5ce6bbce352a078dbc37d9aa/hello_world.txt',
    { type: 'buffer' },
  )

  assertEquals(arrayBuffer.data instanceof ArrayBuffer, true)
  assertEquals(arrayBuffer.code, 200)
  assertEquals(arrayBuffer.ok, true)
  assertEquals(arrayBuffer.error, undefined)

  // stream
  const stream = await customClient.get(
    '/860490a5fc765eb737024a054c5436f1/raw/47d40dfcc39217ff5ce6bbce352a078dbc37d9aa/hello_world.txt',
    { type: 'stream' },
  )

  assertEquals(stream.data instanceof ReadableStream, true)
  assertEquals(stream.code, 200)
  assertEquals(stream.ok, true)
  assertEquals(stream.error, undefined)

  await stream.data?.cancel() // fails without that line

  // does not exist
  const doesNotExist = await customClient.get('/does-not-exist.txt', {
    type: 'text',
  })

  assertEquals(doesNotExist.data, undefined)
  assertEquals(doesNotExist.code, 404)
  assertEquals(doesNotExist.ok, false)
  assertEquals(doesNotExist.error, { code: 404, message: 'Not Found' })
})
