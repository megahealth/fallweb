import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import TableComponent from '@/components/tableComponent';
import styles from './index.less';
import { useRequest } from 'ahooks';
import { getSemiTest, getSemiTestSn } from '@/services/semi';
import moment from 'moment';
import { Button, DatePicker, Input, Tag } from 'antd';

const { RangePicker } = DatePicker;

const SemiTestList: FC = () => {
  const [sn, setSn] = useState('');
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);
  const [startTime, setStartTime] = useState(() => moment().startOf('day').valueOf());
  const [endTime, setEndTime] = useState(() => moment().valueOf());

  const { data, loading, run } = useRequest(
    () => {
      if (sn) {
        return getSemiTestSn({
          sn,
          skip: 0,
          limit: 1000,
          start: startTime,
          end: endTime,
        });
      }
      return getSemiTest({
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
      fixed: 'left',
    },
    {
      title: 'total_result',
      dataIndex: 'total_result',
      render: (_, record) => {
        return record.total_result === 0 ? (
          <Tag color="green">成功</Tag>
        ) : (
          <Tag color="red">失败</Tag>
        );
      },
    },
    { title: '版本号', dataIndex: 'device_version' },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
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

export default SemiTestList;
