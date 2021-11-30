import React, { FC } from 'react';
import { connect, Dispatch } from 'umi';
import { ClickParam } from 'antd/es/menu';
import { Dropdown, Menu } from 'antd';
import { SettingOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons';
import { LoginModelState, GlobalModelState } from '@/models/connect';

export interface HeaderLayoutProps {
  dispatch: Dispatch;
  login: LoginModelState;
}

const UserSettingLayout: FC<HeaderLayoutProps> = ({ login, dispatch }) => {
  function handleSubmit(event: ClickParam) {
    const { key } = event;
    if (key === 'logout') {
      localStorage.removeItem('currentPage');
      dispatch({
        type: 'login/logout',
      });
    }
  }
  // const { userInfo } = login;

  const menu = (
    <Menu onClick={handleSubmit}>
      <Menu.Item key="setPwd">
        <SettingOutlined />
        设置密码
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <LogoutOutlined /> 退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <div
      style={{
        width: 200,
        textAlign: 'right',
      }}
    >
      <Dropdown overlay={menu} placement="bottomRight">
        <span style={{ cursor: 'pointer', fontSize: 16 }}>
          {localStorage.getItem('name')} <DownOutlined />
        </span>
      </Dropdown>
    </div>
  );
};

export default connect(
  ({ login, global }: { login: LoginModelState; global: GlobalModelState }) => ({ login, global }),
)(UserSettingLayout);
