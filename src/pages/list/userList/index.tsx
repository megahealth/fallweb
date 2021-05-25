import React, { FC, useEffect, useState } from 'react';
import { connect } from 'umi';
import { Divider, Popconfirm, Form, Modal, Input, TreeSelect } from 'antd';
import TableComponent from '@/components/tableComponent';
import { ColumnsType } from 'antd/es/table';
import { UserState, GroupState, Loading } from '@/models/connect';
import FilterRegion from './components/filterRegion';
import { QueryUserProps } from './userList';
import styles from './index.less';
import AddUser from './components/addUser';
import { createGroupTreeList } from '@/utils/utils';

type RecordType = {};

const UserList: FC<QueryUserProps> = ({ dispatch, user, group, loading }) => {
  const { userSource, count, limit, start } = user;
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editId, setEditId] = useState(0);

  const { groupList: groupData } = group;
  const groupList = createGroupTreeList(groupData);

  useEffect(() => {
    dispatch({
      type: 'user/queryUserList',
    });

    dispatch({
      type: 'user/queryUserCount',
      payload: {},
    });

    dispatch({
      type: 'group/queryGroupList',
      payload: {},
    });
  }, []);

  const columns: ColumnsType<RecordType> = [
    {
      title: 'ID',
      key: 'user_id',
      dataIndex: 'user_id',
    },
    {
      title: '用户名',
      dataIndex: 'name',
    },
    {
      title: '群组',
      dataIndex: 'group_name',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render: (_, record) => {
        return record.sex === 1 ? '男' : '女';
      },
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              let parent_id;
              const getParentIdBySubId = (root, subId) => {
                if (root.sub_id == subId) {
                  parent_id = root.parent_id;
                } else {
                  for (let i = 0; i < root.children.length; i++) {
                    const element = root.children[i];
                    getParentIdBySubId(element, subId);
                  }
                }
              };

              getParentIdBySubId(groupList[0], record.group_id);

              // form.resetFields();
              form.setFieldsValue({
                name: record.name,
                password: '',
                group: parent_id + '-' + record.group_id,
              });

              setEditId(record.user_id);

              setIsModalVisible(true);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定要删除此用户么?"
            onConfirm={() => {
              dispatch({
                type: 'user/deleteUser',
                payload: {
                  id: record.user_id,
                },
              });
            }}
            okText="确定"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  const onPageChange = (current: number, pageSize: number) => {
    dispatch({
      type: 'user/pageChange',
      payload: {
        start: pageSize * (current - 1),
        limit: pageSize,
      },
    });
  };

  const pagination = {
    total: count,
    current: Math.floor(start / limit) + 1,
    pageSize: limit,
    size: 'small',
    onChange: onPageChange,
  };

  const handleOk = () => {
    form.validateFields().then(value => {
      dispatch({
        type: 'user/updateUser',
        payload: {
          group: value.group.split('-')[1],
          name: value.name,
          password: value.password,
          id: editId,
        },
      });
      setIsModalVisible(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <FilterRegion />
        <AddUser />
      </div>
      <TableComponent
        columns={columns}
        dataSource={userSource}
        rowKey="user_id"
        bordered={true}
        loading={loading}
        pagination={pagination}
      />
      <Modal
        title="更新用户"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form
          preserve={false}
          form={form}
          // initialValues={{ name: '', group: '' }}
        >
          <Form.Item
            label="用户名"
            name="name"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="新密码"
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
    </div>
  );
};

export default connect(
  ({
    user,
    group,
    loading,
  }: {
    user: UserState;
    group: GroupState;
    loading: Loading;
  }) => ({
    user,
    group,
    loading: loading.models.user,
  }),
)(UserList);
