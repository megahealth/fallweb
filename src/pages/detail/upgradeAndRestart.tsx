import React, { useEffect, useState, useMemo } from 'react';
import { Button, Select, Popconfirm, message, Modal, Progress } from 'antd';
import { getSDKs } from '@/services/sdks';

const { Option } = Select;
const UpgradeAndRestart = (props: any) => {
  const { messages, client, sn } = props;
  const [restartVisible, setRestartVisible] = useState(false);
  const [restartLoading, setRestartLoading] = useState(false);
  const [restartResult, setRestartResult] = useState(false);
  const [upgradeVisible, setUpgradeVisible] = useState(false);
  const [upgradeStatus, setUpgradeStatus] = useState(0);
  const [upgradeProgress, setUpgradeProgress] = useState(-1);
  const [versionList, setVersionList] = useState([]);
  const [selectValue, setSelectValue] = useState(undefined);
  useEffect(() => {});
  useMemo(() => {
    if (messages) {
      const { payload } = messages;
      const { restart, ota } = JSON.parse(payload);
      if (restart == 0) {
        setRestartVisible(false);
        setRestartLoading(false);
        setRestartResult(true);
      }
      if (ota) {
        setUpgradeProgress(ota.p || 0);
        setUpgradeStatus(ota.s || 0);
      }
    }
  }, [messages, sn]);

  useEffect(() => {
    if (restartResult) {
      message.success('即将重启...');
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
    console.log('fadfadfa', sn);

    if (client && sn) {
      setUpgradeProgress(0);
      client.subscribe([`device/ota/${sn}`], { qos: 1 }, (error: any) => {
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
    if (client && sn) {
      setRestartLoading(true);
      client.subscribe([`device/restart/${sn}`], { qos: 1 }, (error: any) => {
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
    <div style={{ float: 'right' }}>
      <Button type="primary" style={{ marginRight: '20px' }} onClick={openModal}>
        升级
      </Button>
      <Popconfirm
        title="确定要重启设备吗？"
        visible={restartVisible}
        onConfirm={restartDevice}
        okButtonProps={{ loading: restartLoading }}
        onCancel={() => {
          setRestartVisible(false);
        }}
      >
        <Button
          type="primary"
          danger
          onClick={() => {
            setRestartVisible(true);
          }}
        >
          重启
        </Button>
      </Popconfirm>
      <Modal
        title="选择升级的固件版本，并进行升级。"
        visible={upgradeVisible}
        onCancel={() => {
          setUpgradeVisible(false);
        }}
        footer={null}
      >
        <div style={{ marginBottom: '40px', marginTop: '20px' }}>
          <div
            style={{
              marginBottom: '30px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <label>版本：</label>
            <Select
              style={{ width: 220 }}
              value={selectValue}
              onChange={(e) => {
                setSelectValue(e);
              }}
              disabled={!(upgradeProgress == -1 || upgradeProgress == 100)}
              allowClear
            >
              {versionList.map((item: any, index: number) => {
                return (
                  <Option key={index} value={item.url}>
                    {item.version}
                  </Option>
                );
              })}
            </Select>
            <Button
              type="primary"
              style={{ marginLeft: '20px' }}
              onClick={upgradeSDK}
              disabled={!selectValue || !(upgradeProgress == -1 || upgradeProgress == 100)}
            >
              升级
            </Button>
          </div>
          {upgradeProgress != -1 ? (
            <div
              style={{
                marginBottom: '30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {upgradeStatus == 0 || upgradeStatus == 1 ? (
                <Progress
                  type="circle"
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                  status="normal"
                  percent={upgradeProgress}
                />
              ) : (
                <Progress type="circle" status="exception" percent={upgradeProgress} />
              )}
            </div>
          ) : null}
        </div>
      </Modal>
    </div>
  );
};

export default UpgradeAndRestart;
