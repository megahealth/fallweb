import React, { useState, useEffect, useMemo } from 'react';
import type { MqttClient } from 'mqtt';
import mqtt from 'mqtt';
import { message } from 'antd';
import { history } from 'umi';

interface Messages {
  topic: string;
  payload: string;
}

const useMqtt = () => {
  const [client, setClient] = useState<MqttClient>();
  const [messages, setMessages] = useState<Messages>();
  const [reconnectTimes, setReconnectTimes] = useState([]);

  useEffect(() => {
    setClient(mqtt.connect('wss://wss8084.megahealth.cn/mqtt', {
      clean: true,
      keepalive: 10,
      connectTimeout: 4000,
      clientId: `${localStorage.getItem('user_id')}`,
      username: `user_${localStorage.getItem('name')}`,
      reconnectPeriod: 1000,
      protocolVersion: 5,
    }));
  }, []);


  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        console.log('connect')
      });
      client.on('error', err => {
        console.log(err);
      });
      client.on('message', (topic, payload) => {
        setMessages({
          payload: payload.toString(),
          topic
        });
      });
      client.on('close', () => {
        console.log('close')
      });
      client.on('reconnect', () => {
        const now = new Date().getTime();
        setReconnectTimes((times) => times.push(now));
        const last3 = reconnectTimes[reconnectTimes.length - 3];
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
      client.on('disconnect', () => {
        console.log('disconnect');
      });
      client.on('offline', () => {
        console.log('offline')
      });
    }
  }, [client]);

  useEffect(() => {
    return () => {
      if (client) {
        client.end();
      }
    };
  }, [client])

  return {
    client,
    messages,
  };
}

export default useMqtt;