import { useState, useEffect } from 'react';
import mqtt, { MqttClient } from 'mqtt';
import { message } from 'antd';
import { history } from 'umi';

interface Messages {
  topic: string;
  payload: string;
}

const useMqtt = () => {
  const [client, setClient] = useState<MqttClient>();
  const [messages, setMessages] = useState<Messages>();
  const [reconnectTimes, setReconnectTimes] = useState(0);

  useEffect(() => {
    setClient(
      mqtt.connect('wss://wss8084.megahealth.cn/mqtt', {
        clean: true,
        keepalive: 10,
        connectTimeout: 4000,
        clientId: `${localStorage.getItem('user_id')}`,
        username: `user_${localStorage.getItem('name')}`,
        reconnectPeriod: 1000,
        protocolVersion: 5,
      }),
    );
  }, []);

  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        console.log('connect');
      });
      client.on('error', (err) => {
        console.log(err);
      });
      client.on('message', (topic, payload) => {
        setMessages({
          payload: payload.toString(),
          topic,
        });
      });
      client.on('close', () => {
        console.log('close');
      });
      client.on('reconnect', () => {
        setReconnectTimes((times) => times + 1);
        if (reconnectTimes > 3) {
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
      client.on('disconnect', () => {
        console.log('disconnect');
      });
      client.on('offline', () => {
        console.log('offline');
      });
    }
  }, [client, reconnectTimes]);

  useEffect(() => {
    return () => {
      if (client) {
        client.end();
      }
    };
  }, [client]);

  return {
    client,
    messages,
  };
};

export default useMqtt;
