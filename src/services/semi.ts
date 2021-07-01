import request_logic from '@/utils/request_logic';

export interface paramsType {
  sn?: string;
  skip: number;
  limit: number;
  start: number;
  end: number;
}

export async function getSemiTest(params: paramsType) {
  const { skip, limit, start, end } = params;
  let url = '/get_semi_finished_test_reports?orderby=-1';
  if (typeof skip === 'number') url += `&skip=${skip}`;
  if (typeof limit === 'number') url += `&limit=${limit}`;
  if (typeof start === 'number') url += `&start=${start}`;
  if (typeof end === 'number') url += `&end=${end}`;
  return request_logic(url, {
    method: 'GET',
  });
}

export async function getSemiTestSn(params: paramsType) {
  const { sn, skip, limit, start, end } = params;
  let url = `/get_semi_finished_test_reports_sn/${sn}?orderby=-1`;
  if (typeof skip === 'number') url += `&skip=${skip}`;
  if (typeof limit === 'number') url += `&limit=${limit}`;
  if (typeof start === 'number') url += `&start=${start}`;
  if (typeof end === 'number') url += `&end=${end}`;
  return request_logic(url, {
    method: 'GET',
  });
}
