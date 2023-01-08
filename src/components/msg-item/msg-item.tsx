import { FansMedal } from '@components';

// 普通消息
export const MsgItem = ({data}: {data: DanmuItem}) => (
	<div
		data-id={data.key}
		className='danmu-item danmu-msg'
		style={{
			animation: data.setting?.isAnimation === 'false' ? 'none' : '0.5s danmuIn',
		}}
	>
		{
			data.setting?.isFansMedal === 'true'
			&& data.data[3]?.length !== 0
				? <FansMedal data={data.data?.[3]}></FansMedal>
				: null
		}
		<div
			className='danmu-msg-name with-colon'
			style={{
				color: data.data?.[2]?.[2] === 0 ? data.setting?.nameColor : '#FFB027',
			}}
		>
			{data.data?.[2]?.[1]}
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
