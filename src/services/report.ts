import request_logic from '@/utils/request_logic';

export interface ReportParamsType {
  orderby: number;
  skip: number;
  limit: number;
  start: number;
  end: number;
  sn: string;
}

export async function getReportFallData(params: ReportParamsType) {
  const { orderby, skip, limit, start, end, sn } = params;
  let url = `/device_fall_rep/${sn}?orderby=-1`;
  if (typeof skip === 'number') url += `&skip=${skip}`;
  if (typeof limit === 'number') url += `&limit=${limit}`;
  if (typeof start === 'number') url += `&start=${start}`;
  if (typeof end === 'number') url += `&end=${end}`;
  return request_logic(url, {
    method: 'GET',
    data: params,
  });
}

export async function getReportBreathData(params: ReportParamsType) {
  const { orderby, skip, limit, start, end, sn } = params;
  let url = `/device_breath_rep/${sn}?orderby=-1`;
  if (typeof skip === 'number') url += `&skip=${skip}`;
  if (typeof limit === 'number') url += `&limit=${limit}`;
  if (typeof start === 'number') url += `&start=${start}`;
  if (typeof end === 'number') url += `&end=${end}`;
  return request_logic(url, {
    method: 'GET',
    data: params,
  });
}

export async function getReportRunningData(params: ReportParamsType) {
  const { orderby, skip, limit, start, end, sn } = params;
  let url = `/device_running_rep/${sn}?orderby=-1`;
  if (typeof skip === 'number') url += `&skip=${skip}`;
  if (typeof limit === 'number') url += `&limit=${limit}`;
  if (typeof start === 'number') url += `&start=${start}`;
  if (typeof end === 'number') url += `&end=${end}`;
  return request_logic(url, {
    method: 'GET',
    data: params,
  });
}

export async function getReportAlterData(params: ReportParamsType) {
  const { orderby, skip, limit, start, end, sn } = params;
  let url = `/device_alert_rep/${sn}?orderby=-1`;
  if (typeof skip === 'number') url += `&skip=${skip}`;
  if (typeof limit === 'number') url += `&limit=${limit}`;
  if (typeof start === 'number') url += `&start=${start}`;
  if (typeof end === 'number') url += `&end=${end}`;
  return request_logic(url, {
    method: 'GET',
    data: params,
  });
}
