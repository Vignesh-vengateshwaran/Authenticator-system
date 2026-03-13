export type Role = 'USER' | 'ADMIN'

export interface User {
  id:       number
  name:     string
  mail:     string
  role:     Role
}

export interface LoginReq {
  mail:     string
  password: string
}

export interface Product {
  id:          number
  name:        string
  price:       number
  description: string
  category:    string
  image:       string
  stock:       number
}

export interface CartItem {
  product:  Product
  quantity: number
}