import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import TableComponent from '@/components/tableComponent';
import styles from './index.less';
import { useRequest } from 'ahooks';
import { getFactoryTests } from '@/services/factory';
import moment from 'moment';
import { DatePicker, Tag } from 'antd';

const { RangePicker } = DatePicker;

const FactoryList: FC = () => {
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);
  const [startTime, setStartTime] = useState(() => moment().startOf('day').valueOf());
  const [endTime, setEndTime] = useState(() => moment().valueOf());

  const { data, loading, run } = useRequest(
    () =>
      getFactoryTests({
        skip: 0,
        limit: 1000,
        start: startTime,
        end: endTime,
      }),
    {
      manual: true,
    },
  );

  useEffect(() => {
    run();
  }, []);

  const list = data && data.msg;

  const columns = [
    {
      title: 'SN',
      dataIndex: 'sn',
      key: 'sn',
      width: 200,
      fixed: 'left',
    },
    {
      title: 'total_result',
      dataIndex: 'total_result',
      width: 100,
      render: (_, record) => {
        return record.total_result === 0 ? (
          <Tag color="green">成功</Tag>
        ) : (
          <Tag color="red">失败</Tag>
        );
      },
    },
    {
      title: 'bt_result',
      dataIndex: 'bt_result',
      width: 100,
      render: (_, record) => {
        return record.bt_result === 0 ? <Tag color="green">成功</Tag> : <Tag color="red">失败</Tag>;
      },
    },
    {
      title: '蓝牙期待信号值',
      dataIndex: 'bt_expect_rssi',
      width: 150,
    },
    {
      title: '蓝牙实际信号值',
      dataIndex: 'bt_current_rssi',
      width: 150,
    },
    {
      title: 'wifi_result',
      dataIndex: 'wifi_result',
      width: 100,
      render: (_, record) => {
        return record.wifi_result === 0 ? (
          <Tag color="green">成功</Tag>
        ) : (
          <Tag color="red">失败</Tag>
        );
      },
    },
    {
      title: 'WIFI期待信号值',
      dataIndex: 'wifi_expect_rssi',
      width: 150,
    },
    {
      title: 'WIFI实际信号值',
      dataIndex: 'wifi_current_rssi',
      width: 150,
    },
    {
      title: 'uart0_result',
      dataIndex: 'uart0_result',
      width: 100,
      render: (_, record) => {
        return record.uart0_result === 0 ? (
          <Tag color="green">成功</Tag>
        ) : (
          <Tag color="red">失败</Tag>
        );
      },
    },
    {
      title: 'uart1_result',
      dataIndex: 'uart1_result',
      width: 150,
      render: (_, record) => {
        return record.uart1_result === 0 ? (
          <Tag color="green">成功</Tag>
        ) : (
          <Tag color="red">失败</Tag>
        );
      },
    },
    {
      title: 'uart2_result',
      dataIndex: 'uart2_result',
      width: 100,
      render: (_, record) => {
        return record.uart2_result === 0 ? (
          <Tag color="green">成功</Tag>
        ) : (
          <Tag color="red">失败</Tag>
        );
      },
    },
    {
      title: 'spi_result',
      dataIndex: 'spi_result',
      width: 100,
      render: (_, record) => {
        return record.spi_result === 0 ? (
          <Tag color="green">成功</Tag>
        ) : (
          <Tag color="red">失败</Tag>
        );
      },
    },
    {
      title: 'io5_result',
      dataIndex: 'io5_result',
      width: 100,
      render: (_, record) => {
        return record.io5_result === 0 ? (
          <Tag color="green">成功</Tag>
        ) : (
          <Tag color="red">失败</Tag>
        );
      },
    },
    {
      title: 'io23_result',
      dataIndex: 'io23_result',
      width: 100,
      render: (_, record) => {
        return record.io23_result === 0 ? (
          <Tag color="green">成功</Tag>
        ) : (
          <Tag color="red">失败</Tag>
        );
      },
    },
    {
      title: 'io18_result',
      dataIndex: 'io18_result',
      width: 100,
      render: (_, record) => {
        return record.io18_result === 0 ? (
          <Tag color="green">成功</Tag>
        ) : (
          <Tag color="red">失败</Tag>
        );
      },
    },
    {
      title: 'io19_result',
      dataIndex: 'io19_result',
      width: 100,
      render: (_, record) => {
        return record.io19_result === 0 ? (
          <Tag color="green">成功</Tag>
        ) : (
          <Tag color="red">失败</Tag>
        );
      },
    },
    {
      title: 'radar_result',
      dataIndex: 'radar_result',
      width: 100,
      render: (_, record) => {
        return record.radar_result === 0 ? (
          <Tag color="green">成功</Tag>
        ) : (
          <Tag color="red">失败</Tag>
        );
      },
    },
    {
      title: 'esp_mem_result',
      dataIndex: 'esp_mem_result',
      width: 150,
      render: (_, record) => {
        return record.esp_mem_result === 0 ? (
          <Tag color="green">成功</Tag>
        ) : (
          <Tag color="red">失败</Tag>
        );
      },
    },
    {
      title: 'esp_flash_result',
      dataIndex: 'esp_flash_result',
      width: 150,
      render: (_, record) => {
        return record.esp_flash_result === 0 ? (
          <Tag color="green">成功</Tag>
        ) : (
          <Tag color="red">失败</Tag>
        );
      },
    },
    {
      title: 'alps_mem_result',
      dataIndex: 'alps_mem_result',
      width: 150,
      render: (_, record) => {
        return record.alps_mem_result === 0 ? (
          <Tag color="green">成功</Tag>
        ) : (
          <Tag color="red">失败</Tag>
        );
      },
    },
    { title: '版本号', dataIndex: 'device_version', width: 150 },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      width: 150,
      render: (_, record) => {
        return moment(record.create_time).format('YYYY-MM-DD HH:mm');
      },
    },
  ];

  const pagination = {
    total: list && list.length,
    current: Math.floor(start / limit) + 1,
    pageSize: limit,
    size: 'small',
    onChange: (a, b) => {
      console.log(a, b);
      setStart((a - 1) * b);
    },
  };

  const onOk = (e) => {
    console.log(e);
    setStartTime(moment(e[0]).valueOf());
    setEndTime(moment(e[1]).valueOf());
    run();
  };

  return (
    <div className={styles.wrap}>
      <RangePicker
        style={{ marginBottom: '10px' }}
        showTime={{ format: 'HH:mm' }}
        format="YYYY-MM-DD HH:mm"
        // onChange={onChange}
        onOk={onOk}
        allowClear={false}
        defaultValue={[moment(startTime), moment(endTime)]}
      />
      <TableComponent
        scroll={{ x: 1500 }}
        columns={columns}
        dataSource={list}
        rowKey="user_id"
        bordered={true}
        loading={loading}
        pagination={pagination}
      />
    </div>
  );
};

export default FactoryList;
