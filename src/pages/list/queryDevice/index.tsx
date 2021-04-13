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
      title: 'device_id',
      dataIndex: 'device_id',
    },
    {
      title: 'sn',
      key: 'sn',
      dataIndex: 'sn',
    },
    {
      title: 'online',
      dataIndex: 'online',
    },
    {
      title: 'group_name',
      dataIndex: 'group_name',
      // ellipsis: true,
    },
    {
      title: 'group_id',
      dataIndex: 'group_id',
    },
    {
      title: 'count',
      dataIndex: 'count',
    },
    {
      title: 'drop',
      dataIndex: 'drop',
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
    onChange: onPageChange,
  };

  return (
    <div>
      <FilterRegion />
      <TableComponent
        columns={columns}
        dataSource={deviceList}
        rowKey="sn"
        loading={loading}
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
