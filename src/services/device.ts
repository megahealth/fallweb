import request from '@/utils/request';

export interface tableParamsType {
  start: number;
  limit: number;
  group: number;
}

export interface getDeviceType {
  id: number;
}

export async function queryDeviceList(params: tableParamsType) {
  const { start, limit, group } = params;
  let url = '/devices?orderby=asc';
  if (typeof start === 'number') url += `&start=${start}`;
  if (typeof limit === 'number') url += `&limit=${limit}`;
  if (typeof group === 'number') url += `&group=${group}`;
  return request(url, {
    method: 'GET',
  });
}

export async function getDevice(params: getDeviceType) {
  const { id } = params;
  let url = `/device/${id}`;
  return request(url, {
    method: 'GET',
  });
}
