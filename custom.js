/* globals
   markers
   polygons
   circles
   L
*/

(function() {
  var map;

  function getSingleByQuery(query){
    return document.querySelectorAll(query)[0];
  }

  function getById(id){
    return document.getElementById(id);
  }

  function setValue(className, value){
    document.querySelectorAll('.' + className + ' .value')[0].innerText = value;
  }

  function formatCoord(value){
    return Math.round(value * 1000000) / 1000000;
  }

  function init(){
    map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
    }).addTo(map);
  }

  function bindEvents(){
    // show current latlng when click on map
    map.on('click', (e) => {
      var lat = formatCoord(e.latlng.lat);
      var lng = formatCoord(e.latlng.lng);

      setValue('current-latlng', 'lat,lng: ' + lat + ', ' + lng);
    });

    // show view center and zoom
    getById('showViewPosition').onclick = function(){
      var center = map.getCenter();
      var lat = formatCoord(center.lat);
      var lng = formatCoord(center.lng);

      setValue('view-center', 'lat,lng, zoom: ' + lat + ', ' + lng + ', ' + map.getZoom());
    };

    getById('addCircle').onclick = function(){
      var lat = getSingleByQuery('#control .circle .lat').value;
      var lng = getSingleByQuery('#control .circle .lng').value;
      var radius = getSingleByQuery('#control .circle .radius').value;
      var fillColor = getSingleByQuery('#control .circle .color').value;

      L.circle([lat, lng], {
        radius: radius,
        fillColor: fillColor
      }).addTo(map);
    };

    getById('addMarker').onclick = function(){
      var lat = getSingleByQuery('#control .marker .lat').value;
      var lng = getSingleByQuery('#control .marker .lng').value;
      var fillColor = getSingleByQuery('#control .marker .color').value;

      L.circleMarker([lat, lng], {
        fillColor: fillColor
      }).addTo(map);
    };
  }

  function drawCircles(circles){
    var circle;
    for(var i = 0; i < circles.length; i++){
      circle = circles[i];
      L.circle([circle[0], circle[1]], {
        radius: circle[2],
        fillColor: '#FF0000'
      }).addTo(map);
    }
  }

  function drawPolygons(polygons){
    for(var i = 0; i < polygons.length; i++){
      L.polygon(polygons[i]).addTo(map);
    }
  }

  function drawMarkers(markers){
    var marker;
    for(var i = 0; i < markers.length; i++){
      marker = markers[i];
      var options = {};

      if(marker[3]){
        options.fillColor = marker[3];
      }

      L.circleMarker([marker[0], marker[1]], options).addTo(map);
    }
  }

  function draw(){
    drawCircles(circles);
    drawPolygons(polygons);
    drawMarkers(markers);
  }

  init();

  map.setView([12.297068, 15.645559]);
  map.setZoom(6);

  bindEvents();
  draw();

})();
