import request from '@/utils/request'

enum API {
  GET_BANNER_LIST = '/banner/pageList',
  GET_WORLD_BANNER_LIST = '/banner/worldPageList',
  ADD_BANNER = '/banner/add',
  UPDATE_BANNER = '/banner/update',
  SHELF_BANNER = '/banner/shelf',
  DELIST_BANNER = '/banner/delist',
  DELETE_BANNER = '/banner/delete'
}

export const reqGetBannerList = (param: string) =>
  request.get<any, any>(`${API.GET_BANNER_LIST}?${param}`)

export const reqGetWorldBannerList = (param: string) =>
  request.get<any, any>(`${API.GET_WORLD_BANNER_LIST}?${param}`)

export const reqAddBanner = (data: any) =>
  request.post<any, any>(API.ADD_BANNER, data)

export const reqUpdateBanner = (data: any) =>
  request.post<any, any>(API.UPDATE_BANNER, data)

export const reqBannerShelf = (data: any) =>
  request.post<any, any>(API.SHELF_BANNER, data)

export const reqBannerDelist = (data: any) =>
  request.post<any, any>(API.DELIST_BANNER, data)

export const reqDeleteBanner = (data: any) =>
  request.post<any, any>(API.DELETE_BANNER, data)
