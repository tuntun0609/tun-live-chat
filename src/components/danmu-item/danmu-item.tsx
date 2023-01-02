import { useMemo } from 'react';
import './danmu-item.scss';

export enum DanmuType {
	DANMU = 'danmu',
	INFO = 'info',
}

// 粉丝勋章
const FansMedal = ({data}: {data: any}) => {
	const color = useMemo(() => dec2hex(data[4]), []);
	return (
		<div className='fans-medal'
			style={{
				borderColor: `#${color}`,
			}}
		>
			<div
				className='fans-medal-name'
				style={{
					backgroundColor: `#${color}`,
				}}
			>
				{data[1]}
			</div>
			<div
				className='fans-medal-level'
				style={{
					color: `#${color}`,
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
					danmuData.isFansMedal === 'true' && danmuData.data[3].length !== 0
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
