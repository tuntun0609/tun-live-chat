import { useMemo } from 'react';
import { isEmpty } from 'lodash';

import { dec2hex } from '@utils';

import ship1Icon from '../../assets/ship-1.png';
import ship2Icon from '../../assets/ship-2.png';
import ship3Icon from '../../assets/ship-3.png';
import './danmu-item.scss';

export enum DanmuType {
	DANMU = 'DANMU_MSG',
	INFO = 'info',
	SC = 'SUPER_CHAT_MESSAGE',
	SC_JAPAN = 'SUPER_CHAT_MESSAGE_JPN',
	WELCOME = 'WELCOME',
	GIFT = 'SEND_GIFT',
	SHIP = 'GUARD_BUY',
}

const fansMedalDataTran = (data: any) => ([
	data.medal_level,
	data.medal_name,
	data.anchor_uname,
	data.anchor_roomid,
	data.medal_color_start,
	data.special,
	data.icon_id,
	data.medal_color_end,
	data.medal_color_end,
	data.medal_color_border,
	data.guard_level,
	data.is_lighted,
]);

// 粉丝勋章
const FansMedal = ({data}: {data: any}) => {
	const color1 = useMemo(() => dec2hex(data[4]), []);
	const color2 = useMemo(() => dec2hex(data[7]), []);
	const color3 = useMemo(() => dec2hex(data[9]), []);
	const getShipIcon = (level: number) => {
		switch (level) {
		case 1:
			return ship1Icon;
		case 2:
			return ship2Icon;
		case 3:
			return ship3Icon;
		default:
			return '';
		}
	};
	return (
		data?.[11] === 1
			? <div className='fans-medal'
				style={{
					borderColor: `#${color2}`,
				}}
			>
				<div
					className='fans-medal-name'
					style={{
						backgroundImage: `linear-gradient(45deg, #${color1}, #${color3})`,
					}}
				>
					{
						data[10] === 1 || data[10] === 2 || data[10] === 3
							? <i className='fans-medal-ship-icon' style={{
								backgroundImage: `url(${getShipIcon(data[10])})`,
							}}></i>
							: null
					}
					{data[1]}
				</div>
				<div
					className='fans-medal-level'
					style={{
						color: `#${color1}`,
					}}
				>
					{data[0]}
				</div>
			</div>
			: null
	);
};

// 普通消息
const MsgItem = ({data}: {data: DanmuItem}) => (
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
						height={data.data?.[0]?.[13]?.height / 2}
						src={data.data?.[0]?.[13]?.url}
						alt={data.data?.[1]}
					></img>
			}
		</div>
	</div>
);

// sc消息
const ScItem = ({data}: {data: DanmuItem}) => (
	<div
		data-id={data.key}
		className={'danmu-item danmu-sc'}
	>
		<div className='danmu-sc-header'
			style={{
				border: `1px solid ${data.data?.background_bottom_color}`,
				backgroundColor: data.data?.background_color,
			}}
		>
			<div className='danmu-sc-header-name'
				style={{
					color: data.data?.user_info.name_color,
				}}
			>
				{
					data.setting?.isFansMedal === 'true'
					&& !isEmpty(data.data?.medal_info ?? {})
						? <FansMedal data={fansMedalDataTran(data.data?.medal_info ?? {})}></FansMedal>
						: null
				}
				{data.data?.user_info.uname}
			</div>
			<div className='danmu-sc-header-price'
				style={{
					color: data.data?.background_price_color,
				}}
			>
				{data.data?.price}
			</div>
		</div>
		<div className='danmu-sc-msg'
			style={{
				backgroundColor: data.data?.background_bottom_color,
			}}
		>
			{data.data?.message}
		</div>
	</div>
);

// 通知消息
const InfoItem = ({data}: {data: DanmuItem}) => (
	<div
		data-id={data.key}
		className='danmu-item danmu-info'
		style={{
			animation: data.setting?.isAnimation === 'false' ? 'none' : '0.5s danmuIn',
		}}
	>{data.data.info}</div>
);

export const DanmuItem = (props: {danmuData: DanmuItem}) => {
	const { danmuData } = props;
	switch (danmuData.type) {
	// 普通弹幕
	case DanmuType.DANMU:
		return <MsgItem data={danmuData}></MsgItem>;
	// 通知信息
	case DanmuType.INFO:
		return <InfoItem data={danmuData}></InfoItem>;
	// sc消息
	case DanmuType.SC:
		return <ScItem data={danmuData}></ScItem>;
	default:
		return null;
	}
};
