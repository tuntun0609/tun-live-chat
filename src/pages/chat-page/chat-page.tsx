/* eslint-disable @typescript-eslint/no-unused-vars */
import { decode, encode, useChatList, useSpeechSynthesisVoices } from '@utils';
import { useCallback, useEffect, useRef } from 'react';
import { isUndefined, isNull } from 'lodash';
import { v4 as uuid } from 'uuid';
import { Button } from 'antd';

import { useQuery } from '@utils';
import { DanmuItem, DanmuType } from '@components';

import './chat-page.scss';

export const ChatPage = () => {
	const ws = useRef<WebSocket | null>(null);
	const heartbeatId = useRef<number | undefined | null>(null);
	const voicesList = useSpeechSynthesisVoices();
	const query = useQuery<Setting>();
	const [danmuList, addDanmu, removeDanmu] = useChatList();

	useEffect(() => {
		if (!isNull(heartbeatId.current)) {
			onClose();
		}
		const removeInvisibleDanmuId = setInterval(removeInvisibleDanmu, 100);
		return () => {
			clearInterval(removeInvisibleDanmuId);
		};
	}, []);

	// 信息处理结束后开启websocket
	useEffect(() => {
		if (!isUndefined(query) && !isUndefined(voicesList)) {
			if (query.roomid !== undefined && ws.current?.readyState !== 1) {
				onConnect(query);
			} else {
				console.error('错误');
			}
		}
	}, [query, voicesList]);

	// 移除不可见弹幕
	const removeInvisibleDanmu = () => {
		const item: HTMLElement | null = document.querySelector('.danmu-item');
		const listHeight = document.querySelector('.danmu-list')?.getBoundingClientRect().top ?? 0;
		if (item) {
			const top = item.getBoundingClientRect() && item.getBoundingClientRect().top;
			if (top <= listHeight) {
				removeDanmu(item.dataset.id as string);
			}
		}
	};

	// tts
	const onTTS = useCallback(async (word: string | undefined) => {
		if (query?.isTTS === 'true') {
			const msg = new SpeechSynthesisUtterance(word);
			const index = query.voice ? voicesList?.findIndex(item => item.name === query.voice) ?? -1 : -1;
			msg.voice = voicesList?.[index] ?? null;
			speechSynthesis.speak(msg);
		} else {
			console.log('tts close');
		}
	}, [voicesList]);

	// 处理信息
	const processMsg = async (msgEvent: MessageEvent<any>) => {
		const packet: any = await decode(msgEvent.data);
		switch (packet.op) {
		case 8:
			console.log('加入房间');
			addDanmu({
				key: uuid(),
				type: DanmuType.INFO,
				data: {
					info: `加入房间 ${query?.roomid}`,
				},
			});
			break;
		case 3:
			// console.log(`人气：${packet.body?.count}`);
			break;
		case 5:
			packet.body.forEach((body: any)=>{
				// console.log(body.cmd, body);
				switch (body.cmd) {
				case 'DANMU_MSG':
					console.log(`${body.info[2][1]}: ${body.info[1]}`);
					addDanmu({
						key: uuid(),
						type: DanmuType.DANMU,
						data: body.info,
					});
					break;
				case 'SEND_GIFT':
					console.log(`${body.data.uname} ${body.data.action} ${body.data.num} 个 ${body.data.giftName}`);
					break;
				case 'WELCOME':
					// console.log(`欢迎 ${body.data.uname}`);
					break;
				case 'SUPER_CHAT_MESSAGE':
					console.log(body.data);
					console.log(`${body.data.user_info.uname} 发送sc: ${body.data.message}`);
					onTTS(`${body.data.user_info.uname} 发送sc: ${body.data.message}`);
					break;
				// 此处省略很多其他通知类型
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

	// 连接
	const onConnect = async (setting: Setting) => {
		// const data = await api.getDanmuInfo(23197314);
		// console.log(data.data);

		// ws.current = new WebSocket(`ws://${data.data.host_list[0].host}:${data.data.host_list[0].ws_port}/sub`);
		ws.current = new WebSocket('ws://broadcastlv.chat.bilibili.com:2244/sub');
		ws.current.onopen = () => {
			console.log('Connection open ...');
			addDanmu({
				key: uuid(),
				type: DanmuType.INFO,
				data: {
					info: '正在连接',
				},
			});
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
		ws.current.addEventListener('message', processMsg);
	};

	// 关闭
	const onClose = () => {
		ws.current?.close();
		clearInterval(heartbeatId.current as number);
		console.log('关闭连接');
	};

	return (
		<div id='chat'>
			<Button onClick={() => {
				onClose();
			}}>close</Button>
			<div className='danmu-list'>
				{
					danmuList.map(item => (
						<DanmuItem key={item.key} danmuData={item}></DanmuItem>
					))
				}
			</div>
		</div>
	);
};
