import pako from 'pako';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder('utf-8');

const readInt = function (buffer: Uint8Array, start: number, len: number) {
	let result = 0
	for (let i = len - 1; i >= 0; i--) {
		result += Math.pow(256, len - i - 1) * buffer[start + i]
	}
	return result
}

const writeInt = function (buffer: any[], start: number, len: number, value: number) {
	let i = 0
	while (i < len) {
		buffer[start + i] = value / Math.pow(256, len - i - 1)
		i++
	}
}

export const encode = function (str: string | undefined, op: any) {
	let data = textEncoder.encode(str);
	let packetLen = 16 + data.byteLength;
	let header = [0, 0, 0, 0, 0, 16, 0, 1, 0, 0, 0, op, 0, 0, 0, 1]
	writeInt(header, 0, 4, packetLen)
	return (new Uint8Array(header.concat(...data))).buffer
}

export const decode = function (blob: Blob) {
	return new Promise(function (resolve, reject) {
		let reader = new FileReader();
		reader.onload = function (e) {
			let buffer = new Uint8Array((e.target?.result) as any)
			let result: {
				[key: string]: any
			} = {}
			result.packetLen = readInt(buffer, 0, 4)
			result.headerLen = readInt(buffer, 4, 2)
			result.ver = readInt(buffer, 6, 2)
			result.op = readInt(buffer, 8, 4)
			result.seq = readInt(buffer, 12, 4)
			if (result.op === 5) {
				result.body = []
				let offset = 0;
				while (offset < buffer.length) {
					let packetLen = readInt(buffer, offset + 0, 4)
					let headerLen = 16// readInt(buffer,offset + 4,4)
					let data = buffer.slice(offset + headerLen, offset + packetLen);

					/**
					 * 仅有两处更改
					 * 1. 引入pako做message解压处理，具体代码链接如下
					 *    https://github.com/nodeca/pako/blob/master/dist/pako.js
					 * 2. message文本中截断掉不需要的部分，避免JSON.parse时出现问题
					 */
					/** let body = textDecoder.decode(pako.inflate(data));
					if (body) {
							// 同一条 message 中可能存在多条信息，用正则筛出来
							const group = body.split(/[\x00-\x1f]+/);
							group.forEach(item => {
								try {
									result.body.push(JSON.parse(item));
								}
								catch(e) {
									// 忽略非 JSON 字符串，通常情况下为分隔符
								}
							});
					}**/

					let body = '';
					try {
						// pako可能无法解压
						body = textDecoder.decode(pako.inflate(data));
					}
					catch (e) {
						body = textDecoder.decode(data)
					}

					if (body) {
						// 同一条 message 中可能存在多条信息，用正则筛出来
						const group = body.split(/[\x00-\x1f]+/);
						group.forEach(item => {
							try {
								const parsedItem = JSON.parse(item);
								if (typeof parsedItem === 'object') {
									result.body.push(parsedItem);
								} else {
									// 这里item可能会解析出number
									// 此时可以尝试重新用pako解压data（携带转换参数）
									// const newBody = textDecoder.decode(pako.inflate(data, {to: 'String'}))
									// 重复上面的逻辑，筛选可能存在的多条信息
									// 初步验证，这里可以解析到INTERACT_WORD、DANMU_MSG、ONLINE_RANK_COUNT
									// SEND_GIFT、SUPER_CHAT_MESSAGE
								}
							}
							catch (e) {
								// 忽略非 JSON 字符串，通常情况下为分隔符
							}
						});
					}

					offset += packetLen;
				}
			} else if (result.op === 3) {
				result.body = {
					count: readInt(buffer, 16, 4)
				};
			}
			resolve(result)
		}
		reader.readAsArrayBuffer(blob);
	});
}