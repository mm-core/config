import { join } from 'path';

// eslint-disable-next-line import/no-dynamic-require
const config = require(join(process.cwd(), 'mm.json')) as Record<string, unknown>;

config.debug = process.env.NODE_ENV === 'development';	// production

export default config;
