import request from '@/utils/request';

export interface tableParamsType {
  start: number;
  limit: number;
}

export async function queryDeviceList(params: tableParamsType) {
  const { start, limit } = params;
  return request(`/devices?start=${start}&limit=${limit}&orderby=asc`, {
    method: 'GET',
  });
}
