import React, { useEffect, useState, useMemo } from 'react';
import { Button, message, Modal, Form, Radio, Space, Tabs, Divider, InputNumber } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { intToBytes, intToBytesBig, caluCRC } from '@/utils/utils';
const { TabPane } = Tabs;
interface PropsType {
  messages: any;
  client: any;
  sn: any;
}

let bedTag: any = []; // 标记床1和床2的顺序
let doorTag: any = []; // 标记门1和门2的顺序
const rules = [{ required: true, message: '请填写数值！' }]; // 通用规则
// let rules_left_right:any = [...rules,{type: 'number',min: -200,max: 200}]
// let rules_up:any = [...rules,{ type: 'number', min: 0, max: 600 }]
const ConfigDataModal = (props: PropsType) => {
  const { client, sn, messages } = props;
  const [formRef] = Form.useForm();
  let [activeKey, setActiveKey] = useState('1');
  let [saveConfigLoading, setSaveConfigLoading] = useState(false);
  let [configDataVisible, setConfigDataVisible] = useState(false);
  let [rules_up, setRules_up] = useState([...rules, { type: 'number', min: 0, max: 600 }]);
  let [rules_left_right, setRules_left_right] = useState([
    ...rules,
    { type: 'number', min: -200, max: 200 },
  ]);
  const [configData, setConfigData] = useState({
    beds: [],
    doors: [],
    installation: 0,
    deviceLeft: 0,
    deviceRight: 0,
    deviceUp: 0,
    deviceHeight: 0,
  });
  const onFinish = (values: any) => {
    const data = JSON.parse(JSON.stringify({ ...configData, ...values }));
    let arr: any = [];
    if (bedTag.indexOf(1) !== -1) {
      arr.push(...intToBytesBig(parseInt(data.beds[bedTag.indexOf(1)].left)));
      arr.push(...intToBytesBig(parseInt(data.beds[bedTag.indexOf(1)].up)));
      arr.push(...intToBytesBig(parseInt(data.beds[bedTag.indexOf(1)].right)));
      arr.push(...intToBytesBig(parseInt(data.beds[bedTag.indexOf(1)].down)));
    } else {
      arr.push(85, 170, 85, 170, 85, 170, 85, 170);
    }
    if (bedTag.indexOf(2) !== -1) {
      arr.push(...intToBytesBig(parseInt(data.beds[bedTag.indexOf(2)].left)));
      arr.push(...intToBytesBig(parseInt(data.beds[bedTag.indexOf(2)].up)));
      arr.push(...intToBytesBig(parseInt(data.beds[bedTag.indexOf(2)].right)));
      arr.push(...intToBytesBig(parseInt(data.beds[bedTag.indexOf(2)].down)));
    } else {
      arr.push(85, 170, 85, 170, 85, 170, 85, 170);
    }
    if (doorTag.indexOf(1) !== -1) {
      arr.push(...intToBytesBig(parseInt(data.doors[doorTag.indexOf(1)].left)));
      arr.push(...intToBytesBig(parseInt(data.doors[doorTag.indexOf(1)].up)));
    } else {
      arr.push(85, 170, 85, 170);
    }
    if (doorTag.indexOf(2) !== -1) {
      arr.push(...intToBytesBig(parseInt(data.doors[doorTag.indexOf(2)].left)));
      arr.push(...intToBytesBig(parseInt(data.doors[doorTag.indexOf(2)].up)));
    } else {
      arr.push(85, 170, 85, 170);
    }
    arr.push(...intToBytesBig(parseInt(data.deviceLeft)));
    arr.push(...intToBytesBig(parseInt(data.deviceRight)));
    arr.push(...intToBytesBig(parseInt(data.deviceUp)));
    arr.push(...intToBytesBig(parseInt(data.deviceHeight)));
    arr.push(data.installation);
    arr.push(...intToBytes(caluCRC(arr, 33)));
    setConfigData(data);
    setSaveConfigLoading(true);
    saveConfigData(arr);
  };

  const onFinishFailed = (data: any) => {
    const errorFields = data.errorFields;
    let errorName = '--';
    switch (errorFields[0].name[0]) {
      case 'beds':
        errorName = '【床】的配置出现错误';
        setActiveKey('1');
        break;
      case 'doors':
        errorName = '【门】的配置出现错误';
        setActiveKey('2');
        break;
      case 'installation':
        errorName = '【安装方式】的配置出现错误';
        setActiveKey('4');
        break;
      case 'deviceLeft':
      case 'deviceRight':
      case 'deviceUp':
      case 'deviceHeight':
        errorName = '【设备】的配置出现错误';
        setActiveKey('3');
        break;
      default:
        break;
    }
    message.error(`${errorName}，${errorFields[0].errors[0]}!`);
  };

  const saveConfigData = (arr: any) => {
    if (client && sn) {
      let uint8Arr = new Uint8Array(arr);
      client.subscribe([`device/environment/${sn}`], { qos: 1 }, (error: any) => {
        if (error) {
          console.log('Unsubscribe error', error);
        }
      });
      client.publish(`/todevice/environment/${sn}`, uint8Arr);
    } else {
      message.error('没有发现连接，无法进行配置！');
      setConfigDataVisible(false);
    }
  };

  const processingData = (payload: any) => {
    bedTag = [];
    doorTag = [];
    const arr: any = [];
    const data: any = {
      beds: [],
      doors: [],
      installation: 0,
      deviceLeft: 0,
      deviceRight: 0,
      deviceUp: 0,
      deviceHeight: 0,
    };
    for (let i = 0; i < payload.length; i += 2) {
      if (i < 32) {
        const low2Bit = payload[i]; // 默认值（无效值：55）
        const height2Bit = payload[i + 1]; // 默认值（无效值：aa）
        const number = height2Bit * 256 + low2Bit; // 默认值（无效值：43605）
        arr.push(number);
      }
    }
    if (arr[0] !== 43605 && arr[1] !== 43605 && arr[2] !== 43605 && arr[3] !== 43605) {
      data.beds.push({ left: arr[0], right: arr[2], up: arr[1], down: arr[3] });
      bedTag.push(1);
    }
    if (arr[4] !== 43605 && arr[5] !== 43605 && arr[6] !== 43605 && arr[7] !== 43605) {
      data.beds.push({ left: arr[4], right: arr[6], up: arr[5], down: arr[7] });
      bedTag.push(2);
    }
    if (arr[8] !== 43605 && arr[9] !== 43605) {
      data.doors.push({ left: arr[8], up: arr[9] });
      doorTag.push(1);
    }
    if (arr[10] !== 43605 && arr[11] !== 43605) {
      data.doors.push({ left: arr[10], up: arr[11] });
      doorTag.push(2);
    }
    if (arr[12] !== 43605 && arr[13] !== 43605 && arr[14] !== 43605 && arr[15] !== 43605) {
      data.deviceLeft = arr[12];
      data.deviceRight = arr[13];
      data.deviceUp = arr[14];
      data.deviceHeight = arr[15];
    }
    data.installation = payload[32];

    return data;
  };

  const checkResult = (payload: any) => {
    if (Object.entries(payload).toString() === Object.entries(configData).toString()) {
      message.success('保存数据成功！');
      setConfigDataVisible(false);
    } else {
      message.success('保存数据失败！');
    }
    setSaveConfigLoading(false);
  };

  useMemo(() => {
    if (messages) {
      const { payload, topic } = messages;
      if (topic.indexOf('device/environment/') != -1) {
        setConfigData(processingData(payload));
        formRef.setFieldsValue(processingData(payload));
        if (saveConfigLoading) {
          checkResult(processingData(payload));
        } else {
          setConfigDataVisible(true);
        }
      }
    }
  }, [messages, sn]);

  const getConfigInfo = () => {
    if (client && sn) {
      client.subscribe([`device/environment/${sn}`], { qos: 1 }, (error: any) => {
        if (error) {
          console.log('Unsubscribe error', error);
        }
      });
      client.publish(`/todevice/g_environment/${sn}`, 'hello');
    } else {
      message.error('没有发现连接，无法进行配置！');
      setConfigDataVisible(false);
    }
  };

  const onFormChangeValues = (changedValues: any, allValues: any) => {
    const { deviceLeft, deviceRight, deviceUp, deviceHeight } = changedValues;
    if (deviceLeft || deviceRight || deviceUp || deviceHeight) {
      const { deviceLeft, deviceRight, deviceUp } = allValues;
      setRules_left_right([...rules, { type: 'number', min: 0 - deviceLeft, max: deviceRight }]);
      setRules_up([...rules, { type: 'number', min: 0, max: deviceUp }]);
    }
  };

  return (
    <>
      <Button type="primary" style={{ marginRight: '20px' }} onClick={getConfigInfo}>
        配置
      </Button>
      <Modal
        title="配置床、门及设备位置信息"
        visible={configDataVisible}
        width={720}
        onCancel={() => {
          setConfigDataVisible(false);
        }}
        footer={null}
      >
        <Form
          name="dynamic_form_nest_item"
          form={formRef}
          onFinish={onFinish}
          autoComplete="off"
          initialValues={configData}
          onValuesChange={onFormChangeValues}
          onFinishFailed={onFinishFailed}
        >
          <Space direction="vertical" style={{ width: '100%', marginBottom: '20px' }}>
            <Tabs
              defaultActiveKey="1"
              activeKey={activeKey}
              onTabClick={(key: string) => {
                setActiveKey(key);
              }}
            >
              <TabPane tab="床" key="1">
                <Form.List name="beds">
                  {(fields, { add, remove }) => {
                    return (
                      <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                          <Space
                            key={key}
                            style={{ display: 'flex', marginBottom: 8 }}
                            align="baseline"
                          >
                            <Divider orientation="left">
                              {bedTag[name] === 1 ? '床1' : '床2'}
                            </Divider>
                            <Form.Item
                              {...restField}
                              name={[name, 'left']}
                              fieldKey={[fieldKey, 'left']}
                              label="左"
                              rules={rules_left_right}
                            >
                              <InputNumber />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, 'right']}
                              fieldKey={[fieldKey, 'right']}
                              label="右"
                              rules={rules_left_right}
                            >
                              <InputNumber />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, 'up']}
                              fieldKey={[fieldKey, 'up']}
                              label="上"
                              rules={rules_up}
                            >
                              <InputNumber />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, 'down']}
                              fieldKey={[fieldKey, 'down']}
                              label="下"
                              rules={rules_up}
                            >
                              <InputNumber />
                            </Form.Item>
                            <MinusCircleOutlined
                              onClick={() => {
                                bedTag.splice(name, 1);
                                remove(name);
                              }}
                            />
                          </Space>
                        ))}
                        {fields.length > 1 ? null : (
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => {
                                bedTag.push(bedTag[0] === 1 ? 2 : 1);
                                add();
                              }}
                              block
                              icon={<PlusOutlined />}
                            >
                              添加床位
                            </Button>
                          </Form.Item>
                        )}
                      </>
                    );
                  }}
                </Form.List>
              </TabPane>
              <TabPane tab="门" key="2">
                <Form.List name="doors">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, fieldKey, ...restField }) => (
                        <Space
                          key={key}
                          style={{ display: 'flex', marginBottom: 8 }}
                          align="baseline"
                        >
                          <Divider orientation="left">
                            {doorTag[name] === 1 ? '门1' : '门2'}
                          </Divider>
                          <Form.Item
                            label="左"
                            {...restField}
                            name={[name, 'left']}
                            fieldKey={[fieldKey, 'left']}
                            rules={rules_left_right}
                          >
                            <InputNumber />
                          </Form.Item>
                          <Form.Item
                            label="上"
                            {...restField}
                            name={[name, 'up']}
                            fieldKey={[fieldKey, 'up']}
                            rules={rules_up}
                          >
                            <InputNumber />
                          </Form.Item>
                          <MinusCircleOutlined
                            onClick={() => {
                              doorTag.splice(name, 1);
                              remove(name);
                            }}
                          />
                        </Space>
                      ))}
                      {fields.length > 1 ? null : (
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => {
                              doorTag.push(doorTag[0] === 1 ? 2 : 1);
                              add();
                            }}
                            block
                            icon={<PlusOutlined />}
                          >
                            添加门
                          </Button>
                        </Form.Item>
                      )}
                    </>
                  )}
                </Form.List>
              </TabPane>
              <TabPane tab="设备" key="3">
                <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    label="左"
                    name="deviceLeft"
                    rules={[...rules, { type: 'number', min: 0, max: 200 }]}
                  >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item
                    label="右"
                    name="deviceRight"
                    rules={[...rules, { type: 'number', min: 0, max: 200 }]}
                  >
                    <InputNumber />
                  </Form.Item>
                </Space>
                <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    label="上"
                    name="deviceUp"
                    rules={[...rules, { type: 'number', min: 0, max: 600 }]}
                  >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item
                    label="高"
                    name="deviceHeight"
                    rules={[...rules, { type: 'number', min: 0, max: 300 }]}
                  >
                    <InputNumber />
                  </Form.Item>
                </Space>
              </TabPane>
              <TabPane tab="安装方式" key="4">
                <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item label="安装方式" name="installation" rules={rules}>
                    <Radio.Group>
                      <Radio.Button value={0}>壁挂</Radio.Button>
                      <Radio.Button value={1}>吸顶</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </Space>
              </TabPane>
            </Tabs>
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

export default ConfigDataModal;
