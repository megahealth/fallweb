import React, { FC, useEffect } from 'react';
import { Tree } from 'antd';
import { connect } from 'umi';
import { GroupState, Loading } from '@/models/connect';
import { QueryGroupProps } from './queryGroup';
const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        disabled: true,
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
            disableCheckbox: true,
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [
          {
            title: <span style={{ color: '#1890ff' }}>sss</span>,
            key: '0-0-1-0',
          },
        ],
      },
    ],
  },
];

const QueryGroup: FC<QueryGroupProps> = ({ dispatch, group, loading }) => {
  const { groupList } = group;
  console.log(groupList);

  useEffect(() => {
    dispatch({
      type: 'group/queryGroupList',
      payload: {},
    });
  }, []);

  return (
    <div>
      <Tree
        // onSelect={onSelect}
        // onCheck={onCheck}
        treeData={treeData}
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
