// 通知消息
export const InfoItem = ({data}: {data: DanmuItem}) => (
	<div
		data-id={data.key}
		className={`danmu-item danmu-info ${data.setting?.isAnimation === 'false' ? '' : 'danmu-in'}`}
	>{data.data.info}</div>
);
