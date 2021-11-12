import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Divider, Popconfirm, Form, Modal, Input, TreeSelect, Button, Switch } from 'antd';
import TableComponent from '@/components/tableComponent';
import type { ColumnsType } from 'antd/es/table';
import type { DeviceState, GroupState, Loading } from '@/models/connect';
import FilterRegion from './components/filterRegion';
import type { QueryDeviceProps } from './queryDevice';
import moment from 'moment';
import styles from './index.less';
import AddDevice from './components/addDevice';
import { createGroupTreeList } from '@/utils/utils';

type RecordType = {
  device_id: number;
  sn: string;
  name: string;
  group_id: number;
  sleep_on: number;
};

const QueryDevice: FC<QueryDeviceProps> = ({ dispatch, device, group, loading }) => {
  const [form] = Form.useForm();
  const [sn, setSn] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editId, setEditId] = useState(0);
  const [isShowSleepOnSwitch, setIsShowSleepOnSwitch] = useState(false);

  const { deviceList, count, limit, start } = device;
  const { groupList: groupData } = group;
  const groupList = createGroupTreeList(groupData);

  useEffect(() => {
    dispatch({
      type: 'device/queryDeviceList',
      payload: {
        sn,
      },
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
      title: '群组ID',
      dataIndex: 'group_id',
    },
    {
      title: '睡眠监测',
      dataIndex: 'sleep_on',
      render: (value, record) => {
        return value == 1 ? '已开启' : '未开启';
      },
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
                group: `${parent_id}-${record.group_id}`,
                sleep_on: record.sleep_on,
              });
              setEditId(record.device_id);
              if (record.sn.indexOf('J01MD') != -1) {
                setIsShowSleepOnSwitch(true);
              } else {
                setIsShowSleepOnSwitch(false);
              }
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
        sn,
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
    form.validateFields().then((value) => {
      dispatch({
        type: 'device/updateDevice',
        payload: {
          group: value.group.split('-')[1],
          name: value.name,
          sleep_on: value.sleep_on ? true : false,
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
        <Input
          value={sn}
          onChange={(v) => {
            setSn(v.target.value);
          }}
          placeholder="请输入 SN 搜索"
          style={{ width: 200 }}
        />
        <div>
          <Button
            type="primary"
            style={{ marginRight: '10px' }}
            onClick={() => {
              dispatch({
                type: 'device/queryDeviceList',
                payload: {
                  sn,
                },
              });
            }}
          >
            查询
          </Button>
          {localStorage.getItem('group_id') === '1' ? <AddDevice /> : null}
        </div>
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
          {isShowSleepOnSwitch ? (
            <Form.Item label="睡眠监测" name="sleep_on" valuePropName="checked">
              <Switch />
            </Form.Item>
          ) : null}
        </Form>
      </Modal>
    </div>
  );
};

export default connect(
  ({ device, group, loading }: { device: DeviceState; group: GroupState; loading: Loading }) => ({
    device,
    group,
    loading: loading.models.device,
  }),
)(QueryDevice);
