import type { FC } from 'react';
import React, { useEffect, useMemo } from 'react';
import { useLocalStorageState } from 'ahooks';
import styles from './index.less';
import Status from './status';
import BriefReport from '../report/briefReport';
import BreifInfo from '../sleep/breifInfo';
import FallHandleLog from './fallHandleLog';
import RealTimeLocation from './realTimeLocation';
import UpgradeAndRestart from './upgradeAndRestart';
import { getDevice } from '@/services/device';
import { useRequest } from 'ahooks';
import useMqtt from '@/hooks/useMqtt/useMqtt';
export interface DetailProps {
  match: any;
  location: any;
}

const Detail: FC<DetailProps> = (props) => {
  const { id } = props.match.params;
  const { data: deviceInfo, loading } = useRequest(() => getDevice({ id }));
  const { client, messages } = useMqtt();
  const [selectedGroupChain] = useLocalStorageState('selectedGroupChain');

  useEffect(() => {
    const { page } = props.location.query;
    localStorage.setItem('currentPage', page);
  }, []);

  useEffect(() => {
    if (client && deviceInfo) {
      const { sn } = deviceInfo.msg;
      client.publish(`/todevice/point/${sn}`, 'hello');
      client.publish(`/todevice/tcount/${sn}`, 'hello');
      client.subscribe(
        [
          `device/ota/${sn}`,
          `device/state/${sn}`,
          `device/point/${sn}`,
          `device/breath/${sn}`,
          `device/fall/${sn}`,
          `device/alert/${sn}`,
          `device/tcount/${sn}`,
          `trans_device/upline/${sn}`,
          `trans_device/downline/${sn}`,
        ],
        { qos: 0 },
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
      if (topic.indexOf('device/environment/') != -1 || topic.indexOf('device/param/') != -1)
        return data;
      const { point, fall, breath, state, alert, tcount } = JSON.parse(payload);
      if (tcount) data.tcount = tcount.c;

      let online;
      if (topic.indexOf('downline') !== -1) {
        online = 0;
      }
      if (topic.indexOf('upline') !== -1) {
        online = 1;
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
      if (state) {
        data.version = state.v;
        data.wifi = state.w;
        data.ip = state.i;
      }
      if (alert === 0 || alert) {
        data.alert = alert;
      }
    }
    return data;
  }, [deviceInfo, messages]);

  const changeOnline = (value: number) => {
    state.online = value;
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
            {localStorage.getItem('group_id') === '1' ? (
              <UpgradeAndRestart
                client={client}
                messages={messages}
                sn={deviceInfo.msg ? deviceInfo.msg.sn || '' : ''}
                changeOnline={changeOnline}
              />
            ) : null}
          </div>
          <Status
            breath={state.breath}
            state={state.action_state}
            online={state.online}
            count={state.count}
            roll={state.roll}
            rollTime={state.last_roll_time}
            alert={state.alert}
            tcount={state.tcount}
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
          {deviceInfo &&
            deviceInfo.msg &&
            deviceInfo.msg.sleep_on == 1 &&
            state.sn.indexOf('J01MD') !== -1 && <BreifInfo sn={state.sn}></BreifInfo>}
        </div>
      )}
    </div>
  );
};

export default Detail;
