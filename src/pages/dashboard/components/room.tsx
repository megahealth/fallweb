import React, { useState, useEffect } from 'react';
import Style from './room.less';
import 离线 from '@/assets/离线.png';

function Room(props: any) {
  // const [color, setColor] = useState('#999');
  let color = '#999';

  if (props.online === 1) {
    color = '#51b988';
  }

  return (
    <div style={{ position: 'relative' }} className={`${Style.container}`}>
      <div className={Style.head} style={{ background: color }}>
        {props.room}
      </div>
      <div className={Style.status}>
        <span className={Style.breath}>呼吸率：16</span>
        <img src={离线}></img>
        <span className={Style.title}>设备离线</span>
      </div>
    </div>
  );
}

export default Room;
