function SpellChart() {

}

var width = 300;
var height = 400;
var barHeight = 200;
var leftOffset = 40;

SpellChart.prototype.update = function (data) {
    var spellChart = d3.select("#spells").append("svg")
        .attr("width", width)
        .attr("height", height);
    var spellData = [];

    if(data.length != 1){
        for(i = 0; i < data.length; i++){
            var spells = data[i].spells;
            var total = 0;
            for(spell in spells){
                total += spells[spell];
            }
            var book = data[i].book.replace('Harry Potter and the ', '');
            spellData.push({name : book, number: total, color: data[i].color});
        }
    } else {
        //TODO handle individual book data
    }

    var maxSpellsCast = d3.max(spellData, function (d) {
        return d.number;
    });

    var xScale = d3.scaleBand()
        .domain(spellData.map(function (d) {
            return d.name;
        })).range([leftOffset, width])
        .padding(.1);

    var yScale = d3.scaleLinear().domain([0, maxSpellsCast]).range([barHeight, 0]);

    var xAxis = d3.axisBottom();
    xAxis.scale(xScale);
    spellChart.append("g")
        .call(xAxis)
        .attr("transform", "translate(" + 0 + "," + barHeight + ")")
        .selectAll("text").style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.2em")
        .attr("transform", function() {
            return "rotate(-90)"
        });
    var yAxis = d3.axisLeft();
    yAxis.scale(yScale);
    spellChart.append('g')
        .attr("transform", "translate(" + leftOffset + ", 0)")
        .call(yAxis);

    var bars = spellChart.append('g')
        .selectAll('rect');
    var barData = bars.data(spellData);
    var newBars = barData
        .enter().append('rect')
        .attr('x', function(d){
            return xScale(d.name);
        }).attr("y", function(d){
            return yScale(d.number);
        }).attr("width", xScale.bandwidth())
        .attr("height", function(d){
            return barHeight - yScale(d.number);
        }).style("fill", function(d){
            return d.color;
        });
    bars.exit().remove();
    bars = newBars.merge(bars);
    bars.attr('x', function(d){
        return xScale(d.name);
    }).attr("y", function(d){
        return yScale(d.number);
    }).attr("width", xScale.bandwidth())
        .attr("height", function(d){
            return barHeight - yScale(d.number);
        }).style("fill", function(d){
        return d.color;
    });
};