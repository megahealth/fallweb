import { Dispatch } from 'umi';
import { DeviceState } from '@/models/connect';

export interface QueryDeviceProps {
  dispatch: Dispatch;
  device: DeviceState;
  loading?: boolean;
}
