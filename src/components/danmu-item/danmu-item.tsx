import { useMemo } from 'react';

import ship1Icon from '../../assets/ship-1.png';
import ship2Icon from '../../assets/ship-2.png';
import ship3Icon from '../../assets/ship-3.png';
import './danmu-item.scss';

export enum DanmuType {
	DANMU = 'danmu',
	INFO = 'info',
}

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
};

// 十进制颜色值转十六进制
const dec2hex = (dec: number) => {
	let hex = dec.toString(16);
	for (let i = hex.length; i < 6; i++) {
		hex += '0';
	}
	return hex;
};

export const DanmuItem = (props: {danmuData: DanmuItem}) => {
	const { danmuData } = props;
	switch (danmuData.type) {
	case DanmuType.DANMU:
		return (
			<div data-id={danmuData.key} className='danmu-item danmu-msg'>
				{
					danmuData.isFansMedal === 'true'
					&& danmuData.data[3]?.length !== 0
					&& danmuData.data[3]?.[11] === 1
						? <FansMedal data={danmuData.data[3]}></FansMedal>
						: null
				}
				<div className='danmu-msg-name with-colon'>{danmuData.data[2][1]}</div>
				<div className='danmu-msg-message'>{danmuData.data[1]}</div>
			</div>
		);
	case DanmuType.INFO:
		return <div data-id={danmuData.key} className='danmu-item danmu-info'>{danmuData.data.info}</div>;
	default:
		return null;
	}
};
