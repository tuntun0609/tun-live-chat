import { useEffect, useRef, useState } from 'react';
import { Button, Col, Input, Row, Select, Space } from 'antd';

import './setting-page.scss';
import { api, decode, encode, getVoices } from '@utils';

export const SettingPage = () => {
	const [word, setWord] = useState('豆豆豆豆 我好喜欢你啊！！！!为了你，我要听爱要坦荡荡');
  const [loading, setLoading] = useState(false);
  const [selectVoice, setSelectVoice] = useState(0);
  const [voicesList, setVoicesList] = useState<SpeechSynthesisVoice[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const heartbeatId = useRef<number | undefined | null>(null);

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

  // 连接
  const onConnect = async () => {
    // const data = await api.getDanmuInfo(23197314);
    // console.log(data.data);

    // ws.current = new WebSocket(`ws://${data.data.host_list[0].host}:${data.data.host_list[0].ws_port}/sub`);
    ws.current = new WebSocket('ws://broadcastlv.chat.bilibili.com:2244/sub');
    ws.current.onopen = (evt) => { 
      console.log("Connection open ...");
      ws.current?.send(encode(JSON.stringify({
        uid: 0,
        roomid: 23197314,
        platform: 'web',
        type: 2,
      }), 7));
    };
    heartbeatId.current = setInterval(() => {
      ws.current?.send(encode('', 2));
    }, 30000);
    ws.current.onmessage = async (msgEvent) => {
      const packet: any = await decode(msgEvent.data);
      switch (packet.op) {
        case 8:
          console.log('加入房间');
          break;
        case 3:
          const count = packet.body.count
          console.log(`人气：${count}`);
          break;
        case 5:
          packet.body.forEach((body: any)=>{
            console.log(body.cmd, body);
            switch (body.cmd) {
              case 'DANMU_MSG':
                console.log(`${body.info[2][1]}: ${body.info[1]}`);
                break;
              case 'SEND_GIFT':
                console.log(`${body.data.uname} ${body.data.action} ${body.data.num} 个 ${body.data.giftName}`);
                break;
              case 'WELCOME':
                console.log(`欢迎 ${body.data.uname}`);
                break;
              case 'SUPER_CHAT_MESSAGE':
                console.log(`${body.data.uname}`);
              // 此处省略很多其他通知类型
              default:
                // console.log(body);
            }
          })
          break;
        default:
          console.log(packet);
      }
    };
  };

  const onClose = () => {
    ws.current?.close();
    clearInterval(heartbeatId.current as number);
    console.log('关闭连接');
  }

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
          <Row gutter={8} justify='center'>
            <Button onClick={onConnect}>连接</Button>
            <Button onClick={onClose}>中断</Button>
          </Row>
        </Space>
      </div>
    </div>
	);
};
