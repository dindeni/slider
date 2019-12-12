import DemoPage from '../slider/demoPage/demoPage';

const req = require.context('../', true, /^(?!.*test\.(js|ts)).*\.(scss|js|ts)$/);
req.keys().forEach(req);

const demoPage = new DemoPage();
demoPage.initSliders();
