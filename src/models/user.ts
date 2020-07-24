export type UserMeta = {
  description: string
}

export type User = {
  id: number,
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  password: string,
  meta?: UserMeta
}
