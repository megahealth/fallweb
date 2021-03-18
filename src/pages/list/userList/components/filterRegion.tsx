import React, { FC } from 'react';
import { Input, Select, Button } from 'antd';
import { connect } from 'umi';
import { SearchOutlined } from '@ant-design/icons';
import { QueryTableState } from '@/models/connect';
import { QueryTableProps } from '../userList';

const { Option } = Select;

const ListFilterRegion: FC<QueryTableProps> = ({ dispatch, queryUser }) => {
  const { searchContentVal, statusVal } = queryUser;

  const onInputChange = (e: any) => {
    dispatch({
      type: 'queryUser/save',
      payload: {
        searchContentVal: e.target.value,
      },
    });
  };
  const onStatusChange = (val: string) => {
    dispatch({
      type: 'queryUser/save',
      payload: {
        statusVal: val,
      },
    });
  };

  const onSearchChange = () => {
    dispatch({
      type: 'queryUser/queryTableList',
      payload: {},
    });
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <Input
        placeholder="请输入搜索内容"
        value={searchContentVal}
        style={{ width: 200 }}
        suffix={<SearchOutlined />}
        onChange={onInputChange}
      />
      <Button
        type="primary"
        style={{ marginLeft: 24 }}
        onClick={onSearchChange}
      >
        查询
      </Button>
    </div>
  );
};

export default connect(({ queryUser }: { queryUser: QueryTableState }) => ({
  queryUser,
}))(ListFilterRegion);
