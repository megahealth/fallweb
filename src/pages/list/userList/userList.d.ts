import { Dispatch } from 'umi';
import { GroupState, UserState } from '@/models/connect';

export interface QueryUserProps {
  dispatch: Dispatch;
  user: UserState;
  group: GroupState;
  loading?: boolean;
}
