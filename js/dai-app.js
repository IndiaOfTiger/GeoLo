$(
    function initMap() {
        map = new google.maps.Map(document.getElementById('Location-map'), {
        center: {lat: 23.5832340, lng: 120.5825975},
        zoom: 3});
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
        var markersDom = $('#markers > span');
        var centerRead = "" // Set Flag, We only update center once
        var r;
        var g;
        var b;
        var lat;
        var lng;
        var temp_r;
        var temp_g;
        var temp_b;
        var temp_lat;
        var temp_lng;
        var description;
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
            
            console.log(data);
            //addMarker(lat, lng);
        }
        function Description_O (data)
        {
            description = data[0];
            console.log(data);
            if((r == temp_r && g == temp_g && b == temp_b) && (lat == temp_lat && lng == temp_lng))
                return;
            else
            {
                temp_r = r;
                temp_b = b;
                temp_g = g;
                temp_lng = lng;
                temp_lat = lat;
            }
            addMarker(lat, lng);

        }
        function GeoLo_O (data)
        {
            lat = data[0];
            lng = data[1];
            console.log(data);
            console.log("data[0]:", data[0]);
            console.log("data[1]:", data[1]);

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
            //addMarker(output.lat, output.lng);
            requestAnimationFrame(domUpdater);
        }
        requestAnimationFrame(domUpdater); // Refresh Page

        function addMarker(lat, lng)
        {
            if(lat == 0 && lng == 0)
                return;
            var index;
            index = markers.length;
            var string;
            var _lat = lat;
            var _lng = lng;
            string = '('  + lat + ',' + lng + ')' + '\n';
            //markersDom.append(document.createTextNode(string));
            markersDom.append('<button class=".btn-default delete" value = "'+index+'">'+string+'</button>');
            changepinImage();
            console.log(pinColor);
            var infowindow = new google.maps.InfoWindow(
               {
                   content: description
               });
            var marker = new google.maps.Marker({
                position:{ lat: lat, lng: lng },
                map: map, 
                icon: pinImage,});
            marker.addListener('click', function() {
                               infowindow.open(map, marker);
                               });
            markers.push(marker);


        }
        $(document).on('click', '.delete', function(){
                $(this).remove();
                index = $(this).val();
                markers[index].setMap(null);
            });

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
        //succesiveMarker();
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
            moveToLocation(output.lat , output.lng , 3 );

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
                //deleteMarkers();
                i = 0;
                //succesiveMarker();
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
            'df_list': [Color_O, GeoLo_O, Description_O],
        }

        var ida = {
            'iot_app': iot_app,
        }; // How iot device receive data (format)
        dai(profile,ida);
        
});




