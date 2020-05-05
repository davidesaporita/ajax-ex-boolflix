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
            apiCall(query, template);
        }
    });

    app.on('keyup','#search-input', (e) => {
        if(e.which === 13 || e.keyCode === 13) {
            var query = searchInput.val();
            if(query.length > 2) {
                apiCall(query, template);
            }
        }
    });
    
}); // End of ready function

/*  ------------
   | Functions |
   ------------   */

function apiCall(query, template) {
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
            if(data.results.length > 0){
                data.results.forEach(element => {
                    var templateData = {
                        title:            element.title,
                        originalTitle:    element.original_title,
                        originalLanguage: element.original_language,
                        voteAverage:      element.vote_average,
                        stars:            howManyStars(element.vote_average)
                    }

                    list.append(template(templateData));
                });
            } else {
                alert('Nessun film trovato');
                //searchInput.select();
            }
        },
        error: function() {
            console.log('Qualcosa non funziona');
            //searchInput.focus();
        }
    });
}

function howManyStars(vote) {
    // Vars
    var starFull = '<i class="fas fa-star"></i>';
    var starEmpty = '<i class="far fa-star"></i>';
    var html = '';

    // Modifica scala di valori e arrotonamento per eccesso
    var starsVote = Math.ceil(vote*0.5);

    // Ciclo per generare html
    for(var i = 0; i < 5; i++) {
        if(starsVote > i) html += starFull;
        else              html += starEmpty;
    }

    return html;
}