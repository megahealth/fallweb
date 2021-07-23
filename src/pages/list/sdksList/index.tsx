import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import TableComponent from '@/components/tableComponent';
import styles from './index.less';
import { getSDKs, getSDKsCount, deleteSDK, uploadSDK } from '@/services/sdks';
import moment from 'moment';
import { Button, Input, Popconfirm, message, Modal, Form, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const SdkList: FC = () => {
  const [sn, setSn] = useState('');
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);
  const [list, setList] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const getSDKsList = async (obj: any) => {
    setLoading(true);
    const res1 = await getSDKsCount();
    const res2 = await getSDKs(obj);
    setLoading(false);
    setList(res2.msg);
    setCount(res1.msg);
  };

  useEffect(() => {
    getSDKsList({
      skip: 0,
      limit: 10,
    });
  }, []);
  const columns = [
    {
      title: 'id',
      dataIndex: '_id',
      width: 250,
    },
    {
      title: 'version',
      dataIndex: 'version',
      width: 200,
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      width: 200,
      render: (_: any, record: any) => {
        const date = moment(record.create_time).format('YYYY-MM-DD HH:mm:ss');
        return <span>{date}</span>;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      with: 100,
      render: (_: any, record: any) => (
        <>
          <Popconfirm
            title="确定要删除此固件么?"
            onConfirm={() => {
              deleteSDK(record.version)
                .then((res) => {
                  if (res.code == 0) {
                    message.error('删除成功！');
                    getSDKsList({
                      skip: start,
                      limit,
                    });
                  } else {
                    message.error('删除失败！');
                  }
                })
                .catch((err) => {
                  console.log(err);
                  message.error('删除失败！');
                });
            }}
            okText="确定"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  const handleOk = () => {
    form.validateFields().then((value) => {
      uploadSDK({ description: value.description, upload: value.upload[0].originFileObj })
        .then((res) => {
          if (res.code == 0) {
            message.success('添加成功！');
            setModalVisible(false);
            getSDKsList({
              skip: start,
              limit: limit,
            });
          } else if (res.code == 2) {
            message.warning('与已经添加的版本重复！');
          } else {
            message.error('添加失败！');
          }
        })
        .catch((err) => {
          console.log(err);
          message.error('添加失败！');
        });
    });
  };
  const handleCancel = () => {
    setModalVisible(false);
  };
  const normFile = (e: any) => {
    const file = e.file;
    const i = e.fileList.length > 0 ? e.fileList.length - 1 : 0;
    const fileList = e.fileList[i];
    if (file.status == 'removed') {
      return [];
    } else {
      return [{ ...fileList, status: 'done' }];
    }
  };

  const pagination: any = {
    total: count,
    current: Math.floor(start / limit) + 1,
    pageSize: limit,
    size: 'small',
    onChange: (a: number, b: number) => {
      setStart((a - 1) * b);
      getSDKsList({
        skip: (a - 1) * b,
        limit: limit,
      });
    },
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <div></div>
        <div style={{ marginBottom: 24 }}>
          <Button
            type="primary"
            onClick={() => {
              setModalVisible(true);
            }}
          >
            添加
          </Button>
        </div>
      </div>

      <TableComponent
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={list}
        rowKey="_id"
        bordered={true}
        loading={loading}
        pagination={pagination}
      />

      <Modal title="添加固件" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} name="control-ref">
          <Form.Item
            label="描述"
            name="description"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="upload"
            label="Upload"
            valuePropName="fileList"
            rules={[{ required: true, message: '请选择上传的固件！' }]}
            getValueFromEvent={normFile}
          >
            <Upload name="logo" listType="text" customRequest={(res) => {}}>
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SdkList;
