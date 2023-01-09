import { useMemo } from 'react';
import classnames from 'classnames';

import { FansMedal, isShowFansMedal } from '@components';

// 普通消息
export const MsgItem = ({data}: {data: DanmuItem}) => {
	const showFansMedal = useMemo(() => isShowFansMedal(data), []);
	return (
		<div
			data-id={data.key}
			className={classnames(
				'danmu-item',
				'danmu-msg',
				{
					'danmu-in': data.setting?.isAnimation !== 'false',
				},
				{
					'danmu-fans': showFansMedal,
				},
			)}
		>
			<div
				className='danmu-msg-header with-colon'
				style={{
					color: data.data?.[2]?.[2] === 0 ? data.setting?.nameColor : '#FFB027',
				}}
			>
				{
					showFansMedal
						? <FansMedal data={data.data?.[3]}></FansMedal>
						: null
				}
				<div className='danmu-msg-header-name'>
					{data.data?.[2]?.[1]}
				</div>
			</div>
			<div className='danmu-msg-message'>
				{
					data.data?.[0]?.[13] === '{}'
						? data.data?.[1]
						: <img
							className='danmu-msg-message-image'
							height={data.data?.[0]?.[13]?.height / 2}
							src={data.data?.[0]?.[13]?.url}
							alt={data.data?.[1]}
						></img>
				}
			</div>
		</div>
	);
};
