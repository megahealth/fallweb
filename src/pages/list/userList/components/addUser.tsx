import React, { FC, useState } from 'react';
import { connect, Dispatch } from 'umi';
import { Form, Modal, Button, Input, TreeSelect } from 'antd';
import { GroupState, Loading } from '@/models/connect';
import { createGroupTreeList } from '@/utils/utils';

interface AddUserProps {
  dispatch: Dispatch;
  group: GroupState;
}

const AddUser: FC<AddUserProps> = ({ dispatch, group }) => {
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
        type: 'user/createUser',
        payload: {
          group: value.group.split('-')[1],
          name: value.name,
          password: value.password,
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
        title="添加用户"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} name="control-ref">
          <Form.Item
            label="用户名"
            name="name"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="群组" name="group" rules={[{ required: true }]}>
            <TreeSelect treeData={groupList} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default connect(({ group }: { group: GroupState }) => ({
  group,
}))(AddUser);
