import React, { FC, useEffect } from 'react';
import { Tree } from 'antd';
import { connect } from 'umi';
import { GroupState, Loading } from '@/models/connect';
import { QueryGroupProps } from './queryGroup';

const QueryGroup: FC<QueryGroupProps> = ({ dispatch, group, loading }) => {
  const { groupList } = group;

  useEffect(() => {
    dispatch({
      type: 'group/queryGroupList',
      payload: {},
    });
  }, []);

  const onSelect = e => {
    console.log(e);
  };

  const onCheck = e => {
    console.log(e);
  };

  return (
    <div>
      <Tree onSelect={onSelect} onCheck={onCheck} treeData={groupList} />
    </div>
  );
};

export default connect(
  ({ group, loading }: { group: GroupState; loading: Loading }) => ({
    group,
    loading: loading.models.group,
  }),
)(QueryGroup);
