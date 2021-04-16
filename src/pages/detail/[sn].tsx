import React, { FC } from 'react';
import { connect, Dispatch, Link } from 'umi';
import { ConnectState } from '@/models/connect';
import Img from '@/assets/detail.png'

export interface DetailProps {
  dispatch: Dispatch;
  loading: boolean;
}

const Detail = (props) => {

  const { sn } = props.match.params;
  localStorage.setItem('sn', sn);

  return (
    <Link to={`/report/${sn}`}>
      <img style={{width: '100%'}} src={Img}></img>
    </Link>
  )
}

export default connect(({

}: {

}) => ({

}))(Detail);