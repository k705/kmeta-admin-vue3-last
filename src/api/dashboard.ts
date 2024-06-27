import request from '@/utils/request-notoken'


enum API {
  // 设备路由
  DATABOARD_URL = '/dataBoard/getLargeScreenData',


}
export const reqLargeScreenData = (data: LoginFormData) =>
  request.post(API.DATABOARD_URL, data)

