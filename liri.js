require("dotenv").config();

var keys = require("./keys");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var LiriCommand = process.argv[2];
var LiriInput = process.argv[3];

//external packages
var OmbdURL = "http://www.omdbapi.com/?t=" + LiriInput + "&y=&plot=short&apikey=trilogy";
var bandsInTownURL = "https://rest.bandsintown.com/artists/" + LiriInput + "/events?app_id=codingbootcamp"

Userinputs(LiriCommand, LiriInput);

function Userinputs (LiriCommand, LiriInput){
    switch (LiriCommand) {
            case "concert-this":
              concertThis(LiriInput);
              break;
            case "spotify-this":
              spotifyThis(LiriInput);
              break;
            case "movie-this":
              movieThis(LiriInput);
              break;
            case "do-what-it-says":
            doWhatItSays(LiriInput);
            break;
            default:
            console.log("somethings not right");
            break;
        }
};
    function movieThis(){
      if(LiriInput === undefined){
          LiriInput = "Red October"; 
          var OmbdURL = "http://www.omdbapi.com/?t=" + LiriInput + "&y=&plot=short&apikey=trilogy";
          console.log(LiriInput);
      }
      axios.get(OmbdURL).then(        
          function(response) {
              console.log("Title: " + response.data.Title);
              console.log("Release Year: " + response.data.Year);
              console.log("IMBD Rating: " + response.data.dataimbdRating);
              console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
              console.log("Produced in: " + response.data.Country);
              console.log("Language: " + response.data.Language);
              console.log("Plot: " + response.data.Plot);
              console.log("Actors: " + response.data.Actors);
          }
      );
    }

    function concertThis(){
        axios.get(bandsInTownURL).then(
            function(response){
                if(LiriInput === undefined){
                    console.log("No data on this Artist, please try again");
                } 
                    console.log("Venue: " + response.data[0].venue.name);
                    console.log("Location: " + response.data[0].venue.city + ", " + response.data[0].venue.region);
                    var concertDate = (response.data[0].datetime);
                    var convertedDate = moment(concertDate);
                    console.log("Date: " + convertedDate.format("MM/DD/YYYY"));
            }
        );

    }


    function spotifyThis(){
        if(LiriInput === undefined){
            LiriInput = "Ride Of The Valkyries";           
        }
        spotify.search(
            {type: "track", 
            query: LiriInput 
            },
            function(err, data){
                if (err) {
                    return console.log("Error Occurred: ", err);
                }
                var song = data.tracks.items;
                console.log("Artist: " + song[0].artists[0].name);
                console.log("Song Title: " + song[0].name);
                console.log("Listen Now: " + song[0].preview_url);
                console.log("Album this song is from: " + song[0].album.name);

            }
        );
    }

    function doWhatItSays(){
       const data = fs.readFileSync("random.txt", "utf8")
            console.log(data);
            var dataArr = data.split(", ");
            console.log(data[0], data[1])
            spotifyThis(data[0], data[1]);
    
    
    }
