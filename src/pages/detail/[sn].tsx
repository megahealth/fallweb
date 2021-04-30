import React, { useRef, useState, useEffect } from 'react';
import { message, Empty } from 'antd';
import { connect, Dispatch, history, Link } from 'umi';
import mqtt, { MqttClient } from 'mqtt';
import styles from './index.less';
import Status from './status';
import Report from '../report/[sn]';
import BreifInfo from '../sleep/breifInfo';
import IconTitle from '@/components/iconTitle';
import 记录 from '@/assets/记录.png';

export interface DetailProps {
  dispatch: Dispatch;
  loading: boolean;
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

  // ctx.save();
  // ctx.rotate(-90 * Math.PI / 180);
  // ctx.transform(0.5,0.6,-0.3,0.5,-300,-50);
  // ctx.beginPath();
  // ctx.strokeStyle = '#5dc394';
  // ctx.moveTo(location.x, location.y);
  // ctx.lineTo(location.x, location.y-50);
  // ctx.stroke();
  // ctx.restore();

  // ctx.save();
  // ctx.rotate(-90 * Math.PI / 180);
  // ctx.transform(0.5,0.6,-0.3,0.5,-300,-50);
  // ctx.fillStyle = '#5dc394';
  // ctx.fillRect(location.x-40, location.y-50, 40, 20);
  // ctx.restore();

  // ctx.save();
  // ctx.rotate(-90 * Math.PI / 180);
  // ctx.transform(0.5,0,0,0.5,-300,-50);
  // ctx.fillStyle = '#fff';
  // ctx.fillText("目标",location.x-30,location.y-37);
  // ctx.restore();
}

const Detail = props => {
  const { sn } = props.match.params;
  const { group } = props.location.query;
  localStorage.setItem('sn', sn);
  const canvasRef = useRef(null);
  const [location, setLocation] = React.useState({ x: 1350, y: 1400 });
  const [client, setClient] = useState<MqttClient>();
  const [reconnectTimes, setReconnectTimes] = useState([]);

  const data = localStorage.getItem('data');
  const {
    action_state,
    breath: localbreath,
    count: localcount,
    device_id,
    group_id,
    group_name,
    name,
    online: localonline,
    outdoor: localoutdoor,
    roll: localroll,
    last_roll_time,
    update_at,
  } = JSON.parse(data);
  const [online, setOnline] = useState(localonline);
  const [state, setState] = useState(action_state);
  const [outdoor, setOutdoor] = useState(localoutdoor);
  const [count, setCount] = useState(localcount);
  const [roll, setRoll] = useState(localroll);
  const [breath, setBreath] = useState(localbreath);
  const [rollTime, setRollTime] = useState(last_roll_time);

  const mqttConnect = () => {
    setClient(
      mqtt.connect('wss://wss8084.megahealth.cn/mqtt', {
        clean: true,
        keepalive: 10,
        connectTimeout: 4000,
        clientId: localStorage.getItem('user_id'),
        username: 'user_' + localStorage.getItem('name'),
        reconnectPeriod: 1000,
        protocolVersion: 5,
      }),
    );
  };

  useEffect(() => {
    mqttConnect();
  }, []);

  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        console.log('connect');
        client.subscribe(`web/${group}/#`, error => {
          if (error) {
            console.log('Unsubscribe error', error);
            return;
          }
        });
      });
      client.on('error', err => {
        console.log(err);
      });
      client.on('message', (topic, payload) => {
        const { sn: msgSn, point, fall, breath } = JSON.parse(
          payload.toString(),
        );

        if (msgSn === sn) {
          if (topic.indexOf('downline') !== -1) {
            setOnline(0);
          }
          if (topic.indexOf('upline') !== -1) {
            setOnline(1);
          }
          if (fall) {
            const { a, d, c, r } = fall;
            setState(a);
            setOutdoor(d);
            setCount(c);
            setRoll(r);
            if (r === 1) {
              setRollTime(new Date().getTime());
            }
          }
          if (breath) setBreath(breath.b);

          if (point) {
            const { x, y } = point;
            // x:-200,300
            // y: 600

            setLocation({
              x: 100 * x + 200 + 100,
              y: 100 * y + 100,
            });
          }
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

  // 绘制矩形，绘制点，变形（斜拉）
  // 清除矩形内容，绘制点

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 500, 400);
    draw(ctx, location);
  });

  return (
    <div>
      <Status
        breath={breath}
        state={state}
        online={online}
        count={count}
        roll={roll}
        rollTime={rollTime}
        group={group}
      ></Status>
      <div className={styles.warp}>
        <div className={styles.point}>
          <canvas ref={canvasRef} width={500} height={400} />
          <div className={styles.fall}>
            <IconTitle title="跌到处理记录" img={记录}></IconTitle>
            <div className={styles.list}>
              <Empty />
            </div>
          </div>
        </div>
        <div className={styles.report}>
          <Report></Report>
        </div>
      </div>
      <div>
        <BreifInfo></BreifInfo>
      </div>
    </div>
  );
};

export default connect(({}) => ({}))(Detail);
