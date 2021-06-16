import React, { useEffect, useRef } from 'react';
import styles from './index.less';

const RealTimeLocation = (props: any) => {
  const { sn, version, wifi, ip, location } = props;

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 500, 400);
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.shadowColor = '#ccc';
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.shadowBlur = 3;
    ctx.rotate((-90 * Math.PI) / 180);
    ctx.transform(0.25, 0.6, -0.3, 0.25, -150, -60);
    ctx.fillRect(100, 100, 500, 600);
    ctx.restore();

    ctx.save();
    ctx.rotate((-90 * Math.PI) / 180);
    ctx.transform(0.25, 0.6, -0.3, 0.25, -150, -60);
    ctx.shadowColor = '#ccc';
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.shadowBlur = 5;
    ctx.fillStyle = '#aaa';
    ctx.fillRect(280, 100, 40, 40);
    ctx.fillStyle = '#fff';
    ctx.font = '18px sans-serif';
    ctx.fillText('设备', 283, 123);
    ctx.restore();

    ctx.save();
    ctx.rotate((-90 * Math.PI) / 180);
    ctx.transform(0.25, 0.6, -0.3, 0.25, -150, -60);
    ctx.beginPath();
    if (location) {
      ctx.arc(location.x, location.y, 8, 0, Math.PI * 2, true); // 绘制
    }
    ctx.fillStyle = '#5dc394';
    ctx.strokeStyle = '#5dc394';
    ctx.shadowColor = '#5dc394';
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }, [location]);

  return (
    <div className={styles.canvas}>
      <div className={styles.info}>
        <p>
          {sn} / v{version}
        </p>
        <p>
          {wifi} / {ip}
        </p>
      </div>
      <canvas ref={canvasRef} width={500} height={400} />
    </div>
  );
};

export default RealTimeLocation;
