import React, { memo } from 'react';
import { AudioMutedOutlined, AudioOutlined } from '@ant-design/icons';
import { Switch, message } from 'antd';
import { useLocalStorageState } from 'ahooks';
import fallWarning from '@/assets/fall-warning.mp3';
import useAudio from '@/components/useAudio/useAudio';

const AudioAlarm = () => {
  const [audioSwitch, setAudioSwitch] = useLocalStorageState('audioSwitch', 'OFF');
  const [playing, toggle] = useAudio(fallWarning);

  return (
    <>
      音频告警
      <Switch
        checkedChildren={<AudioOutlined />}
        unCheckedChildren={<AudioMutedOutlined />}
        checked={audioSwitch === 'ON'}
        onChange={(checked) => {
          const flag = checked === true ? 'ON' : 'OFF';
          setAudioSwitch(flag);
          if (flag === 'ON') {
            message.success('已打开音频告警');
          } else {
            message.error('已关闭音频告警');
            if (playing) {
              toggle();
            }
          }
        }}
      />
    </>
  );
};

export default memo(AudioAlarm);
