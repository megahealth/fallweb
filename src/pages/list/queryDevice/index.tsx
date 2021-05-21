import React, { FC, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Divider, Button } from 'antd';
import TableComponent from '@/components/tableComponent';
import { ColumnsType } from 'antd/es/table';
import { DeviceState, Loading } from '@/models/connect';
import FilterRegion from './components/filterRegion';
import { QueryDeviceProps } from './queryDevice';
import moment from 'moment';
import styles from './index.less';
import AddDevice from './components/addDevice';

type RecordType = {};

const QueryDevice: FC<QueryDeviceProps> = ({
  dispatch,
  device,
  group,
  loading,
}) => {
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
    // {
    //   title: '在线状态',
    //   dataIndex: 'online',
    // },
    {
      title: '群组',
      dataIndex: 'group_name',
      // ellipsis: true,
    },
    {
      title: 'WIFI',
      dataIndex: 'wifi',
      // ellipsis: true,
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      // ellipsis: true,
    },
    {
      title: '版本',
      dataIndex: 'version',
      // ellipsis: true,
    },
    {
      title: '添加时间',
      dataIndex: 'create_at',
      render: (value, record) => {
        return moment(value).format('YYYY-MM-DD');
      },
      // ellipsis: true,
    },
    // {
    //   title: '群组ID',
    //   dataIndex: 'group_id',
    // },
    // {
    //   title: '人数',
    //   dataIndex: 'count',
    // },
    {
      title: '操作',
      dataIndex: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              // setStepFormValues(record);
              // dispatch({
              //   type: 'device/deleteDevice',
              //   payload: {
              //     id: record.device_id,
              //   },
              // });
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              console.log(record.device_id);
              dispatch({
                type: 'device/deleteDevice',
                payload: {
                  id: record.device_id,
                },
              });
            }}
          >
            删除
          </a>
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
