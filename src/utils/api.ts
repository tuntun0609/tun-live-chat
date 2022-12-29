import axios from 'axios';


const TRUE_STATUS = 200;
// 封装get方法
export const get = async (props: { url: any; params?: any; options?: any; }) => {
	const { url: baseUrl, params = {}, options = {} } = props;
	const pStr = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
	const url = `${baseUrl}${pStr !== '' ? '?' : ''}${pStr}`;
  return fetch(url, {
		headers: {
			origin: 'https://www.bilibili.com',
			'Content-Type': 'application/json',
		},
    referrer: '',
    referrerPolicy: 'no-referrer',
    mode: 'no-cors',
  }).then(r => r.json());
};

export const getDanmuInfo = async (bvId: string) => {
	const baseUrl = 'https://api.bilibili.com/x/web-interface/view';
	const paramsData = {
		bvid: bvId,
	};
	try {
		const res = await get({
			url: baseUrl,
			params: {
				...paramsData,
			},
			options: {
				headers: {
					'Content-Type': 'application/json',
				},
			},
		});
		return res.data;
	} catch (error) {
		console.log('getVideoInfo', error);
	}
};

export const getDanmuInfo1 = async (roomid: number) => {
	const baseUrl = 'https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo';
	const data = await axios(baseUrl, {
		params: {
			id: roomid,
		}
	});
	return data;
};
