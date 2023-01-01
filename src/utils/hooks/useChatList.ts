import { useEffect, useRef, useState } from 'react';

export const useChatList = <T>(): [T[], (item: T) => void] => {
	const danmuPool = useRef<T[]>([]);
	const [danmuList, setDanmuList] = useState<T[]>([]);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const pushDanmuFromPool = () => {
		let intervalTime = 200;
		if (danmuPool.current.length > 0) {
			// console.log(danmuList);
			intervalTime = Math.min(intervalTime, 1000 / length);
			const item = danmuPool.current.shift();
			setDanmuList(prevState => (
				[...prevState, item as T]
			));
		}
		if (window.location.pathname === '/chat') {
			setTimeout(pushDanmuFromPool, intervalTime);
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const removeDanma = (index: number) => {
		setDanmuList(danmuList.filter((_item, i) => i !== index));
	};

	useEffect(() => {
		pushDanmuFromPool();
	}, []);

	const addDanmu = (item: T) => {
		danmuPool.current.push(item);
	};
	return [danmuList, addDanmu];
};
