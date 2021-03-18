import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
export interface tableParamsType {
  searchContentVal: string;
}

export async function queryUserList(params: tableParamsType) {
  return request('/users', {
    method: 'GET',
    data: params,
  });
}
