/*
    Student Name: Seeram Likitha
    Project Name: Project 2
    Due Date: 26 Oct 2016
*/

var username = "likitha_23";
var request = new XMLHttpRequest();
var i = 0;

//Function to initialize map and then call reverseGeocode with new marker coordinates
function initMap() {
        var coord = {lat: 32.75, lng: -97.13}; 
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 17,
          center: coord
        });
        var marker = new google.maps.Marker({
          position: coord,
          map: map
        });
        var geocoder = new google.maps.Geocoder;
        var infowindow = new google.maps.InfoWindow;

        map.addListener('click', function(event) {
            var latitude = event.latLng.lat();
            var longitude = event.latLng.lng();
            marker.setPosition(event.latLng);
            reverseGeoCoding(geocoder, map, infowindow, latitude, longitude, marker);   
            });
        }

//Function to get the postal address of a place through latitude and longitude. Later call sendRequest() which uses geoNames api
function reverseGeoCoding(geocoder, map, infowindow, latitude, longitude, marker) {
        var loc = {lat: latitude, lng: longitude};
        geocoder.geocode({'location': loc}, function(results, status) {
          if (status === 'OK') {
            if (results[1]) {
              map.setZoom(11);
              marker.setPosition(loc);
              infowindow.setContent("Postal Address: "+results[1].formatted_address);
              infowindow.open(map, marker);
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
        sendRequest(latitude, longitude, marker, infowindow);
        }

//This method makes an asynchronous call to geoNames API 'findNearByWeatherXML'
function sendRequest (latitude, longitude, marker, infowindow) {
        request.open("GET"," proxy.php?lat="+latitude+"&lng="+longitude+"&username="+username);
        request.withCredentials = "true";
        request.setRequestHeader("Accept","text/xml");
        request.send(null);

        request.onreadystatechange = function () {
            if (this.readyState == 4) {
            displayResult(marker, infowindow);
            }
        };
        }


//We call this method when response from the geoNames API is ready and fetch the weather details from XML. Information is appended to the overlay marker
function displayResult (marker, infowindow) {
        if(request.readyState == 4) {
            var xml = request.responseXML.documentElement;
            var temperature = xml.getElementsByTagName("temperature");
            var windSpeed = xml.getElementsByTagName("windSpeed");
            var clouds = xml.getElementsByTagName("clouds");

            infowindow.setContent(infowindow.getContent()+"<br> Temperature: "+temperature[0].textContent+", WindSpeed: "+windSpeed[0].textContent+", Clouds: "+clouds[0].textContent);
            infowindow.open(map, marker);

            var history = document.getElementById("history");
            displayText(history, infowindow);
            }
        }

//This method displays the postal address and weather details of the place 
function displayText(history ,infowindow) {
        if(i<10) {
            i++;
            var oldHistory = history.innerHTML;
            history.innerHTML = oldHistory + "<p>"+infowindow.getContent()+"</p>";
        }
        else {
            i--;
            history.removeChild(history.children[0]);
            displayText(history, infowindow);   
        }
}

//This method is called upon clicking 'Clear' button
function clearHistory() {
        i=0;
        document.getElementById("history").innerHTML = "<pre>&nbsp;</pre>";
        initMap();
        }