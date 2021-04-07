import React, { FC, useMemo, useEffect, useState } from 'react';
import { connect, Dispatch } from 'umi';
import {
  TreeSelect,
  message,
  Select,
  Empty,
  Row,
  Col,
  Pagination,
  Badge,
  Button,
  Space,
} from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';
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
  const [connectStatus, setConnectStatus] = useState('UnConnected');
  // UnConnected  未连接，初始状态
  // Connecting   连接中
  // Connected    已连接
  // Reconnecting 重连中
  // Offline      脱机
  // Disconnected 代理通知断开连接
  // Closed       连接已断开
  const [isSub, setIsSub] = useState(false);
  // true   已订阅
  // false  取消订阅
  const [messages, setMessages] = useState(new Map());
  const [type, setType] = useState('all');

  const [value, setValue] = useState(groupKeys);
  const [topics, setTopics] = useState(localTopics);
  const [current, setCurrent] = useState(1);

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

  const mqttConnect = () => {
    setMqttStatus('Connecting');
    setClient(
      mqtt.connect('wss://wss8084.megahealth.cn/mqtt', {
        clean: true,
        keepalive: 10,
        connectTimeout: 4000,
        clientId: localStorage.getItem('user_id'),
        username: 'user_' + localStorage.getItem('name'),
        reconnectPeriod: 1000,
      }),
    );
  };

  useEffect(() => {
    mqttConnect();

    return () => {
      mqttDisconnect();
    };
  }, []);

  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        setMqttStatus('Connected');
        if (topics.length > 0) {
          mqttSub(topics);
        }
      });
      client.on('error', err => {
        // mqttDisconnect(err);
        console.log(err);
      });
      client.on('reconnect', () => {
        setMqttStatus('Reconnecting');
      });
      client.on('message', (topic, payload) => {
        const { sn, fall, breath, point } = JSON.parse(payload.toString());
        const o = msgs.get(sn) || {};
        if (fall) o.fall = fall;
        if (breath) o.breath = breath;
        if (point) o.point = point;
        msgs.set(sn, o);
      });
      client.on('close', () => {
        setMqttStatus('Closed');
      });
      client.on('disconnect', packet => {
        setMqttStatus('Disconnected');
        // 代理通知断开连接
      });
      client.on('offline', () => {
        setMqttStatus('Offline');
        // 客户端脱机，紧接着会close
      });
    }

    return () => {
      mqttDisconnect();
    };
  }, [client]);

  const mqttDisconnect = () => {
    if (client) {
      client.end(() => {
        // message.error('client end');
      });
    }
  };

  const setMqttStatus = (status: string) => {
    console.log(status);
    message.success(status);
    setConnectStatus(status);
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

    if (ts.length > 0) {
      mqttSub(ts);
    }
  };

  const handleChange = value => {
    console.log(`selected ${value}`);
    setType(value);
  };

  const showTotal = (total: number) => {
    return `共 ${total} 台`;
  };

  const onSizeChange = page => {
    console.log(page);
    setCurrent(page);
  };

  const onConnectBtn = () => {
    if (connectStatus === 'Connected') {
      mqttDisconnect();
    } else {
      if (client) {
        client.reconnect();
      } else {
        mqttConnect();
      }
    }
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={15}>
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
        <Col span={3}>
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
        <Col span={6}>
          <Space align="center">
            <Button
              danger={connectStatus === 'Connected' ? true : false}
              icon={<PoweroffOutlined />}
              onClick={onConnectBtn}
            >
              {' '}
              {connectStatus === 'Connected' ? '断开' : '连接'}{' '}
            </Button>
            <Badge
              status={connectStatus === 'Connected' ? 'success' : 'error'}
              text={connectStatus}
            />
            <Badge
              status={
                isSub && connectStatus === 'Connected' ? 'success' : 'error'
              }
              text={
                isSub && connectStatus === 'Connected' ? '已订阅' : '未订阅'
              }
            />
          </Space>
        </Col>
      </Row>
      <div className={styles.devices}>
        {[...messages.keys()]
          .slice((current - 1) * 10, current * 10)
          .map(key => {
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
      <Pagination
        size="small"
        total={messages.size}
        current={current}
        pageSize={10}
        showTotal={showTotal}
        // showSizeChanger
        showQuickJumper
        onChange={onSizeChange}
      />
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
