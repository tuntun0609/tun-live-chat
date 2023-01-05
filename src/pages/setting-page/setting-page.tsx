import { useCallback, useEffect } from 'react';
import {
	Button, Card, Col,
	Form, InputNumber, Row,
	Select, Switch, message,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import qs from 'qs';
import { isEmpty, isUndefined } from 'lodash';

import './setting-page.scss';
import {
	DEFAULT_DANMU_SPEED, DEFAULT_OFFSET, DEFAULT_REMOVE_DELAY,
	copyDataToClipboard, removeEmptyField, useSpeechSynthesisVoices,
} from '@utils';
import { SettingPageTitle, GithubStarIcon } from '@components';

export const SettingPage = () => {
	const voicesList = useSpeechSynthesisVoices();
	const [form] = Form.useForm<Setting>();
	const isTTS = Form.useWatch('isTTS', form);
	const [settingData, setSettingData] = useLocalStorage('setting', {});
	const navigate = useNavigate();

	useEffect(() => {
		if (!isEmpty(settingData)) {
			form.setFieldsValue(settingData);
		}
	}, [settingData]);

	useEffect(() => {
		// 将voice选择列表重置
		if (!isTTS && !isUndefined(isTTS)) {
			form.setFieldValue('voice', undefined);
		}
	}, [isTTS]);

	const onStart = useCallback((values: Setting) => {
		const query = removeEmptyField(values);
		console.log(query);
		setSettingData(query);
		navigate(`/chat?${qs.stringify(query)}`);
	}, []);

	const copyUrl = () => {
		try {
			const query = removeEmptyField(form.getFieldsValue(true));
			const url = `${window.location.origin}/chat?${qs.stringify(query)}`;
			copyDataToClipboard(url);
			message.success('复制url成功');
		} catch (error) {
			message.error('复制url失败');
		}
	};

	return (
		<div
			style={{
				width: '100%',
				minHeight: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
			}}
		>
			<div
				style={{
					width: '100%',
					padding: '20px 0',
				}}
			>
				<Row gutter={8} justify='center'>
					<Col xs={20} sm={16} md={12} lg={12} xl={12} xxl={8}>
						<Card
							title={<SettingPageTitle />}
							extra={<GithubStarIcon />}
							style={{
								width: '100%',
								boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
							}}
						>
							<Form
								form={form}
								name={'setting'}
								onFinish={onStart}
								initialValues={{
									isCors: 'false',
								} as Setting}
							>
								<Form.Item
									name='roomid'
									label={'房间号'}
									rules={[{ required: true, message: '必须输入房间号' }]}
								>
									<InputNumber
										placeholder={'支持直播间短号'}
										style={{ width: '100%' }}
									/>
								</Form.Item>
								<Form.Item
									name={'isCors'}
									label={'是否跨域'}
								>
									<Select
										style={{ width: '100%' }}
										options={[
											{
												value: 'true',
												label: '开启(导入obs并关闭安全机制后建议选择此项)',
											},
											{
												value: 'false',
												label: '关闭',
											},
										]}
									></Select>
								</Form.Item>
								{/* <Form.Item
									name={'direction'}
									label={'弹幕排列'}
								>
									<Select
										style={{ width: '100%' }}
										options={[
											{
												value: 'top',
												label: '自顶部',
											},
											{
												value: 'bottom',
												label: '自底部',
											},
										]}
									></Select>
								</Form.Item> */}
								<Form.Item
									name={'removeDelay'}
									label={'弹幕移除延迟时间(ms)'}
								>
									<InputNumber
										min={0}
										step={100}
										placeholder={`默认${DEFAULT_REMOVE_DELAY}`}
										style={{ width: '100%' }}
									/>
								</Form.Item>
								<Form.Item
									name={'offset'}
									label={'弹幕移除区域偏移(自顶部)'}
								>
									<InputNumber
										step={10}
										placeholder={`默认${DEFAULT_OFFSET}`}
										style={{ width: '100%' }}
									/>
								</Form.Item>
								<Form.Item
									name={'speed'}
									label={'弹幕速度'}
								>
									<InputNumber
										min={1}
										max={1000}
										placeholder={`每秒添加多少条弹幕 默认${DEFAULT_DANMU_SPEED}条/秒 范围1~1000 过低可能造成弹幕延迟`}
										style={{ width: '100%' }}
									/>
								</Form.Item>
								<Form.Item
									name={'isFansMedal'}
									label={'是否显示粉丝勋章'}
									valuePropName={'checked'}
								>
									<Switch></Switch>
								</Form.Item>
								<Form.Item
									name={'isTTS'}
									label={'是否开启语音'}
									valuePropName={'checked'}
								>
									<Switch></Switch>
								</Form.Item>
								{
									isTTS
										? <Form.Item
											name={'voice'}
											label={'自动阅读语音'}
										>
											<Select
												style={{ width: '100%' }}
												options={voicesList?.map(voice => ({
													value: voice.name,
													label: voice.name,
												}))}
											></Select>
										</Form.Item>
										: null
								}
								<Form.Item>
									<Button
										style={{ width: '100%' }}
										onClick={copyUrl}
									>
                    仅复制url
									</Button>
								</Form.Item>
								<Form.Item>
									<Button
										style={{ width: '100%' }}
										type='primary'
										htmlType='submit'
										className='login-form-button'
									>
                    启动
									</Button>
								</Form.Item>
							</Form>
						</Card>
					</Col>
				</Row>
			</div>
		</div>
	);
};
