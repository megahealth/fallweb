import React, { FC, useEffect } from 'react';
import { Divider, Tree } from 'antd';
import { connect } from 'umi';
import TableComponent from '@/components/tableComponent';
import { ColumnsType } from 'antd/es/table';
import { GroupState, Loading } from '@/models/connect';
import { QueryGroupProps } from './queryGroup';

type RecordType = {};

const QueryGroup: FC<QueryGroupProps> = ({ dispatch, group, loading }) => {
  const { groupList: groupData } = group;

  useEffect(() => {
    dispatch({
      type: 'group/queryGroupList',
      payload: {},
    });
  }, []);

  const columns: ColumnsType<RecordType> = [
    {
      title: 'sub_id',
      key: 'sub_id',
      dataIndex: 'sub_id',
    },
    {
      title: 'sub_name',
      dataIndex: 'sub_name',
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
      title: 'dev_cnt',
      dataIndex: 'dev_cnt',
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
      <TableComponent
        columns={columns}
        dataSource={groupData.children}
        rowKey="sub_id"
        bordered={true}
        loading={loading}
        pagination={pagination}
      />
    </div>
  );
};

export default connect(
  ({ group, loading }: { group: GroupState; loading: Loading }) => ({
    group,
    loading: loading.models.group,
  }),
)(QueryGroup);
