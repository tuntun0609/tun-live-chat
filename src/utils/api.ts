import qs from 'qs';

const corsUrl = 'https://api.codetabs.com/v1/proxy/?quest=';

// 封装get方法
export const get = async (props: { url: any; query?: any; cors?: boolean; options?: any; }) => {
	const { url: baseUrl, query = {}, options = {}, cors = false } = props;
	const queryStr = qs.stringify(query);
	const url = `${baseUrl}${queryStr !== '' ? '?' : ''}${queryStr}`;
	return fetch(`${cors ? '' : corsUrl}${url}`, {
		...options,
	}).then(r => r.json());
};

// 弹幕信息源
export const getDanmuInfo = async (roomid: number, cors?: boolean) => {
	const baseUrl = 'https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo';
	const paramsData = {
		id: roomid,
	};
	return get({
		url: baseUrl,
		query: {
			...paramsData,
		},
		cors,
	});
};

// 获取房间信息
export const getRoomInfo = async (roomid: number, cors?: boolean) => {
	const baseUrl = 'https://api.live.bilibili.com/room/v1/Room/get_info';
	return get({
		url: baseUrl,
		query: {
			id: roomid,
		},
		cors,
	});
};

export const getUserInfo = async (mid: number, cors?: boolean) => {
	const baseUrl = '/api/x/space/acc/info';
	// const baseUrl = 'https://api.bilibili.com/x/space/acc/info';
	return get({
		url: baseUrl,
		query: {
			mid: mid,
		},
		cors,
	});
};
