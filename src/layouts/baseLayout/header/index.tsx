import React from 'react';
import UserSetting from './userSetting';
import iconlogo from '@/assets/logo.3c5aff9b.png';

export default function() {
  return (
    <>
      <div style={{ fontSize: 18 }}>
        <img
          style={{ width: '30px', marginRight: '10px' }}
          src={iconlogo}
        ></img>
        Welcome! 毫米波雷达监测系统
      </div>
      <UserSetting />
    </>
  );
}
