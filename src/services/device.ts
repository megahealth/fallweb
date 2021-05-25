import request from '@/utils/request';

export interface tableParamsType {
  start: number;
  limit: number;
  group: number;
}

export interface getDeviceType {
  id: number;
}

export interface deleteDeviceType {
  id: number;
}

export interface createDeviceType {
  group: number;
  sn: string;
  name: string;
}

export interface updateDeviceType {
  group: number;
  name: string;
  id: number;
}

export interface getCountType {
  group: number;
}

export async function queryDeviceList(params: tableParamsType) {
  const { start, limit, group } = params;
  let url = '/devices?orderby=desc';
  if (typeof start === 'number') url += `&start=${start}`;
  if (typeof limit === 'number') url += `&limit=${limit}`;
  if (typeof group === 'number') url += `&group=${group}`;
  return request(url, {
    method: 'GET',
  });
}

export async function getDeviceCount(params: getCountType) {
  const { group } = params;
  let url = '/devices_cnt?';
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

export async function createDevice(params: createDeviceType) {
  let url = `/device`;
  return request(url, {
    method: 'POST',
    data: params,
  });
}

export async function deleteDevice(params: deleteDeviceType) {
  const { id } = params;
  let url = `/device/${id}`;
  return request(url, {
    method: 'DELETE',
  });
}

export async function updateDevice(params: updateDeviceType) {
  const { name, group, id } = params;
  let url = `/device/${id}`;
  return request(url, {
    method: 'PUT',
    data: {
      name,
      group,
    },
  });
}
