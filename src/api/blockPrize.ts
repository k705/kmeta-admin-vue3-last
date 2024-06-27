import request from '@/utils/request'

enum API {
  GET_BLOCK_PRIZE_LIST = '/blockPrize/pageList',
  ADD_BLOCK_PRIZE = '/blockPrize/add',
  UPDATE_BLOCK_PRIZE = '/blockPrize/update',
  PUBLISH_BLOCK_PRIZE = '/blockPrize/publish',
  REVOKE_BLOCK_PRIZE = '/blockPrize/revoke',
  DELETE_BLOCK_PRIZE = '/blockPrize/delete',
  UPLOAD_USED_CODE = '/blockPrize/uploadUsedCode',
  LOTTERY_INFO = '/blockPrize/lotteryInfo',
  WINNING_LIST = '/blockPrize/winningList',
  SET_BLOCK_WAYBILL_NO = '/blockPrize/setBlockWaybillNo'
}

export const reqGetBlockPrizeList = (param: string) =>
  request.get<any, any>(`${API.GET_BLOCK_PRIZE_LIST}?${param}`)

export const reqAddBlockPrize = (data: any) =>
  request.post<any, any>(API.ADD_BLOCK_PRIZE, data)

export const reqUpdateBlockPrize = (data: any) =>
  request.post<any, any>(API.UPDATE_BLOCK_PRIZE, data)

export const reqPublishBlockPrize = (data: any) =>
  request.post<any, any>(API.PUBLISH_BLOCK_PRIZE, data)

export const reqRevokeBlockPrize = (data: any) =>
  request.post<any, any>(API.REVOKE_BLOCK_PRIZE, data)

export const reqDeleteBlockPrize = (data: any) =>
  request.post<any, any>(API.DELETE_BLOCK_PRIZE, data)

export const reqUploadUsedCode = (data: any) =>
  request.post<any, any>(API.UPLOAD_USED_CODE, data)

export const reqLotteryInfo = (blockPrizeId: string) =>
  request.get<any, any>(`${API.LOTTERY_INFO}?blockPrizeId=${blockPrizeId}`)

export const reqWinningList = (blockPrizeId: string) =>
  request.get<any, any>(`${API.WINNING_LIST}?blockPrizeId=${blockPrizeId}`)

export const reqSetBlockWaybillNo = (data: any) =>
  request.post<any, any>(API.SET_BLOCK_WAYBILL_NO, data)
