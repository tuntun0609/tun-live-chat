import { useEffect, useRef } from 'react';

import { DanmuItem } from '@components';

export const DanmuList = ({data, remove, offset = 30}: {
	data: DanmuItem[];
	remove: (key: string) => void;
	offset?: number;
}) => {
	const listRef = useRef<HTMLDivElement>(null);
	const removeInvisibleDanmuId = useRef<number | null>(null);

	// 移除不可见弹幕
	const removeInvisibleDanmu = () => {
		const firstChildren = listRef.current?.children[0] as HTMLElement;
		const listHeight = listRef.current?.getBoundingClientRect().top ?? 0;
		if (firstChildren) {
			const top = firstChildren.getBoundingClientRect() && firstChildren.getBoundingClientRect().top;
			if (top <= (listHeight + offset)) {
				firstChildren.style.opacity = '0';
				setTimeout(() => {
					remove(firstChildren.dataset.id as string);
				}, 500);
			}
		}
	};

	useEffect(() => {
		if (listRef && removeInvisibleDanmuId) {
			removeInvisibleDanmuId.current = setInterval(removeInvisibleDanmu, 100);
		}
		return () => {
			clearInterval(removeInvisibleDanmuId.current ?? undefined);
		};
	}, [listRef]);

	return (
		<div className='danmu-list' ref={listRef}>
			{
				data.map(item => (
					<DanmuItem key={item.key} danmuData={item}></DanmuItem>
				))
			}
		</div>
	);
};
