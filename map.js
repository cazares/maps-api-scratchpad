Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

function Coordinate(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
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
    var loc1 = new google.maps.LatLng(initialCoordinates[0].latitude, 
                                      initialCoordinates[0].longitude);
    var loc2 = new google.maps.LatLng(initialCoordinates[1].latitude, 
                                      initialCoordinates[1].longitude);
    markers.push(new google.maps.Marker({
                                        position: loc1,
                                        title: 'Location 1',
                                        map: map
                                        }));
    markers.push(new google.maps.Marker({
                                        position: loc2,
                                        title: 'Location 2',
                                        map: map
                                        }));
    lineBetweenMarkers = new google.maps.Polyline({
                                    strokeColor: '#FF0000'
                                    });
    lineBetweenMarkers.setMap(map);
    lineBetweenMarkers.setPath([loc1, loc2]);
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
        var lat1 = pos1.lat();
        var lng1 = pos1.lng();
        var lat2 = pos2.lat();
        var lng2 = pos2.lng();
        
        $('#lat1').val(lat1.toPrecisionFixed(getPrecision(lat1)));
        $('#lon1').val(lng1.toPrecisionFixed(getPrecision(lng1)));
        $('#lat2').val(lat2.toPrecisionFixed(getPrecision(lat2)));
        $('#lon2').val(lng2.toPrecisionFixed(getPrecision(lng2)));
        $('#calc-dist').click();
    }
};