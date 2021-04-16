import { GlobalModelState } from './global';
import { LoginModelState } from './login';
import { DeviceState } from './device';
import { QueryUserState } from './user';
import { DashboardState } from './dashboard';
import { GroupState } from './group';
import { ReportState } from './report';

export {
  GlobalModelState,
  LoginModelState,
  DeviceState,
  QueryUserState,
  DashboardState,
  GroupState,
  ReportState,
};

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login: boolean;
    device: boolean;
    queryUser: boolean;
    dashboard: boolean;
    group: boolean;
    report: boolean;
  };
}

export interface ConnectState {
  global: GlobalModelState;
  login: LoginModelState;
  loading: Loading;
}

export interface Route {
  routes?: Route[];
}
export interface MenusDate {
  title: string;
  link: string;
  key: string;
  icon: string;
  children: any;
}
export interface LoginUserInfoState {
  id: string;
  name: string;
  role?: string;
  [key: string]: any;
}
