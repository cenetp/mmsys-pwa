var cacheName = 'pwa1-cache';
var filesToCache = [
  'index.html'
];
this.addEventListener('install', function(e) {
  console.log('SW: Installing...');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('SW: Caching app shell...');
      return cache.addAll(filesToCache);
    })
  );
});
