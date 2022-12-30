/* eslint-disable @typescript-eslint/no-unused-vars */
import { decode, encode } from '@utils';
import { useRef } from 'react';

export const ChatPage = () => {
	const ws = useRef<WebSocket | null>(null);
	const heartbeatId = useRef<number | undefined | null>(null);

	// 连接
	const onConnect = async () => {
		// const data = await api.getDanmuInfo(23197314);
		// console.log(data.data);

		// ws.current = new WebSocket(`ws://${data.data.host_list[0].host}:${data.data.host_list[0].ws_port}/sub`);
		ws.current = new WebSocket('ws://broadcastlv.chat.bilibili.com:2244/sub');
		ws.current.onopen = (evt) => {
			console.log('Connection open ...');
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
				console.log(`人气：${packet.body?.count}`);
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
						break;
					default:
						console.log(body);
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
		<div>ChatPage</div>
	);
};
