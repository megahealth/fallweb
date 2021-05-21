import React, { FC, useState } from 'react';
import { connect, Dispatch } from 'umi';
import { Form, Modal, Button, Input, TreeSelect } from 'antd';
import { GroupState, Loading } from '@/models/connect';
import { createGroupTreeList } from '@/utils/utils';

interface AddDeviceProps {
  dispatch: Dispatch;
  group: GroupState;
}

const AddDevice: FC<AddDeviceProps> = ({ dispatch, group }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { groupList: groupData } = group;
  const groupList = createGroupTreeList(groupData);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(value => {
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

  return (
    <>
      <Button type="primary" onClick={showModal}>
        新增
      </Button>
      <Modal
        title="添加设备"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
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
      </Modal>
    </>
  );
};

export default connect(({ group }: { group: GroupState }) => ({
  group,
}))(AddDevice);
