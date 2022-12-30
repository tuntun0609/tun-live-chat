/* eslint-disable @typescript-eslint/no-unused-vars */
import { decode, encode, getVoices, useSpeechSynthesisVoices } from '@utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { isUndefined, isNull, isEmpty } from 'lodash';

import { useQuery } from '@utils';

export const ChatPage = () => {
	const ws = useRef<WebSocket | null>(null);
	const heartbeatId = useRef<number | undefined | null>(null);
	const voicesList = useSpeechSynthesisVoices();
	const query = useQuery<Setting>();

	useEffect(() => {
		if (!isUndefined(query) && !isEmpty(voicesList)) {
			const index = query.voice ? voicesList?.findIndex(item => item.name === query.voice) : 0;
			if (query.roomid !== undefined) {
				onConnect(query, index);
			} else {
				console.error('信息缺失');
			}
		}
	}, [query, voicesList]);

	useEffect(() => () => {
		if (!isNull(heartbeatId.current)) {
			onClose();
		}
	}, []);

	// 转换
	const onTTS = useCallback(async (word: string | undefined, voiceIndex?: number) => {
		const msg = new SpeechSynthesisUtterance(word);
		msg.voice = voicesList[voiceIndex ?? 0];
		speechSynthesis.speak(msg);
		// msg.onstart = () => {};
	}, [voicesList]);

	// 连接
	const onConnect = async (setting: Setting, voiceIndex: number) => {
		// const data = await api.getDanmuInfo(23197314);
		// console.log(data.data);

		// ws.current = new WebSocket(`ws://${data.data.host_list[0].host}:${data.data.host_list[0].ws_port}/sub`);
		ws.current = new WebSocket('ws://broadcastlv.chat.bilibili.com:2244/sub');
		ws.current.onopen = () => {
			console.log('Connection open ...');
			ws.current?.send(encode(JSON.stringify({
				uid: 0,
				roomid: parseInt(setting.roomid as string, 10),
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
				console.log(`人气：${packet.body?.count}`);
				break;
			case 5:
				packet.body.forEach((body: any)=>{
					// console.log(body.cmd, body);
					switch (body.cmd) {
					case 'DANMU_MSG':
						console.log(`${body.info[2][1]}: ${body.info[1]}`);
						break;
					case 'SEND_GIFT':
						console.log(`${body.data.uname} ${body.data.action} ${body.data.num} 个 ${body.data.giftName}`);
						break;
					case 'WELCOME':
						// console.log(`欢迎 ${body.data.uname}`);
						break;
					case 'SUPER_CHAT_MESSAGE':
						console.log(`${body.data.user_info.uname} 发送sc: ${body.data.message}`);
						onTTS(`${body.data.user_info.uname} 发送sc: ${body.data.message}`, voiceIndex);
						// 此处省略很多其他通知类型
						break;
					default:
						// console.log(body);
						break;
					}
				});
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
	};

	return (
		<div>
			<Button onClick={() => {
				console.log(voicesList);
				onTTS('test', 3);
			}}>close</Button>
		</div>
	);
};
