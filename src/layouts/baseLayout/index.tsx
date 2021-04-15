import React from 'react';
import { Layout } from 'antd';
import HeaderContent from './header';
import MenuContent from './menu';
// import UserSetting from './header/userSetting';
import styles from './index.less';
import LOGO from '@/assets/logo.png';
import COLL from '@/assets/收起.png';

const { Header, Content, Sider } = Layout;

export default (props: any) => {
  return (
    <Layout className={styles.container}>
      <Sider
        collapsible
        trigger={null}
        width={200}
        style={{ background: '#5ec394' }}
      >
        <img src={LOGO} className={styles.logo}></img>
        <MenuContent />
        <div className={styles.coll}>
          <img src={COLL}></img>
          <span>收起侧边栏</span>
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
