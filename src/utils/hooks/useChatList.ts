import { useEffect, useRef, useState } from 'react';

export const useChatList = (): [
	DanmuItem[],
	(item: DanmuItem) => void,
	(key: string) => DanmuItem | undefined,
] => {
	const danmuPool = useRef<DanmuItem[]>([]);
	const [danmuList, setDanmuList] = useState<DanmuItem[]>([]);

	const pushDanmuFromPool = () => {
		let intervalTime = 200;
		if (danmuPool.current.length > 0) {
			intervalTime = Math.min(intervalTime, 1000 / length);
			const item = danmuPool.current.shift();
			setDanmuList(prevState => (
				[...prevState, item as DanmuItem]
			));
		}
		if (window.location.pathname === '/chat') {
			setTimeout(pushDanmuFromPool, intervalTime);
		}
	};

	const removeDanmu = (key: string) => {
		const removeItem = danmuList.find(item => item.key === key);
		setDanmuList(prevState => (
			prevState.filter(item => item.key !== key)
		));
		return removeItem;
	};

	useEffect(() => {
		pushDanmuFromPool();
	}, []);

	const addDanmu = (item: DanmuItem) => {
		danmuPool.current.push(item);
	};
	return [danmuList, addDanmu, removeDanmu];
};
