import { Dispatch } from 'umi';
import { DeviceState, GroupState } from '@/models/connect';

export interface QueryDeviceProps {
  dispatch: Dispatch;
  device: DeviceState;
  loading?: boolean;
  group: GroupState;
}
