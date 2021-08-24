import request from '@/utils/request';

export interface queryGroupListParamsType {
  group: number;
  start: number;
  limit: number;
}

export interface getGroupCountType {
  group: number;
}

export interface createGroupType {
  name: string;
  parent_group: number;
}

export interface deleteGroupType {
  id: number;
}

export interface updateGroupType {
  id: number;
  name: string;
}

export async function queryGroupList() {
  return request('/groups', {
    method: 'GET',
  });
}

export async function queryGroupName(queryGroup: string) {
  return request('/group_name/' + queryGroup, {
    method: 'GET',
  });
}

// export async function queryGroupList(params: queryGroupListParamsType) {
//   const { start, limit, group } = params;
//   let url = '/groups?orderby=desc';
//   if (typeof start === 'number') url += `&start=${start}`;
//   if (typeof limit === 'number') url += `&limit=${limit}`;
//   if (typeof group === 'number') url += `&group=${group}`;
//   return request(url, {
//     method: 'GET',
//   });
// }

export async function getGroupCount(params: getGroupCountType) {
  const { group } = params;
  let url = '/groups_cnt?';
  if (typeof group === 'number') url += `&group=${group}`;
  return request(url, {
    method: 'GET',
  });
}

export async function createGroup(params: createGroupType) {
  return request('/group', {
    method: 'POST',
    data: params,
  });
}

export async function updateGroup(params: updateGroupType) {
  const { name, id } = params;
  return request(`/group/${id}`, {
    method: 'PUT',
    data: {
      name,
    },
  });
}

export async function deleteGroup(params: deleteGroupType) {
  const { id } = params;
  return request(`/group/${id}`, {
    method: 'DELETE',
  });
}

export async function getGroup(params: deleteGroupType) {
  console.log(params);
  const { id } = params;
  return request(`/group/${id}`, {
    method: 'GET',
  });
}
