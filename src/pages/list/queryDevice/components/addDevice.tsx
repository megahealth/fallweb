/* eslint-disable no-await-in-loop */
import type { FC } from 'react';
import React, { useState, useCallback } from 'react';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import {
  Form,
  Modal,
  Button,
  Input,
  TreeSelect,
  Tabs,
  message,
  Upload,
  List,
  Progress,
  Space,
} from 'antd';
import type { GroupState } from '@/models/connect';
import { createGroupTreeList } from '@/utils/utils';
import XLSX from 'xlsx';
import { UploadOutlined } from '@ant-design/icons';
import { createDevice } from '@/services/device';

const { TabPane } = Tabs;

interface AddDeviceProps {
  dispatch: Dispatch;
  group: GroupState;
}

const BatchAdd = (props) => {
  const { groupList } = props;
  const [list, setList] = useState([]);
  const [progress, setProgress] = useState(0);
  const [value, setValue] = useState(undefined);

  const uploadprops = {
    // 这里我们只接受excel2007以后版本的文件，accept就是指定文件选择框的文件类型
    accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    name: 'file',
    headers: {
      authorization: 'authorization-text',
    },
    showUploadList: false,
    // 把excel的处理放在beforeUpload事件，否则要把文件上传到通过action指定的地址去后台处理
    // 这里我们没有指定action地址，因为没有传到后台
    beforeUpload: (file, fileList) => {
      const rABS = true;
      const f = fileList[0];
      const reader = new FileReader();
      reader.onload = function (e) {
        let data = e.target.result;
        if (!rABS) data = new Uint8Array(data);
        const workbook = XLSX.read(data, {
          type: rABS ? 'binary' : 'array',
        });
        // 假设我们的数据在第一个标签
        const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
        // XLSX自带了一个工具把导入的数据转成json
        const jsonArr = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });
        // 通过自定义的方法处理Json，比如加入state来展示
        // handleImpotedJson(jsonArr.slice(1));
        console.log(jsonArr.slice(1));
        setList(jsonArr.slice(1));
      };
      if (rABS) reader.readAsBinaryString(f);
      else reader.readAsArrayBuffer(f);
      return false;
    },
  };

  const multiUpload = useCallback(async () => {
    if (!value) {
      message.error('请先选择群组');
      return;
    }
    if (list.length === 0) {
      message.error('请上传数据');
      return;
    }
    if (progress > 0) {
      message.error('上传中...');
      return;
    }
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      await createDevice({
        group: value,
        sn: item[0],
        name: item[1],
      });
      // await sleep(200);
      const p = ((i + 1) / list.length) * 100;
      setProgress(p);
    }
  }, [list, value, progress]);

  const onChange = (v) => {
    console.log(v);
    if (v) {
      const id = v.split('-');
      setValue(id[1]);
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <div>
        <TreeSelect
          style={{ width: '100%' }}
          placeholder="请先选择群组"
          treeData={groupList}
          onChange={onChange}
        />
      </div>

      <div>
        <Upload {...uploadprops}>
          <Button icon={<UploadOutlined />}>上传数据</Button>
        </Upload>
        <Button type="link">
          <a
            href="https://file-shc.megahealth.cn/DoOf7CyxjCHd6GAwKse449VeCCXmpChh/device_upload_template.xlsx"
            download="device_upload_template.xlsx"
          >
            下载模板
          </a>
        </Button>
      </div>

      <div style={{ maxHeight: '150px', overflowY: 'scroll' }}>
        <List
          size="small"
          bordered
          dataSource={list}
          renderItem={(item) => (
            <List.Item>
              {item[0]} - {item[1]}
            </List.Item>
          )}
        />
      </div>

      <Progress percent={progress} size="small" />
      <Button onClick={multiUpload}>开始导入</Button>
    </Space>
  );
};

const AddDevice: FC<AddDeviceProps> = ({ dispatch, group }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { groupList: groupData } = group;
  const groupList = createGroupTreeList(groupData);
  const [form] = Form.useForm();
  const [tab, setTab] = useState('single');

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (tab === 'multi') {
      setIsModalVisible(false);
      return;
    }
    form.validateFields().then((value) => {
      console.log(value);
      dispatch({
        type: 'device/createDevice',
        payload: {
          group: value.group.split('-')[1],
          sn: value.sn,
          name: value.name,
        },
      });
      setIsModalVisible(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function callback(key) {
    setTab(key);
  }

  return (
    <>
      <Button type="primary" onClick={showModal}>
        新增
      </Button>
      <Modal title="添加设备" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Tabs defaultActiveKey="single" onChange={callback}>
          <TabPane tab="单个添加" key="single">
            <Form form={form} name="control-ref">
              <Form.Item
                label="设备SN"
                name="sn"
                rules={[{ required: true, message: '请输入设备SN!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="群组" name="group" rules={[{ required: true }]}>
                <TreeSelect treeData={groupList} />
              </Form.Item>
              <Form.Item label="名称" name="name">
                <Input />
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="批量导入" key="multi">
            <BatchAdd groupList={groupList} />
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
};

export default connect(({ group }: { group: GroupState }) => ({
  group,
}))(AddDevice);
