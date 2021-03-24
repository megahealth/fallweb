import React, { FC, Suspense, useEffect, useState } from 'react';
import { connect, Dispatch } from 'umi';
import { TreeSelect, Card, Spin } from 'antd';
import { Loading, DashboardState } from '@/models/connect';
import mqtt from 'mqtt';
import { useInterval } from 'ahooks';
import styles from './index.less';
import Room from './components/room';

const { SHOW_PARENT } = TreeSelect;

const treeData = [
  {
    title: '兆观',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: '实验室1',
        value: '0-1-0',
        key: '0-1-0',
      },
      {
        title: '实验室2',
        value: '0-1-1',
        key: '0-1-1',
      },
      {
        title: '实验室3',
        value: '0-1-2',
        key: '0-1-2',
      },
    ],
  },
];

interface DashboardProps {
  dispatch: Dispatch;
  dashboard: DashboardState;
  loading?: boolean;
}

const Dashboard: FC<DashboardProps> = ({ dashboard, dispatch, loading }) => {
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [messages, setMessages] = useState(new Map());

  useInterval(() => {
    const m = new Map(messages);
    setMessages(m);
  }, 1000);

  useEffect(() => {
    const client = mqtt.connect('wss://wss8084.megahealth.cn/mqtt', {
      clean: true,
      connectTimeout: 4000,
      clientId:
        '877741DB6A0999626FA4E2A82BE75DC3FB5140DF4E7838BD3A480E357D6DEA2C',
      username: 'user_test1',
      password: '123456!',
    });
    client.on('connect', () => {
      console.log('connect');
      client.subscribe(['web/6/fall', 'web/6/breath'], console.log);
      setConnectionStatus(true);
    });
    client.on('error', error => {
      console.log('连接失败:', error);
    });
    client.on('message', (topic, payload, packet) => {
      const { sn, fall, breath } = JSON.parse(payload.toString());
      const o = messages.get(sn) || {};
      if (fall) o.fall = fall;
      if (breath) o.breath = breath;
      messages.set(sn, o);
      setMessages(messages);
    });

    return () => {
      client.end();
    };
  }, []);

  const { cardSource } = dashboard;

  const [value, setValue] = useState(['0-1']);

  const onChange = (value: any) => {
    console.log('onChange ', value);
    setValue(value);
  };

  const tProps = {
    treeData,
    value,
    onChange: onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: '请选择群组',
    style: {
      width: '100%',
    },
  };

  return (
    <div>
      <TreeSelect {...tProps} />
      <Spin tip="连接中..." spinning={!connectionStatus}>
        <div className={styles.devices}>
          {[...messages.keys()].map(key => {
            const data = messages.get(key);
            const { e, x, y, f, b, d, c } = (data && data.fall) || {
              e: 0,
              x: 0,
              y: 0,
              f: 0,
              b: 0,
              d: 0,
              c: 0,
            };
            const { b: breath } = (data && data.breath) || {
              b: 0,
            };
            return (
              <Room key={key} room={key} br={breath} e={e} f={f} b={b} d={d} />
            );
          })}
        </div>
      </Spin>
    </div>
  );
};

export default connect(
  ({
    dashboard,
    loading,
  }: {
    dashboard: DashboardState;
    loading: Loading;
  }) => ({
    dashboard,
    loading: loading.effects['dashboard/queryCard'],
  }),
)(Dashboard);
