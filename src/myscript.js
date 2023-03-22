const form = document.querySelector('#search-me-form');
const input = document.querySelector('#search-term');
const msg = document.querySelector('.form-msg');
const citiesList = document.querySelector('.cities');



//API KEY 
const apiKey = 'getYouOwnTokenFromWeatherAppAPI(api.openweathermap);


form.addEventListener('submit', event => {
	
	// Prevent default form submission
	event.preventDefault()

	// Reset
	msg.textContent = ''
	msg.classList.remove('visible')

	// Search For input value
	let inputVal = input.value

	// Check if there's already a city that matches the search criteria
	
	const listItemsArray = Array.from(citiesList.querySelectorAll('.cities li'))
    // console.log(listItemArray);
	
    // If same city exist while searching
	if (listItemsArray.length > 0) {
		const filerItemArr = listItemsArray.filter(el => {
			let content = ''
			let cityName = el.querySelector('.city-name').textContent.toLowerCase()
			let cityCountry = el.querySelector('.city-country').textContent.toLowerCase()

			//check for <cities,counrty>format
			if (inputVal.includes(',')) {
				// check country code is invalid (ex. cityname,xxxx) it keeps cityname only
				if (inputVal.split(',')[1].length > 2) {
					inputVal = inputVal.split(',')[0]
					content = cityName;
				} else {
					//counrty name and city format
                    //  content = cityNameNew + ',' + cityCountryNew ;
					content = `${cityName},${cityCountry}`
				}
			} else {
				
				// Only the <city> format 
				content = cityName
			}
			return content == inputVal.toLowerCase()
		})
        console.log(filerItemArr);
		// If filteredArray is not blank, we have matches so we show a message and exit
		if(filerItemArr.length > 0){
            msg.textContent = `You already know the weather Forecast for ${filerItemArr[0].querySelector('.city-name').textContent}....:) please b more specific😉`;
            msg.classList.add('visible');
            form.reset();
            input.focus();
            return
        }
	}
	
const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`
fetch(url)
		.then(response => response.json())
		.then(data => {
			console.log(data)

            if(data.cod == '404'){
                throw new Error(`${data.cod},${data.message}`)
            }
            const {main,name,sys,weather} = data;
            // console.log("weather",weather)
            //  console.log("name",sys.country)
			//  console.log("icons",icons)
            const icon = `images/weather/${weather[0]['icon']}.svg`
            const li = document.createElement('li')
			let date = dateAndTime();
            const displayWeatherList = `
                                 <div class="display-image">
                                 <img src="${icon}" alt="${weather[0]['description']}">
                                 </div>
								 <div class="date">Date:${date}</div>
                                <div>
                                     <h1>${Math.round(main.temp)}<sup>°C</sup></h1>
                                     <p class="city-condition">${weather[0]['description'].toUpperCase()}</p>
                                    <h2><span class="city-name">${name}</span><span class="city-country">${sys.country}</span></h2>
                                </div>
                            `
            li.innerHTML = displayWeatherList;
            citiesList.appendChild(li)
			console.log("date",`dateAndTime(${name})`)
            
		})
        .catch (()=> {
            msg.textContent = "Please search for Valid City Thank you";
            msg.classList.add('visible')
        })

    msg.textContent = ''

	form.reset();
	
	input.focus();
	
}
)

 dateAndTime = () => {
	const today = new Date();
  	const options = {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  };
   date = today.toLocaleString('en-us', options);
   return date;
}

