import React, { FC, useState, useEffect } from 'react';
import { Link, connect, Dispatch } from 'umi';
import Style from './room.less';
import 离线 from '@/assets/离线.png';
import 跌倒 from '@/assets/跌倒.png';
import 有人活动 from '@/assets/有人活动.png';
import 在床 from '@/assets/在床.png';
import 无人 from '@/assets/无人.png';
import 单人 from '@/assets/单人.png';
import 多人 from '@/assets/多人.png';
import { DetailState } from '@/models/connect';

export interface DetailProps {
  sn: string;
  online: number;
  count: number;
  breath: number;
  action: number;
  name: string;
  id: number;
}

const Room: FC<DetailProps> = ({
  sn,
  online,
  count,
  action,
  breath,
  name,
  id,
}) => {
  let colors = {
    grey: '#999',
    green: '#51b988',
    blue: '#4a7fdf',
    red: '#e15e5e',
  };
  let color = colors.grey;
  let textColor = '#000';
  let text = '设备离线';
  let img = 离线;
  let pImg = null;
  if (action > 0) {
    if (count > 1) {
      pImg = 多人;
    } else {
      pImg = 单人;
    }
  }

  if (online === 1) {
    color = colors.green;
    switch (action) {
      case 0:
        text = '无人';
        img = 无人;
        color = colors.grey;
        break;
      case 1:
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
      case 4:
        text = '低姿态';
        img = 有人活动;
        color = colors.green;
        break;
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
        text = '有人跌倒';
        img = 跌倒;
        color = colors.red;
        textColor = '#c52f2f';
        break;
      default:
    }
  } else {
    text = '离线';
    img = 离线;
    pImg = null;
    color = colors.grey;
  }

  // const next = () => {
  //   localStorage.setItem('data', JSON.stringify(data));
  //   dispatch({
  //     type: 'detail/initDetail',
  //     payload: {
  //       sn,
  //       group,
  //       name,
  //       online,
  //       count,
  //       action,
  //       breath,
  //     },
  //   });
  // };

  return (
    <Link to={`/detail/${id}`}>
      <div
        style={{ position: 'relative' }}
        className={`${Style.container}`}
        // onClick={next}
      >
        <div className={Style.head} style={{ background: color }}>
          {pImg && <img src={pImg}></img>}
          {name}
        </div>
        <div className={Style.status}>
          <span className={Style.breath}>
            {online == 1 && action == 3 && `呼吸率：${breath}`}
          </span>
          <img src={img}></img>
          <span className={Style.title} style={{ color: textColor }}>
            {text}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Room;
