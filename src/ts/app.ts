const req = require.context('../', true, /^(?!.*test\.(js|ts)).*\.(scss|js|ts)$/);
req.keys().forEach(req);
