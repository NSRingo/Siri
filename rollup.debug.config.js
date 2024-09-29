import json from '@rollup/plugin-json';
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
	{
		input: 'src/request.debug.js',
		output: {
			file: 'debug/request.js',
			//format: 'es',
			banner: `/* README: https://github.com/NSRingo */\nconsole.log(' iRingo: ⭕ Siri β Request')\nconsole.log('${new Date().toLocaleString('zh-CN', {timeZone: 'PRC'})}')`,
		},
		plugins: [json(), commonjs(), nodeResolve()]
	},
	{
		input: 'src/response.debug.js',
		output: {
			file: 'debug/response.js',
			//format: 'es',
			banner: `/* README: https://github.com/NSRingo */\nconsole.log(' iRingo: ⭕ Siri β Response')\nconsole.log('${new Date().toLocaleString('zh-CN', {timeZone: 'PRC'})}')`,
		},
		plugins: [json(), commonjs(), nodeResolve()]
	}
];
