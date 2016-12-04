function BattleChart() {

}


BattleChart.prototype.update = function (i) {
    d3.json('data/BattleDataNew.json', function (error, data) {

        var height = 600;

        var leftOffset = 250;
        console.log(data);
        var battleData = data[i]["battles"];
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

        var groups = points.selectAll("g").data(bookLocationData,function(d,i){
            //console.log(d["locations"]);
            return  d["locations"];});
        var timedelay=data[i]["totalPlaces"]*1000;
        console.log("loc chart cycle time:"+timedelay);
        groups.enter().append("g")
            .each(function(d,i){
                console.log(d["locations"]);

                var pointSelection=d3.select(this).selectAll("circle").data(d["locations"]);
                pointSelection.transition();
                console.log(pointSelection);
                pointSelection.enter().append("circle")
                    .attr("r", 5)
                    .attr("cx", function(d) { return xScale(i+1); })
                    .attr("cy", function(d) {
                        console.log(d);
                        return yScale(d)+10; })
                    .style("opacity",0.2)
                    .style("fill","lime")
                    .transition().duration(1000).delay(function(d,j) {
                    return (i*1000)+(j*250)})
                    .on("start", function repeat(d,j) {

                        d3.active(this)
                            .attr("r", 10)
                            .style("fill","red")
                            .style("opacity",1)
                            .transition()
                            .attr("r", 5)
                            .style("fill","lime")
                            .transition()
                            .delay(timedelay)
                            .on("start", repeat);

                    });
                pointSelection.attr("r", 5)
                    .attr("cx", function(d) { return xScale(i+1); })
                    .attr("cy", function(d) { console.log(d);return yScale(d)+10; })
                    .style("opacity",0.2)
                    .style("fill","lime")
                    .transition().duration(1000).delay(function(d,j) {
                    return (i*1000)+(j*250)})
                    .on("start", function repeat(d,j) {

                        d3.active(this)
                            .attr("r", 10)
                            .style("fill","red")
                            .style("opacity",1)
                            .transition()
                            .attr("r", 5)
                            .style("fill","lime")
                            .transition()
                            .delay(timedelay)
                            .on("start", repeat);

                    });
                pointSelection.exit().remove();

            });
        groups.each(function(d,i){
            console.log(d["locations"]);

            var pointSelection=d3.select(this).selectAll("circle").data(d["locations"]);
            pointSelection.transition();
            console.log(pointSelection);
            pointSelection.enter().append("circle")
                .attr("r", 5)
                .attr("cx", function(d) { return xScale(i+1); })
                .attr("cy", function(d) {
                    console.log(d);
                    return yScale(d)+10; })
                .style("opacity",0.2)
                .style("fill","lime")
                .transition().duration(1000).delay(function(d,j) {
                return (i*1000)+(j*250)})
                .on("start", function repeat(d,j) {

                    d3.active(this)
                        .attr("r", 10)
                        .style("fill","red")
                        .style("opacity",1)
                        .transition()
                        .attr("r", 5)
                        .style("fill","lime")
                        .transition()
                        .delay(timedelay)
                        .on("start", repeat);

                });
            pointSelection.attr("r", 5)
                .attr("cx", function(d) { return xScale(i+1); })
                .attr("cy", function(d) { console.log(d);return yScale(d)+10; })
                .style("opacity",0.2)
                .style("fill","lime")
                .transition().duration(1000).delay(function(d,j) {
                return (i*1000)+(j*250)})
                .on("start", function repeat(d,j) {

                    d3.active(this)
                        .attr("r", 10)
                        .style("fill","red")
                        .style("opacity",1)
                        .transition()
                        .attr("r", 5)
                        .style("fill","lime")
                        .transition()
                        .delay(timedelay)
                        .on("start", repeat);

                });
            pointSelection.exit().remove();

        });
        groups.exit().remove();

        console.log(timedelay);



    })




};