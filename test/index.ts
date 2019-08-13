
// @ts-ignore
const src = require.context('../src', true, /\.tsx?/);
src.keys().forEach(src);

// @ts-ignore
const tests = require.context('.', true, /\.test\.tsx?/);
tests.keys().forEach(tests);
