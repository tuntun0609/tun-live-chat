import './danmu-item.scss';

export enum DanmuType {
	DANMU = 'danmu',
	INFO = 'info',
}

export type DanmuItem = {
	key: string,
	type: DanmuType,
	data: any,
}

export const DanmuItem = (props: {danmuData: DanmuItem}) => {
	const { danmuData } = props;
	switch (danmuData.type) {
	case DanmuType.DANMU:
		return <div data-id={danmuData.key} className='danmu-item danmu-item'>{danmuData.data[2][1]}: {danmuData.data[1]}</div>;
	case DanmuType.INFO:
		return <div data-id={danmuData.key} className='danmu-item danmu-info'>{danmuData.data.info}</div>;
	default:
		return null;
	}
};
