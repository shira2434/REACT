const https = require('https');

const candidates = [
  {id:39, name:'לחם שום חמאה', urls:[
    'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1549931319-a545dcf3bc7b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop'
  ]},
  {id:45, name:'אבוקדו טוסט', urls:[
    'https://images.unsplash.com/photo-1603046891744-1f057a5e3f5e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop'
  ]},
  {id:27, name:"גלידת ג'לטו", urls:[
    'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&h=300&fit=crop'
  ]},
  {id:34, name:'סמוזי ירוק', urls:[
    'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1622597467836-f3e6707a5e77?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop'
  ]}
];

function check(url) {
  return new Promise(resolve => {
    const u = new URL(url);
    const req = https.get({hostname:u.hostname,path:u.pathname+u.search,headers:{'User-Agent':'Mozilla/5.0'}}, r => resolve({url,status:r.statusCode}));
    req.on('error', () => resolve({url,status:'ERR'}));
    req.setTimeout(6000, () => { req.destroy(); resolve({url,status:'TIMEOUT'}); });
  });
}

(async () => {
  for (const c of candidates) {
    console.log('--- id', c.id, c.name, '---');
    for (const url of c.urls) {
      const r = await check(url);
      console.log(r.status===200?'OK':'FAIL', r.status, r.url);
    }
  }
})();
