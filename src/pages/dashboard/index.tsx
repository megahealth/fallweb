import React, { FC, Suspense, useEffect, useState } from 'react';
import { connect, Dispatch } from 'umi';
import { TreeSelect, message, Spin, Empty } from 'antd';
import {
  Loading,
  GroupState,
  DashboardState,
  GlobalModelState,
} from '@/models/connect';
import mqtt from 'mqtt';
import { useInterval } from 'ahooks';
import styles from './index.less';
import Room from './components/room';
import { QueryDashboardProps } from './queryDashboard';

const { SHOW_PARENT } = TreeSelect;

const Dashboard: FC<QueryDashboardProps> = ({
  group,
  global,
  dispatch,
  loading,
}) => {
  const groupKeys = JSON.parse(localStorage.getItem('groupKeys') || '[]');
  const localTopics = JSON.parse(localStorage.getItem('topics') || '[]');
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [messages, setMessages] = useState(new Map());
  const [value, setValue] = useState(groupKeys);
  const [topics, setTopics] = useState(localTopics);
  const { groupList } = group;

  useInterval(() => {
    const m = new Map(messages);
    setMessages(m);
  }, 1000);

  useEffect(() => {
    console.log(global.userInfo);
    const client = mqtt.connect('wss://wss8084.megahealth.cn/mqtt', {
      clean: true,
      connectTimeout: 4000,
      clientId: global.userInfo.user_id,
      username: 'user_' + global.userInfo.name,
      reconnectPeriod: 0,
    });
    client.on('connect', () => {
      console.log('connect');
      if (topics.length > 0) {
        client.subscribe(topics, console.log);
      }
      setConnectionStatus(true);
    });
    client.on('error', error => {
      console.log('连接失败:', error);
    });
    client.on('message', (topic, payload, packet) => {
      const { sn, fall, breath, point } = JSON.parse(payload.toString());
      const o = messages.get(sn) || {};
      if (fall) o.fall = fall;
      if (breath) o.breath = breath;
      if (point) o.point = point;
      messages.set(sn, o);
      setMessages(messages);
    });
    client.on('close', () => {
      console.log('close connect');
    });

    return () => {
      client.end();
    };
  }, [global, topics]);

  useEffect(() => {
    dispatch({
      type: 'group/queryGroupList',
      payload: {},
    });
  }, []);

  const onChange = (keys: any) => {
    console.log('onChange ', keys);
    console.log('groupList: ', groupList);
    let ts: [] = [];

    const search = (node, key) => {
      const len = node && node.children && node.children.length;
      if (len > 0) {
        node.children.forEach(node => {
          search(node, key);
        });
      } else {
        if (node.key === key) {
          const ids = node.key.split('-');
          const id = ids[ids.length - 1];
          ts.push(`web/${id}/#`);
        }
      }
    };

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const node = groupList[0];
      search(node, key);
    }

    console.log(keys);
    console.log('ts:', ts);
    console.log('keys:', keys);

    setValue(keys);
    localStorage.setItem('groupKeys', JSON.stringify(keys));
    setTopics(ts);
    localStorage.setItem('topics', JSON.stringify(ts));
  };

  return (
    <div>
      <TreeSelect
        treeData={groupList}
        value={value}
        onChange={onChange}
        treeCheckable={true}
        showCheckedStrategy={SHOW_PARENT}
        placeholder="请选择群组"
        style={{ width: '100%' }}
      />
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
          {messages.size == 0 && (
            <div className={styles.emptyBox}>
              <Empty />
            </div>
          )}
        </div>
      </Spin>
    </div>
  );
};

export default connect(
  ({
    dashboard,
    group,
    global,
    loading,
  }: {
    dashboard: DashboardState;
    group: GroupState;
    global: GlobalModelState;
    loading: Loading;
  }) => ({
    dashboard,
    group,
    global,
    loading: loading.models.group,
  }),
)(Dashboard);
