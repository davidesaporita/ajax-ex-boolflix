/**
 * 
 * BOOLFLIX / Netflix replica
 *  
 */

$(document).ready(function() {
   
    // Refs
    var searchInput = $('#search-input');
    var searchBtn = $('#search-button');
    var app = $('#app');

    // Init Handlebars
    var source = $('#result-template').html();
    var template = Handlebars.compile(source);

    searchBtn.click(function() {
        var query = searchInput.val();
        if(query.length > 2) {
            movieSearch(query, template);
        }
    });

    app.on('keyup','#search-input', (e) => {
        if(e.which === 13 || e.keyCode === 13) {
            var query = searchInput.val();
            if(query.length > 2) {
                movieSearch(query, template);
            }
        }
    });
    
}); // End of ready function

/*  ------------
   | Functions |
   ------------   */

function movieSearch(query, template) {
    // Vars
    var apiUrl = 'https://api.themoviedb.org/3/search/movie';
    var apiKey = '2c7968616e24faf12903bba4628706b2';
    var language = 'it-IT';

    // Refs
    var list = $('.result-list');

    $.ajax({
        url: apiUrl, 
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
                    title:            element.title,
                    originalTitle:    element.original_title,
                    originalLanguage: element.original_language,
                    voteAverage:      element.vote_average
                }
                list.append(template(templateData));
            });
        },
        error: function() {
            console.log('Qualcosa non funziona');
        }
    });
}