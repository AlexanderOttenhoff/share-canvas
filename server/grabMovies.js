
RequestDumps = new Mongo.Collection("requestDumps");


if (!RequestDumps.findOne({ name: "movies" })) {
	var res = HTTP.get("http://www.imdb.com/chart/top?ref_=nv_ch_250_4", { 
		headers: { 
			"Accept-Language": "en-US,en;q=0.7,de;q=0.3",
			// "Accept-Encoding": "gzip, deflate",
		}
	});
	console.log("made webrequest to imdb!");
	RequestDumps.upsert({ movies: { $exists: true } }, 
		{ $set: { "movies": res.content, "name": "movies" } });
}

var htmlMovies = RequestDumps.findOne({ movies: { $exists: true } }).movies;

var $ = cheerio.load(htmlMovies);

// console.log("test: ", $("h1").text());

var moviesList = [];
$(".titleColumn a").each(function() {
	// console.log($(this).text())
	moviesList.push($(this).text());
});

// console.log("moviesList: ", moviesList);

if (!ThingsToGuess.findOne({"name": "movies"})) {
	ThingsToGuess.upsert({ movies: { $exists: true } }, {"movies": moviesList});
}
// console.log("movies out of ThingsToGuess: ", ThingsToGuess.findOne({"movies": { $exists: true } }).movies);