import { Dispatch } from 'umi';
import {
  GroupState,
  GlobalModelState,
  LoginModelState,
} from '@/models/connect';

export interface QueryDashboardProps {
  dispatch: Dispatch;
  group: GroupState;
  global: GlobalModelState;
  login: LoginModelState;
  loading?: boolean;
}
