function InteractionChart() {
    d3.json('data/interactions.json', function (error, data) {
        interactions = data;
    });
}

function highlightText(classType, index, cell){
    var selectedIndex = 0;
    d3.selectAll(classType + " text")
        .classed("active",function (d, i) {
            if(i == cell[index]){
                selectedIndex = i;
                return true;
            }
        }).classed("nonactive",function (d, i) {
        return i != cell[index];
    }).style("fill",function (d, i) {
        if(i == cell[index]){
            return color;
        }
    });
    return selectedIndex;
}


InteractionChart.prototype.update = function (data) {

    var width = height = 1250,
        matrix = [],
        margin = 150;

    color = data.color;

    var svg = d3.select("#story svg")
        .attr("width", width + 2 * margin)
        .attr("height", height + 2 * margin)
        .attr("transform", "translate(" + margin + "," + margin + ")");

    var g = svg.select("g").attr("transform", "translate(" + margin + "," + margin + ")");

    var bookTitle = data.book.split(" ")[0];
    bookTitle = bookTitle.replace("'", "").toLowerCase();

    Object.keys(interactions).forEach(function (book) {
        if (book.includes(bookTitle)) {
            data = interactions[book];
        }
    });

    var characters = [];
    data.forEach(function (node) {
        var interaction = Object.keys(node)[0];
        interaction = interaction.split("*");
        if (characters.indexOf(interaction[0]) == -1) {
            characters.push(interaction[0]);
        }
        if (characters.indexOf(interaction[1]) == -1) {
            characters.push(interaction[1]);
        }
    });

    var charCount = [];
    characters.forEach(function (character, i) {
        character = {name: character, index: i, count: 0};
        charCount[i] = character;
        matrix[i] = d3.range(characters.length).map(function (j) {
            return {x: j, y: i, z: 0};
        });
    });

    charCount.forEach(function (character, i) {
        data.forEach(function (interaction) {
            var key = Object.keys(interaction)[0];
            if (key.includes(character.name)) {
                var otherChar = key.replace(character.name, "").replace("*", "");
                var otherCharIndex = characters.indexOf(otherChar);
                var count = interaction[key];
                matrix[i][i].z += count;
                matrix[otherCharIndex][otherCharIndex].z += count;
                if(matrix[i][otherCharIndex].z == 0) {
                    matrix[i][otherCharIndex].z += count;
                    matrix[otherCharIndex][i].z += count;
                    charCount[i].count += count;
                    charCount[otherCharIndex].count += count;
                }
            }
        });
    });

    tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([0, 0])
        .html(function (d) {
            return charCount[d[0]].name + " and " + charCount[d[1]].name +
                " appear in " +matrix[d[0]][d[1]].z + " chapters together.";
        });

    g.call(tip);

    var max = d3.max(matrix, function (d, i) {
        return d3.max(d, function (k, j) {
            if (i != j) {
                return k.z;
            }
        });
    });

    var orders = {
        name: d3.range(characters.length).sort(function (a, b) {
            return d3.ascending(charCount[a].name, charCount[b].name);
        }),
        count: d3.range(characters.length).sort(function (a, b) {
            return charCount[b].count - charCount[a].count;
        })
    };

    var xScale = d3.scaleBand().range([0, width]).domain(orders.count);

    var opacityScale = d3.scaleLinear().domain([0, max]).range([.1, 1]).clamp(true);

    g.select("rect")
        .attr("width", width)
        .attr("height", height);

    g.selectAll(".row").remove();
    g.selectAll(".column").remove();
    g.selectAll("text").remove();

    var row = g.selectAll('.row')
        .data(matrix)
        .enter().append("g")
        .attr("class", "row")
        .attr("transform", function (d, i) {
            return "translate(0," + xScale(i) + ")";
        }).each(function (row) {
            d3.select(this).selectAll(".cell")
                .data(row.filter(function (d) {
                    return d.z;
                })).enter().append("rect")
                .attr("class", "cell")
                .attr("x", function (d) {
                    return xScale(d.x);
                }).attr("width", xScale.bandwidth())
                .attr("height", xScale.bandwidth())
                .style("fill-opacity", function (d) {
                    return opacityScale(d.z);
                }).style("fill", function (d) {
                if (d.z > 0) {
                    return color;
                } else {
                    return null;
                }
            }).on("mouseover", function (cell) {
                y = highlightText(".row", "y", cell);
                x = highlightText(".column", "x", cell);
                if(x != y) {
                    tip.show([x, y]);
                }
            })
                .on("mouseout", function () {
                    tip.hide();
                    d3.selectAll("text").classed("active", false);
                    d3.selectAll("text").classed("nonactive", false);
                    d3.selectAll("#story svg text").style("fill", "black");
                });
        });

    row.append("line").attr("x2", width);

    row.append("text")
        .attr("x", -6)
        .attr("y", xScale.bandwidth() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "end")
        .attr("class", function () {
            if (charCount.length < 70) {
                return "storyTextBig";
            }
        })
        .text(function (d, i) {
            return charCount[i].name;
        });

    var column = g.selectAll(".column")
        .data(matrix)
        .enter().append("g")
        .attr("class", "column")
        .attr("transform", function (d, i) {
            return "translate (" + xScale(i) + ")rotate(-90)";
        });

    column.append("line").attr("x1", -width);

    column.append("text")
        .attr("x", 6)
        .attr('y', xScale.bandwidth() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "start")
        .attr("class", function () {
            if (charCount.length < 70) {
                return "storyTextBig";
            }
        })
        .text(function (d, i) {
            return charCount[i].name;
        });


};
