import {
	MsgItem, ScItem, InfoItem, GiftItem,
} from '@components';

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
	case DanmuType.GIFT:
		return <GiftItem data={danmuData}></GiftItem>;
	default:
		return null;
	}
};
