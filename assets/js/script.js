/** to do:
 * 1. user should enter a valid city or error message should be displayed
 * 2. user has to select a state or error message should be displayed
 * 3. If service not available display proper message
 * 4. if any value is not present/ undefined, how to handle it?
 * 5. if no events available, what message should be displayed?
 */

// Loading message displayed until getting response 
var $loading = $('#loadingDiv').hide();
$(document)
	.ajaxStart(function () {
		$loading.show();
	})
	.ajaxStop(function () {
		$loading.hide();
	});
// Hamburger view
$(document).ready(function(){
    $('.sidenav').sidenav();
  });
        
//Initiating drop down
$(document).ready(function () {
	var imageArray = ["assets/images/img-1.jpg", "assets/images/img-2.jpg", "assets/images/img-3.jpg", "assets/images/img-4.jpg", "assets/images/img-5.jpg", "assets/images/img-6.jpg", "assets/images/img-7.jpg", "assets/images/img-8.jpg", "assets/images/img-9.jpg", "assets/images/img-10.jpg"];



	//Initiating drop down
	$('select').formSelect();


	//adding event listener on search button
	$("#searchBtn").on("click", function () {
		$("#rental-results").empty();
		$("#event-results").empty();

	// Splitting words, replacing first letter of each word with capital letter and joining them so they can be added to url		

		// var word1 = city[0].charAt(0).toUpperCase()+city[0].slice(1);
		// if (city[1]==null){
		// 	city=word1;
		// }else if (city[1]){
		// var word2 = city[1].charAt(0).toUpperCase()+city[1].slice(1);
		// 	city = word1 + "%20" + word2
		// }

		var city = $("#input").val().split(" ");
		var concatCity =" ";
		if (city.length > 1) {
			city.forEach(element => {
				concatCity = concatCity + element.charAt(0).toUpperCase() + element.slice(1) + " ";
			});
			city = escape(concatCity.trim());
		} else {
			city = city[0].charAt(0).toUpperCase() + city[0].slice(1);
		}

		var selectedState = $("#state :selected").val();
		var eventStartDate = moment().unix();
		var eventEndDate = moment().add(moment.duration(6, "months")).unix();

		//Ajax call to get rental listing
		var settings = {
			"async": true,
			"crossDomain": true,
			"url": "https://realty-mole-property-api.p.rapidapi.com/rentalListings?city=" + city + "&state=" + selectedState + "&limit=10",
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
			"url": "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/events?limit=10&location=" + city + "," + selectedState + "&start_date=" + eventStartDate + "&end_date=" + eventEndDate + "&sort_on=time_start",
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
			var card = `<div class="card">
					<div class="row">
						<div class="card-image col s4">
							<img id="img-1" class="responsive-img" src="${imageArray[i]}">
						</div>
						<div class="card-content col s8" id="content-1" >
							<h6><strong>Address: ${rentals.formattedAddress == null ? " " : rentals.formattedAddress}</strong></h6>
							<p><strong>Rent</strong>: $ ${rentals.price == null ? " " : rentals.price}</p>
							<p><strong>Property Type</strong>: ${rentals.propertyType == null ? " " : rentals.propertyType}</p>
							<p><strong>No of bedroom</strong>: ${rentals.bedrooms == null ? " " : rentals.bedrooms}</p>
							<p><strong>No of bathroom</strong>: ${rentals.bathrooms == null ? " " : rentals.bathrooms}</p><br>
							<button class="buttonViewMap" data-index="${escape(rentals.formattedAddress == null ? " " : rentals.formattedAddress)}">View Map</button>
						</div>
					</div>
			</div>`
			$("#rental-results").append(card);
		};
	};

	//add event listener to View Map button
	$('body').on("click", '.buttonViewMap', function () {
		var buttonIndex = $(this).data('index');
		console.log(buttonIndex)
	

	//GeoCode Address
		var settings = {
			"async": true,
			"crossDomain": true,
			"url": "https://www.mapquestapi.com/geocoding/v1/address?key=rS5lDoNcX2uDA4T332RbG7npjFiUZ84p&location=" + buttonIndex ,
			"method": "GET",
		}
		$.ajax(settings).done(function (response) {
		lat = response.results[0].locations[0].latLng.lat
		lng = response.results[0].locations[0].latLng.lng

		url= "https://www.mapquestapi.com/staticmap/v5/map?locations="+lat+ "," +lng+"&size=1280,800@2x&key=rS5lDoNcX2uDA4T332RbG7npjFiUZ84p"
		// console.log(url)	
		window.open(url);
		});		
	});


	// this function is for displaying local events
	function showEvents(response) {

		for (var i = 0; i < response.events.length; i++) {
			var event = response.events[i];
			var card = `<div class="card">
				<div class="row">
					<div class="card-image col s4">
						<img id="img-1" class="responsive-img" src="${event.image_url}">
					</div>
					<div class="card-content col s8" id="content-1">
						<h6><strong> Title: ${event.name}</strong></h6>
						<p><strong>Description</strong>: ${event.description}</p>
						<p><strong>Venue</strong>: ${event.location.display_address[0]}</p>
						<button class="buttonReadMore"><a href="${event.event_site_url}" target ="_blank">Read More</a></button>
					</div>
				<div>	
			</div>`
			$("#event-results").append(card);

		};

	};
});
