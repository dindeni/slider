// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsdom = require('jsdom');

const { JSDOM } = jsdom;
const { window } = (new JSDOM());
const { document } = window.document;

global.window = window;
global.document = document;
global.jQuery = require('jquery');
global.$ = require('jquery');
