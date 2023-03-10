import { useMemo } from 'react';
import { Avatar } from 'antd';

import { FansMedal, fansMedalDataTran, isShowFansMedal } from '@components';

// sc消息
export const ScItem = ({data}: {data: DanmuItem}) => {
	const showFansMedal = useMemo(() => isShowFansMedal(data), []);
	return (
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
						showFansMedal
							? <FansMedal data={fansMedalDataTran(data.data?.medal_info ?? {})}></FansMedal>
							: null
					}
					<Avatar
						className='danmu-sc-header-face'
						src={data.data?.user_info?.face}
					></Avatar>
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
};
