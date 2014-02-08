Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

function Coordinate(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.round = function() {
        this.latitude = this.latitude.toPrecisionFixed(getPrecision(this.latitude));
        this.longitude = this.longitude.toPrecisionFixed(getPrecision(this.longitude));
        return this;
    }
};

initialCoordinates = new Array();
initialCoordinates.push(new Coordinate(30.26700, -97.7430));
initialCoordinates.push(new Coordinate(30.25202, -97.7487));

var mapCenter = new Coordinate(30.26263, -97.7433);
var markers = new Array();
var map;
var lineBetweenMarkers;

function initialize() {
    var mapOptions = {
        center: new google.maps.LatLng(mapCenter.latitude, mapCenter.longitude),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"),
                              mapOptions);

    var firstLocation = new google.maps.LatLng(initialCoordinates[0].latitude, 
                                               initialCoordinates[0].longitude);
    var secondLocation = new google.maps.LatLng(initialCoordinates[1].latitude, 
                                                initialCoordinates[1].longitude);

    markers.push(new google.maps.Marker({
                                            position: firstLocation,
                                            title: 'Location 1',
                                            map: map
                                        }));

    markers.push(new google.maps.Marker({
                                            position: secondLocation,
                                            title: 'Location 2',
                                            map: map
                                        }));

    lineBetweenMarkers = new google.maps.Polyline({
                                                    strokeColor: '#FF0000'
                                                  });

    lineBetweenMarkers.setMap(map);
    lineBetweenMarkers.setPath([firstLocation, secondLocation]);
    google.maps.event.addListener(map, 'click', addLatLng);
};

function getPrecision(latlng) {
    if (latlng < 0) {
        return 6;
    }
    return 7;
};

function addLatLng(event) {
    var path = lineBetweenMarkers.getPath();
    var marker = new google.maps.Marker({
                                            position: event.latLng,
                                            title: 'Location ' + path.getLength(),
                                            map: map
                                        });
    
    markers.push(marker);
    if (path.length < 2) {
        path.push(event.latLng);
        return;
    }
    path.removeAt(0)
    path.push(event.latLng);
    markers[0].setMap(null);
    markers.remove(0);
    
    if (markers[0] != null) {
        markers[0].setTitle('Location 1');
        var pos1 = markers[0].getPosition();
        var pos2 = markers[1].getPosition();
        var newCoordinates = new Array();
        newCoordinates.push((new Coordinate(pos1.lat(), pos1.lng())).round());
        newCoordinates.push((new Coordinate(pos2.lat(), pos2.lng())).round());
        
        $('#lat1').val(newCoordinates[0].latitude);
        $('#lon1').val(newCoordinates[0].longitude);
        $('#lat2').val(newCoordinates[1].latitude);
        $('#lon2').val(newCoordinates[1].longitude);
        $('#calc-dist').click();
    }
};