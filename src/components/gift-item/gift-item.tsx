import { isEmpty } from 'lodash';
import { Avatar } from 'antd';

import { FansMedal, fansMedalDataTran } from '@components';

// 礼物消息
export const GiftItem = ({data}: {data: DanmuItem}) => (
	<div
		data-id={data.key}
		className='danmu-item danmu-gift'
	>
		<div className='danmu-gift-header'>
			{
				data.setting?.isFansMedal === 'true'
					&& !isEmpty(data.data?.medal_info ?? {})
					? <FansMedal data={fansMedalDataTran(data.data?.medal_info ?? {})}></FansMedal>
					: null
			}
			<Avatar
				className='danmu-gift-header-face'
				src={data.data?.face}
			></Avatar>
			<div className='danmu-gift-header-name'>
				{data.data?.uname}
			</div>
		</div>
		<div className='danmu-gift-content'>
			{data.data.action} {data.data.num} 个 {data.data.giftName}
		</div>
	</div>
);
