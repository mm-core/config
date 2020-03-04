const test = require('ava');

const { default: f } = require('../dist/index');

test('config', (t) => {
	const v = f.debug;
	t.is(v, true);
});
