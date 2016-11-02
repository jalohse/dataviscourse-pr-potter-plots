var width = 300;
var height = 400;
var barHeight = 200;
var leftOffset = 40;

function GrossChart(data) {

    var grossChart = d3.select("#gross").append("svg")
        .attr("width", width)
        .attr("height", height);

    var properties = ["book_gross", "movie_gross"];
    data.forEach(function (d) {
        d.gross = properties.map(function (property) {
            var book = d.book.replace('Harry Potter and the ', '');
            return {name: book, property: property, number: d[property], color: d.color};
        });
    });


    var maxGross = d3.max(data, function (d) {
        return d3.max(d.gross, function(i){
            return i.number;
        });

    });

    var xScale = d3.scaleBand()
        .domain(data.map(function (d) {
            return d3.max(d.gross, function(i){
                return i.name;
            });
        })).range([leftOffset, width])
        .padding(.1);

    var x2Scale = d3.scaleBand()
        .domain(properties)
        .rangeRound([0, xScale.bandwidth()])
        .padding(.05);

    var yScale = d3.scaleLinear()
        .domain([0, maxGross])
        .range([barHeight, 0]);

    var xAxis = d3.axisBottom();
    xAxis.scale(xScale);
    grossChart.append("g")
        .call(xAxis)
        .attr("transform", "translate(" + 0 + "," + barHeight + ")")
        .selectAll("text").style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.2em")
        .attr("transform", function () {
            return "rotate(-90)"
        });
    var yAxis = d3.axisLeft();
    yAxis.scale(yScale);
    grossChart.append('g')
        .attr("transform", "translate(" + leftOffset + ", 0)")
        .call(yAxis);

    var bookMovie = grossChart.selectAll(".group")
        .data(data).enter().append("g")
        .attr("transform", function(d){
            var book = d.book.replace('Harry Potter and the ', '');
            return "translate (" + xScale(book) + ",0)";
        });

    var bars = bookMovie.append('g')
        .selectAll('rect');
    var barData = bars.data(function(d){
        return d.gross;
    });
    var newBars = barData
        .enter().append('rect')
        .attr('x', function (d) {
            return x2Scale(d.name);
        }).attr("y", function (d) {
            return yScale(d.number);
        }).attr("width", x2Scale.bandwidth())
        .attr("height", function (d) {
            return barHeight - yScale(d.number);
        }).style("fill", function (d) {
            return d.color;
        });
    bars.exit().remove();
    bars = newBars.merge(bars);
    bars.attr('x', function (d) {
        return x2Scale(d.property);
    }).attr("y", function (d) {
        return yScale(d.number);
    }).attr("width", x2Scale.bandwidth())
        .attr("height", function (d) {
            return barHeight - yScale(d.number);
        }).style("fill", function (d) {
        if(d.property == 'movie_gross'){
            return 'red';
        } else {
            return d.color;
        }
    });

}


