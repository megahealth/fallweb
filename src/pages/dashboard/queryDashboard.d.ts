import { Dispatch } from 'umi';
import { GroupState, GlobalModelState } from '@/models/connect';

export interface QueryDashboardProps {
  dispatch: Dispatch;
  group: GroupState;
  global: GlobalModelState;
  loading?: boolean;
}
