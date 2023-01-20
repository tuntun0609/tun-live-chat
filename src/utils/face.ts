import { debounce, fromPairs } from 'lodash';
import { api } from './index';

const storage = window.localStorage;
const storageGet = (key: string, defaultValue: any = null) => {
	const text = storage.getItem(key);
	try {
		return text ? JSON.parse(text) : defaultValue;
	} catch (error) {
		return defaultValue;
	}
};

const storageSet = (key: string, value: any) => storage.setItem(key, JSON.stringify(value));

const FACE_CACHE_KEY = 'face';

const faceMap = new Map(
	Object.entries(storageGet(FACE_CACHE_KEY, {}))
		.map(([uid, face]) => [Number(uid), face]),
);

const saveFaceMap = debounce(() => storageSet('face', fromPairs(Array.from(faceMap))), 5000, { maxWait: 5000 });

export const getFace = async (uid: number, isCors?: boolean) => {
	const face = faceMap.get(uid);
	if (face) {
		return face;
	}
	try {
		const data = await api.getUserInfo(uid, isCors);
		if (data?.data?.card) {
			faceMap.set(uid, data?.data?.card?.face);
			saveFaceMap();
			return data?.data?.card?.face;
		}
	} catch (error) {
		return 'https://i1.hdslb.com/bfs/face/member/noface.jpg';
	}
};
