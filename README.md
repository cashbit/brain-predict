brain-predict
=============

A Neural network prediction algorithm based on brain node module

### Install

```
npm install brain-predict
```

### Example

How to predict sales per year quarter.

```
var predict = require("brain-predict") ;

var config = {
	// how many steps use to calculate meanerror
	checkSteps : 16,
	// how many steps to predict
	predictionSteps : 8,
	// how many steps use for eache pattern
	step : 4,
	// input data
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
```

Result for 2 quarters

```
PredictionSerie
2140,3191,4676,2182,2181,3356,4605,2254

Mean error: 0.05270396240618591
```
