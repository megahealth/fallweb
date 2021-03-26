import React, { FC, Suspense, useEffect, useState } from 'react';
import { connect, Dispatch } from 'umi';
import { TreeSelect, message, Spin } from 'antd';
import { Loading, GroupState, DashboardState } from '@/models/connect';
import mqtt from 'mqtt';
import { useInterval } from 'ahooks';
import styles from './index.less';
import Room from './components/room';
import { QueryDashboardProps } from './queryDashboard';

const { SHOW_PARENT } = TreeSelect;

const Dashboard: FC<QueryDashboardProps> = ({ group, dispatch, loading }) => {
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [messages, setMessages] = useState(new Map());
  const [value, setValue] = useState([]);
  const [topics, setTopics] = useState([]);
  const { groupList } = group;

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
  }, [topics]);

  useEffect(() => {
    dispatch({
      type: 'group/queryGroupList',
      payload: {},
    });
  }, []);

  const onChange = (keys: any) => {
    console.log('onChange ', keys);
    let ts: [] = [];

    const search = (node, key) => {
      if (node.key === key) {
        if (node.children.length > 0) {
          node.children.forEach(node => {
            const ids = node.key.split('-');
            const id = ids[ids.length - 1];
            const tfall = `web/${id}/fall`;
            const tpoint = `web/${id}/poinet`;
            const tbreath = `web/${id}/breath`;
            ts.push(tfall, tpoint, tbreath);
            search(node, key);
          });
        }
      }
    };

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const node = groupList[0];
      search(node, key);
    }

    console.log(ts);

    setValue(keys);
    setTopics(ts);
  };

  const tProps = {
    treeData: groupList,
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
    group,
    loading,
  }: {
    dashboard: DashboardState;
    group: GroupState;
    loading: Loading;
  }) => ({
    dashboard,
    group,
    loading: loading.models.group,
  }),
)(Dashboard);
