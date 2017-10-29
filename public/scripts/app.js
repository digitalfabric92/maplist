$(document).ready(function() {
  //getting the list of maps
  $("#maps-display").on("click", function () {
    $.ajax({
      method: "GET",
      url: "/maps"
    }).done((maps) => {
      $("#maps-div").empty();
      for (map of maps) {
        $("#maps-div").append(`<p class="map-name" data-id="${map.id}">${map.name}</p>`);
      }
    });
  });

  //getting likes
  $("#maps-div").on("click", ".map-name", function(e) {
    const $mapId = $(e.target).data("id");
    $.ajax({
      method: "GET",
      url: `/maps/${$mapId}/likes`
    }).done((likes) => {
      $("#likes-div").empty();
      likes.forEach(function(e) {
        $("#likes-div").append(`<p>${e.user_name}</p>`);
      });
    });
  });

  //getting contributors
  $("#maps-div").on("click", ".map-name", function(e) {
    const $mapId = $(e.target).data("id");
    $.ajax({
      method: "GET",
      url: `/maps/${$mapId}/contributors`
    }).done((contributors) => {
      $("#contributor-div").empty();
      contributors.forEach(function(e) {
        $("#contributor-div").append(`<p>${e.user_name}</p>`);
      });
    });
  });

  //getting the points in a single map
  $("#maps-div").on("click", ".map-name", function(e) {
    const $mapId = $(e.target).data("id");
    $.ajax({
      method: "GET",
      url: `/maps/${$mapId}`
    }).done((mapPoints) => {
      mapPoints.forEach((e) => {
          getPoints(e.lat, e.lng, e.title, e.id, e.description, e.image, e.map_id);
      });
    });
  });

  //editing the points in a single map
  $var = $("#edit-point-button")
  $(document).on("click", "#edit-point-button", function(e) {
    const $title = $("#map-title-edit").text();
    const $description = $("#map-description-edit").text();
    const $mapId = $(this).parent().data("mapid");
    const $pointId = $(this).parent().find("#map-title-edit").data("id");
    $.ajax({
      method: "POST",
      url: `/maps/${$mapId}/points/${$pointId}`,
      data: {
        title: $title,
        description: $description
      }
    }).done(() => {
      console.log('we are in done');
    })
  });



// =======================================================================
// Added sidebar.js Events
// =======================================================================

// Posting map name (key press enter event)
$("#name-input").keypress(function(e) {
    if(e.which === 13) {
        var textInput = $("#name-input").val();
        if (textInput === "") {
            alert("You must write a map name!");
        }
        else {
            $.ajax({
                method: "POST",
                url: "/maps/new",
                data: {name: textInput},
                //success: callback or function with response parameter
                success: function (data) {
                  console.log("The data is: ", data);
                  // TODO Check the data object and get the mapId
                  $("#map").data("mapId", data);
                  //$('#mydiv').data('myval',20); //setter

                }
            }).done(() => {
                console.log("POST map name");
            }).fail((err) => {
                console.log({name: textInput});
                console.log("error");
            });
            // $("#search-input").slideToggle("fast");
            $("#name-input").slideToggle("fast");
            // $("#search-input").select();

        }
    }
});

//Event to add points to db
$(document).on('click', "#add-point-button", function(e){
e.preventDefault();
// points.title = $("#map-info").find("#point-title").val();
// points.description = $("#map-info").find("#point-description").val();
// points.lat = $("#point-lat").val();
// points.lng = $("#point-lng").val();
// points.mapId = $("#map-info").data("mapid");
var $image = "https://s3-media3.fl.yelpcdn.com/bphoto/J74IH84zwxBnpjkrW_gn9Q/o.jpg";
var $mapId = $("#map-info").data("mapid");
  $.ajax({
    method: "POST",
    url: `/maps/${$mapId}/points/new`,
    data: {lat: $("#point-lat").val(),
           lng: $("#point-lng").val(),
           map_id: $("#map-info").data("mapid"),
           title:  $("#map-info").find("#point-title").val(),
           description: $("#map-info").find("#point-description").val(),
           image: $image
          },
    success: function (data) {
      console.log("The data is: ", data);
    },
    error : function (xhr,status,error) {
      alert("Status: " + status);
      alert("Error: " + error);
      alert("xhr: " + xhr.readyState);
      console.log("error info data: ", data);
    }
  });
});

});
