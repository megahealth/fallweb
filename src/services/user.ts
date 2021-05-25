import request from '@/utils/request';

export interface getUserParamsType {
  start: number;
  limit: number;
  group: number;
}

export interface createUserType {
  name: string;
  password: string;
  group: number;
}

export interface deleteUserType {
  id: number;
}

export interface updateUserType {
  id: number;
  name: string;
  password: string;
  group: number;
}

export async function queryUserList(params: getUserParamsType) {
  const { start, limit, group } = params;
  let url = '/users?orderby=desc';
  if (typeof start === 'number') url += `&start=${start}`;
  if (typeof limit === 'number') url += `&limit=${limit}`;
  if (typeof group === 'number') url += `&group=${group}`;
  return request(url, {
    method: 'GET',
  });
}

export async function getUserCount(params: getUserParamsType) {
  const { group } = params;
  let url = '/users_cnt?';
  if (typeof group === 'number') url += `&group=${group}`;
  return request(url, {
    method: 'GET',
  });
}

export async function createUser(params: createUserType) {
  return request('/user', {
    method: 'POST',
    data: params,
  });
}

export async function updateUser(params: updateUserType) {
  const { name, password, group, id } = params;
  return request(`/user/${id}`, {
    method: 'PUT',
    data: {
      name,
      password,
      group,
    },
  });
}

export async function deleteUser(params: deleteUserType) {
  const { id } = params;
  return request(`/user/${id}`, {
    method: 'DELETE',
  });
}
