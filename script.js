// ==UserScript==
// @name         Remplacer div par card et ajouter posters sur les site de streaming
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remplace les div par des card et ajoute les posters depuis l'API The Movie DB
// @author       M1tx
// @match        https://brorov.com/*
// @match        https://www.votrob.com/*
// @match        https://tiblor.com/*
// @match        https://www.redziv.com/*
// @match        https://grogab.com/*
// @match        https://nopliv.com/*
// @match        https://evdod.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==
 
(function() {
    'use strict';
 
    const apiKey = 'Yourkeyapi';
 
    function fetchMoviePoster(movieTitle, callback) {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieTitle)}`;
        console.log('Fetching poster for:', movieTitle);
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                const json = JSON.parse(response.responseText);
                if (json.results && json.results.length > 0) {
                    const posterPath = json.results[0].poster_path;
                    const posterUrl = `https://image.tmdb.org/t/p/w200${posterPath}`;
                    console.log('Poster URL:', posterUrl);
                    callback(posterUrl);
                } else {
                    console.log('No poster found for:', movieTitle);
                    callback(null);
                }
            }
        });
    }
 
    function replaceDivsWithCards() {
        const divs = document.querySelectorAll('#hann');
        divs.forEach(div => {
            const movieLink = div.querySelector('a');
            const movieTitle = movieLink.textContent.trim();
            const movieYearMatch = movieTitle.match(/\((\d{4})\)/);
            const movieYear = movieYearMatch ? movieYearMatch[1] : '';
 
            // Supprimer l'année et "HD" du titre du film
            const cleanMovieTitle = movieTitle.replace(/\((\d{4})\)|HD/gi, '').trim();
 
            fetchMoviePoster(cleanMovieTitle, posterUrl => {
                const card = document.createElement('div');
                card.className = 'movie-card';
                card.innerHTML = `
                    <a href="${movieLink.href}" class="movie-card-link">
                        <div class="movie-poster">
                            ${posterUrl ? `<img src="${posterUrl}" alt="${movieTitle}">` : ''}
                        </div>
                        <div class="movie-info">
                            <h3>${movieTitle}</h3>
                            <p>${movieYear}</p>
                        </div>
                    </a>
                `;
                div.parentNode.replaceChild(card, div);
            });
        });
    }
 
function addCardStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        .movie-card {
            display: inline-block;
            width: 200px;
            padding: 10px;
            box-sizing: border-box;
            vertical-align: top;
            text-align: center;
            margin: 5px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            background-color: #fff;
            transition: transform 0.3s;
        }
        .movie-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
        .movie-card-link {
            display: block;
            text-decoration: none;
            color: inherit;
        }
        .movie-card-link:hover {
            text-decoration: none;
        }
        .movie-poster {
            width: 100%;
            height: auto;
            position: relative;
            overflow: hidden;
            border-radius: 5px;
        }
        .movie-poster img {
            width: 100%;
            height: auto;
            display: block;
            transition: transform 0.3s;
        }
        .movie-card:hover .movie-poster img {
            transform: scale(1.1);
        }
        .movie-info {
            margin-top: 10px;
        }
        .movie-info h3 {
            font-size: 18px;
            margin-bottom: 5px;
            font-weight: bold;
            line-height: 1.3;
            color: #000000
        }
        .movie-info p {
            font-size: 14px;
            color: #777;
            margin: 0;
        }
    `;
    document.head.appendChild(style);
}
 
 
 
    // Appeler la fonction pour ajouter des styles CSS
    addCardStyles();
 
    // Appeler la fonction pour remplacer les divs par des cartes
    replaceDivsWithCards();
})();
