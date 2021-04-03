export interface User  {
  id?: number
  name: string
  email: string
  gender: string
  role: string
  blocked: boolean
  password?: string
  emailChecked: boolean
  createdAt?: string
  updatedAt?: string
}