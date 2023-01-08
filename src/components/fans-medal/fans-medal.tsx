import { useMemo } from 'react';
import { isEmpty } from 'lodash';

import { dec2hex } from '@utils';
import { DanmuType } from '../danmu-item/danmu-item';

import './fans-medal.scss';
import ship1Icon from '../../assets/ship-1.png';
import ship2Icon from '../../assets/ship-2.png';
import ship3Icon from '../../assets/ship-3.png';

// 转换数据
export const fansMedalDataTran = (data: any) => ([
	data.medal_level,
	data.medal_name,
	data.anchor_uname,
	data.anchor_roomid,
	data.medal_color_start,
	data.special,
	data.icon_id,
	data.medal_color_border,
	data.medal_color_end,
	data.medal_color_end,
	data.guard_level,
	data.is_lighted,
]);

export const isShowFansMedal = (data: DanmuItem) => {
	if (data.setting?.isFansMedal !== 'false') {
		if (data.type === DanmuType.DANMU) {
			if (data.data[3]?.length !== 0) {
				if (data.setting?.isFansMedal === 'all') {
					return true;
				} else if (
					data.setting?.isFansMedal === 'onlyFans'
					&& data.data?.[3]?.[3] === parseInt(data.setting?.roomid ?? '-1', 10)
				) {
					return true;
				}
			}
		}
		if (data.type === DanmuType.GIFT || data.type === DanmuType.SC) {
			console.log(data);
			if (!isEmpty(data.data?.medal_info ?? {})) {
				return true;
			}
		}
	}
	return false;
};

// 粉丝勋章
export const FansMedal = ({data}: {data: any}) => {
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
	if (
		data?.[11] === 1
	) {
		return (
			<div className='fans-medal'
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
		);
	}
	return null;
};
