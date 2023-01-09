import classnames from 'classnames';
// 通知消息
export const InfoItem = ({data}: {data: DanmuItem}) => (
	<div
		data-id={data.key}
		className={classnames(
			'danmu-item',
			'danmu-info',
			{
				'danmu-in': data.setting?.isAnimation !== 'false',
			},
		)}
	>{data.data.info}</div>
);
