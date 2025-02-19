function selectVisible() {
    var selector = document.getElementById('musicSelector');
    if(selector.style.visibility == 'hidden') {
        selector.style.visibility = 'visible';
        selector.style.display = 'inline-block';
    }
    else {
        selector.style.visibility = 'hidden';
        selector.style.display = 'none';
    }
}

searchInputListener();
function searchInputListener() {
    searchInput.addEventListener('click', searchInputChange);
    searchInput.addEventListener('keyup', searchInputChange);
    searchInput.addEventListener('keyup', function(event) {
        if(event.key == 'Enter') document.getElementById('searchHref').click()
    })
}

function searchInputChange() {
    var searchInput = document.getElementById('searchInput');
    if (searchInput.value != "") {
        searchParser(searchInput.value);
    }
    else {
        var musicSelector = document.getElementById('musicSelector');
        musicSelector.style.visibility = 'visible';
        musicSelector.style.display = 'inline-block';
        while(musicSelector.hasChildNodes()) {
            musicSelector.removeChild(musicSelector.firstChild);
        }
        for(var i = 0; i < music_list_length; i++) {
            var temp_option = document.createElement('option')
            temp_option.innerHTML = music_list[i].replace('\"', '');
            musicSelector.appendChild(temp_option);

            (function() {
                var music_title = music_list[i];
                temp_option.addEventListener('click', function() {
                    searchInput.value = music_title;
                    musicSelector.style.visibility = 'hidden';
                    musicSelector.style.display = 'none';
                    searchInput.focus();
                    document.getElementById('searchHref').href = '/result?' + music_title
                });
            }());
        }
        musicSelector.size = 10;
    }
    document.getElementById('searchHref').href = '/result?type=' + searchInput.value
}

function searchParser(searchValue) {
    var musicSelector = document.getElementById('musicSelector');
    musicSelector.style.visibility = 'visible';
    musicSelector.style.display = 'inline-block';
    while(musicSelector.hasChildNodes()) {
        musicSelector.removeChild(musicSelector.firstChild);
    }
    var searchValue_length = searchValue.length;
    for(var i = 0; music_list[i]; i++) {
        if (music_list[i].includes(searchValue)) {
            var temp_option = document.createElement('option')
            temp_option.innerHTML = music_list[i].replace('\"', '');
            musicSelector.appendChild(temp_option);
            (function() {
                var music_title = music_list[i];
                temp_option.addEventListener('click', function() {
                    searchInput.value = music_title;
                    musicSelector.style.visibility = 'hidden';
                    musicSelector.style.display = 'none';
                    searchInput.focus();
                    document.getElementById('searchHref').href = '/result?' + searchInput.value
                });
            }());
            if (musicSelector.childElementCount < 10) musicSelector.size = musicSelector.childElementCount
            else musicSelector.size = 10;
        }
    }
    if (musicSelector.childElementCount == 0) {
        musicSelector.style.visibility = 'hidden';
        musicSelector.style.display = 'none';
    }
}

function searchBtn() {
    var searchInput = document.getElementById('searchInput');
    var url = '/select_music';
    var data = JSON.stringify({'music_name': searchInput.value + '.wav'});
    var resultBox = document.getElementById('resultBox');
    while(resultBox.hasChildNodes()) {
        resultBox.removeChild(resultBox.firstChild);
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState>3 && xhr.status==200){
            var responseText = xhr.responseText;
            console.log(responseText);
            if(responseText == 'not exist') {
                temp = document.createElement('div');
                temp.innerHTML = 'not in database';
                resultBox.appendChild(temp);
            }
            else {
                responseJSON = JSON.parse(responseText);
                Object.keys(responseJSON).forEach(function(key){
                    Object.keys(responseJSON[key]).forEach(function(index){
                        temp = document.createElement('div');
                        temp.innerHTML = key + '<br>' + responseJSON[key][index] + '<br><br>';
                        resultBox.appendChild(temp);
                    })
                })
            }
        }
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data);
}


            