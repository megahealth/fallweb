import request_logic from '@/utils/request_logic';

export interface paramsType {
  sn?: string;
  skip: number;
  limit: number;
  start: number;
  end: number;
}

export async function getFactoryTests(params: paramsType) {
  const { skip, limit, start, end } = params;
  let url = '/get_factory_test_reports?orderby=-1';
  if (typeof skip === 'number') url += `&skip=${skip}`;
  if (typeof limit === 'number') url += `&limit=${limit}`;
  if (typeof start === 'number') url += `&start=${start}`;
  if (typeof end === 'number') url += `&end=${end}`;
  return request_logic(url, {
    method: 'GET',
  });
}

export async function getFactoryTestsSn(params: paramsType) {
  const { sn, skip, limit, start, end } = params;
  let url = `/get_factory_test_reports_sn/${sn}?orderby=-1`;
  if (typeof skip === 'number') url += `&skip=${skip}`;
  if (typeof limit === 'number') url += `&limit=${limit}`;
  if (typeof start === 'number') url += `&start=${start}`;
  if (typeof end === 'number') url += `&end=${end}`;
  return request_logic(url, {
    method: 'GET',
  });
}
