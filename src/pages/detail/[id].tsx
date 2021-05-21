import React, { FC, useRef, useState, useEffect } from 'react';
import { message, Empty } from 'antd';
import { connect, Dispatch, history } from 'umi';
import { DeviceState, ReportState, Loading } from '@/models/connect';
import mqtt, { MqttClient } from 'mqtt';
import styles from './index.less';
import Status from './status';
import BriefReport from '../report/briefReport';
import BreifInfo from '../sleep/breifInfo';
import IconTitle from '@/components/iconTitle';
import 记录 from '@/assets/记录.png';

export interface DetailProps {
  device: DeviceState;
  dispatch: Dispatch;
  loading: boolean;
  match: object;
  location: object;
}

function draw(ctx, location) {
  ctx.save();
  ctx.fillStyle = 'white';
  ctx.shadowColor = '#ccc';
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.shadowBlur = 3;
  ctx.rotate((-90 * Math.PI) / 180);
  ctx.transform(0.25, 0.6, -0.3, 0.25, -150, -60);
  ctx.fillRect(100, 100, 500, 600);
  ctx.restore();

  ctx.save();
  ctx.rotate((-90 * Math.PI) / 180);
  ctx.transform(0.25, 0.6, -0.3, 0.25, -150, -60);
  ctx.shadowColor = '#ccc';
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.shadowBlur = 5;
  ctx.fillStyle = '#aaa';
  ctx.fillRect(280, 100, 40, 40);
  ctx.fillStyle = '#fff';
  ctx.font = '18px sans-serif';
  ctx.fillText('设备', 283, 123);
  ctx.restore();

  ctx.save();
  ctx.rotate((-90 * Math.PI) / 180);
  ctx.transform(0.25, 0.6, -0.3, 0.25, -150, -60);
  ctx.beginPath();
  ctx.arc(location.x, location.y, 8, 0, Math.PI * 2, true); // 绘制
  ctx.fillStyle = '#5dc394';
  ctx.strokeStyle = '#5dc394';
  ctx.shadowColor = '#5dc394';
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

const Detail: FC<DetailProps> = ({ device, dispatch, loading, match }) => {
  const { id } = match.params;
  const canvasRef = useRef(null);
  const [client, setClient] = useState<MqttClient>();
  const [location, setLocation] = useState({ x: 1350, y: 1400 });
  const [reconnectTimes, setReconnectTimes] = useState([]);
  const [connect, setConnect] = useState('no');

  const {
    sn,
    group,
    name,
    version,
    wifi,
    ip,
    online,
    count,
    action_state,
    breath,
    last_roll_time,
    outdoor,
    roll,
  } = device.status;

  const mqttConnect = () => {
    setClient(
      mqtt.connect('wss://wss8084.megahealth.cn/mqtt', {
        clean: true,
        keepalive: 10,
        connectTimeout: 4000,
        clientId: localStorage.getItem('user_id') + '',
        username: 'user_' + localStorage.getItem('name'),
        reconnectPeriod: 1000,
        protocolVersion: 5,
      }),
    );
  };

  useEffect(() => {
    mqttConnect();

    dispatch({
      type: 'device/getDevice',
      payload: {
        id,
      },
    });
  }, []);

  useEffect(() => {
    if (sn && connect === 'yes') {
      client.publish(`/todevice/point/${sn}`, 'hello');
      client.subscribe(
        [
          `device/ota/${sn}`,
          `device/state/${sn}`,
          `device/point/${sn}`,
          `device/breath/${sn}`,
          `device/fall/${sn}`,
        ],
        { qos: 1 },
        error => {
          if (error) {
            console.log('Unsubscribe error', error);
            return;
          }
        },
      );
    }
  }, [sn, connect]);

  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        setConnect('yes');
      });
      client.on('error', err => {
        console.log(err);
      });
      client.on('message', (topic, payload) => {
        const { point, fall, breath } = JSON.parse(payload.toString());

        if (topic.indexOf('downline') !== -1) {
          dispatch({
            type: 'device/updateStatus',
            payload: {
              online: 0,
            },
          });
        }
        if (topic.indexOf('upline') !== -1) {
          dispatch({
            type: 'device/updateStatus',
            payload: {
              online: 1,
            },
          });
        }
        if (fall) {
          const { a, d, c, r } = fall;
          dispatch({
            type: 'device/updateStatus',
            payload: {
              action_state: a,
              outdoor: d,
              count: c,
              roll: r,
            },
          });
          if (r === 1) {
            dispatch({
              type: 'device/updateStatus',
              payload: {
                last_roll_time: new Date().getTime(),
              },
            });
          }
        }
        if (breath) {
          dispatch({
            type: 'device/updateStatus',
            payload: {
              breath: breath.b,
            },
          });
        }

        if (point) {
          const { x, y } = point;
          setLocation({
            x: 100 * x + 200 + 100,
            y: 100 * y + 100,
          });
        }
      });
      client.on('close', () => {});
      client.on('reconnect', () => {
        let now = new Date().getTime();
        setReconnectTimes(reconnectTimes.push(now));
        let last3 = reconnectTimes[reconnectTimes.length - 3];
        if (last3 && now - last3 < 10 * 1000) {
          if (client) {
            client.end();
          }

          localStorage.clear();
          history.replace({
            pathname: '/login',
          });
          message.error('有人登陆您的账号，已被迫下线！');
        }
      });
      client.on('disconnect', packet => {
        console.log(packet);
      });
      client.on('offline', () => {});
    }

    return () => {
      if (client) {
        client.end();
      }
    };
  }, [client]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 500, 400);
    draw(ctx, location);
  });

  useEffect(() => {
    return () => {
      dispatch({
        type: 'device/clearStatus',
      });
      dispatch({
        type: 'report/clearState',
      });
    };
  }, []);

  return (
    <div>
      <div className={styles.breadcrumb}>
        监控页
        {' > ' + localStorage.getItem('localCurrentGroup') + ' > ' + name}
      </div>
      <Status
        breath={breath}
        state={action_state}
        online={online}
        count={count}
        roll={roll}
        rollTime={last_roll_time}
      ></Status>
      <div className={styles.warp}>
        <div className={styles.point}>
          <div className={styles.canvas}>
            <div className={styles.info}>
              <p>
                {sn} / v{version}
              </p>
              <p>
                {wifi} / {ip}
              </p>
            </div>
            <canvas ref={canvasRef} width={500} height={400} />
          </div>
          <div className={styles.fall}>
            <IconTitle title="跌倒处理记录" img={记录}></IconTitle>
            <div className={styles.list}>
              <Empty />
            </div>
          </div>
        </div>
        <div className={styles.report}>
          <BriefReport state={action_state} sn={sn}></BriefReport>
        </div>
      </div>
      <div>
        <BreifInfo sn={sn}></BreifInfo>
      </div>
    </div>
  );
};

export default connect(
  ({
    device,
    report,
    loading,
  }: {
    device: DeviceState;
    report: ReportState;
    loading: Loading;
  }) => ({
    device,
    report,
    loading: loading.models.device,
  }),
)(Detail);
