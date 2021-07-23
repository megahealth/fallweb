import type { FC } from 'react';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocalStorageState } from 'ahooks';
import styles from './index.less';
import Status from './status';
import BriefReport from '../report/briefReport';
import BreifInfo from '../sleep/breifInfo';
import FallHandleLog from './fallHandleLog';
import RealTimeLocation from './realTimeLocation';
import { getDevice } from '@/services/device';
import { useRequest } from 'ahooks';
import useMqtt from '@/hooks/useMqtt/useMqtt';
import { getSDKs } from '@/services/sdks';
import { Button, Select, Popconfirm, message, Modal, Progress } from 'antd';
const { Option } = Select;
export interface DetailProps {
  match: any;
  location: any;
}

const Detail: FC<DetailProps> = (props) => {
  const { id } = props.match.params;
  const { data: deviceInfo, loading } = useRequest(() => getDevice({ id }));
  const { client, messages } = useMqtt();
  const [selectedGroupChain] = useLocalStorageState('selectedGroupChain');
  const [restartVisible, setRestartVisible] = useState(false);
  const [restartLoading, setRestartLoading] = useState(false);
  const [restartResult, setRestartResult] = useState(false);
  const [upgradeVisible, setUpgradeVisible] = useState(false);
  const [upgradeStatus, setUpgradeStatus] = useState(0);
  const [upgradeProgress, setUpgradeProgress] = useState(-1);
  const [versionList, setVersionList] = useState([]);
  const [selectValue, setSelectValue] = useState(undefined);

  useEffect(() => {
    if (client && deviceInfo) {
      const { sn } = deviceInfo.msg;
      client.publish(`/todevice/point/${sn}`, 'hello');
      client.subscribe(
        [
          `device/ota/${sn}`,
          `device/state/${sn}`,
          `device/point/${sn}`,
          `device/breath/${sn}`,
          `device/fall/${sn}`,
          `trans_device/upline/${sn}`,
          `trans_device/downline/${sn}`,
        ],
        { qos: 1 },
        (error) => {
          if (error) {
            console.log('Unsubscribe error', error);
          }
        },
      );
    }
  }, [client, deviceInfo]);

  const state = useMemo(() => {
    const data = deviceInfo && deviceInfo.msg;
    if (messages) {
      const { payload, topic } = messages;
      const { point, fall, breath, restart, ota } = JSON.parse(payload);
      let online;
      if (topic.indexOf('downline') !== -1) {
        online = 0;
      }
      if (topic.indexOf('upline') !== -1) {
        online = 1;
      }
      if (restart == 0) {
        setRestartVisible(false);
        setRestartLoading(false);
        setRestartResult(true);
      }
      if (ota) {
        setUpgradeProgress(ota.p || 0);
        setUpgradeStatus(ota.s || 0);
      }

      if (online !== null && online !== undefined) data.online = online;
      if (breath !== null && breath !== undefined) data.breath = breath.b;
      if (fall !== null && fall !== undefined) {
        data.count = fall.c;
        data.action_state = fall.a;
        data.outdoor = fall.d;
        data.roll = fall.r;
        if (fall.last_roll_time === 1) {
          data.last_roll_time = new Date().getTime();
        }
      }
      if (point) {
        if (point.y > 6 || point.y < 0 || point.x > 3 || point.x < -3) {
          data.location = null;
        } else {
          data.location = {
            x: 100 * point.x + 300 + 100,
            y: 100 * point.y + 100,
          };
        }
      }
    }
    return data;
  }, [deviceInfo, messages]);

  useEffect(() => {
    if (restartResult) {
      message.success('重启成功！');
      setRestartResult(false);
    }
  }, [restartResult]);

  const openModal = async () => {
    setUpgradeVisible(true);
    setUpgradeProgress(-1);
    const res = await getSDKs({
      skip: 0,
      limit: 10,
    });
    if (res.code == 0) {
      const arr: any = [];
      res.msg.forEach((item: any) => {
        arr.push({
          url: item.url,
          version: item.version,
        });
      });
      setVersionList(arr);
    }
  };

  const upgradeSDK = () => {
    if (client && deviceInfo) {
      setUpgradeProgress(0);
      const { sn } = deviceInfo.msg;
      client.subscribe([`device/ota/${sn}`], { qos: 1 }, (error) => {
        if (error) {
          console.log('Unsubscribe error', error);
        }
      });
      client.publish(`/todevice/ota/${sn}`, `${selectValue}`);
    } else {
      message.error('没有发现连接，升级失败！');
    }
  };

  const restartDevice = () => {
    if (client && deviceInfo) {
      setRestartLoading(true);
      const { sn } = deviceInfo.msg;
      client.subscribe([`device/restart/${sn}`], { qos: 1 }, (error) => {
        if (error) {
          console.log('Unsubscribe error', error);
        }
      });
      client.publish(`/todevice/restart/${sn}`, '');
    } else {
      message.error('没有发现连接，重启失败！');
      setRestartVisible(false);
      setRestartLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        'loading'
      ) : (
        <div>
          <div className={styles.breadcrumb}>
            <span>
              监控页
              {` > ${selectedGroupChain} > ${state.name}`}
            </span>
            {/* <div  style={{ float:'right' }}>
              <Button 
                type="primary" 
                style={{ marginRight:'20px' }} 
                onClick={openModal}
              >升级</Button>
              <Popconfirm
                title="确定要重启设备吗？"
                visible={restartVisible}
                onConfirm={restartDevice}
                okButtonProps={{ loading: restartLoading }}
                onCancel={()=>{ setRestartVisible(false) }}
              >
                <Button type="primary" danger onClick={()=>{ setRestartVisible(true) }}>重启</Button>
              </Popconfirm>
              <Modal
                title="选择升级的固件版本，并进行升级。"
                visible={upgradeVisible}
                onCancel={()=>{ setUpgradeVisible(false) }}
                footer = {null}
              >
                <div style={{ marginBottom:'40px', marginTop:'20px', }}>
                  <div  style={{ marginBottom:'30px', display:'flex',justifyContent:'center',alignItems:'center' }}>
                    <label>版本：</label>
                    <Select 
                      style={{ width: 220 }} 
                      value={selectValue} 
                      onChange={(e)=>{ setSelectValue(e) }} 
                      disabled={!(upgradeProgress==-1 || upgradeProgress == 100)}
                      allowClear
                    >
                      {
                        versionList.map((item:any,index:number)=>{
                          return <Option key={index} value={item.url}>{item.version}</Option>
                        })
                      }
                    </Select>
                    <Button 
                      type="primary" 
                      style={{ marginLeft:'20px' }} 
                      onClick={upgradeSDK} 
                      disabled={!selectValue || !(upgradeProgress==-1 || upgradeProgress == 100)}
                    >升级</Button>
                  </div>
                  {
                    upgradeProgress?
                    <div  style={{ marginBottom:'30px', display:'flex',justifyContent:'center',alignItems:'center' }}>
                      <Progress
                        type="circle"
                        strokeColor={{
                          '0%': '#108ee9',
                          '100%': '#87d068',
                        }}
                        status="exception"
                        percent={65 || upgradeProgress}
                      />
                    </div>:null
                  }
                </div>
              </Modal>
            </div> */}
          </div>
          <Status
            breath={state.breath}
            state={state.action_state}
            online={state.online}
            count={state.count}
            roll={state.roll}
            rollTime={state.last_roll_time}
          ></Status>
          <div className={styles.warp}>
            <div className={styles.point}>
              <RealTimeLocation
                sn={state.sn}
                version={state.version}
                wifi={state.wifi}
                ip={state.ip}
                location={state.location}
              />
              <FallHandleLog />
            </div>
            <div className={styles.report}>
              <BriefReport state={state.action_state} sn={state.sn}></BriefReport>
            </div>
          </div>
          {state.sn.indexOf('J01MD') !== -1 && <BreifInfo sn={state.sn}></BreifInfo>}
        </div>
      )}
    </div>
  );
};

export default Detail;
