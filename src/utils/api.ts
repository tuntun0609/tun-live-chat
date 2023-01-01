// 封装get方法
export const get = async (props: { url: any; params?: any; options?: any; }) => {
	const { url: baseUrl, params = {}, options = {} } = props;
	const pStr = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
	const url = `${baseUrl}${pStr !== '' ? '?' : ''}${pStr}`;
	return fetch(`https://api.codetabs.com/v1/proxy/?quest=${url}`, {
		...options,
	}).then(r => r.json());
};

// 弹幕信息源
export const getDanmuInfo = async (roomid: number) => {
	const baseUrl = 'https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo';
	const paramsData = {
		id: roomid,
	};
	return get({
		url: baseUrl,
		params: {
			...paramsData,
		},
	});
};

// 获取房间信息
export const getRoomInfo = async (roomid: number) => {
	const baseUrl = 'https://api.live.bilibili.com/room/v1/Room/get_info';
	return get({
		url: baseUrl,
		params: {
			id: roomid,
		},
	});
};
