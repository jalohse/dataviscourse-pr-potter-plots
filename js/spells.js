function SpellChart() {

}


SpellChart.prototype.update = function (data) {

    var height = 400;
    var barHeight = 200;
    var leftOffset = 40;

    var spellData = [];
    var max = 0;

    if (data.length != 1) {
        for (i = 0; i < data.length; i++) {
            var spells = data[i].spells;
            var casters = [];
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
        }
    } else {
        var spells = data[0].spells;
        for (spell in spells) {
            spellData.push({name: spell, number: spells[spell], color: data[0].color});
        }
    }


    var allData = [];
    var used = [];
    spellData.forEach(function (element) {
        if (used.indexOf(element.name) == -1) {
            var allForPerson = spellData.filter(function (d) {
                return d.name == element.name;
            });
            if (allForPerson.length > 3) {
                allData.push(allForPerson);
            }
            used.push(element.name);
        }
    });

    console.log(allData);

    var numSpells = spellData.length;

    var width = 7 * 100;

    var spellChart = d3.select("#spells")
        .attr("width", width)
        .attr("height", height);


    var xScale = d3.scalePoint()
        .domain(spellData.map(function (d) {
            return d.book;
        })).range([leftOffset, width]);

    var yScale = d3.scaleLinear().domain([0, max]).range([barHeight, 0]);

    var color = d3.scaleOrdinal(d3.schemeCategory10);


    var lineCreator = d3.line()
        .x(function (d) {
            return xScale(d.book);
        })
        .y(function (d) {
            return yScale(d.number);
        });

    var xAxis = d3.axisBottom();
    xAxis.scale(xScale);
    spellChart.select("#xAxis")
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
    if (max < 10) {
        yAxis.ticks(max);
    }
    spellChart.select("#yAxis")
        .attr("transform", "translate(" + leftOffset + ", 0)")
        .call(yAxis);

    var lines = spellChart.select("#lines")
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

    d3.selectAll("#circles circle").exit().remove();
    var circles = spellChart.select("#circles")
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
            .attr("r", 3.5)
            .style("fill", "white")
            .style("stroke", function (d) {
                return color(d.name);
            });
    }
};