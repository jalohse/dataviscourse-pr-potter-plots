function GrossChart(data) {

    var width = 850;
    var height = 750;
    var barHeight = 600;
    var leftOffset = 40;

    var properties = ["book_gross", "movie_gross"];
    data.forEach(function (d) {
        if (d.book != " Deathly Hallows") {
            d.gross = properties.map(function (property) {
                return {name: d.book, property: property, number: d[property], color: d.color};
            });
        }
    });
    var twoMovieProperties = ["book_gross", "movie1_gross", "movie2_gross"];
    var dh = data[data.length - 1];
    dh.gross = twoMovieProperties.map(function (property) {
        return {name: dh.book, property: property, number: dh[property], color: dh.color};
    });

    var totalBookSum = d3.sum(data, function (d) {
        return d.gross[0].number;
    });

    totalBookSum += dh.gross[0].number;

    var totalMovieSum = d3.sum(data, function (d) {
        return d.gross[1].number;
    });

    totalMovieSum += dh.gross[1].number + dh.gross[2].number;

    d3.select("#gross").append("text")
        .classed("summary", true)
        .html("The total grosses of all seven <i>Harry Potter</i> books and films are shown. Books are solid colored bars," +
            " while movies are striped bars. In total, the books made $" + totalBookSum.toLocaleString() + " million and the" +
            " movies made $" + totalMovieSum.toLocaleString() + " million. Hover over the bars to find out more information about " +
            "each book or movie.");


    var maxGross = d3.max(data, function (d) {
        return d3.max(d.gross, function (i) {
            return i.number;
        });

    });

    var xScale = d3.scaleBand()
        .domain(data.map(function (d) {
            return d3.max(d.gross, function (i) {
                return i.name;
            });
        })).range([leftOffset, width - 60])
        .padding(.05);


    var x2Scale = d3.scaleBand()
        .domain(properties)
        .rangeRound([0, xScale.bandwidth()])
        .padding(.02);

    var x3Scale = d3.scaleBand()
        .domain(twoMovieProperties)
        .rangeRound([0, xScale.bandwidth() * 1.5])
        .padding(.1);

    var yScale = d3.scaleLinear()
        .domain([0, maxGross])
        .range([barHeight, 0]);

    var grossChart = d3.select("#gross").append("svg")
        .attr("width", width)
        .attr("height", height);

    var defs = grossChart.append("defs");
    defs.selectAll("pattern")
        .data(bookData).enter().append("pattern")
        .attr('id', function (d) {
            return "pattern_" + d.color;
        })
        .attr("width", 80)
        .attr("height", 10)
        .attr('patternUnits', "userSpaceOnUse")
        .append('rect')
        .attr("width", 80)
        .attr("height", 5)
        .attr("fill", function (d) {
            return d.color;
        });

    var xAxis = d3.axisBottom();
    xAxis.scale(xScale);
    grossChart.append("g")
        .call(xAxis)
        .attr("transform", "translate(" + 0 + "," + barHeight + ")")
        .selectAll("text").style("text-anchor", "middle")
        .attr("dx", "-.8em")
        .attr("dy", ".5em");
    var yAxis = d3.axisLeft();
    yAxis.scale(yScale);
    grossChart.append('g')
        .attr("transform", "translate(" + leftOffset + ", 0)")
        .call(yAxis);

    var bookMovie = grossChart.selectAll(".group")
        .data(data).enter().append("g")
        .attr("transform", function (d) {
            return "translate (" + xScale(d.book) + ",0)";
        });

    var grossTip = d3.tip().attr('class', 'd3-tip')
        .direction('ne')
        .offset(function () {
            return [50, 0];
        })
        .html(function (d) {
            var text = "<p style='font-size: 20px; text-align: center; color: "
                + d.color + ";'><b><i>" + d.name;
            if (d.property.includes("movie1")) {
                text += " Part 1</i>: ";
            } else if (d.property.includes("movie2")) {
                text += " Part 2</i>: ";
            } else if (d.property.includes("movie")) {
                text += "</i> movie: ";
            } else {
                text += "</i> book: ";
            }
            text += "$" + d.number + " million</b><p>";
            return text;
        });

    grossChart.call(grossTip);


    var bars = bookMovie.append('g')
        .selectAll('rect');
    var barData = bars.data(function (d) {
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
        }).style("fill", "red");

    bars.exit().remove();
    bars = newBars.merge(bars);
    bars.attr('x', function (d) {
        if (d.name == "Deathly Hallows") {
            return x3Scale(d.property);
        }
        return x2Scale(d.property);
    }).attr("y", function (d) {
        return yScale(d.number);
    }).attr("width", function (d) {
        if (d.name == "Deathly Hallows") {
            return x3Scale.bandwidth();
        }
        return x2Scale.bandwidth();
    })
        .attr("height", function (d) {
            return barHeight - yScale(d.number);
        }).style("fill", function (d) {
        if (d.property.includes("movie")) {
            return "url(#pattern_" + d.color + ")";
        } else {
            return d.color;
        }
    }).attr("stroke", function (d) {
        if (d.property.includes("movie")) {
            return d.color;
        }
    }).on("mouseover", grossTip.show)
        .on("mouseout", grossTip.hide);

    d3.select("g path").attr("d", "M40.5,6V0.5H" + (width + 10) + "V6");
    var ticks = d3.selectAll("g.tick")._groups[0];
    var moved = false;
    for (i = 0; i < ticks.length; i++) {
        if (ticks[i]["__data__"] == "Deathly Hallows" && !moved) {
            var currentTick = ticks[i];
            var newVal = currentTick["transform"]["baseVal"][0]["matrix"]["e"] + xScale.bandwidth() / 4;
            currentTick.setAttribute("transform", "translate(" + newVal + ", 0)");
            moved = true;
        }
    }

}




