import { Dispatch } from 'umi';
import { GroupState } from '@/models/connect';

export interface QueryGroupProps {
  dispatch: Dispatch;
  group: GroupState;
  loading?: boolean;
}
