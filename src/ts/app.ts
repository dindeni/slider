const req = require.context('../blocks', true, /\.(scss|js|ts)$/);
req.keys().forEach(req);

import DemoPage from '../blocks/demoPage/demoPage';

const demoPage = new DemoPage();
demoPage.initSliders();
