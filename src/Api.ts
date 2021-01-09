import qs from 'qs'
import axios, { AxiosInstance } from 'axios'

class Api {
  instance: AxiosInstance

  constructor(private token: string) {
    this.instance = axios.create({
      headers: {
        'Wanikani-Revision': '20170710',
        Authorization: `Bearer ${token}`
      },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma', encode: false })
    })
  }

  async get<T>(url: string, lastUpdated?: Date) {
    const results = await this.instance.get<T>(url, {
      headers: {
        'If-Modified-Since': lastUpdated?.toUTCString()
      },
      params: {
        'updated_after': lastUpdated?.toISOString()
      }
    })
    return results.data
  }
}

export default Api
