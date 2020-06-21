/**
 * Step 1: Use "https://realty-mole-property-api.p.rapidapi.com/rentalListings?city=Austin&state=TX" to get the Rental Property Listing in the given city.
 * Step 2: Display the properties on the html as formatted address.
 * Step 3: Provide 2 buttons one for "Show Property Details" and other "Local Events"
 * Step 4: On click "Show Property Details" call https://realty-mole-property-api.p.rapidapi.com/properties?address= with the property address from the display.
 * Step 5: On click "Local Events", call yelp api to get events using the city from the formatted address.
 */

//Initiating drop down
$(document).ready(function () {
	$('select').formSelect();
});

//adding event listener on search button
$("#searchBtn").on("click", function () {
	$("#results").empty();
	var city = $("#input").val();
	var formattedCity = city.charAt(0).toUpperCase() + city.slice(1);
	var selectedState = $('#state :selected').val();
	var eventStartDate = moment().unix();
	var eventEndDate = moment().add(moment.duration(1, 'months')).unix();

	//Ajax call to get rental listing
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://realty-mole-property-api.p.rapidapi.com/rentalListings?city=" + formattedCity + "&state=" + selectedState + "&limit=10",
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "realty-mole-property-api.p.rapidapi.com",
			"x-rapidapi-key": "5b3ff73122msh6af3ba0447690c7p1e5784jsn2bc639bd251a"
		}
	};
	$.ajax(settings).done(function (response) {
		console.log(response);
		showListing(response);

	});

	//Ajax call to get local events
	var settings = {

		"url": "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/events?limit=10&location=" + formattedCity + "," + selectedState + "&start_date=" + eventStartDate + "&end_date=" + eventEndDate + "&sort_on=time_start",
		"method": "GET",
		"timeout": 0,
		// dataType: "jsonp",
		"headers": {
			"Authorization": "Bearer ziQsHIfnSa_NACbvMbDhqwbokq9PHvJ8vhH3TqgnSKqriuR-X8NwwjZ2zcdke6bCgJ-wW4NtRRKuAk0IdZzWg71fPHApVP841FW-X3sLYft0wMD9AK9ioGrJQRnsXnYx"

		},
	};
	$.ajax(settings).done(function (response) {
		showEvents(response);
		console.log(response);
	})


});

//This function is for displaying the rental listing
function showListing(response) {
	for (var i = 0; i < response.length; i++) {
		var rentals = response[i];
		var button = $("<button>");
		button.attr("type", "button");
		button.attr("data-index", escape(rentals.formattedAddress));
		button.attr("class", "buttonSeeMore");
		button.attr("alt", "See More");

		var card = `<div class="card">
		<div class="row">
			<div class="card-image col s4">
				<img id="img-1" src="#">
			</div>
			<div class="card-content col s8" id="content-1" >
				<h6><strong>Address: ${rentals.formattedAddress}</strong></h6>
				<p><strong>Rent</strong>: $ ${rentals.price}</p>
				<p><strong>Property Type</strong>: ${rentals.propertyType}</p>
				<p><strong>No of bedroom</strong>: ${rentals.bedrooms}</p>
				<p><strong>No of bathroom</strong>: ${rentals.bathrooms}</p>
				<button class="buttonSeeMore">See More</button>
			</div>
	  	</div>
	</div>`

		$("#rental-results").append(card);
		//$("#rental-results").append(button);

	};
};

// //add event listener to seeMore button
// $('body').on("click", '.buttonSeeMore', function(){
// 	var buttonIndex = $(this).data('index');
// 	console.log(buttonIndex);

// 	var settings = {
// 		"async": true,
// 		"crossDomain": true,
// 		"url": "https://realty-mole-property-api.p.rapidapi.com/properties?address=" + buttonIndex,
// 		"method": "GET",
// 		"headers": {
// 			"x-rapidapi-host": "realty-mole-property-api.p.rapidapi.com",
// 			"x-rapidapi-key": "5b3ff73122msh6af3ba0447690c7p1e5784jsn2bc639bd251a"
// 		}
// 	}

// 	$.ajax(settings).done(function (response) {
// 		console.log(response);
// 	});
//   });

//   function showMore(address) {
// 	var settings = {
// 		"async": true,
// 		"crossDomain": true,
// 		"url": "https://realty-mole-property-api.p.rapidapi.com/properties?address=" + address,
// 		"method": "GET",
// 		"headers": {
// 			"x-rapidapi-host": "realty-mole-property-api.p.rapidapi.com",
// 			"x-rapidapi-key": "5b3ff73122msh6af3ba0447690c7p1e5784jsn2bc639bd251a"
// 		}
// 	}

// 	$.ajax(settings).done(function (response) {
// 		console.log(response);
// 	});	  
//   }

// this function is for displaying local events
function showEvents(response) {

	for (var i = 0; i < response.events.length; i++) {
		var event = response.events[i];
		var card = `<div class="card">
		<div class="row">
	  <div class="card-image col s4">
		<img id="img-1" src="${event.image_url}">
	  </div>
	  <div class="card-content col s8" id="content-1">
		<h6><strong> Title: ${event.name}</strong></h6>
		<p><strong>Description</strong>: ${event.description}</p>
		<p><strong>Venue</strong>: ${event.location.display_address[0]}</p>
		<button class="buttonReadMore"><a href="${event.event_site_url}" target ="_blank">Read More</a></button>
	  </div>
	</div>`
		$("#event-results").append(card);

	};

};
