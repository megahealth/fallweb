import type { FC } from 'react';
import React, { useEffect, useMemo } from 'react';
import { useLocalStorageState } from 'ahooks';
import styles from './index.less';
import Status from './status';
import BriefReport from '../report/briefReport';
import BreifInfo from '../sleep/breifInfo';
import FallHandleLog from './fallHandleLog';
import RealTimeLocation from './realTimeLocation';
import { getDevice } from '@/services/device'
import { useRequest } from 'ahooks';
import useMqtt from '@/hooks/useMqtt/useMqtt'

export interface DetailProps {
  match: any;
  location: any;
}

const Detail: FC<DetailProps> = (props) => {
  const { id } = props.match.params;
  const { data: deviceInfo, loading } = useRequest(() => getDevice({id}));
  const { client, messages } = useMqtt();
  const [currentGroup] = useLocalStorageState('currentGroup');

  useEffect(() => {
    if (client && deviceInfo) {
      const sn = deviceInfo.msg.sn;
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
        error => {
          if (error) {
            console.log('Unsubscribe error', error);
          }
        },
      );
    }
  }, [client, deviceInfo]);

  const state = useMemo(() => {
    const data = deviceInfo && deviceInfo.msg;
    if(messages) {
      const { payload, topic } = messages;
      const { point, fall, breath } = JSON.parse(payload);

      let online;
      if (topic.indexOf('downline') !== -1) {
        online = 0;
      }
      if (topic.indexOf('upline') !== -1) {
        online = 1;
      }

      if(online !== null && online !== undefined) data.online = online;
      if(breath !== null && breath !== undefined) data.breath = breath.b;
      if(fall !== null && fall !== undefined) {
        data.count = fall.c;
        data.action_state = fall.a;
        data.outdoor = fall.d;
        data.roll = fall.r;
        if(fall.last_roll_time === 1) {
          data.last_roll_time = new Date().getTime();
        }
      }
      if(point) {
        data.location = {
          x: 100 * point.x + 200 + 100, y: 100 * point.y + 100
        }
      }
    }
    return data;
  }, [deviceInfo, messages]);

  return (
    <div>
      {
        loading ? 'loading' : 
        <div>
          <div className={styles.breadcrumb}>
            监控页
            {` > ${currentGroup} > ${state.name}`}
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
          {state.sn.indexOf('J01MD') !== -1 && (
            <BreifInfo sn={state.sn}></BreifInfo>
          )}
        </div>
      }
    </div>
  );
};

export default Detail;
