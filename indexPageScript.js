//<![CDATA[
		
		// ------------------------- Configuration Area --------------------------
		
      
            
            
		// Search Engine ID
		var searchEngineID = "009877431157003102180:oytpzxj_lgc";
		
		// List of countries with domain.
		var countryDomainList =
		{
			//Testing: "" //Use this while testing to save api requests. Comment out other domains.
			
			USA : "countryUS",
			Brazil: "countryBR",
			UK	: "countryUK",
			SouthAfrica: "countryZA",
			India: "countryIN",
			Australia: "countryAU"
	
		};
		
		//Seperate apikey for each country.
		var apiKeyList =
		{
			Default: "AIzaSyAg_dZVi4ldat-sQ0Jrjz4zganUMvwkYB8",
			Testing: "AIzaSyCzxXKgJ-f9kHIJ1DyItBCPwTiAishPpM8",
			USA : "AIzaSyC3XSz7mUxm0TjTLEOUTajqo8uH7AV8EWY",
			Brazil: "AIzaSyDDzxQ5s8dqZ8uUxVgVTosgU5D45u4oa4o",
			UK : "AIzaSyDZBoLGi1pejBEcIENDu6CCvV3zfdSMKsI",
			SouthAfrica: "AIzaSyDAmjOj2kvVrpdhxr27ozrYBUu3AToq-bA",
			India: "AIzaSyCbU-5xr739ObKEwmg79lj53EHUeFlqie0",
			Australia: "AIzaSyBTZXsFQwhKsj5N-kLDpMwd0cnb3lUU6Zg"
		};
		
		// ------------------------- Utility Functions  -------------------------------

		function getDomainName(country)
		{
			if (countryDomainList.hasOwnProperty(country))
				return countryDomainList[country];
				
			console.log("Missing Domain"+country);
		}
		
		function getAPIkey(country)
		{
			if (apiKeyList.hasOwnProperty(country))
				return apiKeyList[country];
			
			console.log("Missing API Key"+country);
			
			return apiKeyList["Default"];
		}
		
		// ------------------------- GCS API Call  -------------------------------
		
		var activeRequests = 0;
		
		// Function to call google api.
		function searchImage(keywords,country)
		{
			var q= keywords.replace(/ /g, "+") +"+" +country;
			var cx = searchEngineID;
			var key = getAPIkey(country);
			var callback = "handler";
			var searchType = "image";
		
            
			//Set country same as geo location.
			var gl = getDomainName(country);
			var cr = gl;
			// Optimize response by limiting fields.
			var optFields = "&fields=items(title,image/thumbnailLink,image/contextLink)";
						
			var apiURL = "https://www.googleapis.com/customsearch/v1?"+"q="+q+"&key="+key+"&cx="+cx+"&searchType="+searchType+"&gl="+gl+"&cr="+cr+optFields;
						
			$.ajax({
				   url: apiURL,
				   dataType: 'json',
				   success: function(json_data)
				   {
						display(country,json_data.items);

						// Remove request from global tracker.
						activeRequests--;
                       
                     $("#carousel"+country).waterwheelCarousel({
                     forcedImageHeight: 250,
                         forcedImageWidth: 280,
                          separation: 200,
                     
                     });   
                       
				   }
               
                
			});
			
			// Add to request to global counter.
			activeRequests++;
		}
		

		// ------------------------- HTML Manipulation  -------------------------------
		
		// Function to retireive search query from html.
		function search()
		{
			var q = document.getElementById('searchBox').value;
			
			if(q=="")
			{
				alert("Enter a keyword");
				return;
			}
			
			if(activeRequests > 0)
			{
				alert("Please Wait..");
				return;
			}
			
			clearDisplay();
			
			// Search each country in list.
			for (var country in countryDomainList)
			{
				searchImage(q,country);
			}
		
     
        }

            
                
                
		// Function displays data on webpage. @Akshay: Modifications come here, #Tanay.
		function display(countryName,results)
		{
			// Return if results not present.
			if(results ==null)
			{
				console.log("Error in fetching results for "+countryName);
				return;
			}
			
			// Set heading for country.
			var divElement = "<div id='"+countryName+"'> <center><h3>"+countryName+ "</h3></center></br>";

            $('#carousel'+countryName).html('');
            
			// Display images.
			for(var i=0;i <results.length; i++)
			{
				// Title used for alt attribute.
				var title = results[i].title;
				
				// Link to image.
				var imageSource = results[i].image.thumbnailLink;
				
				// Link to webpage.
				var imageRef = results[i].image.contextLink;
				
				
			
                $('#carousel'+countryName).append('<a href="'+imageRef+'" target="_blank"><img  class="search-image" src="'+imageSource+'"/></a>');
            
           
            
            }
			
            
           
			
		}
		
		// Clear Results
		function clearDisplay()
		{
			
		}
		
		//]]>