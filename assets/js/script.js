/**
 * Step 1: Use "https://realty-mole-property-api.p.rapidapi.com/rentalListings?city=Austin&state=TX" to get the Rental Property Listing in the given city.
 * Step 2: Display the properties on the html as formatted address.
 * Step 3: Provide 2 buttons one for "Show Property Details" and other "Local Events"
 * Step 4: On click "Show Property Details" call https://realty-mole-property-api.p.rapidapi.com/properties?address= with the property address from the display.
 * Step 5: On click "Local Events", call yelp api to get events using the city from the formatted address.
 */
 $(document).ready(function(){
	$('select').formSelect();
 });
 
	
$("#searchBtn").on("click",function(){
	var city = $("#input").val();
	console.log(city);
	var selectedState = $('#state :selected').val();
	console.log("Selected State on Search" + selectedState);

	//Ajax call to get rental listing
	var settings = {
			"async": true,
			"crossDomain": true,
			"url": "https://realty-mole-property-api.p.rapidapi.com/rentalListings?city=" + city + "&state="+ selectedState +"&limit=10",
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
		//Ajax call for events
	var settings = {

		"url": "http://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/events?limit=10&location=" + city + "," + selectedState,
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
	


 
function showListing(response) {
	var column = `<div class="col s6">
	<div class="card">
	  <div class="card-image">
		<span class="card-title" id="title-1"></span>
		<img id="img-1" src="#">
	  </div>
	  <div class="card-content" id="content-1">
		<p></p>
	  </div>
	  <div class="card-action" id="link-1">
		<a href="#"></a>
	  </div>
	</div>
  </div>`
 for(var i = 0; i < response.length; i++){};
}

function showEvents(response){
	
 for(var i = 0; i < response.events.length; i++){
	var event = response.events[i];
	var column = `<div class="col s6">
	<div class="card">
	  <div class="card-image">
		<span class="card-title" id="title-1">${event.name}</span>
		<img id="img-1" src="${event.image_url}">
	  </div>
	  <div class="card-content" id="content-1">
		<p></p>
	  </div>
	  <div class="card-action" id="link-1">
		<a href="#"></a>
	  </div>
	</div>
  </div>`
    $("#results").append(column);

 };

};