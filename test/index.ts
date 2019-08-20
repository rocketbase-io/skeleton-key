import * as fetchMock from "fetch-mock";
fetchMock.config.fallbackToNetwork = true;
fetchMock.mock("foobar", 200);

// @ts-ignore
const src = require.context('../src', true, /\.tsx?/);
src.keys().forEach(src);

// @ts-ignore
const tests = require.context('.', true, /\.test\.tsx?/);
tests.keys().forEach(tests);
