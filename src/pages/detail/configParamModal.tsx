import React, { useEffect, useState, useMemo } from 'react';
import { Button, message, Modal, Form, Space, InputNumber } from 'antd';
import { intToBytes, intToBytesBig, caluCRC } from '@/utils/utils';

interface PropsType {
  messages: any;
  client: any;
  sn: any;
}

interface ParaDataType {
  presenceBurnIn: number;
  sitToFallBurnIn: number;
  halfToFallBurnIn: number;
  peopleCountThreshold: number;
  onBedExceptionBurnIn: number;
}

let timeout: any = null;
const rules: any = [{ required: true, message: '请填写数值！' }]; // 通用规则
const ConfigParamModal = (props: PropsType) => {
  const { client, sn, messages } = props;
  const [formRef] = Form.useForm();
  let [saveConfigLoading, setSaveConfigLoading] = useState(false);
  let [configParamVisible, setConfigParamVisible] = useState(false);
  let [openModalLoading, setOpenModalLoading] = useState(false);
  const [configParamData, setConfigParamData] = useState({
    presenceBurnIn: 0,
    sitToFallBurnIn: 0,
    halfToFallBurnIn: 0,
    peopleCountThreshold: 5,
    onBedExceptionBurnIn: 0,
  });
  const onFinish = (values: any) => {
    const data = JSON.parse(JSON.stringify({ ...configParamData, ...values }));
    let arr: any = [];
    arr.push(...intToBytesBig(parseInt(data.presenceBurnIn), 4));
    arr.push(...intToBytesBig(parseInt(data.sitToFallBurnIn), 4));
    arr.push(...intToBytesBig(parseInt(data.halfToFallBurnIn), 4));
    arr.push(...intToBytesBig(parseInt(data.peopleCountThreshold), 4));
    arr.push(...intToBytesBig(parseInt(data.onBedExceptionBurnIn), 4));
    arr.push(...intToBytes(caluCRC(arr, 20)));
    setConfigParamData(data);
    setSaveConfigLoading(true);
    saveConfigData(arr);
  };

  const saveConfigData = (arr: any) => {
    if (client && sn) {
      let uint8Arr = new Uint8Array(arr);
      client.subscribe([`device/param/${sn}`], { qos: 1 }, (error: any) => {
        if (error) {
          console.log('Unsubscribe error', error);
        }
      });
      client.publish(`/todevice/param/${sn}`, uint8Arr);
    } else {
      message.error('没有发现连接，无法进行设置！');
      setConfigParamVisible(false);
    }
  };

  const processingData = (payload: any) => {
    const arr: any = [];
    const data: ParaDataType = {
      presenceBurnIn: 0,
      sitToFallBurnIn: 0,
      halfToFallBurnIn: 0,
      peopleCountThreshold: 5,
      onBedExceptionBurnIn: 0,
    };
    for (let i = 0; i < payload.length; i += 4) {
      if (i < 20) {
        const value =
          payload[i + 3] * 0x1000000 +
          payload[i + 2] * 0x10000 +
          payload[i + 1] * 0x100 +
          payload[i];
        arr.push(value);
      }
    }
    data.presenceBurnIn = arr[0];
    data.sitToFallBurnIn = arr[1];
    data.halfToFallBurnIn = arr[2];
    data.peopleCountThreshold = arr[3];
    data.onBedExceptionBurnIn = arr[4];
    return data;
  };

  const checkResult = (payload: any) => {
    if (Object.entries(payload).toString() === Object.entries(configParamData).toString()) {
      message.success('保存数据成功！');
      setConfigParamVisible(false);
    } else {
      message.success('保存数据失败！');
    }
    setSaveConfigLoading(false);
  };

  useMemo(() => {
    if (messages) {
      const { payload, topic } = messages;
      if (topic.indexOf('device/param/') != -1) {
        setConfigParamData(processingData(payload));
        formRef.setFieldsValue(processingData(payload));
        if (saveConfigLoading) {
          checkResult(processingData(payload));
        }
        if (openModalLoading) {
          if (timeout) clearTimeout(timeout);
          setConfigParamVisible(true);
          setOpenModalLoading(false);
        }
      }
    }
  }, [messages, sn]);

  const getConfigInfo = () => {
    if (client && sn) {
      client.subscribe([`device/param/${sn}`], { qos: 1 }, (error: any) => {
        if (error) {
          console.log('Unsubscribe error', error);
        }
      });
      client.publish(`/todevice/g_param/${sn}`, 'hello');
      setOpenModalLoading(true);
      timeout = setTimeout(() => {
        setOpenModalLoading(false);
        message.error('连接响应超时，无法进行设置！');
      }, 3000);
    } else {
      message.error('没有发现连接，无法进行设置！');
      setConfigParamVisible(false);
    }
  };
  return (
    <>
      <Button
        type="primary"
        style={{ marginRight: '20px' }}
        onClick={getConfigInfo}
        loading={openModalLoading}
      >
        设置
      </Button>
      <Modal
        title="设置设备相关信息"
        visible={configParamVisible}
        width={720}
        onCancel={() => {
          setConfigParamVisible(false);
        }}
        footer={null}
      >
        <Form
          name="dynamic_form_nest_item"
          form={formRef}
          onFinish={onFinish}
          autoComplete="off"
          initialValues={configParamData}
        >
          <Space direction="vertical" style={{ width: '100%', marginBottom: '20px' }}>
            <Form.Item
              label="人数门限"
              name="peopleCountThreshold"
              rules={[...rules, { type: 'number', min: 1, max: 5 }]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="无人老化时间(分钟)"
              name="presenceBurnIn"
              rules={[...rules, { type: 'number', min: 0 }]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="在床异常老化时间(分钟)"
              name="onBedExceptionBurnIn"
              rules={[...rules, { type: 'number', min: 0 }]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="坐姿跌倒老化时间(分钟)"
              name="sitToFallBurnIn"
              rules={[...rules, { type: 'number', min: 0 }]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="低姿态跌倒老化时间(分钟)"
              name="halfToFallBurnIn"
              rules={[...rules, { type: 'number', min: 0 }]}
            >
              <InputNumber />
            </Form.Item>
          </Space>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saveConfigLoading}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ConfigParamModal;
