import type { FC } from 'react';
import React from 'react';
import type { Loading } from 'umi';
import { Link, connect, useLocation } from 'umi';
import { Menu } from 'antd';
import type { GlobalModelState } from '@/models/connect';
import { queryKeysByPath } from '@/utils/utils';
import { createFromIconfontCN } from '@ant-design/icons';
import styles from './index.less';

const { SubMenu, Item } = Menu;

export interface BasicLayoutProps {
  global: GlobalModelState;
  loading: boolean;
}

const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2558912_lbw95y32va.js', // 在 iconfont.cn 上生成
});

const MenuContent: FC<BasicLayoutProps> = ({ global }) => {
  const { menusData } = global;
  const location = useLocation();

  function renderMenu(data: any = []) {
    const rows = Array.isArray(data) ? data : [];
    return rows.map((row) => {
      if (row === undefined) return false;
      const { title, icon, link = '', key, children, ...restState } = row;
      if (title === '产测列表' || title === '半成品产测' || title === '固件列表') {
        if (localStorage.getItem('group_id') !== '1') return false;
      }
      if (children && children.length > 0) {
        const subMenu = renderMenu(children);
        return (
          <SubMenu key={key} title={<span>{title}</span>}>
            {subMenu}
          </SubMenu>
        );
      }

      return (
        <Item
          key={key}
          title={title}
          icon={<MyIcon className={styles.icon} type={`icon-${icon}`} />}
        >
          <Link to={{ pathname: link, state: { ...restState, key } }}>{title}</Link>
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

export default connect(({ global, loading }: { global: GlobalModelState; loading: Loading }) => ({
  global,
  loading: loading.models.index,
}))(MenuContent);
