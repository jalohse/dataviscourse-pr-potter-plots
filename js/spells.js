function SpellChart() {

}

SpellChart.prototype.update = function (data) {
    var spellChart = d3.select("#spells").append("svg")
        .attr("width", 300)
        .attr("height", 400);
    var spellData = [];

    if(data.length != 1){
        for(i = 0; i < data.length; i++){
            var spells = data[i].spells;
            var total = 0;
            for(spell in spells){
                total += spells[spell];
            }
            var book = data[i].book.replace('Harry Potter and the ', '');
            spellData.push({book : book, number: total});
        }
    } else {
        //TODO handle individual book data
    }

    var maxSpellsCast = d3.max(spellData, function (d) {
        return d.number;
    });

    var xScale = d3.scaleBand()
        .domain(spellData.map(function (d) {
            return d.book;
        })).range([40, 300])
        .padding(.1);

    var yScale = d3.scaleLinear().domain([0, maxSpellsCast]).range([200, 0]);

    var xAxis = d3.axisBottom();
    xAxis.scale(xScale);
    spellChart.append("g")
        .call(xAxis)
        .attr("transform", "translate(" + 0 + "," + 200 + ")")
        .selectAll("text").style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.2em")
        .attr("transform", function() {
            return "rotate(-90)"
        });
    var yAxis = d3.axisLeft();
    yAxis.scale(yScale);
    spellChart.append('g')
        .attr("transform", "translate(" + 40 + ", 0)")
        .call(yAxis);

    var bars = spellChart.append('g')
        .selectAll('rect');
    var barData = bars.data(spellData);
    var newBars = barData
        .enter().append('rect')
        .attr('x', function(d){
            return xScale(d.book);
        }).attr("y", function(d){
            return yScale(d.number);
        }).attr("width", xScale.bandwidth())
        .attr("height", function(d){
            return 200 - yScale(d.number);
        }).style("fill", "red");
    bars = newBars.merge(bars);
};