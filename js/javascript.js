var list = document.querySelector('.characters-list');
var nextButton = document.querySelector('.change-list.next');
var previousButton = document.querySelector('.change-list.previous');
var listChilds = list.children;
var persCollection;
var date;

window.addEventListener('load', createList);
nextButton.addEventListener('click', showNextList);
previousButton.addEventListener('click', showPreviousList);
list.addEventListener('click', ShowInfoAboutCharacters);


function fillingList(url) {
    var roller = document.querySelector('.lds-roller');
    document.querySelector('h1').innerHTML = 'Star Wars saga characters';
    list.innerHTML ='';
    document.querySelector('.back').style.display = 'none';
    roller.style.display = 'inline-block';
    window.localStorage.setItem('link', url);

    fetch(url)
    .then(function(response) {
        return response.json();
    })
        .then(function(data) {
            persCollection = data.results;
            date = data;
            return date;
        })
            .then(function(){
                roller.style.cssText = '';

                for(var i = 0;i< persCollection.length;i++) {
                    var li = document.createElement('li');
                    list.appendChild(li);
                    var a = document.createElement('a');
                    a.innerHTML = persCollection[i].name;
                    li.appendChild(a);
                }
                
                if(date.next === null) {
                    nextButton.style.display = 'none';
                } else {
                    nextButton.style.display = 'inline';
                }

                if(date.previous === null) {
                    previousButton.style.display = 'none';
                } else {
                    previousButton.style.display = 'inline';
                }
            })
}

function createList(){ 
    fillingList('https://swapi.co/api/people/?format=json');
}
   
function showNextList() {
    fillingList(date.next);
}

function showPreviousList() {
    fillingList(date.previous);
}

function ShowInfoAboutCharacters(e) {
    var target = e && e.target;

    if(target.tagName!='A') {
        return;
    }
    var characterName = target.innerHTML;
    var allInfo;

    for(var i = 0;i<persCollection.length;i++) {
        if(characterName === persCollection[i].name) {
            allInfo = persCollection[i];
        }
    }
    createInfoPage(allInfo);
    document.querySelector('.back').style.display = 'inline';
}

function createInfoPage(obj) {
    previousButton.style.display = 'none';
    nextButton.style.display = 'none'; 
    fetch('ajax/info.html')
        .then(function(response){
            return response.text();
        })
        .then(function(data) {
            list.innerHTML = data;
            console.log(obj);
            var arrWithFilms = obj.films;
            document.querySelector('h1').innerHTML = obj.name;
            document.querySelector('.year').innerHTML += '<i>' +  obj.birth_year + 'i';
            document.querySelector('.gender').innerHTML += '<i>' + obj.gender + '</i>';
            document.querySelector('.films').innerHTML += '(' + arrWithFilms.length + ')';

            if(arrWithFilms) {
                var ul = document.createElement('ul');
                ul.className = 'film-list';
                document.querySelector('.films').appendChild(ul);
                for(let i = 0;i<arrWithFilms.length;i++) {
                    var li = document.createElement('li');
                    getInfo(arrWithFilms[i], li, 'title');
                    document.querySelector('.film-list').appendChild(li);
                }
            } else {document.querySelector('.films').innerHTML ='<i>' + 'No films' + '</i>'}

            getInfo(obj.homeworld, document.querySelector('.planet'), 'name');

            if(obj.species.length>0) {
                getInfo(obj.species[0], document.querySelector('.species'), 'name');
            } else {
                document.querySelector('.species').innerHTML ='<i>' + 'No species' + '</i>';
            }
        }) 
}

function getInfo(url, obj, arg) {
    fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        for(var key in data) {
            if(key == arg) {
                obj.innerHTML += "<i>"+ data[key] + "</i>";
            }
        }
    })
}

function returnBack() {
    list.innerHTML = '';
    fillingList(window.localStorage.getItem('link'));
}