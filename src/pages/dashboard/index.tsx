import React, { FC, useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Empty, Space, Pagination, Badge, Cascader, message } from 'antd';
import { useInterval, useLocalStorageState, useRequest } from 'ahooks';
import { createGroupTreeList, getTreeLeaf } from '@/utils/utils';
import { queryGroupList } from '@/services/group';
import { queryDeviceList } from '@/services/device';
import useMqtt from '@/hooks/useMqtt/useMqtt';
import AudioAlarm from '@/components/audioAlarm/AudioAlarm';
import Room from './components/room';
import styles from './index.less';
import { QueryDashboardProps } from './queryDashboard';

const Dashboard: FC<QueryDashboardProps> = () => {
  const devices = useRef(new Map());
  const { client, messages: mqttMsg, connectStatus } = useMqtt();
  const [selectedGroups, setSelectedGroups] = useLocalStorageState('selectedGroups', '[]');
  const [selectedGroupChain, setSelectedGroupChain] = useLocalStorageState(
    'selectedGroupChain',
    '',
  );
  const [audioSwitch] = useLocalStorageState('audioSwitch', 'OFF');
  const [topics, setTopics] = useState<string[] | []>([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [date, setDate] = useState(0);
  const [interval, setInterval] = useState(1000);

  const { data: group } = useRequest(queryGroupList);

  useInterval(() => {
    setDate(new Date().getTime()); // 控制刷新频率
  }, interval);

  useEffect(() => {
    return () => {
      setInterval(null);
      if (client) {
        client.end();
      }
    };
  }, []);

  /*
  group变化
  请求新group设备
  订阅新group设备
  */
  useEffect(() => {
    const getDevicesAndTopics = async () => {
      let selectedDeviceList: any[] = [];
      let newTopics: any[] = [];

      if (selectedGroups) {
        const groups =
          typeof selectedGroups === 'string' ? JSON.parse(selectedGroups) : selectedGroups;
        for (let i = 0; i < groups.length; i++) {
          const { sub_id, dev_cnt } = groups[i];
          if (dev_cnt === 0) continue;
          const response = await queryDeviceList({
            start: 0,
            limit: dev_cnt,
            group: sub_id,
          });
          selectedDeviceList = selectedDeviceList.concat(response.msg);

          newTopics.push(`web/${sub_id}/breath`);
          newTopics.push(`web/${sub_id}/fall`);
          newTopics.push(`web/${sub_id}/upline`);
          newTopics.push(`web/${sub_id}/downline`);
        }
      }

      devices.current.clear();
      mqttUnSub(topics);

      selectedDeviceList.forEach((d) => {
        devices.current.set(d.sn, d);
      });
      mqttSub(newTopics);
      setTopics(newTopics);
    };

    getDevicesAndTopics();
  }, [selectedGroups, client]);

  /*
  mqtt更新device map
  */
  useEffect(() => {
    if (mqttMsg) {
      const { payload, topic } = mqttMsg;
      const { sn, fall, breath } = JSON.parse(payload);
      const o = devices.current.get(sn) || {};

      if (topic.indexOf('downline') !== -1) {
        o.online = 0;
      }
      if (topic.indexOf('upline') !== -1) {
        o.online = 1;
      }
      if (fall) {
        o.action_state = fall.a;
        o.outdoor = fall.d;
        o.count = fall.c;
        o.roll = fall.r;
        if (o.action_state >= 5 && audioSwitch === 'ON') {
          message.warning(`${o.name}跌倒，请注意查看！`);
        }
        if (o.action_state >= 5) {
          message.warning(`${o.name}跌倒，请注意查看！`);
        }
      }
      if (breath) o.breath = breath.b;

      devices.current.set(sn, o);
    }
  }, [mqttMsg]);

  const groupList = useMemo(() => {
    if (group) {
      return createGroupTreeList(group.msg);
    }
  }, [group]);

  const onGroupChange = useCallback(
    (value: any, selectedOptions: any) => {
      const groupChain = selectedOptions.map((o: any) => o.label).join(' > ');
      setSelectedGroupChain(groupChain);

      const key = selectedOptions.pop().value; // 取 key， eg：1-2，可以支持多选，单选，默认单选，预留后续多选需求
      const node = groupList[0]; // 需进一步计算子节点？需要的，订阅父节点获取不到数据(接口设定)
      const leafs = getTreeLeaf(node, key);
      setSelectedGroups(leafs); // [{key:'1-2',...}, ... ]
    },
    [setSelectedGroupChain, setSelectedGroups, groupList],
  );

  const mqttSub = useCallback(
    (topics) => {
      if (client) {
        if (topics && topics.length > 0) {
          client.subscribe(topics, { qos: 1 }, (error) => {
            if (error) {
              console.log('Subscribe error', error);
            }
          });
        }
      }
    },
    [client, topics],
  );

  const mqttUnSub = useCallback(
    (topics) => {
      if (client) {
        if (topics && topics.length > 0) {
          client.unsubscribe(topics, (error: any) => {
            if (error) {
              console.log('Unsubscribe error', error);
            }
          });
        }
      }
    },
    [client, topics],
  );

  const onCurrentChange = useCallback(
    (current) => {
      setCurrent(current);
    },
    [setCurrent],
  );

  const onShowSizeChange = useCallback(
    (current, size) => {
      setPageSize(size);
    },
    [setPageSize],
  );

  return (
    <div>
      <div className={styles.tree}>
        <Cascader options={groupList} onChange={onGroupChange} changeOnSelect expandTrigger="hover">
          <a href="#">{selectedGroupChain || '选择群组'}</a>
        </Cascader>
        <Space align="center">
          <Badge
            status={connectStatus === 'Connected' ? 'success' : 'error'}
            text={connectStatus}
          />{' '}
          /
          <AudioAlarm />
        </Space>
      </div>
      <div className={styles.devices}>
        {[...devices.current].slice((current - 1) * pageSize, current * pageSize).map((data) => {
          const { device_id, action_state, breath, count, online, sn, name } = data[1];
          return (
            <Room
              key={device_id}
              id={device_id}
              sn={sn}
              name={name}
              online={online}
              count={count}
              action={action_state}
              breath={breath}
            />
          );
        })}
      </div>
      {devices.current.size == 0 && (
        <div className={styles.emptyBox}>
          <Empty />
        </div>
      )}
      <Pagination
        className={styles.custonPagi}
        size="small"
        total={devices.current.size}
        current={current}
        pageSize={pageSize}
        showSizeChanger={true}
        onShowSizeChange={onShowSizeChange}
        showQuickJumper
        onChange={onCurrentChange}
      />
    </div>
  );
};

export default Dashboard;
