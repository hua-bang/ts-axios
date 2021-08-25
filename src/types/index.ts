export type Method = "get" | "GET"
  | "delete" | "DELETE"
  | "head" | "HEAD"
  | "options" | "OPTIONS"
  | "post" | "POST"
  | "put" | "PUT"
  | "fetch" | "FETCH"


export interface AxiosRequestConfig {
  url: string
  method?: Method
  data?: any
  params?: any,
  headers?: any
}