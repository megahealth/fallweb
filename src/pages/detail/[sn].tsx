import React, { useRef, useState, useEffect } from 'react';
import { connect, Dispatch, Link } from 'umi';
import mqtt, { MqttClient } from 'mqtt';
import styles from './index.less'
import Status from './status'

export interface DetailProps {
  dispatch: Dispatch;
  loading: boolean;
}

function draw(ctx, location) {
  ctx.save();

  ctx.fillStyle = 'white';
  ctx.shadowColor = '#ccc';
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.shadowBlur = 2;
  // ctx.rotate(30 * Math.PI / 180);
  // ctx.transform(0.3,0.5,1,0,0,0);
  ctx.fillRect(100, 100, 500, 600);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = '#ddd';
  ctx.fillRect(280, 100, 40, 40);
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(location.x, location.y, 8, 0, Math.PI * 2, true); // 绘制
  ctx.fillStyle = '#5dc394';
  ctx.strokeStyle = "#5dc394"
  ctx.shadowColor = '#5dc394';
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 20;
  ctx.fill()
  ctx.stroke();
  ctx.restore();

  ctx.beginPath();
  ctx.strokeStyle = '#5dc394';
  ctx.moveTo(location.x, location.y);
  ctx.lineTo(location.x, location.y-50);
  ctx.stroke();

  ctx.save();
  ctx.fillStyle = '#5dc394';
  ctx.fillRect(location.x-40, location.y-50, 40, 20);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.fillText("目标",location.x-30,location.y-37);
  // ctx.transform(0.3,0.5,1,0,location.x,location.y);
  ctx.restore();


  // ctx.save();
  // ctx.restore();
  // ctx.rotate(30 * Math.PI / 180);

}

const Detail = (props) => {

  const { sn } = props.match.params;
  const { group } = props.location.query;
  localStorage.setItem('sn', sn);
  const canvasRef = useRef(null)
  const [location, setLocation] = React.useState({x:350,y:400})
  const [client, setClient] = useState<MqttClient>();
  const data = localStorage.getItem('data');
  const { 
    action_state,
    breath: localbreath,
    count: localcount,
    device_id,
    group_id,
    group_name,
    last_roll_time,
    name,
    online: localonline,
    outdoor: localoutdoor,
    roll: localroll,
    update_at
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
        console.log('connect')
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
        const { sn: msgSn, point, fall, breath } = JSON.parse(payload.toString());

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
        }
        if (breath) setBreath(breath.b);

        if(point) {
          const {x,y} = point;
          // x:-200,300
          // y: 600
          if(msgSn===sn) {
            setLocation({
              x: 100*x+200+100,
              y: 100*y+100
            });
          }
        }

      });
      client.on('close', () => {
      });
      client.on('disconnect', packet => {
        console.log(packet);
      });
      client.on('offline', () => {
      });
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
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0,0,700,800);
    draw(ctx, location)
  })

  return (
    <div>
      <Status
        breath={breath}
        state={state}
        online={online}
        count={count}
        roll={roll}
        last_roll_time={rollTime}
      ></Status>
      <div className={styles.point}>
        <canvas
          ref={canvasRef}
          width={700}
          height={800}
          onClick={e => {
            const newLocation = { x: e.clientX-225, y: e.clientY-80 }
            setLocation(newLocation)
          }}
        />
      </div>
      <Link to={`/report/${sn}`}>
        查看完整报告
      </Link>
    </div>
    
  )
}

export default connect(({

}) => ({

}))(Detail);