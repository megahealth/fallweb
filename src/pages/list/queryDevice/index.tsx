import React, { FC, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Divider, Popconfirm, Form, Modal, Input, TreeSelect } from 'antd';
import TableComponent from '@/components/tableComponent';
import { ColumnsType } from 'antd/es/table';
import { DeviceState, GroupState, Loading } from '@/models/connect';
import FilterRegion from './components/filterRegion';
import { QueryDeviceProps } from './queryDevice';
import moment from 'moment';
import styles from './index.less';
import AddDevice from './components/addDevice';
import { createGroupTreeList } from '@/utils/utils';

type RecordType = {
  device_id: number;
  sn: string;
  name: string;
  group_id: number;
};

const QueryDevice: FC<QueryDeviceProps> = ({
  dispatch,
  device,
  group,
  loading,
}) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editId, setEditId] = useState(0);

  const { deviceList, count, limit, start } = device;
  const { groupList: groupData } = group;
  const groupList = createGroupTreeList(groupData);

  useEffect(() => {
    dispatch({
      type: 'device/queryDeviceList',
    });

    dispatch({
      type: 'device/queryDeviceCount',
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
      dataIndex: 'device_id',
    },
    {
      title: '名称',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: 'SN号',
      key: 'sn',
      dataIndex: 'sn',
    },
    {
      title: '群组',
      dataIndex: 'group_name',
    },
    {
      title: 'WIFI',
      dataIndex: 'wifi',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
    },
    {
      title: '版本',
      dataIndex: 'version',
    },
    {
      title: '添加时间',
      dataIndex: 'create_at',
      render: (value, record) => {
        return moment(value).format('YYYY-MM-DD');
      },
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
                sn: record.sn,
                name: record.name,
                group: parent_id + '-' + record.group_id,
              });

              setEditId(record.device_id);

              setIsModalVisible(true);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定要删除此设备么?"
            onConfirm={() => {
              // console.log(record);
              dispatch({
                type: 'device/deleteDevice',
                payload: {
                  id: record.device_id,
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
      type: 'device/pageChange',
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
        type: 'device/updateDevice',
        payload: {
          group: value.group.split('-')[1],
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
        <FilterRegion />
        <AddDevice />
      </div>
      <TableComponent
        columns={columns}
        dataSource={deviceList}
        rowKey="sn"
        loading={loading}
        bordered={true}
        pagination={pagination}
      />
      <Modal
        title="更新设备"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form preserve={false} form={form}>
          <Form.Item
            label="设备SN"
            name="sn"
            rules={[{ required: true, message: '请输入设备SN!' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item label="群组" name="group" rules={[{ required: true }]}>
            <TreeSelect treeData={groupList} />
          </Form.Item>
          <Form.Item label="名称" name="name">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default connect(
  ({
    device,
    group,
    loading,
  }: {
    device: DeviceState;
    group: GroupState;
    loading: Loading;
  }) => ({
    device,
    group,
    loading: loading.models.device,
  }),
)(QueryDevice);
