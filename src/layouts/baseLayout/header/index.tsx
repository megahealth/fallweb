import React from 'react';
import UserSetting from './userSetting';
import iconlogo from '@/assets/logo.3c5aff9b.png';

export default function () {
  function getTitleText(group_id: string) {
    switch (group_id) {
      case '122':
        return '上海贝生毫米波雷达监测系统';
      case '125':
        return '泽道网络毫米波雷达监测系统';
      default:
        return 'Welcome! 毫米波雷达监测系统';
    }
  }

  return (
    <>
      <div style={{ fontSize: 18 }}>
        {/* <img
          style={{ width: '30px', marginRight: '10px' }}
          src={iconlogo}
        ></img> */}
        {getTitleText(localStorage.getItem('group_id') || '')}
      </div>
      <UserSetting />
    </>
  );
}
