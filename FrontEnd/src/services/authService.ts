import axios from 'axios'
import type { User, LoginReq } from '../types'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

export const authService = {

  register: async (data: {
    name:     string
    mail:     string
    password: string
    role:     string
  }): Promise<User> => {
    const response = await api.post<User>('/api/auth/register', data)
    return response.data
  },

  login: async (data: LoginReq): Promise<User> => {
    debugger;
    const response = await api.post<User>('/api/auth/login', data)
    return response.data
  },

}