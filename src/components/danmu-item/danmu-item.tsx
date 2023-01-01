export enum DanmuType {
	DANMU = 'danmu'
}

export type DanmuItem = {
	key: string,
	type: DanmuType,
	data: any,
}

export const DanmuItem = (props: {danmuData: DanmuItem}) => {
	const { danmuData } = props;
	switch (danmuData.type) {
	case DanmuType.DANMU :
		return <div className='danmu-item'>{danmuData.data[2][1]}: {danmuData.data[1]}</div>;
	default:
		return null;
	}
};
