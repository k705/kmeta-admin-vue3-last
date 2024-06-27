import request from '@/utils/request'

enum API {
  GET_AD_COLUMN_LIST = '/worldAd/adColumnPageList',
  ADD_AD_COLUMN = '/worldAd/addAdColumn',
  UPDATE_AD_COLUMN = '/worldAd/updateAdColumn',
  DELETE_AD_COLUMN = '/worldAd/deleteAdColumn',
  GET_AD_LIST = '/worldAd/adPageList',
  ADD_AD = '/worldAd/addAd',
  UPDATE_AD = '/worldAd/updateAd',
  PUBLISH_AD = '/worldAd/publishAd',
  DELETE_AD = '/worldAd/deleteAd'
}

export const reqGetAdColumnList = (param: string) =>
  request.get<any, any>(`${API.GET_AD_COLUMN_LIST}?${param}`)

export const reqAddAdColumn = (data: any) =>
  request.post<any, any>(API.ADD_AD_COLUMN, data)

export const reqUpdateAdColumn = (data: any) =>
  request.post<any, any>(API.UPDATE_AD_COLUMN, data)

export const reqDeleteAdColumn = (data: any) =>
  request.post<any, any>(API.DELETE_AD_COLUMN, data)

export const reqGetAdList = (param: string) =>
  request.get<any, any>(`${API.GET_AD_LIST}?${param}`)

export const reqAddAd = (data: any) =>
  request.post<any, any>(API.ADD_AD, data)

export const reqUpdateAd = (data: any) =>
  request.post<any, any>(API.UPDATE_AD, data)

export const reqPublishAd = (data: any) =>
  request.post<any, any>(API.PUBLISH_AD, data)

export const reqDeleteAd = (data: any) =>
  request.post<any, any>(API.DELETE_AD, data)
