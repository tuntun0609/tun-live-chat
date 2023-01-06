import { useEffect, useRef } from 'react';
import { useInterval } from 'usehooks-ts';

import { DanmuItem } from '@components';

import './danmu-list.scss';
import { str2num, DEFAULT_REMOVE_DELAY, DEFAULT_OFFSET } from '@utils';

export const DanmuList = ({
	data,
	remove,
	offset = DEFAULT_OFFSET,
	removeDelay = DEFAULT_REMOVE_DELAY,
}: {
	data: DanmuItem[];
	remove: (key: string) => void;
	offset?: number | string;
	removeDelay?: number | string;
}) => {
	const listRef = useRef<HTMLDivElement>(null);
	// 移除不可见弹幕
	const removeInvisibleDanmu = () => {
		const firstChildren = listRef.current?.querySelector('.danmu-item') as HTMLDivElement;
		const listHeight = listRef.current?.getBoundingClientRect().top ?? 0;
		if (firstChildren) {
			const top = firstChildren.getBoundingClientRect() && firstChildren.getBoundingClientRect().top;
			if (top <= (listHeight + (str2num(offset) ?? DEFAULT_OFFSET))) {
				firstChildren.style.opacity = '0';
				setTimeout(() => {
					remove(firstChildren.dataset.id as string);
				}, str2num(removeDelay) ?? DEFAULT_REMOVE_DELAY);
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
		window.addEventListener('resize', scrollList);
		return () => {
			window.removeEventListener('resize', scrollList);
		};
	}, []);

	useEffect(() => {
		scrollList();
	}, [data]);

	useInterval(() => {
		removeInvisibleDanmu();
	}, 20);

	return (
		<div className='danmu-list' ref={listRef}>
			{/* <div className='danmu-list-placeholder'></div> */}
			{
				data.map(item => (
					<DanmuItem key={item.key} danmuData={item}></DanmuItem>
				))
			}
		</div>
	);
};
