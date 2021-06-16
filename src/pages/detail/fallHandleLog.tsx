import IconTitle from '@/components/iconTitle';
import styles from './index.less';
import React from 'react';
import 记录 from '@/assets/记录.png';
import { Empty } from 'antd';

const FallHandleLog = () => {
  return (
    <div className={styles.fall}>
      <IconTitle title="跌倒处理记录" img={记录}></IconTitle>
      <div className={styles.list}>
        <Empty />
      </div>
    </div>
  );
};

export default FallHandleLog;
