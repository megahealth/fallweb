import React, { FC, useState } from 'react';
import { connect, Dispatch } from 'umi';
import { Form, Modal, Button, Input, TreeSelect } from 'antd';
import { GroupState, Loading } from '@/models/connect';
import { createGroupTreeList } from '@/utils/utils';

interface AddGroupProps {
  dispatch: Dispatch;
  group: GroupState;
}

const AddGroup: FC<AddGroupProps> = ({ dispatch, group }) => {
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
        type: 'group/createGroup',
        payload: {
          parent_group: value.group.split('-')[1],
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
        title="添加群组"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} name="control-ref">
          <Form.Item
            label="群组名称"
            name="name"
            rules={[{ required: true, message: '请输入群组名称!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="上级群组" name="group" rules={[{ required: true }]}>
            <TreeSelect treeData={groupList} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default connect(({ group }: { group: GroupState }) => ({
  group,
}))(AddGroup);
