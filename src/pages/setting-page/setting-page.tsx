import { useCallback, useEffect } from 'react';
import { Button, Card, Col, Form, Input, Row, Select, Switch } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import qs from 'qs';
import { isEmpty, isUndefined } from 'lodash';

import './setting-page.scss';
import { useSpeechSynthesisVoices } from '@utils';
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
		console.log(values);
		setSettingData(values);
		navigate(`/chat?${qs.stringify(values)}`);
	}, []);

	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
			}}
		>
			<div
				style={{
					width: '100%',
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
							>
								<Form.Item
									name='roomid'
									label={'房间号'}
									rules={[{ required: true, message: '必须输入房间号' }]}
								>
									<Input />
								</Form.Item>
								<Form.Item
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
