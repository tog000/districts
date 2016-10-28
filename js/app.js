
var genetic = Genetic.create();
genetic.optimize = Genetic.Optimize.Maximize;
genetic.select1 = Genetic.Select1.Tournament2;
genetic.select2 = Genetic.Select2.Tournament2;

var map =   [
              [0,0,0,0,1,0,1,1,0,0,0,0,0,0],
              [0,0,0,1,1,0,1,1,0,0,0,0,0,0],
              [0,0,0,0,1,0,0,1,1,1,0,0,0,0],
              [0,0,0,0,1,1,1,1,1,1,0,0,0,0],
              [0,0,0,1,1,1,0,0,0,0,0,0,0,0],
              [0,0,0,1,1,0,0,0,0,0,0,0,0,0],
              [0,0,0,1,1,1,0,0,1,1,0,0,0,0],
              [1,1,1,0,1,1,1,0,1,1,0,0,0,0],
              [0,0,1,0,0,0,1,1,1,1,1,1,0,0],
              [0,1,1,0,0,1,1,1,1,1,1,1,0,0]
            ];

genetic.seed = function(){
  var district = [];
  var counter = 0;
  var currentDistrict = 1;
  for(var i=0;i<10;i++){
    district[i] = new Array(14);
    for(var j=0;j<14;j++){
      counter++;
      if(counter == 20){
        currentDistrict++;
        counter=0;
      }
      district[i][j] = currentDistrict;
    }
  }
  return district;
};

genetic.fitness = function(array){
  // fitness score
  var score = 0;
  // For every district
  for(var d=1;d<=7;d++){
    // Count red vs blue
    var reds = 0;
    var blues = 0;
    // For every square
    for(var i=0;i<array.length;i++){
      for(var j=0;j<array[i].length;j++){
        // If this is the district we are looking at
        if(array[i][j] == d){
          // Count votes
          if(this.userData["map"][i][j] == 1){
            blues++;
          }else{
            reds++;
          }
        }
      }
    }

    // Tally
    if(blues >= reds){
      score += 1;
    }else{
      var fraction = blues/reds;
      score += Number.isNaN(fraction)?0:fraction;
    }
  }
  return score;
}

// Swap one square with a neighboring square
genetic.mutate = function(array) {
	var x = parseInt(Math.random()*10);
  var y = parseInt(Math.random()*10);

  for(var i=0;i<10;i++){
    // Randomize direction
    if(Math.random()>0.5){
      var dx = Math.random()>0.5?1:-1;
      if(x+dx >= 0 && x+dx < 14){
        var tmp = array[x+dx][y];
        array[x+dx][y] = array[x][y];
        array[x][y] = tmp;
        return array;
      }
    }else{
      var dy = Math.random()>0.5?1:-1;
      if(y+dy >= 0 && y+dy < 10){
        var tmp = array[x][y+dy];
        array[x][y+dy] = array[x][y];
        array[x][y] = tmp;
        return array;
      }
    }
  }
};

genetic.crossover = function(array1, array2) {
  return [genetic.mutate(array1),genetic.mutate(array2)];
};

genetic.generation = function(pop, generation, stats) {
	// stop running once we've reached the solution
  console.log("generation "+generation+" fitness="+pop[0].fitness);
	return pop[0].fitness == 7;
};

genetic.notification = function(pop, generation, stats, isFinished) {
  paintMap(pop[0].entity,squareSize,200,1);
  paintMap(pop[0].entity,(squareSize*15),200,2);
  paintMap(pop[0].entity,2*(squareSize*15),200,3);
  paintMap(pop[0].entity,squareSize,300,4);
  paintMap(pop[0].entity,(squareSize*15),300,5);
  paintMap(pop[0].entity,2*(squareSize*15),300,6);
  paintMap(pop[0].entity,squareSize,400,7);
  console.log(stats);
}

var squareSize = 15;

var paintMap = function(array,x,y,filter){
  for(var i=0;i<array.length;i++){
    for(var j=0;j<array[i].length;j++){
      if(filter && array[i][j] != filter){
        continue;
      }
      var rect = two.makeRectangle(x + j*squareSize, y + i*squareSize, squareSize, squareSize);
      var text = two.makeText(new String(array[i][j]), x + j*squareSize, y + i*squareSize);
      if(map[i][j]==1){
        rect.fill = 'rgb(0, 200, 255)';
      }else{
        rect.fill = 'rgb(200, 50, 55)';
      }
      rect.stroke = 'black';
      rect.linewidth=1;
    }
  }

  two.update();
}

document.addEventListener("DOMContentLoaded", function() {

  var elem = document.getElementById('canvas');
  var params = { width: 1200, height: 600 };
  two = new Two(params).appendTo(elem);

  //paintMap(map,10,10);

  var config = {
			"iterations": 150
			, "size": 250
			, "crossover": 0.3
			, "mutation": 0.3
			, "skip": 20
		};
		var userData = {
			"map": map
		};
		genetic.evolve(config, userData);

    var test = genetic.seed();
    var test2 = genetic.mutate(test);
    paintMap(test,20,20);
    paintMap(test2,280,20);



});
