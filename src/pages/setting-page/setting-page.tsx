import { useEffect, useState } from 'react';
import { Button, Col, Input, Row, Select, Space } from 'antd';

import './setting-page.scss';

export const SettingPage = () => {
	const [word, setWord] = useState('豆豆豆豆 我好喜欢你啊！！！！为了你，我要听爱要坦荡荡');
  const [loading, setLoading] = useState(false);
  const [selectVoice, setSelectVoice] = useState(0);
  const [voicesList, setVoicesList] = useState<SpeechSynthesisVoice[]>([]);

  // 获取可以转换的声音列表
	const getVoices = (): Promise<SpeechSynthesisVoice[]> => {
		return new Promise(function (resolve) {
			let id: number | undefined;
			id = setInterval(() => {
        const list = window.speechSynthesis.getVoices().filter((item) => (
          item.lang.includes('zh-CN')
        ));
				if (list.length !== 0) {
					resolve(list);
					clearInterval(id);
				}
			}, 0);
		});
	}

  useEffect(() => {
    const init = async () => {
      if (typeof speechSynthesis === 'undefined') {
        return;
      }
      const voicesList = await getVoices();
      setVoicesList(voicesList);
    }
    init();
  }, []);

  // 转换
	const onTTS = async (word: string | undefined) => {
    if (word) {
      setLoading(true);
      const msg = new SpeechSynthesisUtterance(word);
      msg.voice = voicesList[selectVoice];
      speechSynthesis.speak(msg);
      msg.onstart = () => {
        setLoading(false);
      };
    }
	};

	return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          width: '100%',
        }}
      >
        <Space
          direction={'vertical'}
          style={{
            width: '100%',
            display: 'flex',
          }}
        >
          <Row gutter={8} justify='center'>
            <Col xs={20} sm={16} md={12} lg={8} xl={8}>
              <Input
                value={word}
                onChange={(e) => {
                  setWord(e.target.value);
                }}>
              </Input>
            </Col>
          </Row>
          <Row gutter={8} justify='center'>
            <Col xs={6} sm={6} md={4} lg={2} xl={2}>
              <Button
                loading={loading}
                onClick={() => onTTS(word)}
                style={{ width: '100%' }}
              >tts</Button>
            </Col>
            <Col xs={14} sm={10} md={8} lg={6} xl={6}>
              <Select
                defaultActiveFirstOption
                style={{ width: '100%' }}
                onChange={(e) => {
                  setSelectVoice(voicesList.findIndex((item) => item.name === e));
                }}
                options={voicesList.map(voice => ({
                  value: voice.name,
                  label: voice.name,
                }))}
              ></Select>
            </Col>
          </Row>
        </Space>
      </div>
    </div>
	);
};
