function SpellChart() {

}

function findTotalInAll(key, spells) {
    var array = [];
    spells.forEach(function (element) {
        if (element[key] in array) {
            array[element[key]] = array[element[key]] + element.number;
            if (array[element[key]] > maxSpellsForCaster && key == "caster") {
                maxSpellsForCaster = array[element[key]];
            } else if (array[element[key]] > maxSpellsCast && key == "spell") {
                maxSpellsCast = array[element[key]];
            }
        } else {
            array[element[key]] = element.number;
        }
    });
    return array;
}

function findTotalForCaster(spells, color) {
    array = [];
    spells.forEach(function (element) {
        if (element.number > maxSpellsForCaster) {
            maxSpellsForCaster = element.number;
        }
        array.push({spell: element.spell, name: element.caster, number: element.number, color: color});
    });

    return array;

}

function groupBy(key, spellData) {
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

function createLineChart(spellData, allCasterData){

    var leftOffset = 40;
    height = 700;


    d3.select("#line").attr("height", height)
        .attr("y", 100);

    d3.select("#spells").classed("hidden", true);
    d3.select("#line").classed("hidden", false);

    var xScale = d3.scalePoint()
        .domain(spellData.map(function (d) {
            return d.book;
        })).range([leftOffset, width - leftOffset]);

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
        .attr("transform", "translate(" + 0 + "," + (height - 10) + ")")
        .selectAll("text").style("text-anchor", "middle")
        .attr("dx", "-.8em")
        .attr("dy", ".5em");
    var yAxis = d3.axisLeft();
    yAxis.scale(yScale);
    if (maxSpellsForCaster < 10) {
        yAxis.ticks(maxSpellsForCaster);
    }
    spellChart.select("#line #yAxis")
        .attr("transform", "translate(" + leftOffset + ", -10)")
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


    var lineTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([0, 0])
        .html(function (d) {
            return d.name  + " cast " + d.number + " spells in " + d.book;
        });
    spellChart.call(lineTip);

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
            }).on('mouseover', lineTip.show)
            .on('mouseout', lineTip.hide);
    }
}

function createAllSpellsAster(allSpellData){

    var largeRadius = Math.min(width, height) / 1.5,
        largeInnerRadius = 0.3 * largeRadius;

    var largeArc = d3.arc()
        .innerRadius(largeInnerRadius)
        .outerRadius(function (d) {
            return (largeRadius - largeInnerRadius) * (d.data.number / maxSpellsCast) + largeInnerRadius;
        });

    var largeOutlineArc = d3.arc()
        .innerRadius(largeInnerRadius)
        .outerRadius(largeRadius);

    var large = d3.select("#aster").append("g")
        .attr("transform", "translate(0, " + placementRadius + ")");

    large.selectAll(".solidArc")
        .data(pie(allSpellData))
        .enter().append("path")
        .attr("spell", function (d) {
            return d.data.name;
        })
        .attr("fill", "gray")
        .attr("class", "solidArc")
        .attr("stroke", "#fff")
        .attr("d", largeArc)
        .on('mouseover', function (d) {
            highlightSelected(d);
        })
        .on('mouseout', unhighlight);


    large.selectAll(".largeOutlineArc")
        .data(pie(allSpellData))
        .enter().append("path")
        .attr("fill", "none")
        .attr("stroke", "#fff")
        .attr("class", "largeOutlineArc")
        .attr("d", largeOutlineArc);
}

function createSmallSpellCharts(character, radius, degree){

    var innerRadius = 0.3 * radius;

    var smallOutlineArc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius);

    var maxCast = 0;
    character.forEach(function (element) {
        if (element.number > maxCast) {
            maxCast = element.number;
        }
    });

    var x = Math.round(Math.cos(degree * i) * placementRadius);
    var y = Math.round(Math.sin(degree * i) * placementRadius + placementRadius);

    var current = d3.select("#aster").append("g")
        .attr("transform", "translate(" + x + "," + y + ")");

    var spacing = 15;

    var newR = radius * .87;

    current.append("text")
        .text(character[0].name)
        .attr("text-anchor", function () {
            if(total > 8 && x == y && x != 0){
                    return "end";
            } else if(total > 8 && x == -y && x != 0){
                return "start";
            } else if(x == 0 || y == 0){
                return "middle"
            } else if(x > 0){
                return "start";
            } else {
                return "end";
            }
        })
        .attr("dy", function () {
            if(x == 0){
                if(y == 0){
                    return (spacing + newR) * -1;
                } else {
                    return spacing + spacing + newR ;
                }
            }
        })
        .attr("dx", function () {
            if(total > 8 && x == y && x != 0){
                return (spacing + newR) * -1;
            } else if(total > 8 && x == -y && x != 0){
                return spacing + newR;
            } else if(x > 0){
                return spacing + newR;
            } else if (x == 0){
                return 0;
            }else {
                return (spacing + newR) * -1;
            }
        });

    current.selectAll(".solidArc")
        .data(pie(character))
        .enter().append("path")
        .attr("spell", function (d) {
            return d.data.spell;
        })
        .attr("fill", "gray")
        .attr("class", "solidArc")
        .attr("stroke", "#fff")
        .attr("d", smallOutlineArc)
        .on('mouseover', spellTip.show)
        .on('mouseover', function (d) {
            highlightSelected(d);
        })
        .on('mouseout', unhighlight);
}

function highlightSelected(d){
    spellTip.hide();
    var spells = d3.selectAll("#aster path")._groups[0];
    spells.forEach(function (path) {
        if(path.getAttribute("fill") != "gray" && path.getAttribute("class" == "solidArc")){
            path.setAttribute("fill", "gray");
        }
        spellTip.show(d);
        if(path.getAttribute("spell") == d.data.spell){
            path.setAttribute("fill", color);
        }
    })
}

function unhighlight(){
    spellTip.hide();
    var spells = d3.selectAll("#aster path")._groups[0];
    spells.forEach(function (path) {
        if(path.getAttribute("fill") != "gray" && path.getAttribute("class") == "solidArc"){
            path.setAttribute("fill", "gray");
        }
    })
}


SpellChart.prototype.update = function (data) {

    var spellData = [];
    var allSpellData = [];

    height = 200;
    minNum = 0;
    maxSpellsCast = 0;
    maxSpellsForCaster = 0;
    width = 750;

    color = d3.scaleOrdinal(d3.schemeCategory20);


    var spells;
    if (data.length != 1) {
        for (i = 0; i < data.length; i++) {
            spells = data[i].spells;
            var casters = [];
            maxSpellsForCaster = 0;
            casters = findTotalInAll("caster", spells);
            for (var key in casters) {
                spellData.push({book: data[i].book, name: key, number: casters[key], color: data[i].color});
            }
            minNum = 3;
        }
    } else {
        spells = data[0].spells;
        color = data[0].color;
        spellData = findTotalForCaster(spells, data[0].color);
        var bookSpellDataGrouped = findTotalInAll("spell", spells);
        for (var key in bookSpellDataGrouped) {
            allSpellData.push({spell: key, name: key, number: bookSpellDataGrouped[key], color: data[0].color});
        }
        if (data[0].book == "Sorcerer's Stone") {
            minNum = 0;
        } else {
            minNum = 1;
        }
    }


    var allCasterData = groupBy("name", spellData);
    total = allCasterData.length;

    if (data.length != 1) {
        spellChart = d3.select("#line")
            .attr("width", width)
            .attr("height", height);
        createLineChart(spellData, allCasterData);
    } else {
        spellChart = d3.select("#spells")
            .attr("width", width)
            .attr("height", height);
        d3.select("#spells").classed("hidden", false);
        d3.select("#line").classed("hidden", true);
        d3.selectAll("#aster g").remove();

        spellTip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([0, 0])
            .html(function (d) {
                return d.data.spell + ": " + d.data.number;
            });

        d3.select("#aster")
            .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

        var radius = Math.min(width, height) / 3;

        pie = d3.pie().value(function (d) {
            return d.number;
        });

        spellChart.call(spellTip);


        placementRadius = radius * (7/2);
        if (total > 8) {
            placementRadius = radius * 4;
        }

        spellChart.attr("height", placementRadius * 3);

        createAllSpellsAster(allSpellData);

        var degree = (2 * Math.PI) / allCasterData.length;

        for (i = 0; i < allCasterData.length; i++) {
            createSmallSpellCharts(allCasterData[i], radius, degree);
        }


    }
};