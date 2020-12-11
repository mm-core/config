/* eslint-disable import/no-dynamic-require */
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { Region } from 'minio';

interface IRouter {
	url: string;
	method: 'get' | 'post' | 'all' | 'put' | 'delete';
	service: string;
	data: {
		[param: string]: string | number | boolean;
	};
}

interface IProject {
	wx: {
		getopenid: boolean;
		getuserinfo: boolean;
		token: string;
		appid: string;
		appsecret: string;
	};
	baidu: {
		apikey: string;
		appsecret: string;
	};
	favicon: string;

	filters: IRouter[];
	routers: IRouter[];
	push_appid: string;
	push_secret: string;
	jobs: {
		service: string;
		description: string;
		rule: string;
		start: string;
		end: string;
		data: {
			[key: string]: unknown;
		};
	}[];
	[key: string]: unknown;
}

interface IDBConfigPostgres {
	type: 'postgres';
	source: string;
}

interface IDBConfigMysql {
	type: 'mariadb' | 'mysql';
	source: string | string[];
}

type IDBConfig = IDBConfigPostgres | IDBConfigMysql;

interface IAdmin {
	timeout: number;
	mqtt: string;
	port: number;
	acao: string;
	acma: number;
	dbs: {
		[db: string]: IDBConfig;
	};
	db: IDBConfig,
	redis: {
		url: string;
		expiration: number;
	};

	max_file_size: number;

	minio: {
		endPoint: string;	// 127.0.0.1
		port: number;		// 9000
		accessKey: string;
		secretKey: string;
		useSSL?: boolean;
		region?: Region;	// cn-north-1
		transport?: string;	// todo any
		sessionToken?: string;
		partSize?: number;
	};
	push_appid: string;
	push_secret: string;
	doccode: string;
	[key: string]: unknown;
}

const config = require(join(process.cwd(), 'mm.json')) as IAdmin;

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

const proj = require(join(cwd, 'mm.json')) as IProject;

if (debug) {
	proj.acao = '*';
	proj.acma = 150000;
}

const conf: IAdmin & IProject & { cwd: string; debug: boolean; } = {
	...proj,
	...config,
	...{
		cwd,
		debug
	}
};

if (!conf.dbs) {
	conf.dbs = {};
}

export default conf;
