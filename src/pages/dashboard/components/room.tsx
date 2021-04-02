import React from 'react';
import Style from './room.less';
import { Button } from 'antd';

let show = false;

function Room(props: any) {
  const { e, f } = props;

  const style = (e: any, f: any) => {
    if (e === 0) {
      return Style.grey;
    }
    if (e === 1) {
      // return Style.grey
      if (f == 1) {
        return Style.warning;
      } else {
        return Style.normal;
      }
    }
  };

  return (
    <div
      style={{ position: 'relative' }}
      className={`${Style.container} ${style(e, f)}`}
      onMouseEnter={() => (show = true)}
      onMouseLeave={() => (show = false)}
    >
      <div className={Style.item}>房间号：{props.room || '--'}</div>
      <div className={Style.item}>呼吸率：{props.br || '--'}</div>
      <div className={Style.item}>人体存在：{props.e ? '有人' : '无人'}</div>
      <div className={Style.item}>
        人体位置：x: {props.x} y: {props.y}
      </div>
      <div className={Style.item}>区域人数：{props.c}</div>
      <div className={Style.item}>在床离床：{props.b || '--'}</div>
      <div className={Style.item}>
        跌倒检测：
        {props.f === 1 ? '有人跌倒' : props.f == 2 ? '低姿态' : '正常'}
      </div>
    </div>
  );
}

export default Room;
