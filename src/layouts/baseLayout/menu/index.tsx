import React, { FC } from 'react';
import { Link, connect, useLocation, Loading } from 'umi';
import { Menu } from 'antd';
import { GlobalModelState } from '@/models/connect';
import { queryKeysByPath } from '@/utils/utils';
import 监控 from '@/assets/监控.png';
import 文件夹 from '@/assets/文件夹.png';

const { SubMenu, Item } = Menu;

export interface BasicLayoutProps {
  global: GlobalModelState;
  loading: boolean;
}

const MenuContent: FC<BasicLayoutProps> = ({ global }) => {
  const { menusData } = global;
  const location = useLocation();

  function renderMenu(data: any = []) {
    const rows = Array.isArray(data) ? data : [];
    return rows.map(row => {
      if (row === undefined) return false;
      const { title, icon, link = '', key, children, ...restState } = row;
      if (children && children.length > 0) {
        const subMenu = renderMenu(children);
        return (
          <SubMenu key={key} title={<span>{title}</span>}>
            {subMenu}
          </SubMenu>
        );
      }
      const img = icon => {
        if (icon === '监控') {
          return 监控;
        } else {
          return 文件夹;
        }
      };
      return (
        <Item key={key} title={title}>
          <Link to={{ pathname: link, state: { ...restState, key } }}>
            <img
              src={img(icon)}
              style={{ width: '25px', marginRight: '10px' }}
            ></img>
            <span style={{ fontSize: '16px' }}>{title}</span>
          </Link>
        </Item>
      );
    });
  }

  const { openKey, selectKey } = queryKeysByPath(location.pathname);

  return (
    <Menu
      selectedKeys={[selectKey || '']}
      defaultOpenKeys={[openKey]}
      mode="inline"
      theme="light"
      className="progressbar"
      siderCollapsed
      style={{ background: '#5ec394' }}
    >
      {renderMenu(menusData)}
    </Menu>
  );
};

export default connect(
  ({ global, loading }: { global: GlobalModelState; loading: Loading }) => ({
    global,
    loading: loading.models.index,
  }),
)(MenuContent);
