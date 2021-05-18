import request_logic from '@/utils/request_logic';
import moment from 'moment';

export interface SleepReportParamsType {
  sn: string;
  day: string;
}

export async function getSleepReport(params: SleepReportParamsType) {
  console.log(params);
  let { day, sn } = params;

  let url = `/sleep_report/${sn}`;
  if (day) {
    url = url + `?day=${day}`;
  }
  return request_logic(url, {
    method: 'GET',
  });
}
