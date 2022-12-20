// Fires the code once the DOM is loaded:
document.addEventListener('DOMContentLoaded', function() {

// Getting the exchange rates from the API
Promise.all([
    fetch('https://api.exchangerate.host/latest?base=GBP&symbols=USD,EUR,JPY'),
    fetch('https://api.exchangerate.host/latest?base=USD&symbols=GBP,EUR,JPY'),
    fetch('https://api.exchangerate.host/latest?base=EUR&symbols=GBP,USD,JPY'),
    fetch('https://api.exchangerate.host/latest?base=JPY&symbols=GBP,EUR,USD'),
]).then(function (responses) {
    // Get a JSON object from each of the responses
    return Promise.all(responses.map(function (response) {
        return response.json();
    }));
}).then(function (data) {
    // Log the data to the console
    console.log(data);

    // Selecting html elements
    var rate_country_f = document.getElementById("country_f");
    var rate_country_t = document.getElementById("country_t");
    var input_number = document.getElementById("input_number");
    var answer = document.getElementById("answer");
    
    // Initialising variable:
    var rate;

    // Event listener:
    input_number.addEventListener('change', country_rates);

    function country_rates() {
    if (rate_country_t.value != 'select' && rate_country_f.value != 'select') {
        // Selecting correct rates array according to From country chosen:
        if(rate_country_f.value == 'GBP') {
            var rates_array = data[0].rates;
        } else if(rate_country_f.value == 'USD') {
            var rates_array = data[1].rates;
        } else if(rate_country_f.value == 'EUR') {
            var rates_array = data[2].rates;
        } else if(rate_country_f.value == 'JPY') {
            var rates_array = data[3].rates;
        }

        // Returns the value of the exchange rate according to the To country selected by the user: 
        function exchange_rate(country_rates) {
            var index = Object.keys(country_rates).indexOf(rate_country_t.value);
            rate = Object.values(country_rates)[index];
            return rate;
        }

        // Returns the result in the html answer text box
        function result() {
            if (rate_country_f.value == rate_country_t.value && rate_country_t.value != 'select' && rate_country_f.value != 'select') {
                answer.value = "'To' and 'from' currencies must be different.";
                updating();
            } else if (rate_country_f.value != rate_country_t.value &&rate_country_t.value != 'select' && rate_country_f.value != 'select'){
                answer.value = (input_number.value * rate).toFixed(2);
                updating();
            }    
        }

        // Calling the functions
        exchange_rate(rates_array);
        result();

    } else {
        updating();
    }
    
    // Updating result when selections or input have been changed but the page hasn't been reloaded:
    function updating() {
        rate_country_f.addEventListener('change', country_rates);
        rate_country_t.addEventListener('change', country_rates);
    }
    }

}).catch(function (error) {
    // Logging errors:
    console.log(error);
});

// Reloading the page:
var refresh_page = document.getElementById("refresh");
refresh_page.addEventListener('click', refresh);

function refresh() {
    location.reload();
    rate_country_f.value = 'select';
    rate_country_t.value = 'select';
    answer.value = "";
    input_number.value = "";
}

});