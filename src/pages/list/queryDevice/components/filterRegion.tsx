import React, { FC } from 'react';
import { Input, Select, Button } from 'antd';
import { connect } from 'umi';
import { SearchOutlined } from '@ant-design/icons';
import { DeviceState } from '@/models/connect';
import { QueryDeviceProps } from '../queryDevice';

const { Option } = Select;

const ListFilterRegion: FC<QueryDeviceProps> = ({ dispatch, device }) => {
  const { searchContentVal, statusVal } = device;

  const onInputChange = (e: any) => {
    dispatch({
      type: 'device/save',
      payload: {
        searchContentVal: e.target.value,
      },
    });
  };
  const onStatusChange = (val: string) => {
    dispatch({
      type: 'device/save',
      payload: {
        statusVal: val,
      },
    });
  };

  const onSearchChange = () => {
    dispatch({
      type: 'device/queryDeviceList',
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

export default connect(({ device }: { device: DeviceState }) => ({
  device,
}))(ListFilterRegion);
