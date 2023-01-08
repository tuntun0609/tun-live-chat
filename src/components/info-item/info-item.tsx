// 通知消息
export const InfoItem = ({data}: {data: DanmuItem}) => (
	<div
		data-id={data.key}
		className='danmu-item danmu-info'
		style={{
			animation: data.setting?.isAnimation === 'false' ? 'none' : '0.5s danmuIn',
		}}
	>{data.data.info}</div>
);
