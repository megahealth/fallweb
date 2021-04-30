import React from 'react';
import styles from './index.less';

const IconTitle = props => {
  const { title, img } = props;

  return (
    <div className={styles.title}>
      <img src={img}></img>
      <span>{title}</span>
    </div>
  );
};

export default IconTitle;
