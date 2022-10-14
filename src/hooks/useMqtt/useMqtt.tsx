import { useState, useEffect, useCallback } from 'react';
import type { MqttClient } from 'mqtt';
import mqtt from 'mqtt';
import { message } from 'antd';
import { history } from 'umi';
import { useEventListener } from 'ahooks';

interface Messages {
  topic: string;
  payload: any;
}

const useMqtt = () => {
  const [client, setClient] = useState<MqttClient>();
  const [messages, setMessages] = useState<Messages>();
  const [reconnectTimes, setReconnectTimes] = useState(0);
  const [connectStatus, setConnectStatus] = useState<string>('UnConnected');
  const [visible, setVisible] = useState<boolean>(true);

  useEventListener('visibilitychange', () => {
    console.log(document.visibilityState);
    if (document.visibilityState === 'visible') {
      setVisible(true);
    } else {
      setVisible(true); // 取消隐藏保护（即取消最小化时保持登录状态，不被挤掉）
    }
  });

  const setMqttStatus = useCallback((status: string) => {
    console.log(status);
    setConnectStatus(status);
  }, []);

  useEffect(() => {
    setClient(
      mqtt.connect('wss://mmw-emq-ws.megahealth.cn/mqtt', {
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
          payload: payload,
          topic,
        });
      });
      client.on('close', () => {
        setMqttStatus('Closed');
      });
      client.on('reconnect', () => {
        if (visible) {
          setReconnectTimes(reconnectTimes + 1);
        } else {
          setReconnectTimes(0);
        }
        // setReconnectTimes(reconnectTimes + 1);
      });
      client.on('disconnect', () => {
        setMqttStatus('Disconnected');
      });
      client.on('offline', () => {
        setMqttStatus('Offline');
      });
    }
  }, [visible, client, reconnectTimes, setMqttStatus]);

  useEffect(() => {
    if (visible) {
      if (reconnectTimes > 1) {
        message.error('有人登陆您的账号，已被迫下线！', 5);
        if (client) {
          client.end();
        }
        localStorage.clear();
        history.replace({
          pathname: '/login',
        });
      }
    }
  }, [visible, client, reconnectTimes]);

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
