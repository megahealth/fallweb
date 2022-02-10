import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Empty, Space, Pagination, Badge, Cascader, message, Switch } from 'antd';
import { useInterval, useLocalStorageState, useRequest } from 'ahooks';
import { createGroupTreeList, getTreeLeaf } from '@/utils/utils';
import { queryGroupList } from '@/services/group';
import { queryDeviceList } from '@/services/device';
import useMqtt from '@/hooks/useMqtt/useMqtt';
// import AudioAlarm from '@/components/audioAlarm/AudioAlarm';
import useAudio from '@/components/useAudio/useAudio';
import Room from './components/room';
import styles from './index.less';
import type { QueryDashboardProps } from './queryDashboard';
import { AudioMutedOutlined, AudioOutlined } from '@ant-design/icons';

const Dashboard: React.FunctionComponent<QueryDashboardProps> = () => {
  const devices = useRef(new Map());
  const { client, messages: mqttMsg, connectStatus } = useMqtt();
  const [selectedGroups, setSelectedGroups] = useLocalStorageState('selectedGroups', '[]');
  const [selectedGroupChain, setSelectedGroupChain] = useLocalStorageState(
    'selectedGroupChain',
    '',
  );
  const [audioSwitch, setAudioSwitch] = useLocalStorageState('audioSwitch', 'OFF');
  const [topics, setTopics] = useState<string[] | []>([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [date, setDate] = useState(0);
  const [interval, setInterval] = useState<number | null>(1000);
  const [playing, toggle] = useAudio(
    'https://file-shc.megahealth.cn/TFba0jnAkHgtXGeMl6UxF5pF9oXC7MgA/fall-warning.mp3',
  );

  const { data: group } = useRequest(queryGroupList);

  const mqttSub = useCallback(
    (ts) => {
      if (client) {
        if (ts && ts.length > 0) {
          client.subscribe(ts, { qos: 1 }, (error) => {
            if (error) {
              console.log('Subscribe error', error);
            }
          });
        }
      }
    },
    [client],
  );

  const mqttUnSub = useCallback(
    (ts) => {
      if (client) {
        if (ts && ts.length > 0) {
          client.unsubscribe(ts, (error: any) => {
            if (error) {
              console.log('Unsubscribe error', error);
            }
          });
        }
      }
    },
    [client],
  );

  useInterval(() => {
    setDate(new Date().getTime()); // 控制刷新频率
  }, interval);

  useEffect(() => {
    if (localStorage.getItem('currentPage')) {
      setCurrent(parseInt(localStorage.getItem('currentPage') || '1'));
      localStorage.removeItem('currentPage');
    }
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
      const newTopics: any[] = [];
      const promiseArr: any[] = [];

      if (selectedGroups) {
        const groups =
          typeof selectedGroups === 'string' ? JSON.parse(selectedGroups) : selectedGroups;
        groups.forEach((item: any) => {
          const { sub_id, dev_cnt } = item;
          promiseArr.push(
            queryDeviceList({
              start: 0,
              limit: dev_cnt,
              group: sub_id,
            }),
          );

          newTopics.push(`web/${sub_id}/breath`);
          newTopics.push(`web/${sub_id}/fall`);
          newTopics.push(`web/${sub_id}/upline`);
          newTopics.push(`web/${sub_id}/downline`);
          newTopics.push(`web/${sub_id}/alert`);
          newTopics.push(`web/${sub_id}/tcount`);
        });
      }
      selectedDeviceList = await Promise.all(promiseArr);

      devices.current.clear();
      mqttUnSub(topics);

      selectedDeviceList
        .map((item) => item.msg)
        .flat()
        .forEach((d) => {
          if (d) {
            devices.current.set(d.sn, d);
          }
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
    try {
      if (mqttMsg) {
        const { payload, topic } = mqttMsg;
        if (payload === 'close') return;
        const { sn, fall, breath, alert } = JSON.parse(payload);
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
            if (!playing) toggle();
          }
        }
        if (breath) o.breath = breath.b;
        o.alert = alert || 0;
        devices.current.set(sn, o);
      }
    } catch (error) {
      console.log(error);
    }
  }, [mqttMsg]);

  const groupList = useMemo(() => {
    let data = [];
    if (group) {
      data = createGroupTreeList(group.msg);
    }
    return data;
  }, [group]);

  const onGroupChange = useCallback(
    (value: any, selectedOptions: any) => {
      localStorage.removeItem('currentPage');
      setCurrent(1);
      const groupChain = selectedOptions.map((o: any) => o.label).join(' > ');
      setSelectedGroupChain(groupChain);
      if (groupList) {
        const key = selectedOptions.pop().value; // 取 key， eg：1-2，可以支持多选，单选，默认单选，预留后续多选需求
        const node = groupList[0]; // 需进一步计算子节点？需要的，订阅父节点获取不到数据(接口设定)
        const leafs = getTreeLeaf(node, key);
        setSelectedGroups(JSON.stringify(leafs)); // [{key:'1-2',...}, ... ]
      }
    },
    [setSelectedGroupChain, setSelectedGroups, groupList],
  );

  const onCurrentChange = useCallback(
    (c) => {
      setCurrent(c);
    },
    [setCurrent],
  );

  const onShowSizeChange = useCallback(
    (c, size) => {
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
          /{/* <AudioAlarm audioSwitch={audioSwitch} setAudioSwitch={setAudioSwitch} /> */}
          {/* <Button onClick={() => toggle()}>test</Button> */}
          <span onClick={() => toggle()}>音频告警</span>
          <Switch
            checkedChildren={<AudioOutlined />}
            unCheckedChildren={<AudioMutedOutlined />}
            checked={audioSwitch === 'ON'}
            onChange={(checked) => {
              const flag = checked === true ? 'ON' : 'OFF';
              setAudioSwitch(flag);
              if (flag === 'ON') {
                message.success('已打开音频告警');
              } else {
                message.error('已关闭音频告警');
                if (playing) {
                  toggle();
                }
              }
            }}
          />
        </Space>
      </div>
      <div className={styles.devices}>
        {[...devices.current].slice((current - 1) * pageSize, current * pageSize).map((data) => {
          const { device_id, action_state, breath, count, online, sn, name, alert } = data[1];
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
              alert={alert || 0}
              current={current}
            />
          );
        })}
      </div>
      {devices.current.size === 0 && (
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
