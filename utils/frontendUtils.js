const showSuggestionsScript = `
function showSuggestions(value) {
    if (value.length === 0) {
        document.getElementById('suggestions').innerHTML = '';
        return;
    }
    fetch('/autocomplete?query=' + value)
        .then(response => response.json())
        .then(data => {
            let suggestions = data.map(movie => '<li><a href="/movies/search/' + encodeURIComponent(movie.title) + '">' + movie.title + '</a></li>').join('');
            document.getElementById('suggestions').innerHTML = '<ul>' + suggestions + '</ul>';
        });
}
`;

module.exports = { showSuggestionsScript };
