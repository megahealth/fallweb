import React, { FC, useMemo, useEffect, useState } from 'react';
import { connect, Dispatch } from 'umi';
import { TreeSelect, message, Select, Empty, Row, Col } from 'antd';
import {
  Loading,
  GroupState,
  DashboardState,
  GlobalModelState,
  LoginModelState,
  DeviceState,
} from '@/models/connect';
import mqtt, { MqttClient } from 'mqtt';
import { useInterval } from 'ahooks';
import styles from './index.less';
import Room from './components/room';
import { QueryDashboardProps } from './queryDashboard';

const { SHOW_PARENT } = TreeSelect;
const { Option } = Select;

const msgs = new Map();

const Dashboard: FC<QueryDashboardProps> = ({
  group,
  global,
  login,
  device,
  dispatch,
  // loading,
}) => {
  const groupKeys = JSON.parse(localStorage.getItem('groupKeys') || '[]');
  const localTopics = JSON.parse(localStorage.getItem('topics') || '[]');

  const [client, setClient] = useState(null);
  const [connectStatus, setConnectStatus] = useState('Connect');
  const [isSubed, setIsSub] = useState(false);
  const [messages, setMessages] = useState(new Map());
  const [type, setType] = useState('all');

  const [value, setValue] = useState(groupKeys);
  const [topics, setTopics] = useState(localTopics);

  const { groupList } = group;
  const { deviceList } = device;

  useEffect(() => {
    deviceList.forEach(d => {
      const sn = d.sn;
      const o = msgs.get(sn);
      if (topics.length == 0) {
        msgs.clear();
        return;
      }
      if (type == 'all') {
        msgs.set(sn, { ...d, ...o });
      } else {
        msgs.delete(sn);
      }
    });
  }, [deviceList, type, topics]);

  useEffect(() => {
    dispatch({
      type: 'group/queryGroupList',
      payload: {},
    });

    dispatch({
      type: 'device/queryDeviceList',
      payload: {},
    });

    return () => {
      mqttDisconnect();
    };
  }, []);

  const mqttConnect = (host, mqttOption) => {
    setConnectStatus('Connecting');
    setClient(mqtt.connect(host, mqttOption));
  };

  useEffect(() => {
    mqttConnect('wss://wss8084.megahealth.cn/mqtt', {
      clean: true,
      keepalive: 10,
      connectTimeout: 4000,
      clientId: localStorage.getItem('user_id'),
      username: 'user_' + localStorage.getItem('name'),
      reconnectPeriod: 1000,
    });

    return () => {
      mqttDisconnect();
    };
  }, []);

  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        setConnectStatus('Connected');
        message.success('mqtt connect success');
        if (topics.length > 0) {
          // client.subscribe(topics, console.log);
          mqttSub(topics);
          setIsSub(true);
        }
      });
      client.on('error', err => {
        console.error('Connection error: ', err);
        client.end();
        message.success('mqtt disconnect');
      });
      client.on('reconnect', () => {
        setConnectStatus('Reconnecting');
        message.success('mqtt reconnecting');
      });
      client.on('message', (topic, payload) => {
        // console.log(payload.toString())
        const { sn, fall, breath, point } = JSON.parse(payload.toString());
        const o = msgs.get(sn) || {};
        if (fall) o.fall = fall;
        if (breath) o.breath = breath;
        if (point) o.point = point;
        msgs.set(sn, o);
        // setMessages(new Map(messages));
      });
    }

    return () => {
      mqttDisconnect();
    };
  }, [client]);

  const mqttDisconnect = () => {
    if (client) {
      client.end(() => {
        message.error('mqtt disconnect');
      });
    }
  };

  const mqttSub = topics => {
    if (client) {
      client.subscribe(topics, error => {
        if (error) {
          console.log('Subscribe to topics error', error);
          return;
        }
        message.success(`sub success ${JSON.stringify(topics)}`);
        setIsSub(true);
      });
    }
  };

  const mqttUnSub = () => {
    if (client) {
      client.unsubscribe(topics, error => {
        if (error) {
          console.log('Unsubscribe error', error);
          return;
        }
        setIsSub(false);
      });
    }
  };

  useInterval(() => {
    const m = new Map(msgs);
    setMessages(m);
  }, 1000);

  const onChange = (keys: any) => {
    mqttUnSub();

    let ts: [] = [];
    const search = (node, key) => {
      const len = node && node.children && node.children.length;
      if (node.key === key) {
        if (len > 0) {
          node.children.forEach(n => {
            search(n, n.key);
          });
        } else {
          const ids = node.key.split('-');
          const id = ids[ids.length - 1];
          const topic = `web/${id}/#`;
          ts.push(topic);
        }
      } else {
        if (len > 0) {
          node.children.forEach(n => {
            if (n.key === key) {
              search(n, n.key);
            } else {
              search(n, key);
            }
          });
        }
      }
    };
    // 如果当前节点key等于要查找的key，全选叶节点(有子节点，向下遍历，没有子节点，添加)
    // 如果当前节点key不等于要查找的key，且有子节点，继续向下遍历；没有子节点，。

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const node = groupList[0];
      search(node, key);
    }

    console.log('ts:', ts);
    console.log('keys:', keys);

    setValue(keys);
    localStorage.setItem('groupKeys', JSON.stringify(keys));
    setTopics(ts);
    localStorage.setItem('topics', JSON.stringify(ts));

    mqttSub(ts);
  };

  const handleChange = value => {
    console.log(`selected ${value}`);
    setType(value);
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={18}>
          <TreeSelect
            treeData={groupList}
            value={value}
            onChange={onChange}
            treeCheckable={true}
            showCheckedStrategy={SHOW_PARENT}
            placeholder="请选择群组"
            style={{ width: '100%' }}
          />
        </Col>
        <Col span={6}>
          <Select
            defaultValue="all"
            style={{ width: '100%' }}
            onChange={handleChange}
          >
            <Option value="all">全部</Option>
            <Option value="online">在线</Option>
            {/* <Option value="offline">离线</Option> */}
          </Select>
        </Col>
      </Row>
      <div className={styles.devices}>
        {[...messages.keys()].map(key => {
          const data = messages.get(key);
          const { e, f, b, d, c } = (data && data.fall) || {
            e: 0,
            f: 0,
            b: 0,
            d: 0,
            c: 0,
          };
          const { b: breath } = (data && data.breath) || {
            b: 0,
          };
          const { x, y } = (data && data.point) || {
            x: 0,
            y: 0,
          };
          return (
            <Room
              key={key}
              room={key}
              br={breath}
              e={e}
              f={f}
              b={b}
              d={d}
              x={x}
              y={y}
            />
          );
        })}
        {messages.size == 0 && (
          <div className={styles.emptyBox}>
            <Empty />
          </div>
        )}
      </div>
    </div>
  );
};

export default connect(({ // dashboard,
  group, global, login, device }: // loading,
{ // dashboard: DashboardState;
  group: GroupState; global: GlobalModelState; login: LoginModelState; device: DeviceState }) => ({
  // loading: Loading;
  // dashboard,
  group,
  global,
  login,
  device,
  // loading: loading.models.group,
}))(Dashboard);
