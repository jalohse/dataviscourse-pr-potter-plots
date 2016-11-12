function LocationChart() {

}


LocationChart.prototype.update = function (i) {
    d3.json('data/locations.json', function (error, data) {

        var height = 800;

        var leftOffset = 250;
        console.log(data);
        var bookLocationData = data[i]["chapters"];
        console.log(bookLocationData);
        var axisData = data[i]["axis"];
        console.log(axisData);
        var numChapters = bookLocationData.length;

        var width = 600;


        var locationChart = d3.select("#locations")
            .attr("width", leftOffset+width)
            .attr("height", height);


        var yScale = d3.scaleBand()
            .domain(axisData.map(function (d) {

                return d;
            })).range([0,500])
            .padding(.1);

        var xScale = d3.scaleLinear().domain([0, numChapters+1]).range([0, width]);


        var xAxis = d3.axisBottom();
        xAxis.scale(xScale);
        locationChart.select("#xAxis")
            .call(xAxis)
            .attr("transform", "translate(" + leftOffset + "," + 500 + ")")
            .selectAll("text").style("text-anchor", "end")
            .attr("dx", ".4em")
            .attr("dy", "1em")
      ;
        var yAxis = d3.axisLeft();
        yAxis.scale(yScale);
/*        var locations = ["one","two","three"];
        yAxis.tickValues(locations);*/
        locationChart.select("#yAxis")
            .attr("transform", "translate(" + leftOffset + ", "+0+")")
            .call(yAxis)
            .selectAll("text").style("text-anchor", "end")
            .attr("dx", "-.5em")
            .attr("dy", ".2em");

        var points = locationChart.select("#points").attr("transform", "translate(" + leftOffset + ", "+0+")")
        pointSelection = points.selectAll("circle").data(bookLocationData)
        pointSelection.enter().append("circle")
            .attr("r", 3.5)
            .attr("cx", function(d,i) { return xScale(i+1); })
            .attr("cy", function(d) { return yScale(d["locations"][0])+15 });
        pointSelection.attr("r", 3.5)
            .attr("cx", function(d,i) { return xScale(i+1); })
            .attr("cy", function(d) { return yScale(d["locations"][0])+15 });

    })



};