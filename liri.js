let keys = require("./keys.js");
let request = require("request");
let twitter = require("twitter");
let spotify = require("node-spotify-api");



//Stored argument's array
let nodeArgv = process.argv;
let command = process.argv[2];
//movie or song empty strings
let movie = "";
let song = "";
//I found this online that attaches multiple word movie/song arguments
for (var i=3; i<nodeArgv.length; i++){
  if(i>3 && i<nodeArgv.length){
    movie = movie + "+" + nodeArgv[i];
  } else{
    movie = movie + nodeArgv[i];
  }
}

for (var i=3; i<nodeArgv.length; i++){
    if(i>3 && i<nodeArgv.length){
      song = song + "+" + nodeArgv[i];
    } else{
      song = song + nodeArgv[i];
    }
  }
//switch statement
switch(userInput){
  case "my-tweets":
    showTweets();
  break;

  case "spotify-this-song":
    if(song){
      spotifySong(song);
    } else{
      spotifySong("Under Pressure");
    }
  break;

  case "movie-this":
    if(movie){
      omdbData(movie)
    } else{
      omdbData("Django")
    }
  break;

  case "do-what-it-says":
    watchMovie();
  break;

  default:
    console.log("Lets check out some songs, movies, tweets");
  break;
}

function displayTweets(){
  //Display last 20 Tweets
  var screenName = {screen_name: "myTwitter"};
  client.get('statuses/user_timeline', screenName, function(error, tweets, response){
    if(!error){
      for(var i = 0; i<tweets.length; i++){
        var date = tweets[i].created_at;
        console.log("@myTwitterForgot" + tweets[i].text + " Created At: " + date.substring(0, 19));
        console.log("-----------------------");
        
        //adds text to log.txt file
        fs.appendFile('log.txt', "@myTwitterForgot: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        fs.appendFile('log.txt', "-----------------------");
      }
    }else{
      console.log('Error occurred');
    }
  });
}

function spotifySong(song){
  spotify.search({ type: 'track', query: song}, function(error, data){
    if(!error){
      for(var i = 0; i < data.tracks.items.length; i++){
        var songData = data.tracks.items[i];
        //artist
        console.log("Artist: " + songData.artists[0].name);
        //song name
        console.log("Song: " + songData.name);
        //spotify preview link
        console.log("Preview URL: " + songData.preview_url);
        //album name
        console.log("Album: " + songData.album.name);
        console.log("-----------------------");
        
      }
    } else{
      console.log('Error occurred.');
    }
  });
}

function omdbData(movie){
  var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&plot=short&tomatoes=true';

  request(omdbURL, function (error, response, body){
    if(!error && response.statusCode == 200){
      var body = JSON.parse(body);

      console.log("Title: " + body.Title);
      console.log("Release Year: " + body.Year);
      console.log("IMdB Rating: " + body.imdbRating);
      console.log("Country: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
      console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
      console.log("Rotten Tomatoes URL: " + body.tomatoURL);



    } else{
      console.log("Error")
    }
    if(movie === "Django"){
      console.log("Watch Django");

      //adds text to log.txt
      
      fs.appendFile('random.txt', "Watch Django");
      
    }
  });

}

function watchMovie(){
  fs.readFile('random.txt', "utf8", function(error, data){
    var txt = data.split(',');

    spotifySong(txt[1]);
  });
}
