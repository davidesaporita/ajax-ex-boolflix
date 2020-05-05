/*
 * 
 *  88                                  88    ad88 88 88              
 *  88                                  88   d8"   88 ""              
 *  88                                  88   88    88                 
 *  88,dPPYba,   ,adPPYba,   ,adPPYba,  88 MM88MMM 88 88 8b,     ,d8  
 *  88P'    "8a a8"     "8a a8"     "8a 88   88    88 88  `Y8, ,8P'   
 *  88       d8 8b       d8 8b       d8 88   88    88 88    )888(     
 *  88b,   ,a8" "8a,   ,a8" "8a,   ,a8" 88   88    88 88  ,d8" "8b,   
 *  8Y"Ybbd8"'   `"YbbdP"'   `"YbbdP"'  88   88    88 88 8P'     `Y8 
 *  
 *  A Netflix Replica made in Boolean - Class #12 - By Davide Saporita
 * 
 */

$(document).ready(function() {
    
    // Refs
    var searchInput = $('#search-input');
    var searchBtn = $('#search-button');

    // Init Handlebars
    var source = $('#result-template').html();
    var template = Handlebars.compile(source);

    // Event on click | button
    searchBtn.click(() => { 
        searchValidation(searchInput.val(), template); 
    });

    // Event on keyup | input
    searchInput.keyup((e) => {
        if(e.which === 13 || e.keyCode === 13) {
            searchValidation(searchInput.val(), template);
        }
    });
    
}); // End of ready function

// Search validation (at least 3 characters), if it's OK it calls function search()
function searchValidation(query, template) {
    (query.length > 2) ? search(query, template) : alert('Digita almeno 3 caratteri');
}

/* ------------------------------------------------------------------ *
 * SEARCH function                                                    
 * - Execute two api calls via Ajax looking for received query
 * - API urls are collected in apiUrls array, for a better management 
 *   and the possibility to add more url without changing search()
 *   function but just adapting print() function
 * ------------------------------------------------------------------ */ 
function search(query, template) {
    
    // Refs
    var searchInput = $('#search-input');
    var list = $('.result-list');
    
    // API Vars
    var language = 'it-IT';
    var apiKey = '2c7968616e24faf12903bba4628706b2';
    var apiUrls = [ 
        { type: 'movie', url: 'https://api.themoviedb.org/3/search/movie' },
        { type: 'tv',    url: 'https://api.themoviedb.org/3/search/tv' }
    ];

    cleanResults(list);

    apiUrls.forEach(element => {
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

/* ------------------------------------------------------------------ *
 * HOWMANYSTARS function
 * 1) Prepare HTML stars (Fontawesome needed) and html empty string
 * 2) Transform average vote from 0 to 5 anda round up result
 * 3) Apply as full stars as number of rounded vote
 * ------------------------------------------------------------------ */ 
function howManyStars(vote) {
    var starFull = '<i class="fas fa-star"></i>';
    var starEmpty = '<i class="far fa-star"></i>';
    var html = '';
    var starsVote = Math.ceil(vote*0.5);
    for(var i = 0; i < 5; i++) {
        if(starsVote > i) html += starFull;
        else              html += starEmpty;
    }

    return html;
}

/* ------------------------------------------------------------------ *
 * PRINT function
 * 1) Read array with results
 * 2) Build object for Handlebars template, 
 *    checking right property names if is called movie API or tv API
 * 3) Append template at the end of container
 * ------------------------------------------------------------------ */ 
function print(type, data, template) {
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
        
        $('.result-list').append(template(templateData));
    });
}

// Clean container
function cleanResults(ref) {
    ref.html('');
}

// Apply the right flag (Italian or English) or return native language code (es 'fr' for French)
function applyFlag(language) {
    if(language === 'it' || language === 'en') {
        return '<img class="flag" src="'+ 'assets/img/' + language + '.svg' + '" alt="' + language + '">';
    } else {
        return language;
    }
}

// Called when there are no results
function noResults(type) {
    $('.result-list').append('<br>Nessun risultato trovato nella categoria ' + type);
    $('#search-input').select();
}