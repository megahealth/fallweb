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
import { createGroupTreeList } from '@/utils/utils';

const { SHOW_PARENT } = TreeSelect;
const { Option } = Select;

const msgs = new Map();

// 【拼接数组的分页算法】
// 默认选全部分组    groupId [1,2,3,4,5...]
// 获取分组数量列表groupList [9,10,111,34,2...]，计算设备总数count 166，默认每页10个
// 每次切页都重新计算，根据当前页码，例如页码n，取10个，范围就是 (10n-9,10n)，start参数取 10n-10，limit 取 10，遍历 groupList 累加直到值大于等于start，记录此次累加值和累加结果，如果累加结果小于10n，再取一个值，直到结果大于等于10n，将几次累加值都保存到新的变量
// 空间换时间，不必每次切换页面都重新计算，计算出每一页需要请求的分组参数，比如第一页，分组1和分组2的第一项；第二页，分组2的第二项到最后一项和分组3的第一项；第三页，分组3的第二项到第十一项
// [[1,0,9],[2,0,1]]
// [[2,1,10],[3,0,1]]
// [[3,1,11]]
// [[3,11,21]]
// 简单点开始，获取所有分组所有设备，拼接成map放入内存
// 订阅时也先订阅所有已选择的分组，直接动态更新上述map

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
  const localSelectedGroups = JSON.parse(
    localStorage.getItem('localSelectedGroups') || '[]',
  );

  const [client, setClient] = useState<MqttClient>();
  const [connectStatus, setConnectStatus] = useState<string>('UnConnected');
  // UnConnected  未连接，初始状态
  // Connecting   连接中
  // Connected    已连接
  // Reconnecting 重连中
  // Offline      脱机
  // Disconnected 代理通知断开连接
  // Closed       连接已断开
  const [isSub, setIsSub] = useState<boolean>(false);
  // true   已订阅
  // false  取消订阅
  const [messages, setMessages] = useState(new Map());
  const [type, setType] = useState<string>('all');

  const [value, setValue] = useState(groupKeys);
  const [topics, setTopics] = useState(localTopics);
  const [selectedGroups, setSelectedGroups] = useState(localSelectedGroups);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [interval, setInterval] = useState(1000);

  const { groupList: groupData } = group;
  const { selectedDeviceList } = device;
  const groupList = createGroupTreeList(groupData);

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
  }, []);

  useEffect(() => {
    dispatch({
      type: 'group/queryGroupList',
      payload: {},
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: 'device/queryDevicesBySelectedGroup',
      payload: {
        selectedGroups: selectedGroups,
      },
    });
  }, [selectedGroups]);

  useEffect(() => {
    console.log('merge selectedDevices into msgs');
    msgs.clear();

    selectedDeviceList.forEach(d => {
      const sn = d.sn;
      const o = msgs.get(sn);
      msgs.set(sn, { ...d, ...o });
    });
    console.log(msgs);
  }, [selectedDeviceList]);

  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        setMqttStatus('Connected');
        if (topics.length > 0) {
          mqttSub(topics);
        }
      });
      client.on('error', err => {
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

  useInterval(() => {
    const m = new Map(msgs);
    setMessages(m);
  }, interval);

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
        setTopics([]);
        setIsSub(false);
      });
    }
  };

  const onChange = (keys: any) => {
    if (topics && topics.length > 0) {
      mqttUnSub();
    }

    if (keys.length === 0) {
      setInterval(null);
      // msgs.clear();
      // messages.clear();
      setMessages(new Map());
    } else {
      setInterval(1000);
    }

    let ts: [] = [];
    let nodes = [];
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
          // const topic = `web/${id}/#`;
          ts.push(`web/${id}/breath`);
          ts.push(`web/${id}/fall`);
          nodes.push(node);
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
    setSelectedGroups(nodes);
    localStorage.setItem('localSelectedGroups', JSON.stringify(nodes));

    if (ts.length > 0 && connectStatus === 'Connected') {
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

  const onCurrentChange = current => {
    console.log(current);
    setCurrent(current);
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
        <Col span={24}>
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
        {/* <Col span={6}>
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
        </Col> */}
      </Row>
      <div className={styles.devices}>
        {[...messages].slice((current - 1) * 10, current * 10).map(data => {
          // const data = messages.get(key);
          const { e, f, b, d, c } = (data && data[1].fall) || {
            e: 0,
            f: 0,
            b: 0,
            d: 0,
            c: 0,
          };
          const { b: breath } = (data && data[1].breath) || {
            b: 0,
          };
          const { x, y } = (data && data[1].point) || {
            x: 0,
            y: 0,
          };
          return (
            <Room
              key={data[0]}
              room={data[0]}
              online={data[1].online}
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
        className={styles.custonPagi}
        size="small"
        total={selectedDeviceList.length}
        current={current}
        pageSize={pageSize}
        showTotal={showTotal}
        showSizeChanger={false}
        showQuickJumper
        onChange={onCurrentChange}
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
