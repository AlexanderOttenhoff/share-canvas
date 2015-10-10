
RequestDumps = new Mongo.Collection("requestDumps");


if (!RequestDumps.findOne({ movies: { $exists: true } })) {
	var res = HTTP.get("http://www.imdb.com/chart/top?ref_=nv_ch_250_4");
	RequestDumps.insert({ "movies": res.content });
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

if (!ThingsToGuess.findOne({"movies": { $exists: true } })) {
	ThingsToGuess.insert({"movies": moviesList});
}
console.log("movies out of ThingsToGuess: ", ThingsToGuess.findOne({"movies": { $exists: true } }).movies);