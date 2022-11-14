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
  // console.log('semi data',data);

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
      render: (_, record: any) => {
        return record.total_result === 0 ? (
          <Tag color="green">成功</Tag>
        ) : (
          <Tag color="red">失败</Tag>
        );
      },
    },
    {
      title: '版本号',
      dataIndex: 'device_version',
    },
    {
      title: 'mac',
      dataIndex: 'mac',
      render: (_, record: any) => {
        return <span>{record.mac === 'null' ? '' : record.mac}</span>;
      },
    },
    {
      //
      title: 'bt',
      dataIndex: 'bt',
      render: (_, record: any) => {
        return record.bt !== -1 ? (
          <>{record.bt === 0 ? <Tag color="red">失败</Tag> : <Tag color="green">成功</Tag>}</>
        ) : (
          <>
            <span>--</span>
          </>
        );
      },
    },
    {
      title: 'wifi',
      dataIndex: 'wifi',
      render: (_, record: any) => {
        return record.wifi !== -1 ? (
          <>{record.wifi === 0 ? <Tag color="red">失败</Tag> : <Tag color="green">成功</Tag>}</>
        ) : (
          <>
            <span>--</span>
          </>
        );
      },
    },
    {
      title: '呼吸测试预期值',
      dataIndex: 'breath_expect',
      render: (_, record: any) => {
        return <span>{record.breath_expect === -1 ? '--' : record.breath_expect}</span>;
      },
    },
    {
      title: '呼吸测试值',
      dataIndex: 'breath_current',
      render: (_, record: any) => {
        return <span>{record.breath_current === -1 ? '--' : record.breath_current}</span>;
      },
    },
    {
      title: '呼吸测试结果',
      dataIndex: 'breath_result',
      render: (_, record: any) => {
        return record.breath_result !== -1 ? (
          <>
            {record.breath_result === 0 ? (
              <Tag color="red">失败</Tag>
            ) : (
              <Tag color="green">成功</Tag>
            )}
          </>
        ) : (
          <>
            <span>--</span>
          </>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (_, record: any) => {
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
