import React, { useState } from 'react';
import { Layout } from 'antd';
import HeaderContent from './header';
import MenuContent from './menu';
// import UserSetting from './header/userSetting';
import styles from './index.less';
import LOGO from '@/assets/logo.png';
import COLL from '@/assets/收起.png';
import beisheng_logo from '../../assets/logo1.png';
const { Header, Content, Sider } = Layout;

export default (props: any) => {
  const [collapse, setCollapse] = useState(false);

  return (
    <Layout className={styles.container}>
      <Sider
        collapsible
        trigger={null}
        width={200}
        style={{ background: '#5ec394' }}
        collapsed={collapse}
      >
        <img
          src={localStorage.getItem('group_id') == '122' ? beisheng_logo : ''}
          style={
            collapse ? { width: '50px', margin: '20px' } : { width: '140px', margin: '20px 20px' }
          }
        ></img>
        <MenuContent />
        <div
          className={styles.coll}
          onClick={() => {
            setCollapse(!collapse);
          }}
        >
          <img src={COLL} style={{ transform: collapse ? 'rotate(180deg)' : 'rotate(0)' }}></img>
        </div>
      </Sider>
      <Layout style={{ padding: 0 }}>
        <Header className={styles.contentHeader}>
          <HeaderContent />
        </Header>
        <Content className={styles.content}>{props.children}</Content>
      </Layout>
    </Layout>
  );
};
