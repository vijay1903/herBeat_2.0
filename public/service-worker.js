var cacheName = 'herbeat-cache-v1';
var filesToCache = 
['/',
'/js/custom.js',
'/js/firebase.js',
'/js/sw.js',
'/service-worker.js',
'/manifest.json',
'/css/custom.css',
'/dashboard',
'/angular-chart.js/angular-chart.js',
'/angular-chart.js/angular-chart.min.js',
'/controllers/dashboardController.js',
'/css/custom.css',
'/dist/js/sb-admin-2.js',
'/img/distance.jpg',
'/img/logo.png',
'/img/standing.jpg',
'/img/steps.png',
'/img/walking.png',
'/img/sitting.png',
'/vendor/bootstrap4/css/bootstrap.min.css',
'/vendor/bootstrap4/css/bootstrap-grid.min.css',
'/vendor/bootstrap4/css/bootstrap-reboot.min.css',
'/vendor/font-awesome/css/fontawesome-all.css',
'/vendor/charts/Chart.js',
'/vendor/daterangepicker/daterangepicker.css',
'/vendor/jquery/jquery.min.js',
'/vendor/bootstrap4/js/bootstrap.min.js',
'/vendor/metisMenu/metisMenu.min.js',
'/dist/js/sb-admin-2.js',
'http://ajax.googleapis.com/ajax/libs/angularjs/1.4.9/angular-cookies.js',
'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.9/angular-route.js',
'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.9/angular-route.min.js',
'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.9/angular-sanitize.js',
'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.9/angular.js',
'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.9/angular.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js'
];


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        console.log('SW installed cache.');
        console.log('Files cached : ' + filesToCache);
        return cache.addAll(filesToCache);
    })
    .catch((err)=>{
      console.log("Error while installing.",err);
    })
    // .then(() => {
    //   // console.log(cache);
    //   return self.skipWaiting();
    // })
  );
});

self.addEventListener('activate', function(event) {
  console.log('SW activated');
  var cacheWhitelist = [cacheName];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
        console.log('SW activated');
        return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
    .catch((err)=>{
      console.log("Error activating service worker",err);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        
        
        // console.log(response);
        
        
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        var fetchRequest = event.request.clone();
        
        
        // console.log(event.request);
        
        
        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            
            
            // console.log(response);
            
            
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();
            caches.open(cacheName)
              .then(function(cache) {


                // console.log(cache);

                cache.put(event.request, responseToCache)
                .catch((err)=>{
                  console.log(err);
                });
              })
              .catch((err)=>{
                console.log("Error putting to cache: ",err);
              })
            return response;
          })
          .catch((err)=>{
            console.log("Error returning fetch request promise: ",err);
          });
      })
      .catch((err)=>{
        console.log("Error getting from cache: ",err);
      })
    )
    // .catch((err)=>{
    //   console.log('Error: ',err);
    // });
});


