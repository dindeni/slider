const req = require.context('./', true, /^(?!.*test|spec\.(js|ts)).*\.(scss|js|ts)$/);
req.keys().forEach(req);
