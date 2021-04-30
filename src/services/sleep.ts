import request_logic from '@/utils/request_logic';
import moment from 'moment';

export interface SleepReportParamsType {
  sn: string;
  day: string;
}

export async function getSleepReport(params: SleepReportParamsType) {
  let { day, sn } = params;
  if (typeof day !== 'string') {
    day = moment().format('YYYY-MM-DD');
  }

  let url = `/sleep_report/${sn}?day=${day}`;
  return request_logic(url, {
    method: 'GET',
    data: params,
  });
}
