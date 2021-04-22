import React from 'react';
import 呼吸率 from '@/assets/呼吸率.png';
import 在床离床 from '@/assets/在床离床.png';
import 有人无人 from '@/assets/有人无人.png';
import 有人跌倒 from '@/assets/有人跌倒.png';
import styles from './index.less';

const Status = props => {
  const { breath, state, online } = props;

  return (
    <div className={styles.status}>
      <div>
        <img src={呼吸率}></img>
        <div>
          <p>呼吸率</p>
          <p>
            {online == 1 && state == 3 ? breath : 0}
            <span> bpm</span>
          </p>
        </div>
      </div>
      <div>
        <img src={在床离床}></img>
        <div>
          <p>在床/离床</p>
          <p>有人{state == 3 ? '在' : '离'}床</p>
        </div>
      </div>
      <div>
        <img src={有人跌倒}></img>
        <div>
          <p>状态</p>
          <p>{state >= 8 ? '有' : '无'}人跌倒</p>
        </div>
      </div>
    </div>
  );
};

export default Status;
