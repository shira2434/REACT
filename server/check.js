const https = require('https');
const db = require('./db.json');

function check(p) {
  return new Promise(resolve => {
    const url = new URL(p.image);
    const req = https.get({hostname:url.hostname,path:url.pathname+url.search,headers:{'User-Agent':'Mozilla/5.0'}}, r => {
      resolve({id:p.id,name:p.name,status:r.statusCode});
    });
    req.on('error', () => resolve({id:p.id,name:p.name,status:'ERR'}));
    req.setTimeout(8000, () => { req.destroy(); resolve({id:p.id,name:p.name,status:'TIMEOUT'}); });
  });
}

(async () => {
  for (const p of db.products) {
    const r = await check(p);
    console.log(r.status===200?'OK':'FAIL', r.id, r.name, r.status);
  }
})();
