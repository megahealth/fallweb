import request from '@/utils/request';

export interface LoginParamsType {
  userName: string;
  password: string;
}
export interface UserInfoParamsType {
  userid: string;
}

export async function queryLogin(params: LoginParamsType) {
  return request('/login', {
    method: 'POST',
    data: params,
  });
}

export async function queryUserInfo(params: UserInfoParamsType) {
  const id = params.userid;
  return request(`/user/${id}`, {
    method: 'GET',
  });
}

export async function logout(): Promise<any> {
  return request('/api/logout');
}
