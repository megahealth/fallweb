import { Dispatch } from 'umi';
import { GroupState } from '@/models/connect';

export interface QueryDashboardProps {
  dispatch: Dispatch;
  group: GroupState;
  loading?: boolean;
}
