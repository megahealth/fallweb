import React, { FC } from 'react';
import { connect, Dispatch } from 'umi';
import { Row, Col } from 'antd';
import { ConnectState } from '@/models/connect';
import LoginForm from './components/loginForm';
import styles from './index.less';

export interface LoginLayoutProps {
  dispatch: Dispatch;
  login: ConnectState;
  loading: boolean;
}

export interface SubmitValProps {
  name: string;
  password: string;
}

const Login: FC<LoginLayoutProps> = ({ dispatch }) => {
  function handleSubmit(values: SubmitValProps) {
    localStorage.removeItem('currentPage');
    dispatch({
      type: 'login/queryLogin',
      payload: {
        ...values,
      },
    });
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.login}>
        <div className={styles.loginRight}>
          <div className={styles.loginContent}>
            <Row>
              <Col span={24} className={styles.logo} style={{ textAlign: 'center' }}>
                <span className={styles.title}>无线智能监护系统</span>
              </Col>
            </Row>
            <LoginForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(({ login }: { login: ConnectState }) => ({ login }))(Login);
