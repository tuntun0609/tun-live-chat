import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@utils': path.resolve(__dirname, 'src/utils'),
			'@components': path.resolve(__dirname, 'src/components'),
			antd: path.join(__dirname, 'node_modules/antd/dist/antd.js'),
			'@ant-design/icons': path.join(__dirname, 'node_modules/@ant-design/icons/dist/index.umd.js'),
			'@locale': path.join(__dirname, 'node_modules/antd/locale'),
		},
	},
});
