import Demo from '../blocks/demo/Demo';

const req = require.context('../', true, /^(?!.*test\.(js|ts)).*\.(scss|js|ts)$/);
req.keys().forEach(req);

const demoPage = new Demo();
demoPage.loadSliders();
