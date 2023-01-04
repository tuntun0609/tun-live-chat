import { useMemo, useRef, useState } from 'react';
import { useInterval } from 'usehooks-ts';

import { DEFAULT_DANMU_SPEED } from '../DEFAULT_VALUES';

export const useChatList = (time?: number): [
	DanmuItem[],
	(item: DanmuItem) => void,
	(key: string) => DanmuItem | undefined,
] => {
	const intervalTime = useMemo(() => 1000 / (time ?? DEFAULT_DANMU_SPEED), [time]);
	const danmuPool = useRef<DanmuItem[]>([]);
	const [danmuList, setDanmuList] = useState<DanmuItem[]>([]);

	useInterval(() => {
		if (danmuPool.current.length > 0) {
			const item = danmuPool.current.shift();
			setDanmuList(prevState => (
				[...prevState, item as DanmuItem]
			));
		}
	}, intervalTime);

	const removeDanmu = (key: string) => {
		const removeItem = danmuList.find(item => item.key === key);
		setDanmuList(prevState => (
			prevState.filter(item => item.key !== key)
		));
		return removeItem;
	};

	const addDanmu = (item: DanmuItem) => {
		danmuPool.current.push(item);
	};
	return [danmuList, addDanmu, removeDanmu];
};
