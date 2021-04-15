import React, { useState, useEffect } from 'react';
import Style from './room.less';
import 离线 from '@/assets/离线.png';
import 跌倒 from '@/assets/跌倒.png';
import 有人活动 from '@/assets/有人活动.png';
import 在床 from '@/assets/在床.png';
import 无人 from '@/assets/无人.png';

function Room(props: any) {
  const { sn, online, count, action, breath } = props;

  let colors = {
    grey: '#999',
    green: '#51b988',
    blue: '#4a7fdf',
    red: '#e15e5e',
  };
  let color = colors.grey;
  let text = '设备离线';
  let img = 离线;

  if (online === 1) {
    color = colors.green;
    switch (action) {
      case 0:
        text = '无人';
        img = 无人;
        color = colors.grey;
        break;
      case 1:
        text = '有人活动';
        img = 有人活动;
        color = colors.green;
        break;
      case 2:
        text = '有人活动';
        img = 有人活动;
        color = colors.green;
        break;
      case 3:
        text = '有人在床';
        img = 在床;
        color = colors.blue;
        break;
      case 8:
      case 9:
      case 10:
      case 11:
        text = '有人跌倒';
        img = 跌倒;
        color = colors.blue;
        break;
      default:
    }
  }

  return (
    <div style={{ position: 'relative' }} className={`${Style.container}`}>
      <div className={Style.head} style={{ background: color }}>
        {props.sn}-{props.count}
      </div>
      <div className={Style.status}>
        <span className={Style.breath}>
          {action == 3 && `呼吸率：${breath}`}
        </span>
        <img src={img}></img>
        <span className={Style.title}>{text}</span>
      </div>
    </div>
  );
}

export default Room;
