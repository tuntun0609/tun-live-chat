import './danmu-item.scss';

export enum DanmuType {
	DANMU = 'danmu',
	INFO = 'info',
}

export const DanmuItem = (props: {danmuData: DanmuItem}) => {
	const { danmuData } = props;
	switch (danmuData.type) {
	case DanmuType.DANMU:
		return (
			<div data-id={danmuData.key} className='danmu-item danmu-msg'>
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
