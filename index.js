/*

	Neural network test and prediction algorithm
	Carlo Cassinari 29/04/2014

	suggestions from: http://stats.stackexchange.com/questions/10162/how-to-apply-neural-network-to-time-series-forecasting
	brain library from: https://github.com/harthur/brain

	another method:
	 http://www.kadbox.it/Images/Articoli_PMI/PMI%200807%20-%20Strumenti%20di%20studio%20del%20portfolio%20prodotti%20-%20prevedere%20le%20vendite%20di%20un%20prodotto%20-%2045_53.pdf


*/

if(typeof exports == 'undefined'){
    var exports = this['brain_predict'] = {};
}

(function(exports){

    exports.predict = function(config){

    	if (typeof(brain) != 'undefined'){
	    	var net = new brain.NeuralNetwork({
	    	   //hiddenLayers: [4,3,2,1],
	    	   learningRate: 0.01
	    	});	
    	} else {
            /*
    		var the_brain = require("brain");
		   	var net = new the_brain.NeuralNetwork({
		   	   //hiddenLayers: [4,3,2,1],
		   	   learningRate: 0.01
		   	});
            */
            var the_brain = require("brain.js");
            var net = new the_brain.NeuralNetwork({
               //hiddenLayers: [4,3,2,1],
               learningRate: 0.01
            });
    	}


    	// max steps to check
        var checkSteps = config.serie.length - config.step ;
        // max steps to predict
        var predictionSteps = config.predictionSteps ;
        // steps per pattern
        var step = config.step ;
        // serie value
        var serie = config.serie ;

        if (step > serie.length){
           step = serie.length - 1 ;
        }


        // calc meanValue
        var min = Infinity ;
        for (var i=0;i<serie.length;i++){
            if (serie[i] < min) min = serie[i] ;
        }
        // offset only if min < 0
        //if (min > 0) min = 0;
        for (var i=0;i<serie.length;i++){
            serie[i] = serie[i] - min ;
        }

        // normalize to 1
        var maxValue = 0 ;
        for (var i=0;i<serie.length;i++){
            if (maxValue < serie[i]) maxValue = serie[i] ;
        }

        var training = [] ;
        for (var i=0;i<serie.length-step;i=i+1){
            var input = [] ;
            for (var ii=0;ii<step;ii++){
                var value = serie[ii+i] / maxValue ;
                input.push(value) ;
            }
            
            var trainingObj = {
                input: input,
                output: [serie[i+step]/maxValue]
            }
            training.push(trainingObj) ;
        }
        if (training.length == 0){
            return {} ;
        }

        var trainOutput = net.train(training, {
          errorThresh: 0.001,  // error threshold to reach
          iterations: 40000,   // maximum training iterations
          log: false,           // console.log() progress periodically
          logPeriod: 10        // number of iterations between logging
        }) ;
        
        if (config.debug) console.log(trainOutput) ;

        var pastAndFuture = [] ;
        var totError = 0 ;
        var iter = 0 ;
        for (var i=0;i<serie.length-step;i=i+1){
            iter++ ;
            var input = [] ;
            if (config.debug) var visualInput = [] ;
            for (var ii=0;ii<step;ii++){
                var value = serie[ii+i] / maxValue ;
                input.push(value) ;
                if (config.debug) visualInput.push(serie[ii+i]) ;
            }
            var expectedoutput = serie[i+step] ;
            var output = net.run(input) ;
            var prediction = output[0] * maxValue ;
            pastAndFuture.push(prediction) ;
            var error = Math.abs((prediction - expectedoutput))/expectedoutput ;
            if (expectedoutput === 0) error = 0 ;
            totError += error ;
            if (config.debug) console.log(visualInput) ;
            if (config.debug) console.log("ExpectedOuput: " + expectedoutput) ;
            if (config.debug) console.log("Prediction: " + prediction) ;
            if (config.debug) console.log("Error: " + error + "\n") ;
        }

        var simulation = [] ;
        for (var i=0;i<serie.length;i++){
            simulation.push(serie[i]) ;
        }

        for (var i=0;i<simulation.length-step;i=i+1){
            var input = [] ;
            if (config.debug) var visualInput = [] ;
            for (var ii=0;ii<step;ii++){
                var value = simulation[ii+i] / maxValue ;
                input.push(value) ;
                if (config.debug) visualInput.push(simulation[ii+i]) ;
            }
            var output = net.run(input) ;
            var prediction = output[0] * maxValue ;
            simulation[i+step]=prediction ;
            if (config.debug) console.log(visualInput) ;
            if (config.debug) console.log("Prediction: " + prediction) ;
            if (config.debug) console.log("Error: " + error + "\n") ;
        }



        var start = serie.length - step ;
        var maxStep = serie.length + predictionSteps - step ;
        var predictionSerie = [] ;
        for (var i=start;i<maxStep;i=i+1){
            var input = [] ;
            //var visualInput = [] ;
            for (var ii=0;ii<step;ii++){
                var value = serie[ii+i] / maxValue ;
                input.push(value) ;
                //visualInput.push(serie[ii+i]) ;
            }
            var output = net.run(input) ;
            var prediction = output[0] * maxValue ;
            //console.log(visualInput) ;
            //console.log("Prediction: " + prediction + "\n") ;
            serie.push(prediction) ;
            predictionSerie.push(prediction) ;
            pastAndFuture.push(prediction) ;
        }

        for (var i=0;i<serie.length;i++){
            serie[i] = serie[i] + min ;
        }

        for (var i=0;i<prediction.length;i++){
            prediction[i] = prediction[i] + min ;
        }

        for (var i=0;i<pastAndFuture.length;i++){
            pastAndFuture[i] = pastAndFuture[i] + min ;
        }

        for (var i=0;i<simulation.length;i++){
            simulation[i] = simulation[i] + min ;
        }

        return {
            serie: serie,
            prediction: predictionSerie,
            simulation: simulation,
            pastAndFuture : pastAndFuture,
            meanerror : totError/iter,
            trainOutput : trainOutput
        }

    }

})(typeof exports === 'undefined'? this['brain_predict']={}: exports);
