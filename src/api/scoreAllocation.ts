/*
 * @Description: Stay hungry，Stay foolish
 * @Author: Huccct
 * @Date: 2023-05-26 15:59:58
 * @LastEditors: Huccct
 * @LastEditTime: 2023-05-27 23:09:31
 */

import request from '@/utils/request'

enum API {
  GET_SCORE = '/score/getScore',
  GET_ALL_SELECT_ENTERPRISE = '/brand/getAllSelectEnterprise',
  GET_SELECT_STAR = '/star/getSelectStar',
  ALLOCATION = '/score/allocation',
  RECHARGE = '/score/recharge',
  SCORE_RECHARGE_RECORD = '/score/rechargeRecord',
  ALLOCATION_ENTERPRISE_RECORD = '/score/allocationEnterpriseRecord',
  ALLOCATION_STAR_RECORD = '/score/allocationStarRecord'
}

export const reqGetScore = () =>
  request.get<any, any>(API.GET_SCORE)

export const reqGetAllSelectEnterprise = (containPlatform: boolean) =>
  request.get<any, any>(`${API.GET_ALL_SELECT_ENTERPRISE}?containPlatform=${containPlatform}`)

export const reqGetSelectStar = (enterpriseId: number | string) =>
  request.get<any, any>(`${API.GET_SELECT_STAR}?enterpriseId=${enterpriseId}`)

export const reqAllocation = (data: any) =>
  request.post<any, any>(API.ALLOCATION, data)

export const reqRecharge = (data: any) =>
  request.post<any, any>(API.RECHARGE, data)

export const reqScoreRechargeRecord = (param: string) =>
  request.get<any, any>(`${API.SCORE_RECHARGE_RECORD}?${param}`)

export const reqAllocationEnterpriseRecord = (param: string) =>
  request.get<any, any>(`${API.ALLOCATION_ENTERPRISE_RECORD}?${param}`)

export const reqAllocationStarRecord = (param: string) =>
  request.get<any, any>(`${API.ALLOCATION_STAR_RECORD}?${param}`)
