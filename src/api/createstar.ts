
import request from '@/utils/request'


enum API {
  // 设备路由
 CREATESTAR_URL = '/star/create',


}
export const reqCreateStar = (data) =>
  request.post(API.CREATESTAR_URL, data)


