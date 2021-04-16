import React, { FC, useEffect } from 'react';
import { connect } from 'umi';
import { Divider, Badge } from 'antd';
import TableComponent from '@/components/tableComponent';
import { ColumnsType } from 'antd/es/table';
import { QueryUserState, Loading } from '@/models/connect';
import FilterRegion from './components/filterRegion';
import { QueryTableProps } from './userList';

type RecordType = {};
// const columns: ColumnsType<RecordType> = [
//   {
//     key: 'name',
//     title: 'Name',
//     dataIndex: 'name',
//   },
// ];

const UserList: FC<QueryTableProps> = ({ dispatch, queryUser, loading }) => {
  const { queryUserSource } = queryUser;

  useEffect(() => {
    dispatch({
      type: 'queryUser/queryUserList',
      payload: {},
    });
  }, []);

  const columns: ColumnsType<RecordType> = [
    {
      title: 'user_id',
      key: 'user_id',
      dataIndex: 'user_id',
      // ellipsis: true,
    },
    {
      title: 'name',
      dataIndex: 'name',
    },
    {
      title: 'group_name',
      dataIndex: 'group_name',
    },
    {
      title: 'group_id',
      dataIndex: 'group_id',
    },
    {
      title: 'sex',
      dataIndex: 'sex',
    },
    {
      title: 'age',
      dataIndex: 'age',
    },
    {
      title: 'phone',
      dataIndex: 'phone',
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

  const pagination = {
    size: 'small',
  };

  return (
    <div style={{ background: '#fff', borderRadius: '10px', padding: '20px' }}>
      {/* <FilterRegion /> */}
      <TableComponent
        columns={columns}
        dataSource={queryUserSource}
        rowKey="user_id"
        bordered={true}
        loading={loading}
        pagination={pagination}
      />
    </div>
  );
};

export default connect(
  ({
    queryUser,
    loading,
  }: {
    queryUser: QueryUserState;
    loading: Loading;
  }) => ({
    queryUser,
    loading: loading.models.queryUser,
  }),
)(UserList);
