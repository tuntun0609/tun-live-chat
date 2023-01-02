import { useEffect, useRef } from 'react';
import { useInterval } from 'usehooks-ts';

import { DanmuItem } from '@components';

export const DanmuList = ({data, remove, offset = 30, removeDelay = 300}: {
	data: DanmuItem[];
	remove: (key: string) => void;
	offset?: number;
	removeDelay?: number | string;
}) => {
	const listRef = useRef<HTMLDivElement>(null);

	// 移除不可见弹幕
	const removeInvisibleDanmu = () => {
		const firstChildren = listRef.current?.querySelector('.danmu-item') as HTMLDivElement;
		const listHeight = listRef.current?.getBoundingClientRect().top ?? 0;
		if (firstChildren) {
			const top = firstChildren.getBoundingClientRect() && firstChildren.getBoundingClientRect().top;
			if (top <= (listHeight + offset)) {
				firstChildren.style.opacity = '0';
				setTimeout(() => {
					remove(firstChildren.dataset.id as string);
				}, typeof removeDelay === 'number' ? removeDelay : parseInt(removeDelay, 10));
			}
		}
	};

	// 滚动到最底部
	const scrollList = () => {
		if (listRef.current) {
			listRef.current.scrollTop = listRef.current?.scrollHeight;
		}
	};

	useEffect(() => {
		scrollList();
	}, [data]);

	useInterval(() => {
		removeInvisibleDanmu();
	}, 100);

	return (
		<div className='danmu-list' ref={listRef}>
			<div className='danmu-list-placeholder'></div>
			{
				data.map(item => (
					<DanmuItem key={item.key} danmuData={item}></DanmuItem>
				))
			}
		</div>
	);
};
