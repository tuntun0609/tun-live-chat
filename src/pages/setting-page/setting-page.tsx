import { useCallback } from 'react';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import qs from 'qs';

import './setting-page.scss';
import { useSpeechSynthesisVoices } from '@utils';
import { SettingPageTitle } from '@components';

export const SettingPage = () => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const voicesList = useSpeechSynthesisVoices();
	const navigate = useNavigate();

	const onStart = useCallback((values: any) => {
		navigate(`/chat?${qs.stringify(values)}`);
	}, []);

	const GithubStarIcon = () => (
		<a href='https://github.com/tuntun0609/tun-live-chat' target={'_blank'} rel='noreferrer'>
			<img
				alt='GitHub Repo stars'
				src='https://img.shields.io/github/stars/tuntun0609/tun-live-chat?style=social'
			/>
		</a>
	);

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
									name={'voice'}
									label={'自动阅读语音'}
								>
									<Select
										style={{ width: '100%' }}
										options={voicesList.map(voice => ({
											value: voice.name,
											label: voice.name,
										}))}
									></Select>
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