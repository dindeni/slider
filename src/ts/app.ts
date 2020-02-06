import DemoPage from '../demo/DemoPage/DemoPage';

const req = require.context('../', true, /^(?!.*test\.(js|ts)).*\.(scss|js|ts)$/);
req.keys().forEach(req);

const demoPage = new DemoPage();
demoPage.loadSliders();
