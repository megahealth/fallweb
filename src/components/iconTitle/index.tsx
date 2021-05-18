import React from 'react';
import { Tooltip } from 'antd';
import styles from './index.less';
import { QuestionCircleOutlined } from '@ant-design/icons';

const IconTitle = props => {
  const { title, tip, img } = props;

  return (
    <Tooltip title={tip} className={styles.title}>
      <img src={img}></img>
      <span>{title}</span>
      {tip && <QuestionCircleOutlined />}
    </Tooltip>
  );
};

export default IconTitle;
