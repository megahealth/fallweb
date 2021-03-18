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
  function setStepFormValues(record: any) {
    console.log(record);
  }
  function getStatusText(status: number) {
    if (status === 1) {
      return (
        <span>
          <Badge status="processing" />
          运行中
        </span>
      );
    }
    return (
      <span>
        <Badge status="default" />
        关闭
      </span>
    );
  }

  useEffect(() => {
    dispatch({
      type: 'queryTable/queryTableList',
      payload: {},
    });
  }, []);

  const columns: ColumnsType<RecordType> = [
    {
      title: 'sn',
      key: 'sn',
      dataIndex: 'sn',
    },
    {
      title: 'device_id',
      dataIndex: 'device_id',
      // ellipsis: true,
    },
    {
      title: 'parent_id',
      dataIndex: 'parent_id',
    },
    {
      title: 'parent_name',
      dataIndex: 'parent_name',
    },
    {
      title: 'sub_id',
      dataIndex: 'sub_id',
    },
    {
      title: 'sub_name',
      dataIndex: 'sub_name',
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
