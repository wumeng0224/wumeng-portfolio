const CACHE='wumeng-portfolio-v4';
const CORE=[
  '/wumeng-portfolio/pixel.html','/wumeng-portfolio/pixel-style.css','/wumeng-portfolio/pixel-script.js',
  '/wumeng-portfolio/pixel-projects/engineering-cloud.html','/wumeng-portfolio/pixel-projects/super-factory.html','/wumeng-portfolio/pixel-projects/pharmacist-workstation.html','/wumeng-portfolio/pixel-projects/medical-cost-analysis.html','/wumeng-portfolio/pixel-projects/sports-service-platform.html','/wumeng-portfolio/pixel-projects/smart-charging-cloud.html',
  '/wumeng-portfolio/','/wumeng-portfolio/classic.html',
  '/wumeng-portfolio/style.css','/wumeng-portfolio/classic-style.css','/wumeng-portfolio/script.js',
  '/wumeng-portfolio/projects/engineering-cloud.html','/wumeng-portfolio/projects/super-factory.html','/wumeng-portfolio/projects/pharmacist-workstation.html','/wumeng-portfolio/projects/medical-cost-analysis.html','/wumeng-portfolio/projects/sports-service-platform.html','/wumeng-portfolio/projects/smart-charging-cloud.html',
  '/wumeng-portfolio/classic-projects/engineering-cloud.html','/wumeng-portfolio/classic-projects/super-factory.html','/wumeng-portfolio/classic-projects/pharmacist-workstation.html','/wumeng-portfolio/classic-projects/medical-cost-analysis.html','/wumeng-portfolio/classic-projects/sports-service-platform.html','/wumeng-portfolio/classic-projects/smart-charging-cloud.html',
  '/wumeng-portfolio/assets-optimized/portrait.webp','/wumeng-portfolio/assets-optimized/engineering.webp','/wumeng-portfolio/assets-optimized/factory.webp','/wumeng-portfolio/assets-optimized/pharmacy.webp','/wumeng-portfolio/assets-optimized/medical-data.webp','/wumeng-portfolio/assets-optimized/sports-platform.webp','/wumeng-portfolio/assets-optimized/charging-cloud.webp'
];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;e.respondWith(caches.match(e.request).then(function(hit){var fresh=fetch(e.request).then(function(r){if(r&&r.ok){var copy=r.clone();caches.open(CACHE).then(function(c){c.put(e.request,copy)})}return r}).catch(function(){return hit});return hit||fresh}))});

