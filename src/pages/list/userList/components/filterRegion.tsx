import React, { FC } from 'react';
import { Input, Select, Button } from 'antd';
import { connect } from 'umi';
import { SearchOutlined } from '@ant-design/icons';
import { UserState } from '@/models/connect';
import { QueryUserProps } from '../userList';

const { Option } = Select;

const ListFilterRegion: FC<QueryUserProps> = ({ dispatch, user }) => {
  const { searchContentVal, statusVal } = user;

  const onInputChange = (e: any) => {
    dispatch({
      type: 'user/save',
      payload: {
        searchContentVal: e.target.value,
      },
    });
  };
  const onStatusChange = (val: string) => {
    dispatch({
      type: 'user/save',
      payload: {
        statusVal: val,
      },
    });
  };

  const onSearchChange = () => {
    dispatch({
      type: 'user/queryUserList',
      payload: {},
    });
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <Input
        placeholder="请输入用户名搜索"
        value={searchContentVal}
        style={{ width: 200 }}
        suffix={<SearchOutlined />}
        onChange={onInputChange}
      />
      <Button type="primary" style={{ marginLeft: 24 }} onClick={onSearchChange}>
        查询
      </Button>
    </div>
  );
};

export default connect(({ user }: { user: UserState }) => ({
  user,
}))(ListFilterRegion);
