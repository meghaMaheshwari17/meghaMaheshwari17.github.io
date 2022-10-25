// to make the api call we need, timestamp, private key and public key and hash 
const ts=new Date().getTime();
const pvtKey='42c1760ff6cbba59d13808fd689ee85ab1c9f279';
const publicKey='6513105a3262d10c1dd5cb7a01a1be1e';
const hash = CryptoJS.MD5(ts+pvtKey+publicKey).toString();
console.log(ts);
const param = new URLSearchParams(window.location.search); //getting the id from url
const id = param.get("id");

const outerDiv=$('.outer-div');

// this function finds a particular superhero through its id and displays it
function showSupe(){
    $.get(`https://gateway.marvel.com:443/v1/public/characters/${id}?ts=${ts}&apikey=${publicKey}&hash=${hash}`,function(responseData){
       console.log(responseData.data); 
       let result=responseData.data.results[0];
        outerDiv.append(`
          <div>
           <img src="${result.thumbnail.path+'.'+result.thumbnail.extension}"/>
            <h1>${result.name}</h1>
            <p>${result.description}</p>
         
            <p>Comics available:${result.comics.available}</p>
            <p>Series available:${result.series.available}</p>
            <p>Stories available:${result.stories.available}</p>
            
          </div>

        `)
    })
}

showSupe();