import React, { FC } from 'react';
import { connect, Dispatch } from 'umi';
import { Row, Col } from 'antd';
import { ConnectState } from '@/models/connect';
import LoginForm from './components/loginForm';
import styles from './index.less';

const logoTitle = require('@/assets/logotitle.png');

export interface LoginLayoutProps {
  dispatch: Dispatch;
  login: ConnectState;
  loading: boolean;
}

export interface SubmitValProps {
  username: string;
  password: string;
}

const Login: FC<LoginLayoutProps> = ({ dispatch }) => {
  function handleSubmit(values: SubmitValProps) {
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
              <Col
                span={24}
                className={styles.logo}
                style={{ textAlign: 'center' }}
              >
                <span style={{ fontSize: 22, fontWeight: 600 }}>
                  智慧服务前端通用业务模板
                </span>
              </Col>
            </Row>
            <LoginForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(({ login }: { login: ConnectState }) => ({ login }))(
  Login,
);
