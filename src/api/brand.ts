import request from '@/utils/request';

enum API {
  APPROVE = '/approval/approve',
  SUBMIT_MATERIAL = '/brand/submitMaterial',
  UPLOAD = '/file/upload',
  GET_MATERIAL = '/brand/getMaterial'
}

export const reqCheck = (data: any) =>
  request.post<any, any>(API.APPROVE, data);

export const reqSubmitMaterial = (data: any) =>
  request.post<any, any>(API.SUBMIT_MATERIAL, data);

export const reqUpload = (data: any) =>
  request.post<any, any>(API.UPLOAD, data);

export const reqGetMaterial = () =>
  request.get<any, any>(API.GET_MATERIAL);
