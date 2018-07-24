self.addEventListener('install',function(event){
  event.waitUntil(
    caches.open('restaurant-v1').then(cache => {
      return cache.addAll([
        '/',
        '/sw.js',
        'js/idb.js',
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
      if(event.request.url.includes('.jpg')){
        fetch(event.request).then(response => {
          caches.open('restaurant-v1')
          .then(cache => {
          cache.put(event.request.url,response.clone());
          return response;
          });
        });
      }
      return fetch(event.request);
    })
    );
});