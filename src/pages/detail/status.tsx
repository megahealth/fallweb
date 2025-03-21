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
import 有人无人 from '@/assets/有人无人.png';
import 警告 from '@/assets/告警实心.png';

import styles from './index.less';
import moment from 'moment';

const Card = (props) => {
  const { src, name, value } = props;

  return (
    <div>
      <img src={src}></img>
      <div>
        <p>{name}</p>
        <p>{value}</p>
      </div>
    </div>
  );
};

const Status = (props) => {
  let { breath, state, online, count, rollTime, alert, tcount } = props;
  let group_id = localStorage.getItem('group_id');
  if (group_id === '1') {
    let selectedGroups = localStorage.getItem('selectedGroups');
    if (selectedGroups && JSON.parse(selectedGroups).indexOf('sub_id":176') != -1) {
      group_id = '176';
    }
  }
  function alertText(alert: number) {
    switch (alert) {
      case 0:
        return '--';
      case 1:
        return '长时未活动';
      case 2:
        return '长时无呼吸';
      case 3:
        return '长时无目标';
      default:
        return '--';
    }
  }
  return (
    <div className={styles.status}>
      {online === 0 && <Card src={离线圆形} name={'状态'} value={'设备离线'}></Card>}
      {online === 1 && state === 0 && <Card src={无人圆形} name={'状态'} value={'无人'}></Card>}
      {online === 1 && state >= 5 && state <= 11 && (
        <Card src={有人跌倒} name={'状态'} value={'有人跌倒'}></Card>
      )}
      {online === 1 && state === 12 && (
        <Card src={有人跌倒} name={'状态'} value={'马桶异常'}></Card>
      )}
      {online === 1 && state === 13 && (
        <Card src={有人跌倒} name={'状态'} value={'低姿有呼吸'}></Card>
      )}
      {online === 1 && state === 1 && (
        <Card src={有人活动圆形} name={'状态'} value={'有人活动'}></Card>
      )}
      {online === 1 && state === 4 && (
        <Card src={有人活动圆形} name={'状态'} value={'低姿态'}></Card>
      )}
      {online === 1 && state === 2 && <Card src={坐姿} name={'状态'} value={'坐姿'}></Card>}
      {online === 1 && count >= 2 && count <= 4 && (
        <Card src={多人圆形} name={'人数'} value={`${count}人`}></Card>
      )}
      {online === 1 && count > 4 && <Card src={多人圆形} name={'人数'} value={'多人'}></Card>}
      {
        // temp
        online === 1 && count === 1 && <Card src={有人无人} name={'人数'} value={'单人'}></Card>
      }
      {online === 1 && state === 3 && (
        <Card
          src={呼吸率}
          name={'呼吸率'}
          value={((breath) => (
            <>
              {breath > 0 ? breath : '--'} <span>bpm</span>
            </>
          ))(breath)}
        ></Card>
      )}
      {
        // temp
        online == 1 && state !== 3 && (
          <Card
            src={呼吸率}
            name={'呼吸率'}
            value={((breath) => (
              <>
                -- <span>bpm</span>
              </>
            ))(breath)}
          ></Card>
        )
      }
      {online === 1 && state === 3 && <Card src={有人在床} name={'状态'} value={'有人在床'}></Card>}
      {online === 1 && state === 3 && (
        <Card src={翻身时间} name={'最后翻身时间'} value={moment(rollTime).format('HH:mm')}></Card>
      )}
      {
        // temp
        online === 1 && state !== 3 && (
          <Card src={翻身时间} name={'最后翻身时间'} value={'--'}></Card>
        )
      }
      {online === 1 && alert > 0 && (
        <Card src={警告} name={'警告'} value={<span>{alertText(alert)}</span>}></Card>
      )}

      {/* 建行统计人数 */}
      {group_id === '176' && <Card src={多人圆形} name={'统计人数'} value={tcount || '--'}></Card>}
    </div>
  );
};

export default Status;
