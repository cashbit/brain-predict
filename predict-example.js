/*

	Neural network test and prediction algorithm
	Carlo Cassinari 29/04/2014

	suggestions from: http://stats.stackexchange.com/questions/10162/how-to-apply-neural-network-to-time-series-forecasting
	brain library from: https://github.com/harthur/brain

	onther method: http://www.kadbox.it/Images/Articoli_PMI/PMI%200807%20-%20Strumenti%20di%20studio%20del%20portfolio%20prodotti%20-%20prevedere%20le%20vendite%20di%20un%20prodotto%20-%2045_53.pdf


*/

var predict = require("../brain-predict") ;

var config = {
	checkSteps : 16,
	predictionSteps : 8,
	step : 4,
	serie : [
		1198,2093,3274,1156,
		1232,2112,3398,1285,
		1297,2220,3876,1456,
		1434,2473,4213,1506,
		1602,2504,4594,1638,
		1746,2672,4852,1932,
		1978,2916,4976,2031,
		2012,2944,4947,2194,
		2213,3253,5033,2328,
		1981,3015,4811,2058,
		2017,2970,4768,2081,
		2093,3067,4879,2116
	]  
}

var prediction = predict.predict(config) ;

console.log("PredictionSerie\n" + prediction.prediction + "\n");
console.log("Mean error: " + prediction.meanerror) ;


