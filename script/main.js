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

    // Init Handlebars
    var source = $('#result-template').html();
    var template = Handlebars.compile(source);

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
            success: function(data) {
                list.html('');
                data.results.forEach(element => {
                    var templateData = {
                        title: element.title,
                        originalTitle: element.original_title,
                        originalLanguage: element.original_language,
                        voteAverage: element.vote_average
                    }
                    list.append(template(templateData));
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

