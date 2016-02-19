var http = require('http');
var SOM = require('ml-som');

const PORT = 8080;

function handleRequest(request, response) {

  var options = {
    fields: 13,
    gridType: 'rect',
    iterations: 1000
  };


  var set = [
    [1, 3, 1, 1, 2, 1, 1, 5, 3, 1, 1, 1, 3],
    [2, 1, 2, 1, 1, 1, 1, 1, 4, 5, 5, 4, 2],
    [4, 1, 1, 1, 1, 1, 5, 1, 4, 1, 1, 1, 2],
    [2, 1, 2, 1, 1, 1, 1, 2, 3, 1, 1, 1, 2],
    [1, 1, 1, 1, 2, 1, 1, 3, 1, 1, 1, 1, 2],
    [2, 1, 2, 1, 2, 1, 1, 3, 4, 5, 5, 4, 2],
    [1, 1, 1, 1, 2, 1, 1, 5, 4, 1, 3, 3, 3],
    [1, 1, 1, 1, 4, 1, 1, 1, 4, 5, 3, 3, 2],
    [3, 1, 3, 2, 5, 1, 1, 4, 4, 1, 1, 1, 3],
    [1, 1, 2, 1, 1, 1, 1, 5, 2, 1, 5, 4, 2],
    [1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 5, 4, 1],
    [1, 1, 3, 2, 2, 1, 1, 3, 4, 1, 1, 1, 3],
    [1, 1, 2, 1, 3, 1, 5, 3, 4, 1, 1, 1, 1],
    [1, 1, 2, 2, 3, 1, 1, 2, 4, 1, 3, 3, 2],
    [1, 1, 2, 1, 1, 5, 3, 3, 4, 5, 1, 1, 3],
    [1, 2, 3, 1, 1, 1, 1, 4, 3, 1, 3, 3, 2],
    [1, 1, 2, 2, 2, 1, 1, 2, 3, 1, 5, 4, 3],
    [5, 3, 2, 2, 1, 1, 1, 5, 3, 5, 3, 3, 2],
    [1, 1, 2, 1, 2, 1, 1, 3, 4, 1, 5, 4, 2],
    [1, 1, 2, 2, 2, 1, 1, 2, 2, 5, 5, 4, 2],
    [2, 1, 2, 2, 1, 1, 5, 5, 3, 1, 5, 4, 1],
    [1, 1, 3, 1, 1, 1, 1, 2, 3, 5, 1, 1, 3],
    [3, 2, 5, 1, 3, 1, 1, 2, 4, 5, 5, 4, 1],
    [3, 2, 1, 1, 2, 1, 1, 4, 3, 1, 3, 3, 5],
    [1, 1, 2, 1, 1, 1, 5, 5, 3, 1, 5, 4, 3],
    [1, 5, 1, 2, 1, 1, 1, 2, 2, 5, 1, 1, 1],
    [1, 1, 4, 5, 5, 1, 1, 2, 2, 1, 5, 4, 3]
  ];

  var xSet = [];
  var ySet = [];
  var zSet = [];

  var colorArray = ['#CED73E', '#FCF2A9', '#FFCB85',
    '#ED6743', '#F97DAA', '#E8B5FF',
    '#76A4F4', '#97FFFF', '#7EC1AB',
    '#B7589C', '#B3DB6B', '#DCF9AA',
    '#E063C3', '#FFC943'
  ];

  var attributes = [
    "Occurrence of LOVE", "Occurrence of TIME", "Occurrence of HEART",
    "Occurrence of KNOW", "Occurrence of LET", "Occurrence of START",
    "Original language",
    "Beat", "Distance from C", "Major/Minor key", "Female/male lead",
    "Number of lead singers", "Range of vocabulary"
  ];

  var countries = ["Sweden",
    "Russia",
    "Italy",
    "Belgium",
    "Australia",
    "Latvia",
    "Estonia",
    "Norway",
    "Israel",
    "Serbia",
    "Georgia",
    "Azerbaijan",
    "Montenegro",
    "Slovenia",
    "Romania",
    "Armenia",
    "Albania",
    "Lithuania",
    "Greece",
    "Hungary",
    "Spain",
    "Cyprus",
    "Poland",
    "United Kingdom",
    "France",
    "Austria",
    "Germany"
  ]
  var pointsResults = [
    ["Heroes", 365],
    ["A Million Voices", 303],
    ["Grande Amore", 292],
    ["Rhythm Inside", 217],
    ["Tonight Again", 196],
    ["Love Injected", 186],
    ["Goodbye To Yesterday", 106],
    ["A Monster Like Me", 102],
    ["Golden Boy", 97],
    ["Beauty Never Lies", 53],
    ["Warrior", 51],
    ["Hour Of The Wolf", 49],
    ["Adio", 44],
    ["Here For You", 39],
    ["De La Capat / All Over Again", 35],
    ["Face The Shadow", 34],
    ["I'm Alive", 34],
    ["This Time", 30],
    ["One Last Breath", 23],
    ["Wars For Nothing", 19],
    ["Amanecer", 15],
    ["One Thing I Should Have Done", 11],
    ["In The Name Of Love", 10],
    ["Still In Love With You", 5],
    ["N'oubliez Pas", 4],
    ["I Am Yours", 0],
    ["Black Smoke", 0]
  ];


  var som = new SOM(10, 10, options);

  som.setTraining(set);
  console.log("Training grid... " + options.iterations * set.length +
    " iterations.");
  //console.log(som.trainOne());
  var first = true;
  var donutValue;
  var iterations = 0;
  while (som.trainOne()) {
    var returnArray = som.getConvertedNodes();
    if (first === true) {
      response.write("<html>");
      response.write(
        "<link href='https://fonts.googleapis.com/css?family=Source+Code+Pro:400,200,600,300,500' rel='stylesheet' type='text/css'>"
      );
      response.write(
        "<style>body {font-family: 'Source Code Pro', sans-serif;} .block{float: left;max-width: 70px;}h1{font-size:1.8em;text-align:center;}h2{text-align:center;}.row {height: auto;min-height: 60px;max-height:500px;}.under{max-height:0px;text-align:center;font-size:0.3em;margin-top:-35px;max-width:60px;}#content{width: 600px;margin: auto;left: 0;right: 0;}.colr{font-size:2em;}#colorLegend{position:fixed;right:20px;top:120px;font-size:0.8em;text-align:right;}#legend{position:fixed;left:20px;top:120px;font-size:0.8em;}li {list-style-type:none}#end{margin-top:50px;}</style>"
      )
      response.write(
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-beta1/jquery.min.js"></script>'
      );

      response.write(
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/peity/3.2.0/jquery.peity.min.js"></script>'
      );

      response.write(
        '<div id="content"><h1>Self-Organizing the Eurovision</h1> <h2>Training cycles <span id="iterations">0</span>/' +
        options
        .iterations + '</h2>'
      );
      for (var i = 0; i < returnArray.length; i++) {
        response.write('<div class="row">');
        for (var x = 0; x < returnArray[i].length; x++) {
          response.write(
            '<div class="block"><span class="over donut">' +
            returnArray[i][x] +
            '</span><p class="under"></p></div>');
        }
        response.write('</div>');
      };
      response.write("<div id='legend'>");
      for (var i = 0; i < pointsResults.length; i++) {
        var num = i + 1;
        response.write("<li> <strong>" + num + "</strong>: " + countries[i] +
          " - " + pointsResults[i]
          [0] + "</li>");

      }
      response.write("</div>");
      response.write("<div id='colorLegend'>");
      for (var i = 0; i < attributes.length; i++) {
        var num = i + 1;
        response.write("<li>" + attributes[i] +
          "<strong class='colr' style='color:" +
          colorArray[i] +
          ";vertical-align: -3px;'> &#9632;</strong></li>");

      }
      response.write("</div>");
      response.write(
        "<script>var donuts = $('.donut').toArray(); var texts = $('.under').toArray(); console.log(donuts); console.log($('.donut'));var donutses = $('.donut').peity('donut', {innerRadius:20,radius: 30,fill: ['#CED73E', '#FCF2A9', '#FFCB85','#ED6743', '#F97DAA', '#E8B5FF','#76A4F4', '#97FFFF', '#7EC1AB','#B7589C', '#B3DB6B', '#DCF9AA','#E063C3', '#FFC943']});</script>"
      );
      response.write(
        "<div id='end'><strong>Description:</strong><p>The visualization displays the generation of – and positioning of nodes within – a Self-Organizing Map (SOM) out of Eurovision Song Contest data. For the data, we pursued to take apart the eurovision entries of 2015 into categorizable attributes. <li>We extracted the most common nouns and verbs of all the songs official translations in order to get some grasp of the content of the lyrics of each song, and used the frequency of these words as a metric, getting values for the prevalence of LOVE, TIME, HEART, KNOW, LET and START.</li><br><li>Original language, and whether the song had parts both in English and another language, was considered, as the multitude of languages is a distinguishing feature of the Eurovision.</li><br><li>A musical analysis tool (Serato) was used to analyze the tempo (beats-per-minute) and key of the song. The key was split into two components: Major or minor key, and the distance of the key to the note C. Distance to C was used in order to be able to represent the circular scale of notes on a finite scale 1-5, which, while not being a true representation of the key gives some indication of it in relation to the keys of other songs.</li><br><li>The amount of lead singers and the gender of the leading voice were considered, as these are often very distinguishing features of songs - is it a group, male/female solo or duet.</li><br><li>Finally, the range of vocabulary - the amount of different words used - was analysed, to give a scope of how rich the language of each songs is.</li><br>All metrics were mapped to a scale of 1-5, compiled into a dataset and then passed to the SOM-algorithm. The SOM is then used to plot this data into a grid of donut graphs – in which each graph shows the values of the attributes of the underlying data in that particular node. Each song is then placed into the grid into the position that best represents the values of its attributes.</p><br><p><strong>Information Visualization and Design | Aalto University </strong></p><p>2016<br>Marija Erjavec (MA Visual Communication)<br> Wolf Wikgren (MA New Media)</p><p>Libraries:<br>https://github.com/mljs/som/<br>http://benpickles.github.io/peity/</p><p>Data:<br>http://www.eurovision.tv/<br>Downloads:<br><a href='http://wolfw.xyz/r/esc-som/data/eurovision.csv'>Full dataset</a><br><a href='http://wolfw.xyz/r/esc-som/data/scaled_results.csv'>1-5 Scaled results</a></p><p>Processing:<br>Excel<br>Serato<br>Sweat & tears</p></div></div></html>"
      );
      first = false;
    } else if (iterations % 27 == 0) {
      if ((iterations / 27) % 100 === 0) {
        console.log((iterations / 27) / 10 + "%");
      }
      for (var i = 0; i < returnArray.length; i++) {
        for (var x = 0; x < returnArray[i].length; x++) {
          donutValue = i * returnArray[i].length + x;
          response.write(
            '<script>$(donutses[' + donutValue + ']).text("' +
            returnArray[i][x] + '").change();</script>'
          );
        }
      };
    }
    iterations++;
    response.write("<script>$('#iterations').html(" + Math.floor(iterations /
        27) +
      ")</script>");

    var resultArr = [];
    if (iterations % 27 == 0) {
      response.write("<script>$(texts).html('')</script>");
      for (var y = 0; y < set.length; y++) {
        var res = som.predict(set[y]);
        resultArr.push(res);
        //console.log(resultArr);
        //console.log(res);
        //console.log(res);
      }
      for (var t = 0; t <= resultArr.length - 1; t++) {
        //console.log(t);
        //console.log(resultArr[t]);
        var presentNr = t + 1;
        response.write("<script>$(texts[" + resultArr[t][1] * resultArr[t][0] +
          "]).append('" +
          presentNr +
          " ');</script>");
        //console.log(pointsResults[t][0]);
      }
    }
  }

  response.end();
  console.log("Response sent.")
}

var server = http.createServer(handleRequest);

server.listen(PORT, function() {
  //Callback triggered when server is successfully listening. Hurray!
  console.log("Server listening on: http://localhost:%s", PORT);
});
