/* eslint-disable @typescript-eslint/no-unused-vars */
import { api, decode, encode, str2num, useChatList, useSpeechSynthesisVoices } from '@utils';
import { useCallback, useEffect, useRef } from 'react';
import { isUndefined, isNull } from 'lodash';
import { v4 as uuid } from 'uuid';
import { Button } from 'antd';

import { useQuery } from '@utils';
import { DanmuList, DanmuType } from '@components';

import './chat-page.scss';

export const ChatPage = () => {
	const ws = useRef<WebSocket | null>(null);
	const heartbeatId = useRef<number | undefined | null>(null);
	const voicesList = useSpeechSynthesisVoices();
	const query = useQuery<Setting>();
	const [danmuList, addDanmu, removeDanmu] = useChatList(str2num(query?.speed));

	useEffect(() => () => {
		if (!isNull(heartbeatId.current)) {
			onClose();
		}
	}, []);

	// 信息处理结束后开启websocket
	useEffect(() => {
		if (!isUndefined(query) && !isUndefined(voicesList)) {
			console.log(query);
			if (query.roomid !== undefined && ws.current?.readyState !== 1) {
				onConnect();
			} else {
				console.error('错误');
			}
		}
	}, [query, voicesList]);

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
				switch (body.cmd) {
				case DanmuType.DANMU:
					console.log(body);
					console.log(`${body.info[2][1]}: ${body.info[1]}`);
					addDanmu({
						key: uuid(),
						type: DanmuType.DANMU,
						data: body.info,
						setting: query,
					});
					break;
				case DanmuType.GIFT:
					console.log(`${body.data.uname} ${body.data.action} ${body.data.num} 个 ${body.data.giftName}`);
					break;
				case DanmuType.WELCOME:
					// console.log(`欢迎 ${body.data.uname}`);
					break;
				case DanmuType.SC:
					console.log(body.data);
					console.log(`${body.data.user_info.uname} 发送sc: ${body.data.message}`);
					addDanmu({
						key: uuid(),
						type: DanmuType.SC,
						data: body.data,
						setting: query,
					});
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
	const onConnect = async () => {
		addDanmu({
			key: uuid(),
			type: DanmuType.INFO,
			data: {
				info: '正在获取房间信息...',
			},
		});
		let roomInfo: {
			[key: string]: any,
		} = {};
		try {
			roomInfo = await api.getRoomInfo(
				parseInt(query?.roomid ?? '0', 10),
				query?.isCors === 'true' ? true : false,
			);
			console.log(roomInfo.data);
			addDanmu({
				key: uuid(),
				type: DanmuType.INFO,
				data: {
					info: '获取房间信息成功！',
				},
			});
		} catch (error) {
			addDanmu({
				key: uuid(),
				type: DanmuType.INFO,
				data: {
					info: '获取房间信息失败，请重试 :(',
				},
			});
			return;
		}

		// ws.current = new WebSocket(`ws://${data.data.host_list[0].host}:${data.data.host_list[0].ws_port}/sub`);
		ws.current = new WebSocket('wss://broadcastlv.chat.bilibili.com/sub');
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
				roomid: roomInfo.data.room_id as number,
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
			{
				query?.isDebug === 'true'
					? <Button onClick={() => {
						onClose();
					}}>debug</Button>
					: null
			}
			<DanmuList
				data={danmuList}
				remove={key => removeDanmu(key)}
				offset={query?.offset}
				removeDelay={query?.removeDelay}
			></DanmuList>
		</div>
	);
};
