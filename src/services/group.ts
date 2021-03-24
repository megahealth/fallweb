import request from '@/utils/request';

export async function queryGroupList() {
  return request('/groups', {
    method: 'GET',
  });
}
