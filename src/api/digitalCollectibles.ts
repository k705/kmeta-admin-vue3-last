import request from '@/utils/request'

// 枚举 API
enum API {
  GET_NFT_SERIES = '/digitalCollectibles/seriesList',
  ADD_NFT_SERIES = '/digitalCollectibles/addSeries',
  UPDATE_NFT_SERIES = '/digitalCollectibles/updateSeries',
  DELETE_NFT_SERIES = '/digitalCollectibles/deleteSeries',
  GET_DIGITAL_COLLECTIBLES_LIST = '/digitalCollectibles/pageList',
  ADD_DIGITAL_COLLECTIBLES = '/digitalCollectibles/add',
  UPDATE_DIGITAL_COLLECTIBLES = '/digitalCollectibles/update',
  PUBLISH_DIGITAL_COLLECTIBLES = '/digitalCollectibles/publish',
  REVOKE_DIGITAL_COLLECTIBLES = '/digitalCollectibles/revoke',
  DELETE_DIGITAL_COLLECTIBLES = '/digitalCollectibles/delete'
}

// 请求函数
export const reqGetNftSeries = (param?: string) => 
  request.get<any, any>(API.GET_NFT_SERIES, { params: param })

export const reqAddNftSeries = (data: any) => 
  request.post<any, any>(API.ADD_NFT_SERIES, data)

export const reqUpdateNftSeries = (data: any) => 
  request.post<any, any>(API.UPDATE_NFT_SERIES, data)

export const reqDeleteNftSeries = (data: any) => 
  request.post<any, any>(API.DELETE_NFT_SERIES, data)

export const reqGetDigitalCollectiblesList = (param?: string) => 
  request.get<any, any>(`${API.GET_DIGITAL_COLLECTIBLES_LIST}?${param}`)

export const reqAddDigitalCollectibles = (data: any) => 
  request.post<any, any>(API.ADD_DIGITAL_COLLECTIBLES, data)

export const reqUpdateDigitalCollectibles = (data: any) => 
  request.post<any, any>(API.UPDATE_DIGITAL_COLLECTIBLES, data)

export const reqPublishDigitalCollectibles = (data: any) => 
  request.post<any, any>(API.PUBLISH_DIGITAL_COLLECTIBLES, data)

export const reqRevokeDigitalCollectibles = (data: any) => 
  request.post<any, any>(API.REVOKE_DIGITAL_COLLECTIBLES, data)

export const reqDeleteDigitalCollectibles = (data: any) => 
  request.post<any, any>(API.DELETE_DIGITAL_COLLECTIBLES, data)
