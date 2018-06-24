self.addEventListener('install',function(event){
  event.waitUntil(
    caches.open('restaurant-v1').then(cache => {
      return cache.addAll([
        '/',
        '/sw.js',
        '/restaurant.html',
        'js/main.js',
        'js/dbhelper.js',
        'js/restaurant_info.js',
        'css/styles.css'
        ]);

    }));
});

self.addEventListener('fetch',function(event){
  event.respondWith(
    caches.match(event.request).then(response => {
      if(response) return response;
      return fetch(event.request);
    })
    );
});