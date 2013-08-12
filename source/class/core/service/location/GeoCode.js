/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

/**
 * Wrapper around Google's Geocoding API.
 *
 * Note: The Geocoding API must only be used in combination with showing locations
 * on the Google Maps interface. For details see the license of the Google Maps API.
 */
core.Module("core.service.location.GeoCode",
{
  detect : function(data)
  {
    var promise = core.event.Promise.obtain();

    var url = "//maps.googleapis.com/maps/api/geocode/json?sensor=true&latlng=";
    url += data.latitude + "," + data.longitude;

    console.log("Sending request to: " + url);

    // TODO: Make use for XHR wrapper
    var xhr = new XMLHttpRequest;
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() 
    {
      if (xhr.readyState == 4) 
      {
        var parsed = core.JSON.parse(xhr.responseText);
        if (parsed.status == "OK") 
        {
          var components = parsed.results[0].address_components;
          var relevant = ["street_number", "route", "locality", "postal_code"];

          for (var i=0, il=components.length; i<il; i++)
          {
            var component = components[i];
            var value = component.long_name;
            var types = component.types;

            for (var j=0, jl=relevant.length; j<jl; j++)
            {
              if (types.indexOf(relevant[j]) != -1)
              {
                data[relevant[j]] = value;
                break;
              }
            }
          }

          promise.fulfill(data);
        }
        else
        {
          promise.reject("Failed to get or invalid result from Google!");
        }
      }
    };

    xhr.send(null);

    return promise;
  }
});
