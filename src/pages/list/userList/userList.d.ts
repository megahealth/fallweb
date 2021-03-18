import { Dispatch } from 'umi';
import { QueryUserState } from '@/models/connect';

export interface QueryTableProps {
  dispatch: Dispatch;
  queryUser: QueryUserState;
  loading?: boolean;
}
