const req = require.context('../', true, /^(?!.*test\.(js|ts)).*\.(scss|js|ts)$/);
req.keys().forEach(req);

import DemoPage from '../slider/demoPage/demoPage';

const demoPage = new DemoPage();
demoPage.initSliders();
