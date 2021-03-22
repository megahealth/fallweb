import request from '@/utils/request';

export interface tableParamsType {
  searchContentVal: string;
  statusVal: string;
}

export async function queryDeviceList(params: tableParamsType) {
  return request('/devices', {
    method: 'GET',
    data: params,
  });
}
