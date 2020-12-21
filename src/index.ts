/* eslint-disable import/no-dynamic-require */
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

const config = require(join(process.cwd(), 'mm.json')) as Record<string, unknown>;

const { debug, cwd } = (() => {
	const path = join(process.cwd(), 'node_modules', '@mm-works');
	if (existsSync(path)) {
		const paths = readdirSync(path);
		if (paths.length === 1) {
			const project = paths[0];
			return {
				cwd: join(path, project),
				debug: false
			};
		}
		return {
			cwd: process.cwd(),
			debug: true
		};
	}
	return {
		cwd: process.cwd(),
		debug: true
	};
})();

const proj = require(join(cwd, 'mm.json')) as Record<string, unknown>;

if (debug) {
	proj.acao = '*';
	proj.acma = 150000;
}

const conf = {
	...proj,
	...config,
	...{
		cwd,
		debug
	}
} as Record<string, unknown> & { cwd: string; debug: boolean; };

export default conf;
