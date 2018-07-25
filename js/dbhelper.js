 /**
 * Common database helper functions.
 */
 const localDb=idb.open('restaurants',1,function(upgradeDb){
    const allStore=upgradeDb.createObjectStore('all');
    const individualStore=upgradeDb.createObjectStore('individual',{
      keyPath: 'id'
    });
  })

class DBHelper {
  
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
 
   
  static get DATABASE_URL() {
    //const baseUrl=/^.*\:\d+/.exec(window.location.href)[0];
    //return `${baseUrl}/data/restaurants.json`;
    
    const baseUrl='https://script.google.com/macros/s/AKfycbw4Qy1-uSwHXlrN532_lebD48vxmh-w9tk4DRd8TrOqmDQImjzL/exec'
    //const baseUrl='http://node28.codenvy.io:40848';
    //const baseUrl='http://localhost:1337/restaurants';
    //https://rmw-mws-server.herokuapp.com/
    return `${baseUrl}`;
}


  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback,id) {
    localDb.then( db => {
    const storeName = (typeof id!='undefined') ? 'individual'  : 'all';
    const tx =db.transaction(storeName,'readwrite');
    const store = tx.objectStore(storeName);
    const storeResponse= (typeof id!='undefined') ? store.get(Number(id)) : store.get('restaurants');
    storeResponse.then(response =>{
     if(response) return callback(null,response);
     let url=DBHelper.DATABASE_URL
     if(typeof id!='undefined') url+='?id='+id;
     //if(id) url+='/'+id;
     fetch(url)
     .then(response => response.json())
     .then(response => {
      if(typeof id!='undefined'){
        db.transaction(storeName,'readwrite')
        .objectStore(storeName)
        .put(response)
      }else{
        db.transaction(storeName,'readwrite')
        .objectStore(storeName)
        .put(response,'restaurants')
      }
      return response;
    })
    .then(response => callback(null,response))
    .catch(callback)
      
    })

    })
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurant) => {
      if (error) {
        callback(error, null);
      } else {
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    },id);
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph || 'alt'}.jpg`);
  }

  /**
   * Map marker for a restaurant.
   */
   static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(newMap);
    return marker;
  }

}

