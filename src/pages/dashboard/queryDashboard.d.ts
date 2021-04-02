import { Dispatch } from 'umi';
import {
  GroupState,
  GlobalModelState,
  LoginModelState,
  DeviceState,
} from '@/models/connect';

export interface QueryDashboardProps {
  dispatch: Dispatch;
  group: GroupState;
  global: GlobalModelState;
  login: LoginModelState;
  device: DeviceState;
  loading?: boolean;
}
