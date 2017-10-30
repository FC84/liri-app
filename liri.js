  // Node module imports needed to run the functions

  var fs = require("fs");
  var request = require("request");
  var keys = require("./keys.js");
  var twitter = require("twitter");
  var Spotify = require("node-spotify-api");
  var liriArgument = process.argv[2];
  var query = process.argv[3];
  var spotify = new Spotify(keys.spotifyKeys);




  // ---------------------------------------------------------------------------------------------------------------
  // Possible commands for this liri app
  switch (liriArgument) {
      case "my-tweets":
          myTweets();
          break;
      case "spotify-this-song":
          spotifyThisSong();
          break;
      case "movie-this":
          movieThis();
          break;
      case "do-what-it-says":
          doWhatItSays();
          break;

          // Instructions displayed in terminal to the user
      default:
          console.log("\r\n" + "Try typing one of the following commands after 'node liri.js' : " + "\r\n" +
              "1. my-tweets 'any twitter name' " + "\r\n" +
              "2. spotify-this-song 'any song name' " + "\r\n" +
              "3. movie-this 'any movie name' " + "\r\n" +
              "4. do-what-it-says." + "\r\n" +
              "Be sure to put the movie or song name in quotation marks if it's more than one word.");
  };
  // ---------------------------------------------------------------------------------------------------------------
  // Functions
  // Movie function, uses the Request module to call the OMDB api
  function movieThis() {
      var movie = process.argv[3];
      request(`http://www.omdbapi.com/?apikey=40e9cece&t=${movie}`, function(error, response, body) {
          if (error) {
              console.log("error:", error); // Print the error if one occurred
          } else {
              // console.log(JSON.parse(body));
              console.log(`Title: ${JSON.parse(body).Title}`); //movie title
              console.log(`Year: ${JSON.parse(body).Year}`); //movie year
              console.log(`IMDB Rating: ${JSON.parse(body).Ratings[0].Value}`); //IMDB Rating
              console.log(
                  `Rotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value}`
              ); //Rotten tomatoes rating
              console.log(`Country: ${JSON.parse(body).Country}`); //Country
              console.log(`Language(s): ${JSON.parse(body).Language}`); //Language
              console.log(`Plot: ${JSON.parse(body).Plot}`); //Plot
              console.log(`Actors: ${JSON.parse(body).Actors}`); //Actors
          log(movie);
          }
      });
  };

  // Tweet function, uses the Twitter module to call the Twitter api
  function myTweets() {
      var client = new twitter({
          consumer_key: keys.twitterKeys.consumer_key,
          consumer_secret: keys.twitterKeys.consumer_secret,
          access_token_key: keys.twitterKeys.access_token_key,
          access_token_secret: keys.twitterKeys.access_token_secret,
      });
      var twitterUsername = process.argv[3];
      if (!twitterUsername) {
          twitterUsername = "FCEightFour";
      }
      params = { screen_name: twitterUsername };
      client.get("statuses/user_timeline/", params, function(error, data, response) {
          if (!error) {
              for (var i = 0; i < data.length; i++) {
                  //console.log(response); // Show the full response in the terminal
                  var twitterResults =
                      "@" + data[i].user.screen_name + ": " +
                      data[i].text + "\r\n" +
                      data[i].created_at + "\r\n" +
                      "------------------------------ " + i + " ------------------------------" + "\r\n";
                  console.log(twitterResults);
                  log(twitterResults); // calling log function
              }
          } else {
              console.log("Error :" + error);
              return;
          }
      });
  }
  // Spotify function, uses the Spotify module to call the Spotify api
  function spotifyThisSong(songName) {

      spotify.search({ type: 'track', query: query, limit: 1 }, function(err, data) {
          if (err) {
              return console.log('Error occurred: ' + err);
          }
          var song = data.tracks.items[0];
          console.log("Artist Name: " + song.artists[0].name +
              "\nTrack Name: " + song.name + "\nAlbum Name : " +
              song.album.name + "\nPreview URL: " + song.preview_url);
          log(song);
      });
  };

  // Do What It Says function, uses the reads and writes module to access the random.txt file and do what's written in it
  function doWhatItSays() {
            fs.readFile("random.txt", "utf8", function(error, data) {
                var randArray = data.split(",");
                liriArgument = randArray[0], query = randArray[1];
                spotifyThisSong(randArray[0], randArray[1]);
                

  });
  };
  // Do What It Says function, uses the reads and writes module to access the log.txt file and write everything that returns in terminal in the log.txt file
  function log(logResults) {
      fs.appendFile("log.txt", logResults, (error) => {
          if (error) {
              throw error;
          }
      });
  }