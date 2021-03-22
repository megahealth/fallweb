export default [
  {
    title: '监控页',
    link: '/dashboard',
    key: 'dashboard',
    icon: '',
    children: [],
  },
  {
    title: '列表页',
    link: '/list',
    key: 'list',
    icon: '',
    children: [
      {
        title: '设备列表',
        link: '/list/queryDevice',
        key: 'queryDevice',
        icon: '',
        children: [],
      },
      {
        title: '用户列表',
        link: '/list/userList',
        key: 'queryUser',
        icon: '',
        children: [],
      },
    ],
  },
];
