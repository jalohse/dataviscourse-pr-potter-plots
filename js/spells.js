function SpellChart() {

}


SpellChart.prototype.update = function (data) {

    var height = 400;
    var leftOffset = 40;

    var spellData = [];
    var max;
    var minNum = 0;

    var spells, casters;
    if (data.length != 1) {
        for (i = 0; i < data.length; i++) {
            spells = data[i].spells;
            casters = [];
            max = 0;
            spells.forEach(function (element) {
                if (element.caster in casters) {
                    casters[element.caster] = casters[element.caster] + element.number;
                    if (casters[element.caster] > max) {
                        max = casters[element.caster];
                    }
                } else {
                    casters[element.caster] = element.number;
                }
            });
            for (var key in casters) {
                spellData.push({book: data[i].book, name: key, number: casters[key], color: data[i].color});
            }
            minNum = 3;
        }
    } else {
        spells = data[0].spells;
        casters = [];
        max = 0;
        spells.forEach(function (element) {
            if (element.number > max) {
                max = element.number;
            }
            spellData.push({book: element.spell, name: element.caster, number: element.number, color: data[0].color});
        });
        if (data[0].book == "Sorcerer's Stone") {
            minNum = 0;
        } else {
            minNum = 1;
        }
    }


    var allData = [];
    var used = [];
    spellData.forEach(function (element) {
        if (used.indexOf(element.name) == -1) {
            var allForPerson = spellData.filter(function (d) {
                return d.name == element.name;
            });
            if (allForPerson.length > minNum) {
                allData.push(allForPerson);
            }
            used.push(element.name);
        }
    });

    console.log(allData);

    var width = 7 * 100;

    var spellChart = d3.select("#spells")
        .attr("width", width)
        .attr("height", height);

    var color = d3.scaleOrdinal(d3.schemeCategory10);


    if (data.length != 1) {

        d3.select("#aster").classed("hidden", true);
        d3.select("#line").classed("hidden", false);

        var xScale = d3.scalePoint()
            .domain(spellData.map(function (d) {
                return d.book;
            })).range([leftOffset, width]);

        var yScale = d3.scaleLinear().domain([0, max]).range([height, 0]);

        var lineCreator = d3.line()
            .x(function (d) {
                return xScale(d.book);
            })
            .y(function (d) {
                return yScale(d.number);
            });

        var xAxis = d3.axisBottom();
        xAxis.scale(xScale);
        spellChart.select("#line #xAxis")
            .call(xAxis)
            .attr("transform", "translate(" + 0 + "," + height + ")")
            .selectAll("text").style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.2em")
            .attr("transform", function () {
                return "rotate(-90)"
            });
        var yAxis = d3.axisLeft();
        yAxis.scale(yScale);
        if (max < 10) {
            yAxis.ticks(max);
        }
        spellChart.select("#line #yAxis")
            .attr("transform", "translate(" + leftOffset + ", 0)")
            .call(yAxis);

        var lines = spellChart.select("#line #lines")
            .selectAll('path').data(allData);
        var newLines = lines
            .enter().append('path');
        lines.exit().remove();
        lines = lines.merge(newLines);
        lines.attr('d', lineCreator)
            .style("stroke", function (d) {
                return color(d[0].name);
            })
            .style("fill", "none");

        var circles = spellChart.select("#line #circles")
            .selectAll("circle");
        circles.remove();
        circles = spellChart.select("#circles")
            .selectAll("circle");
        for (i = 0; i < allData.length; i++) {
            var lineData = allData[i];
            circles.data(lineData)
                .enter().append('circle')
                .attr("cx", function (d) {
                    return xScale(d.book)
                })
                .attr("cy", function (d) {
                    return yScale(d.number)
                })
                .attr("r", 5)
                .style("fill", "white")
                .style("stroke", function (d) {
                    return color(d.name);
                });
        }
    } else {

        d3.select("#aster").classed("hidden", false);
        d3.select("#line").classed("hidden", true);
        d3.selectAll("#aster g").remove();

        totalHeight = height + 40;

        spellChart.attr("height", totalHeight * allData.length);

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([0, 0])
            .html(function (d) {
                return d.data.name + " " + d.data.book + " " + d.data.number;
            });

        var asterCharts = d3.select("#aster")
            .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

        var radius = Math.min(width, height) / 2,
            innerRadius = 0.3 * radius;

        var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(function (d) {
                return (radius - innerRadius) * (d.data.number / maxCast) + innerRadius;
            });

        var outlineArc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(radius);


        var pie = d3.pie().value(function (d) {
            return d.number;
        });

        spellChart.call(tip);


        for (i = 0; i < allData.length; i++) {
            var character = allData[i];
            maxCast = 0;
            character.forEach(function (element) {
                if (element.number > maxCast) {
                    maxCast = element.number;
                }
            });

            var current = asterCharts.append("g")
                .attr("transform", "translate(0, " + totalHeight * i + ")");

            current.append("text")
                .text(character[0].name)
                .attr("text-anchor", "middle");

            current.selectAll(".solidArc")
                .data(pie(character))
                .enter().append("path")
                .attr("fill", function (d) {
                    return color(d.data.name);
                })
                .attr("class", "solidArc")
                .attr("stroke", "#fff")
                .attr("d", arc)
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);


            current.selectAll(".outlineArc")
                .data(pie(character))
                .enter().append("path")
                .attr("fill", "none")
                .attr("stroke", "#fff")
                .attr("class", "outlineArc")
                .attr("d", outlineArc);
        }


    }
};