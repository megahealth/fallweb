import React, { FC, useEffect } from 'react';
import { connect } from 'umi';
import { Divider, Badge } from 'antd';
import TableComponent from '@/components/tableComponent';
import { ColumnsType } from 'antd/es/table';
import { QueryTableState, Loading } from '@/models/connect';
import FilterRegion from './components/filterRegion';
import { QueryTableProps } from './queryTable';

type RecordType = {};
// const columns: ColumnsType<RecordType> = [
//   {
//     key: 'name',
//     title: 'Name',
//     dataIndex: 'name',
//   },
// ];

const QueryTable: FC<QueryTableProps> = ({ dispatch, queryTable, loading }) => {
  const { queryTableSource } = queryTable;

  useEffect(() => {
    dispatch({
      type: 'queryTable/queryTableList',
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

  return (
    <div>
      <FilterRegion />
      <TableComponent
        columns={columns}
        dataSource={queryTableSource}
        rowKey="sn"
        loading={loading}
      />
    </div>
  );
};

export default connect(
  ({
    queryTable,
    loading,
  }: {
    queryTable: QueryTableState;
    loading: Loading;
  }) => ({
    queryTable,
    loading: loading.models.queryTable,
  }),
)(QueryTable);
