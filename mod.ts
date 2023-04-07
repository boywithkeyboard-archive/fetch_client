type Type =
  | 'text'
  | 'json'
  | 'buffer'
  | 'stream'
  | 'none'

type Stream = ReadableStream<Uint8Array>

type Data =
  | string
  | Record<string, unknown>
  | ArrayBuffer
  | Stream

class fetch {
  private base: string | undefined
  private headers: Record<string, string> | undefined

  constructor(options?: {
    base: string
    headers?: Record<string, string>
  }) {
    this.base = options?.base
    this.headers = options?.headers
  }

  async fetch<T>(
    method: string,
    url: string,
    options: {
      onSuccess?: (
        payload: {
          data: T extends 'text' ? string
            : T extends 'json'
            // deno-lint-ignore no-explicit-any
              ? Record<string, any>
            : T extends 'buffer' ? ArrayBuffer
            : Stream
          code: number
          headers: Record<string, string>
        },
      ) => unknown
      onError?: (
        payload: {
          error: { code: number; message: string }
          code: number
          headers: Record<string, string>
        },
      ) => unknown
      headers?: Record<string, string>
      data?:
        | string
        | Record<string, unknown>
        | ArrayBuffer
        | Stream
      type: Type
    },
  ): Promise<
    {
      data: T extends 'text' ? string
        : T extends 'json'
        // deno-lint-ignore no-explicit-any
          ? Record<string, any>
        : T extends 'buffer' ? ArrayBuffer
        : T extends 'stream' ? Stream
        : null
      error: undefined
      code: number
      ok: true
      headers: Record<string, string>
    } | {
      data: undefined
      error: { code: number; message: string }
      code: number
      ok: false
      headers: Record<string, string>
    }
  > {
    try {
      let body: BodyInit | undefined
      let type: string | undefined

      if (options.data) {
        if (typeof options.data === 'string') {
          body = options.data
          type = 'text/plain; charset=utf-8;'
        } else if (options.data instanceof ArrayBuffer) {
          body = options.data
        } else if (options.data instanceof ReadableStream) {
          body = options.data
        } else {
          body = JSON.stringify(options.data)
          type = 'application/json; charset=utf-8;'
        }
      }

      const res = await globalThis.fetch(
        this.base ? `${this.base}${url}` : url,
        {
          ...(body && { body }),
          method,
          headers: {
            ...(type && { 'content-type': type }),
            ...options.headers,
            ...this.headers,
          },
        },
      )

      const headers: Record<string, string> = {}

      for (const [key, value] of res.headers) {
        headers[key.toLowerCase()] = value
      }

      const def = { code: res.status, ok: res.ok, headers }

      if (res.ok) {
        if (options.type === 'none') {
          await res.body?.cancel()
        }

        const data = options.type === 'buffer'
          ? await res.arrayBuffer()
          : options.type === 'json'
          ? await res.json()
          : options.type === 'stream'
          ? res.body
          : options.type === 'text'
          ? await res.text()
          : null

        if (!options.onSuccess) {
          return {
            data,
            error: undefined,
            code: res.status,
            ok: res.ok,
            headers,
          }
        }

        options.onSuccess({ data, code: res.status, headers })
      }

      const error = res.headers.get('content-type')?.includes('json')
        ? await res.json()
        : { code: res.status, message: await res.text() }

      if (!options.onError) {
        return { data: undefined, error, code: res.status, ok: false, headers }
      }

      options.onError({ error, ...def })

      // deno-lint-ignore no-explicit-any
      return undefined as any
    } catch (_err) {
      return {
        data: undefined,
        code: 0,
        error: {
          code: 0,
          message: 'Network Error',
        },
        ok: false,
        headers: {},
      }
    }
  }

  async get<T extends Type>(url: string, options: {
    headers?: Record<string, string>
    type: T
    onSuccess?: (
      payload: {
        data:
          | (T extends 'text' ? string
            : T extends 'json'
            // deno-lint-ignore no-explicit-any
              ? Record<string, any>
            : T extends 'buffer' ? ArrayBuffer
            : Stream)
          | undefined
        code: number
        headers: Record<string, string>
      },
    ) => unknown
    onError?: (
      payload: {
        error: { code: number; message: string }
        code: number
        headers: Record<string, string>
      },
    ) => unknown
  }) {
    return await this.fetch<T>('GET', url, options)
  }

  async post<T extends Type>(url: string, options: {
    data?: Data
    headers?: Record<string, string>
    type: T
    onSuccess?: (
      payload: {
        data:
          | (T extends 'text' ? string
            : T extends 'json'
            // deno-lint-ignore no-explicit-any
              ? Record<string, any>
            : T extends 'buffer' ? ArrayBuffer
            : Stream)
          | undefined
        code: number
        headers: Record<string, string>
      },
    ) => unknown
    onError?: (
      payload: {
        error: { code: number; message: string }
        code: number
        headers: Record<string, string>
      },
    ) => unknown
  }) {
    return await this.fetch<T>('POST', url, options)
  }

  async put<T extends Type>(url: string, options: {
    data?: Data
    headers?: Record<string, string>
    type: T
    onSuccess?: (
      payload: {
        data:
          | (T extends 'text' ? string
            : T extends 'json'
            // deno-lint-ignore no-explicit-any
              ? Record<string, any>
            : T extends 'buffer' ? ArrayBuffer
            : Stream)
          | undefined
        code: number
        headers: Record<string, string>
      },
    ) => unknown
    onError?: (
      payload: {
        error: { code: number; message: string }
        code: number
        headers: Record<string, string>
      },
    ) => unknown
  }) {
    return await this.fetch<T>('PUT', url, options)
  }

  async patch<T extends Type>(url: string, options: {
    data?: Data
    headers?: Record<string, string>
    type: T
    onSuccess?: (
      payload: {
        data:
          | (T extends 'text' ? string
            : T extends 'json'
            // deno-lint-ignore no-explicit-any
              ? Record<string, any>
            : T extends 'buffer' ? ArrayBuffer
            : Stream)
          | undefined
        code: number
        headers: Record<string, string>
      },
    ) => unknown
    onError?: (
      payload: {
        error: { code: number; message: string }
        code: number
        headers: Record<string, string>
      },
    ) => unknown
  }) {
    return await this.fetch<T>('PATCH', url, options)
  }

  async delete<T extends Type>(url: string, options: {
    data?: Data
    headers?: Record<string, string>
    type: T
    onSuccess?: (
      payload: {
        data:
          | (T extends 'text' ? string
            : T extends 'json'
            // deno-lint-ignore no-explicit-any
              ? Record<string, any>
            : T extends 'buffer' ? ArrayBuffer
            : Stream)
          | undefined
        code: number
        headers: Record<string, string>
      },
    ) => unknown
    onError?: (
      payload: {
        error: { code: number; message: string }
        code: number
        headers: Record<string, string>
      },
    ) => unknown
  }) {
    return await this.fetch<T>('DELETE', url, options)
  }

  async head(url: string, options: {
    headers?: Record<string, string>
    onSuccess?: (
      payload: {
        data: string
        code: number
        headers: Record<string, string>
      },
    ) => unknown
    onError?: (
      payload: {
        error: { code: number; message: string }
        code: number
        headers: Record<string, string>
      },
    ) => unknown
  }) {
    // @ts-ignore: ok
    return await this.fetch('HEAD', url, { ...options, type: 'text' })
  }
}

export default fetch
