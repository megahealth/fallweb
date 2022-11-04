import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import TableComponent from '@/components/tableComponent';
import styles from './index.less';
import { useRequest } from 'ahooks';
import { getFactoryTests, getFactoryTestsSn } from '@/services/factory';
import moment from 'moment';
import { Button, DatePicker, Input, Tag, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const FactoryList: FC = () => {
  const [sn, setSn] = useState('');
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);
  const [startTime, setStartTime] = useState(() => moment().startOf('day').valueOf());
  const [endTime, setEndTime] = useState(() => moment().valueOf());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [obj, getRecord] = useState(null);

  const showModal = (para: any) => {
    getRecord(para);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const { data, loading, run } = useRequest(
    () => {
      if (sn) {
        return getFactoryTestsSn({
          sn,
          skip: 0,
          limit: 1000,
          start: startTime,
          end: endTime,
        });
      }
      return getFactoryTests({
        skip: 0,
        limit: 1000,
        start: startTime,
        end: endTime,
      });
    },
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
      width: 200,
      fixed: 'left',
      render: (text: any, record: any) => (
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => {
            showModal(record);
          }}
        >
          <a>{record.sn}</a>
        </span>
      ),
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
      key: 'create_time',
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
      setStart((a - 1) * b);
      setLimit(b);
      run();
    },
  };

  const onOk = (e) => {
    console.log(e);
    setStartTime(moment(e[0]).valueOf());
    setEndTime(moment(e[1]).valueOf());
    run();
  };
  console.log('jibfd', obj);

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <div style={{ marginBottom: 24 }}>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            // onChange={onChange}
            onOk={onOk}
            allowClear={false}
            defaultValue={[moment(startTime), moment(endTime)]}
          />
          <Input
            value={sn}
            onChange={(v) => {
              setSn(v.target.value);
            }}
            placeholder="请输入 SN 搜索"
            style={{ width: 200, marginLeft: 20 }}
          />
        </div>
        <Button
          type="primary"
          onClick={() => {
            run();
          }}
        >
          查询
        </Button>
      </div>

      <TableComponent
        scroll={{ x: 1500 }}
        columns={columns}
        dataSource={list}
        rowKey="user_id"
        bordered={true}
        loading={loading}
        pagination={pagination}
      />

      <Modal title={obj && obj.sn} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>
          <span>
            total_result:
            {(obj && obj.total_result === 0 ? (
              <Tag color="green">成功</Tag>
            ) : (
              <Tag color="red">失败</Tag>
            )) || '--'}
          </span>
        </p>
        <p>
          bt_result：{' '}
          {(obj && obj.bt_result === 0 ? (
            <Tag color="green">成功</Tag>
          ) : (
            <Tag color="red">失败</Tag>
          )) || '--'}
        </p>
        <p>蓝牙期待信号值：{(obj && obj.bt_expect_rssi) || '--'}</p>
        <p>蓝牙实际信号值：{(obj && obj.bt_current_rssi) || '--'}</p>
        <p>
          wifi_result：
          {(obj && obj.wifi_result === 0 ? (
            <Tag color="green">成功</Tag>
          ) : (
            <Tag color="red">失败</Tag>
          )) || '--'}
        </p>
        <p>WIFI期待信号值：{(obj && obj.wifi_expect_rssi) || '--'}</p>
        <p>WIFI实际信号值：{(obj && obj.wifi_current_rssi) || '--'}</p>
        <p>
          uart0_result：
          {(obj && obj.uart0_result === 0 ? (
            <Tag color="green">成功</Tag>
          ) : (
            <Tag color="red">失败</Tag>
          )) || '--'}
        </p>
        <p>
          uart1_result：
          {(obj && obj.uart1_result === 0 ? (
            <Tag color="green">成功</Tag>
          ) : (
            <Tag color="red">失败</Tag>
          )) || '--'}
        </p>
        <p>
          uart2_result：
          {(obj && obj.uart2_result === 0 ? (
            <Tag color="green">成功</Tag>
          ) : (
            <Tag color="red">失败</Tag>
          )) || '--'}
        </p>
        <p>
          spi_result：
          {(obj && obj.spi_result === 0 ? (
            <Tag color="green">成功</Tag>
          ) : (
            <Tag color="red">失败</Tag>
          )) || '--'}
        </p>
        <p>
          io5_result：
          {(obj && obj.io5_result === 0 ? (
            <Tag color="green">成功</Tag>
          ) : (
            <Tag color="red">失败</Tag>
          )) || '--'}
        </p>
        <p>
          io23_result：
          {(obj && obj.io23_result === 0 ? (
            <Tag color="green">成功</Tag>
          ) : (
            <Tag color="red">失败</Tag>
          )) || '--'}
        </p>
        <p>
          io18_result：
          {(obj && obj.io18_result === 0 ? (
            <Tag color="green">成功</Tag>
          ) : (
            <Tag color="red">失败</Tag>
          )) || '--'}
        </p>
        <p>
          io19_result：
          {(obj && obj.io19_result === 0 ? (
            <Tag color="green">成功</Tag>
          ) : (
            <Tag color="red">失败</Tag>
          )) || '--'}
        </p>
        <p>
          radar_result：
          {(obj && obj.radar_result === 0 ? (
            <Tag color="green">成功</Tag>
          ) : (
            <Tag color="red">失败</Tag>
          )) || '--'}
        </p>
        <p>
          esp_mem_result：
          {(obj && obj.esp_mem_result === 0 ? (
            <Tag color="green">成功</Tag>
          ) : (
            <Tag color="red">失败</Tag>
          )) || '--'}
        </p>
        <p>
          esp_flash_result：
          {(obj && obj.esp_flash_result === 0 ? (
            <Tag color="green">成功</Tag>
          ) : (
            <Tag color="red">失败</Tag>
          )) || '--'}
        </p>
        <p>
          alps_mem_result：
          {(obj && obj.alps_mem_result === 0 ? (
            <Tag color="green">成功</Tag>
          ) : (
            <Tag color="red">失败</Tag>
          )) || '--'}
        </p>
        <p>版本号：{(obj && obj.device_version) || '--'}</p>
        <p>创建时间：{(obj && moment(obj.create_time).format('YYYY-MM-DD HH:mm')) || '--'}</p>
      </Modal>
    </div>
  );
};

export default FactoryList;
