import { useEffect, useMemo, useState } from 'react';
import classnames from 'classnames';
import { Avatar } from 'antd';

import { FansMedal, isShowFansMedal } from '@components';
import { getFace } from '@utils';

// 普通消息
export const MsgItem = ({data}: {data: DanmuItem}) => {
	const showFansMedal = useMemo(() => isShowFansMedal(data), []);
	const [face, setFace] = useState<string>('https://i1.hdslb.com/bfs/face/member/noface.jpg_48x48.jpg');
	useEffect(() => {
		const init = async () => {
			console.log(data);
			if (data.setting?.isFace === 'true') {
				const faceUrl = await getFace(data.data?.[2]?.[0]);
				console.log(faceUrl);
				setFace(`${faceUrl}_48x48.jpg`);
			}
		};
		init();
	}, []);
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
				{/* 头像 */}
				{
					data.setting?.isFace === 'true'
						? <Avatar alt={data.data?.[2]?.[1]?.slice(0, 1)} style={{ marginRight: '6px' }} src={face}></Avatar>
						: null
				}
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
