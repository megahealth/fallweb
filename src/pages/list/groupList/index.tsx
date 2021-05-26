import React, { FC, useEffect, useState } from 'react';
import { Divider, Button, Popconfirm, Form, Modal, Input } from 'antd';
import { connect } from 'umi';
import TableComponent from '@/components/tableComponent';
import { ColumnsType } from 'antd/es/table';
import { GroupState, Loading } from '@/models/connect';
import { QueryGroupProps } from './queryGroup';
import styles from './index.less';
import AddGroup from './components/addGroup';
import { SearchOutlined } from '@ant-design/icons';

type RecordType = {};

const QueryGroup: FC<QueryGroupProps> = ({ dispatch, group, loading }) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editId, setEditId] = useState(0);

  const { groupList, count, limit, start } = group;
  console.log(group);
  // const groupList = createGroupTreeList(groupData);

  useEffect(() => {
    dispatch({
      type: 'group/queryGroupList',
    });

    // dispatch({
    //   type: 'group/getGroupCount',
    // });
  }, []);

  const columns: ColumnsType<RecordType> = [
    {
      title: 'ID',
      // key: 'sub_id',
      dataIndex: 'sub_id',
    },
    {
      title: '群组名称',
      dataIndex: 'sub_name',
    },
    {
      title: '上级群组',
      dataIndex: 'parent_name',
    },
    {
      title: '设备总数',
      dataIndex: 'dev_cnt',
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              form.setFieldsValue({
                name: record.sub_name,
              });

              setEditId(record.sub_id);
              setIsModalVisible(true);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定要删除此群组么?"
            onConfirm={() => {
              dispatch({
                type: 'group/deleteGroup',
                payload: {
                  id: record.sub_id,
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
      type: 'group/pageChange',
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
        type: 'group/updateGroup',
        payload: {
          name: value.name,
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
        {/* <FilterRegion /> */}
        <div style={{ marginBottom: 24 }}>
          <Input
            placeholder="请输入搜索内容"
            style={{ width: 200 }}
            suffix={<SearchOutlined />}
          />
          <Button type="primary" style={{ marginLeft: 24 }}>
            查询
          </Button>
        </div>
        <AddGroup />
      </div>
      <TableComponent
        columns={columns}
        dataSource={groupList.children}
        rowKey="sub_id"
        bordered={true}
        loading={loading}
        pagination={pagination}
      />
      <Modal
        title="更新群组"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form preserve={false} form={form}>
          <Form.Item
            label="群组名称"
            name="name"
            rules={[{ required: true, message: '请输入群组名称!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default connect(
  ({ group, loading }: { group: GroupState; loading: Loading }) => ({
    group,
    loading: loading.models.group,
  }),
)(QueryGroup);
