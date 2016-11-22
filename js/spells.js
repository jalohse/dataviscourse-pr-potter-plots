function SpellChart() {

}

function findTotalInAll(key, spells) {
    var array = [];
    spells.forEach(function (element) {
        if (element[key] in array) {
            array[element[key]] = array[element[key]] + element.number;
                if (array[element[key]] > maxSpellsForCaster) {
                    maxSpellsForCaster = array[element[key]];
                }
        } else {
            array[element[key]] = element.number;
        }
    });
    return array;
}

function findTotalInOne(key, spells, color){
    array = [];
    spells.forEach(function (element) {
        var book, name;
        if(key == "caster"){
            book = element.spell;
            name = element.caster;
            if (element.number > maxSpellsForCaster) {
                maxSpellsForCaster = element.number;
            }
        } else {
            book = element.caster;
            name = element.spell;
            if (element.number > maxSpellsCast) {
                maxSpellsCast = element.number;
            }
        }
        array.push({book: book, name: name, number: element.number, color: color});
    });

    return array;

}

function groupBy(key, spellData){
    var all = [];
    var used = [];
    spellData.forEach(function (element) {
        if (used.indexOf(element[key]) == -1) {
            var allForKey = spellData.filter(function (d) {
                return d[key] == element[key];
            });
            if (allForKey.length > minNum) {
                all.push(allForKey);
            }
            used.push(element[key]);
        }
    });
    return all;
}


SpellChart.prototype.update = function (data) {

    var height = 400;
    var leftOffset = 40;

    spellData = [];
    allSpellData = [];
    bookSpellDataGrouped = [];
    minNum = 0;

    var spells, casters;
    if (data.length != 1) {
        for (i = 0; i < data.length; i++) {
            spells = data[i].spells;
            casters = [];
            maxSpellsForCaster = 0;
            casters = findTotalInAll("caster", spells);
            for (var key in casters) {
                spellData.push({book: data[i].book, name: key, number: casters[key], color: data[i].color});
            }
            minNum = 3;
        }
    } else {
        spells = data[0].spells;
        maxSpellsForCaster = 0;
        maxSpellsCast = 0;
        spellData = findTotalInOne("caster", spells, data[0].color);
        bookSpellDataGrouped = findTotalInOne("spell", spells, data[0].color);
        if (data[0].book == "Sorcerer's Stone") {
            minNum = 0;
        } else {
            minNum = 1;
        }
    }


    var allCasterData = groupBy("name", spellData);
    var bookSpellData = groupBy("name", bookSpellDataGrouped);
    for(i = 0; i < bookSpellData.length; i++){
        var num = 0;
        if(bookSpellData[i].length == 1) {
            num = bookSpellData[i][0]["number"];
        } else {
            bookSpellData.forEach(function (caster) {
                num += caster.number;
            });
        }
        allSpellData.push({book:bookSpellData[i][0]["name"], name: bookSpellData[i][0]["name"], number: bookSpellData[i][0]["number"]});
    }

    var width = window.innerWidth;

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

        var yScale = d3.scaleLinear().domain([0, maxSpellsForCaster]).range([height, 0]);

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
        if (maxSpellsForCaster < 10) {
            yAxis.ticks(maxSpellsForCaster);
        }
        spellChart.select("#line #yAxis")
            .attr("transform", "translate(" + leftOffset + ", 0)")
            .call(yAxis);

        var lines = spellChart.select("#line #lines")
            .selectAll('path').data(allCasterData);
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
        for (i = 0; i < allCasterData.length; i++) {
            var lineData = allCasterData[i];
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

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([0, 0])
            .html(function (d) {
                return d.data.book + ": " + d.data.number;
            });

        var asterCharts = d3.select("#aster")
            .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

        var radius = Math.min(width, height) / 2,
            innerRadius = 0.3 * radius,
            largeRadius = Math.min(width, height),
            largeInnerRadius = 0.3 * largeRadius;

        var smallArc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(function (d) {
                return (radius - innerRadius) * (d.data.number / maxCast) + innerRadius;
            });

        var largeArc = d3.arc()
            .innerRadius(largeInnerRadius)
            .outerRadius(function (d) {
                return (largeRadius - largeInnerRadius) * (d.data.number / maxSpellsCast) + largeInnerRadius;
            });

        var smallOutlineArc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(radius);

        var largeOutlineArc = d3.arc()
            .innerRadius(largeInnerRadius)
            .outerRadius(largeRadius);


        var pie = d3.pie().value(function (d) {
            return d.number;
        });

        spellChart.call(tip);


        var placementRadius = radius* (7/2);
        if(allCasterData.length > 8){
            placementRadius = radius * 4;
        }

        spellChart.attr("height", placementRadius * 3);

        var large = asterCharts.append("g")
            .attr("transform", "translate(0, " + placementRadius  +  ")");

        large.selectAll(".largeSolidArc")
            .data(pie(allSpellData))
            .enter().append("path")
            .attr("fill", function (d) {
                return color(d.data.name);
            })
            .attr("class", "largeSolidArc")
            .attr("stroke", "#fff")
            .attr("d", largeArc)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);


        large.selectAll(".largeOutlineArc")
            .data(pie(allSpellData))
            .enter().append("path")
            .attr("fill", "none")
            .attr("stroke", "#fff")
            .attr("class", "largeOutlineArc")
            .attr("d", largeOutlineArc);


        var degree = (2 * Math.PI) / allCasterData.length;

        for (i = 0; i < allCasterData.length; i++) {
            var character = allCasterData[i];
            maxCast = 0;
            character.forEach(function (element) {
                if (element.number > maxCast) {
                    maxCast = element.number;
                }
            });
            var current = asterCharts.append("g")
                .attr("transform", "translate(" +
                    Math.round(Math.cos(degree * i) * placementRadius ) +  "," +
                    Math.round(Math.sin(degree * i) * placementRadius + placementRadius) + ")");

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
                .attr("d", smallArc)
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);


            current.selectAll(".outlineArc")
                .data(pie(character))
                .enter().append("path")
                .attr("fill", "none")
                .attr("stroke", "#fff")
                .attr("class", "outlineArc")
                .attr("d", smallOutlineArc);
        }


    }
};