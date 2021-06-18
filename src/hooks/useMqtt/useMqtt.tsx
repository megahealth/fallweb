import { useState, useEffect, useCallback } from 'react';
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
  const [connectStatus, setConnectStatus] = useState<string>('UnConnected');

  const setMqttStatus = useCallback((status: string) => {
    setConnectStatus(status);
  }, []);

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
        setMqttStatus('Connected');
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
        setMqttStatus('Closed');
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
        setMqttStatus('Disconnected');
      });
      client.on('offline', () => {
        setMqttStatus('Offline');
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
    connectStatus,
  };
};

export default useMqtt;
