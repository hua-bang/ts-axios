export type Method = "get" | "GET"
  | "delete" | "DELETE"
  | "head" | "HEAD"
  | "options" | "OPTIONS"
  | "post" | "POST"
  | "put" | "PUT"
  | "fetch" | "FETCH"


export interface AxiosConfig {
  url: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
}

export interface AxiosRequestConfig extends AxiosConfig{
  
}

export interface AxiosResponseConfig extends AxiosConfig{
  
}

export interface AxiosResponse{
  data: any
  status: number
  statusText: string
  headers: any
  config: AxiosResponseConfig,
  request: any
}

export interface AxiosPromise extends Promise<AxiosResponse> {

}