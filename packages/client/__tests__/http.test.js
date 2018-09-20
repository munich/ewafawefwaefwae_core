const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')
const mock = new MockAdapter(axios)

const HttpClient = require('../lib/http')

const host = 'http://example.net'
let client

beforeEach(() => {
  client = new HttpClient(host, 2)
})

describe('API - HTTP Client', () => {
  describe('constructor', () => {
    it('should be instantiated', () => {
      expect(client).toBeInstanceOf(HttpClient)
    })

    describe('host', () => {
      it('should set the host', () => {
        client = new HttpClient(host)
        expect(client.host).toBe(host)
      })

      it('should remove the final slash of the host when necessary', () => {
        client = new HttpClient('http://example.net/')
        expect(client.host).toBe('http://example.net')
      })

      it('should check that the host is not empty', () => {
        expect(() => new HttpClient('')).toThrow()
      })
    })

    describe('API version parameter', () => {
      it('should set the API version', () => {
        client = new HttpClient(host, 3)
        expect(client.version).toBe(3)
      })

      it('should use 1 when is not present', () => {
        client = new HttpClient(host)
        expect(client.version).toBe(1)
      })
    })
  })

  describe('setTimeout', () => {
    it('should set the timeout', () => {
      expect(client.timeout).toBe(60000)
      client.setTimeout(5000)
      expect(client.timeout).toBe(5000)
    })
  })

  describe('setHeaders', () => {
    it('should set the headers', () => {
      const newHeaders = {
        'API-Version': 30,
        other: 'value'
      }
      client.setHeaders(newHeaders)

      expect(client.headers).toEqual(newHeaders)
    })
  })

  describe('sendRequest', () => {
    it('should infer the API URL from the version', async () => {
      client.setVersion(1)
      mock.onGet(`${host}/api/ENDPOINT`).reply(200, { data: [] })

      let response = await client.sendRequest('get', 'ENDPOINT')
      expect(response.status).toBe(200)

      client.setVersion(2)
      mock.onGet(`${host}/api/v2/ENDPOINT`).reply(200, { data: [] })

      response = await client.sendRequest('get', 'ENDPOINT')
      expect(response.status).toBe(200)
    })
  })

  describe('get', () => {
    beforeEach(() => {
      mock.onGet(`${host}/api/v2/ENDPOINT`).reply(200, { data: [] })
    })

    it('should send GET requests to the API', async () => {
      const response = await client.get('ENDPOINT')

      expect(response.status).toBe(200)
    })

    it('should send the request params', async () => {
      const params = { param1: 'value1', param2: 'value2' }

      mock.reset()
      mock.onGet(`${host}/api/v2/ENDPOINT`, { params }).reply(200, { data: [] })

      const response = await client.get('ENDPOINT', params)

      expect(response.status).toBe(200)
    })
  })

  describe('post', () => {
    beforeEach(() => {
      mock.onPost(`${host}/api/v2/ENDPOINT`).reply(200, { data: [] })
    })

    it('should send POST requests to the API', async () => {
      const response = await client.post('ENDPOINT')

      expect(response.status).toBe(200)
    })
  })

  describe('put', () => {
    beforeEach(() => {
      mock.onPut(`${host}/api/v2/ENDPOINT`).reply(200, { data: [] })
    })

    it('should send PUT requests to the API', async () => {
      const response = await client.put('ENDPOINT')

      expect(response.status).toBe(200)
    })
  })

  describe('patch', () => {
    beforeEach(() => {
      mock.onPatch(`${host}/api/v2/ENDPOINT`).reply(200, { data: [] })
    })

    it('should send PATCH requests to the API', async () => {
      const response = await client.patch('ENDPOINT')

      expect(response.status).toBe(200)
    })
  })

  describe('delete', () => {
    beforeEach(() => {
      mock.onDelete(`${host}/api/v2/ENDPOINT`).reply(200, { data: [] })
    })

    it('should send DELETE requests to the API', async () => {
      const response = await client.delete('ENDPOINT')

      expect(response.status).toBe(200)
    })

    it('should send the request params', async () => {
      const params = { param1: 'value1', param2: 'value2' }

      mock.reset()
      mock.onDelete(`${host}/api/v2/ENDPOINT`, { params }).reply(200, { data: [] })

      const response = await client.delete('ENDPOINT', params)

      expect(response.status).toBe(200)
    })
  })
})
