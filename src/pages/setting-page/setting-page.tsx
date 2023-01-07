import { useCallback, useEffect, useState } from 'react';
import {
	Button, Card, Col,
	Form, Input, InputNumber, Row,
	Select, Switch, message,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import qs from 'qs';
import { isEmpty, isUndefined } from 'lodash';
import { ChromePicker } from 'react-color';

import './setting-page.scss';
import {
	DEFAULT_DANMU_SPEED, DEFAULT_NAME_COLOR, DEFAULT_OFFSET, DEFAULT_REMOVE_DELAY,
	copyDataToClipboard, removeEmptyField, useSpeechSynthesisVoices,
} from '@utils';
import { SettingPageTitle, GithubStarIcon } from '@components';

export const SettingPage = () => {
	const voicesList = useSpeechSynthesisVoices();
	const [form] = Form.useForm<Setting>();
	const isTTS = Form.useWatch('isTTS', form);
	const voice = Form.useWatch('voice', form);
	const [settingData, setSettingData] = useLocalStorage<any>('setting', {});
	const navigate = useNavigate();
	const [nameColor, setNameColor] = useState(DEFAULT_NAME_COLOR);
	const [isColorPickerShow, setIsColorPickerShow] = useState(false);

	useEffect(() => {
		if (!isEmpty(settingData)) {
			form.setFieldsValue(settingData);
		}
		if (settingData.nameColor) {
			setNameColor(settingData.nameColor);
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

	const testTTS = () => {
		const msg = new SpeechSynthesisUtterance('这是一段测试语音');
		const index = voicesList?.findIndex(item => item.name === voice) ?? -1;
		msg.voice = voicesList?.[index] ?? null;
		speechSynthesis.speak(msg);
	};

	return (
		<div className='main'>
			<div className='main-body'>
				<Row gutter={8} justify='center'>
					<Col xs={20} sm={16} md={12} lg={12} xl={12} xxl={8}>
						<Card
							title={<SettingPageTitle />}
							extra={<GithubStarIcon />}
							className='main-card'
						>
							<Form
								form={form}
								name={'setting'}
								onFinish={onStart}
								initialValues={{
									isCors: 'false',
									nameColor: DEFAULT_NAME_COLOR,
									isAnimation: 'true',
								} as Setting}
							>
								{/* 房间号 */}
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
								{/* 跨域 */}
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
								{/* 弹幕移除延迟时间 */}
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
								{/* 弹幕移除区域偏移 */}
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
								{/* 弹幕速度 */}
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
								{/* 用户名称颜色 */}
								<Form.Item
									label={'用户名称颜色'}
								>
									<Form.Item
										name={'nameColor'}
										noStyle
									>
										<Input
											prefix={
												<div style={{
													width: '16px',
													height: '16px',
													backgroundColor: nameColor,
													borderRadius: '4px',
												}}></div>}
											placeholder={'名称颜色'}
											style={{ width: '100px', marginRight: '10px' }}
											onChange={e => setNameColor(e.target.value)}
										/>
									</Form.Item>
									<Form.Item noStyle>
										<Button
											style={{ marginRight: '10px' }}
											onClick={() => setIsColorPickerShow(!isColorPickerShow)}
										>选择颜色</Button>
									</Form.Item>
									<Form.Item noStyle>
										<Button
											onClick={() => {
												setNameColor(DEFAULT_NAME_COLOR);
												form.setFieldValue('nameColor', DEFAULT_NAME_COLOR);
											}}
										>重置颜色</Button>
									</Form.Item>
									{
										isColorPickerShow
											? <div className='color-picker-popover'>
												<div
													className='color-picker-cover'
													onClick={() => setIsColorPickerShow(false)}
												></div>
												<ChromePicker
													color={nameColor}
													onChangeComplete={(color: any) => {
														setNameColor(color.hex);
														form.setFieldValue('nameColor', color.hex);
													}}
												></ChromePicker>
											</div>
											: null
									}
								</Form.Item>
								{/* 是否显示粉丝勋章 */}
								<Form.Item
									name={'isFansMedal'}
									label={'是否显示粉丝勋章'}
									valuePropName={'checked'}
								>
									<Switch></Switch>
								</Form.Item>
								{/* 是否开启弹幕移入动画 */}
								<Form.Item
									name={'isAnimation'}
									label={'是否开启弹幕移入动画'}
									valuePropName={'checked'}
								>
									<Switch></Switch>
								</Form.Item>
								{/* 是否开启语音 */}
								<Form.Item
									name={'isTTS'}
									label={'是否开启语音(导入obs不建议开启)'}
									valuePropName={'checked'}
								>
									<Switch></Switch>
								</Form.Item>
								{/* 自动阅读语音 */}
								<Form.Item label={'自动阅读语音'}>
									<Form.Item
										noStyle
										name={'voice'}
									>
										<Select
											disabled={!isTTS ?? true}
											style={{ width: 'calc(100% - 72px)' }}
											options={voicesList?.map(voice => ({
												value: voice.name,
												label: voice.name,
											}))}
										></Select>
									</Form.Item>
									<Form.Item noStyle>
										<Button
											style={{
												marginLeft: '8px',
											}}
											disabled={!isTTS ?? true}
											onClick={testTTS}
										>
											试听
										</Button>
									</Form.Item>
								</Form.Item>
								{/* 复制url */}
								<Form.Item>
									<Button
										style={{ width: '100%' }}
										onClick={copyUrl}
									>
                    仅复制url
									</Button>
								</Form.Item>
								{/* 启动 */}
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
