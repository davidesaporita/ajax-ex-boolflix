/**
 * 
 * BOOLFLIX / Netflix replica
 *  
 */

$(document).ready(function() {

    // Vars
    var apiKey = '2c7968616e24faf12903bba4628706b2';
    var language = 'it-IT';
    
    // Refs
    var searchInput = $('#search-input');
    var searchBtn = $('#search-button');
    var list = $('.result-list');

    searchBtn.click(function() {
        var query = searchInput.val();
        $.ajax({
            url: 'https://api.themoviedb.org/3/search/movie', 
            method: 'GET',
            data: {
                api_key: apiKey,
                language: language,
                query: query
            },
            success: function(data){
                data.results.forEach(element => {
                    console.log(element.title);
                    console.log(element.original_title);
                    console.log(element.original_language);
                    console.log(element.vote_average);    
                });
            },
            error: function() {
                console.log('Qualcosa non funziona');
            }
        });
    });
    
}); // End of ready function

/*  ------------
   | Functions |
   ------------   */

