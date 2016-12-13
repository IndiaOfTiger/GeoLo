$(
    function initMap() {
        map = new google.maps.Map(document.getElementById('Location-map'), {
        center: {lat: 23.5832340, lng: 120.5825975},
        zoom: 12});
    }
);
// $(function() function initMap()); Doesn't Work!
$(function(){
        var pinColor = "ffffff";
        var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
            new google.maps.Size(21, 34),
            new google.maps.Point(0,0),
            new google.maps.Point(10, 34));
        var markers = [];
        var interval = 12000; // 1000ms = 1sec
        var output = {lat: 23.5832340, lng:120.5825975};
        var latDom = $('#lat > span');
        var lngDom = $('#lng > span');
        var centerRead = "" // Set Flag, We only update center once
        var r = 40;
        var g = 40;
        var b = 40;

        /* var $Name = $('#Name');
        var $Lat = $('#Lat');
        var $Lng = $('#Lng');
        $('#AddLo').on('click', function(){
                             var Location = {Name: $Name.val(),Lat: $Lat.val(), Lng: $Lng.val()};
                             $.ajax({
                             type: 'POST',
                             url: 'http://localhost/GeoLo/index.html',
                             data: Location,
                             success: function(NewLocation){
                             $('#UserData').append('<li>' + Location.Name + '</li>'),
                             addMarker(Location.Lat, Location.Lng);
                             },
                             error: function()
                             {alert('Error');}
                             });
                            }); */

        function Color_O (data)
        {
            r = data[0];
            g = data[1];
            b = data[2];
            changepinImage();
        }

        function changepinImage()
        {
            //console.log('hi');

            pinColor = rgbToHex(r,g,b).toString();
            //console.log(pinColor);
            pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
            new google.maps.Size(21, 34),
            new google.maps.Point(0,0),
            new google.maps.Point(10, 34));
            //console.log(pinImage);
        }

        function iot_app(){
            r = 40;
            g = 40;
            b = 40;
        }
        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        function rgbToHex(r, g, b) {
            return componentToHex(r) + componentToHex(g) + componentToHex(b);
        }

        function domUpdater() {
            // Try to only update once
            //gg++;
            //console.log(gg);
            latDom.text(output.lat);
            lngDom.text(output.lng);
            moveMapCenter();
            addMarker(output.lat, output.lng);
            requestAnimationFrame(domUpdater);
        }
        requestAnimationFrame(domUpdater); // Refresh Page

        function addMarker(lat, lng)
        {
            changepinImage();
            console.log(pinColor);
            var marker = new google.maps.Marker({
                position:{ lat: lat, lng: lng },
                map: map, 
                icon: pinImage,});
            markers.push(marker);

        }

        //addMarker(output.lat, output.lng);

        var i = 0, total_Marker = 5;
        function succesiveMarker() {
            console.log('i:'+i);
            if( i < total_Marker )
            {
                addMarker(output.lat+i/100, output.lng+i/100);
                setTimeout( succesiveMarker, 2000 );
                i++;
            }
            
            
        }
        succesiveMarker();
        function setMapOnAll(map) {
          for (var i = 1; i < markers.length; i++) {
            markers[i].setMap(map);
          }
        }
        function clearMarkers() {
          setMapOnAll(null);
        }
        function deleteMarkers() {
          clearMarkers();
          markers = [];
        }

        function moveToLocation(lat, lng, zoom){
            var center = new google.maps.LatLng(lat, lng);
            map.panTo(center);
            map.setZoom(zoom);
        }
        function moveMapCenter() {
            moveToLocation(output.lat , output.lng , 12 );

        } 
        function showPosition(position) {
            output.lat = position.coords.latitude;
            output.lng = position.coords.longitude;
        }
        //var kk = 0;
        function iotUpdater() {
            //console.log(kk);
            if( navigator.geolocation )
            {
                navigator.geolocation.getCurrentPosition(showPosition);
                deleteMarkers();
                i = 0;
                succesiveMarker();
            }
        
            //if( window.d_name )
            //  IoTtalk.update(mac, 'Geolocation', [output.lat, output.lng]);
            // Don't Understand
            setTimeout(iotUpdater, interval);
            //requestAnimationFrame(domUpdater);

        }
        /*$('#id').on('click', function()
            getLocation();
            )
        function getLocation()
        {
            document.getElementById('lat');
            document.getElementById('lng')

        }*/
        setTimeout(iotUpdater, interval); // Will this cause loop?
        //requestAnimationFrame(domUpdater);
        /*
        function detach() {
            window.d_name = null;
            IoTtalk.detach(mac);
        }
        window.onunload = detach;
        window.onbeforeunload = detach;
        window.onclose = detach;
        window.onpagehide = detach;*/ // Didn't use , what's the purpose?
        var profile = {
            'dm_name': 'GeoLo',
            'df_list': [Color_O],
        }

        var ida = {
            'iot_app': iot_app,
        }; // How iot device receive data (format)
        dai(profile,ida);
        
});




