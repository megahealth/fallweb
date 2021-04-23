import React from 'react';
import 呼吸率 from '@/assets/呼吸率.png';
import 有人跌倒 from '@/assets/有人跌倒.png';
import 有人活动圆形 from '@/assets/有人活动圆形.png';
import 离线圆形 from '@/assets/离线圆形.png';
import 无人圆形 from '@/assets/无人圆形.png';
import 有人在床 from '@/assets/有人在床.png';
import 翻身时间 from '@/assets/翻身时间.png';
import 坐姿 from '@/assets/坐姿.png';
import 多人圆形 from '@/assets/多人圆形.png';

import styles from './index.less';
import moment from 'moment';

const Status = props => {
  const { breath, state, online, count, last_roll_time, roll } = props;

  if (roll === 1) {
    localStorage.setItem(
      'last_roll_time',
      JSON.stringify(new Date().getTime()),
    );
  } else {
    localStorage.removeItem('last_roll_time');
  }

  const rolltime = localStorage.getItem('last_roll_time') || last_roll_time;

  return (
    <div className={styles.status}>
      {online == 0 && (
        <div>
          <img src={离线圆形}></img>
          <div>
            <p>状态</p>
            <p>设备离线</p>
          </div>
        </div>
      )}
      {online == 1 && state === 0 && (
        <div>
          <img src={无人圆形}></img>
          <div>
            <p>状态</p>
            <p>无人</p>
          </div>
        </div>
      )}
      {online == 1 && state >= 5 && (
        <div>
          <img src={有人跌倒}></img>
          <div>
            <p>状态</p>
            <p>有人跌倒</p>
          </div>
        </div>
      )}
      {online == 1 && state === 1 && (
        <div>
          <img src={有人活动圆形}></img>
          <div>
            <p>状态</p>
            <p>有人活动</p>
          </div>
        </div>
      )}
      {online == 1 && state === 3 && (
        <div>
          <img src={有人在床}></img>
          <div>
            <p>状态</p>
            <p>有人在床</p>
          </div>
        </div>
      )}
      {online == 1 && state === 3 && (
        <div>
          <img src={呼吸率}></img>
          <div>
            <p>呼吸率</p>
            <p>
              {breath} <span>bpm</span>
            </p>
          </div>
        </div>
      )}
      {online == 1 && state === 3 && (
        <div>
          <img src={翻身时间}></img>
          <div>
            <p>最后翻身时间</p>
            <p>{moment(rolltime).format('HH:mm')}</p>
          </div>
        </div>
      )}
      {online == 1 && state === 2 && (
        <div>
          <img src={坐姿}></img>
          <div>
            <p>状态</p>
            <p>坐姿</p>
          </div>
        </div>
      )}
      {online == 1 && count > 1 && (
        <div>
          <img src={多人圆形}></img>
          <div>
            <p>人数</p>
            <p>多人</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Status;
