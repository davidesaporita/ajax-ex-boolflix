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
            search(query, template);
        } else {
            alert('Digita almeno 3 caratteri');
        }
    });

    app.on('keyup','#search-input', (e) => {
        if(e.which === 13 || e.keyCode === 13) {
            var query = searchInput.val();
            if(query.length > 2) {
                search(query, template);
            } else {
                alert('Digita almeno 3 caratteri');
            }
        }
    });
    
}); // End of ready function

/*  ------------
   | Functions |
   ------------   */

function search(query, template) {

    // Vars
    var apiUrlBase = 'https://api.themoviedb.org/3/search/';
    var apiUrlArray = [ 
        {
            type: 'movie',
            url: apiUrlBase + 'movie'
        },
        {
            type: 'tv',
            url: apiUrlBase + 'tv'
        }
    ];
    var apiKey = '2c7968616e24faf12903bba4628706b2';
    var language = 'it-IT';

    // Refs
    var searchInput = $('#search-input');
    var list = $('.result-list');

    cleanResults(list);

    apiUrlArray.forEach(element => {
        $.ajax({
            url: element.url, 
            method: 'GET',
            data: {
                api_key: apiKey,
                language: language,
                query: query
            }, 
            success: function(data) {                
                if(data.results.length > 0) {
                    print(element.type, data.results, template);
                } else {
                    noResults(element.type);
                }
            },
            error: function() {
                alert('Qualcosa non funziona');
                searchInput.focus();
            }
        });
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

function print(type, data, template) {
    
    // Refs
    var list = $('.result-list');

    data.forEach(element => {
        var templateData = {
            title:            type === 'movie' ? element.title : element.name,
            originalTitle:    type === 'movie' ? element.original_title : element.original_name,
            originalLanguage: element.original_language,
            flag:             applyFlag(element.original_language),
            voteAverage:      element.vote_average,
            stars:            howManyStars(element.vote_average),
            type:             type
        }
        
        list.append(template(templateData));
    });
}

function cleanResults(ref) {
    ref.html('');
}

function applyFlag(language) {
    if(language === 'it' || language === 'en') {
        var folder = 'assets/img/';
        var ext = '.svg';
        var html = '<img class="flag" src="'+ folder + language + ext + '" alt="' + language + '">';
        return html;
    } else {
        return language;
    }
}

function noResults(type) {
    // Refs
    var list = $('.result-list');
    var searchInput = $('#search-input');

    list.append('<br>Nessun risultato trovato nella categoria ' + type);
    searchInput.select();
}