/*
 * @Description: Stay hungry，Stay foolish
 * @Author: Huccct
 * @Date: 2023-05-26 15:59:58
 * @LastEditors: Huccct
 * @LastEditTime: 2023-05-27 23:09:31
 */

import request from '@/utils/request'

enum API {
  STAR_LIST = '/star/pageList',
  SHOW_STAR_AVATAR = '/star/showStarAvatar',
  GET_STAR_ORE = '/star/getStarOre',
  UPDATE_STAR = '/star/updateStar',
  SET_ORE = '/star/setOre',
  BATCH_SET_ORE = '/star/batchSetOre',
  ONLINE = '/star/online',
  OFF_SHELF = '/star/offShelf'
}

export const reqStarList = (param: string) =>
  request.get<any, any>(`${API.STAR_LIST}?${param}`)

export const reqShowStarAvatar = (data: any) =>
  request.post<any, any>(API.SHOW_STAR_AVATAR, data)

export const reqGetStarOre = (starId: number | string) =>
  request.get<any, any>(`${API.GET_STAR_ORE}?starId=${starId}`)

export const reqUpdateStar = (data: any) =>
  request.post<any, any>(API.UPDATE_STAR, data)

export const reqSetOre = (data: any) =>
  request.post<any, any>(API.SET_ORE, data)

export const reqBatchSetOre = (data: any) =>
  request.post<any, any>(API.BATCH_SET_ORE, data)

export const online = (data: any) =>
  request.post<any, any>(API.ONLINE, data)

export const offShelf = (data: any) =>
  request.post<any, any>(API.OFF_SHELF, data)
