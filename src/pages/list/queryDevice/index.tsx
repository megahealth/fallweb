import React, { FC, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Divider, Table } from 'antd';
import TableComponent from '@/components/tableComponent';
import { ColumnsType } from 'antd/es/table';
import { DeviceState, Loading } from '@/models/connect';
import FilterRegion from './components/filterRegion';
import { QueryDeviceProps } from './queryDevice';

type RecordType = {};

const QueryDevice: FC<QueryDeviceProps> = ({ dispatch, device, loading }) => {
  const { deviceList, count } = device;
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch({
      type: 'device/queryDeviceList',
      payload: {
        start: pageSize * (current - 1),
        limit: pageSize,
      },
    });
  }, [current, pageSize]);

  useEffect(() => {
    dispatch({
      type: 'device/queryDeviceCount',
      payload: {},
    });
  }, []);

  const columns: ColumnsType<RecordType> = [
    {
      title: 'ID',
      dataIndex: 'device_id',
    },
    {
      title: 'SN号',
      key: 'sn',
      dataIndex: 'sn',
    },
    {
      title: '在线状态',
      dataIndex: 'online',
    },
    {
      title: '群组名',
      dataIndex: 'group_name',
      // ellipsis: true,
    },
    {
      title: '群组ID',
      dataIndex: 'group_id',
    },
    {
      title: '设备总数',
      dataIndex: 'count',
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              // setStepFormValues(record);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <a href="">删除</a>
        </>
      ),
    },
  ];

  const onPageChange = (current: number, pageSize: number) => {
    setCurrent(current);
    setPageSize(pageSize);
  };

  const pagination = {
    total: count,
    current,
    pageSize,
    size: 'small',
    onChange: onPageChange,
  };

  return (
    <div style={{ background: '#fff', borderRadius: '10px', padding: '20px' }}>
      <FilterRegion />
      <TableComponent
        columns={columns}
        dataSource={deviceList}
        rowKey="sn"
        loading={loading}
        bordered={true}
        pagination={pagination}
      />
    </div>
  );
};

export default connect(
  ({ device, loading }: { device: DeviceState; loading: Loading }) => ({
    device,
    loading: loading.models.device,
  }),
)(QueryDevice);
