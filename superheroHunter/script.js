//  for accessing the marvel api
 const ts=new Date().getTime();
 const pvtKey='42c1760ff6cbba59d13808fd689ee85ab1c9f279';
 const publicKey='6513105a3262d10c1dd5cb7a01a1be1e';
 const hash = CryptoJS.MD5(ts+pvtKey+publicKey).toString();


 var searchButton=$('#superhero-search-button');
 var displaySuperhero=$('.superheroes');
 var favList=$('#fav-superhero-list');
 var searchTerm=$('#superhero-searchbar');
 var favSuperhero=[];
  
// storing the typing timer in this variable
let typingTimer;




// when someone types something
searchTerm.on("change paste keyup",function(e){
    e.preventDefault();
    removeAllSuperhero(); //first remove all the superheroes on the page
    clearTimeout(typingTimer); //clear the previous timer
    if($(this).val().length>=3){ //if the typed string is longer than 3 characters
        typingTimer = setTimeout(afterTyping, 800);
    }
   })

// after the user finish typing
function afterTyping(){
    showSearchResults()
}

// this function removes all the superhero from the page
function removeAllSuperhero(){
    $('.card').remove();
}

//this function makes a call to the api to show the search result on the page
function showSearchResults(){
   var searchData=searchTerm.val();
  $.get(`https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&nameStartsWith=${searchData}&apikey=${publicKey}&hash=${hash}`,function(responseData){
    let results=responseData.data.results;
    showSupesOnThePage(results);  //show it on the page
  })
}

// this is to make api call to get random marvel characters on the home screen, before anyone searches anything
function showHomePageSupes(){
   $.get(`https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`,function(responseData){
      let results=responseData.data.results;
      showSupesOnThePage(results);
   })
}


// this function appends the superheroes on the page
function showSupesOnThePage(results){
         for(let result of results){
            let src=(result.thumbnail.path+'.'+result.thumbnail.extension).toString();
            let fav='black';
            const item={
               'id':result.id,
               'name':result.name,
               'src':src
            };
            if(localStorage.getItem(JSON.stringify(item))!=null){
               fav='red';
             }
            displaySuperhero.append( 
                `
                <div  class="card" id="supe-${result.id}" >
                <div onclick="showCard(${result.id})">
                 <img class="img" src="${src}" />
                </div>
                <div class="card-div">
                  <h3 onclick="showCard(${result.id})" id="${result.id}">${result.name}</h3>
                  <i style="color:${fav};" id="heart-${result.id}" onclick="addToFav(${result.id},\'${result.name}\',\'${src}\')" class="fa-solid fa-heart"></i>
                </div>
               </div>
              `
             );

         }
}




// this function takes you to the particular url of the superhero card when the link is clicked
function showCard(id){
      var params=new URLSearchParams();
      params.append('id',id);
      var url="superhero.html?"+ params.toString();
      location.href = url;
}


//this function adds superhero to the favourites list
function addToFav(id,name,src){
   const item={
      'id':id,
      'name':name,
      'src':src
   };
   if(localStorage.getItem(JSON.stringify(item))!=null){ //if the item is already in the favourites, remove it
     removeFav(item);
   }else{
      // if it is not, then append it to the favorites list and add it to the local storage
      localStorage.setItem(JSON.stringify(item), true);
      favList.append(`
         <div class="favList-div" id="favList-${id}">
          <img src="${src}" />
          <p onclick="showCard(${id})">${name}</p>
          <i style="color:red"s id="heart-${id}" onclick="addToFav(${id},\'${name}\',\'${src}\')" class="fa-solid fa-heart"></i>
         </div>
      `)
      $(`#heart-${id}`).css('color','red').prop('title','remove from favourites');
   }
}

// to remove the character from the local storage and favourites list
function removeFav({id,name,src}){
    const item={id,name,src};
    localStorage.removeItem(JSON.stringify(item));
    $(`#heart-${id}`).css('color','black').prop('title','add to favourites');
    $(`#favList-${id}`).remove();
}

// to display the favorites items in the list, even if he page refreshes
function displayFav(){
   const items={...localStorage};
  for(let item in items){
     item=JSON.parse(item);
     favList.append(`
         <div class="favList-div" id="favList-${item.id}">
          <img src="${item.src}" />
          <p onclick="showCard(${item.id})">${item.name}</p>
          <i style="color:red" id="heart-${item.id}" onclick="addToFav(${item.id},\'${item.name}\',\'${item.src}\')" class="fa-solid fa-heart"></i>
         </div>
      `)
  }

}




// show favourites list
displayFav();

// display random superheroes
showHomePageSupes();

// if the search button is clicked, then also display the searched items
searchButton.click(showSearchResults);
