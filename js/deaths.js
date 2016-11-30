function DeathChart() {
    d3.json('data/deaths.json', function (error, data) {
        deaths = data;
    });
}

DeathChart.prototype.update = function (data) {

    var width = 760,
        height = 600,
        radius = (Math.min(width, height) / 2);
    var current = [];

    if (data.length != 7) {
        current = deaths[data[0].book];
    } else {
        for (i = 0; i < data.length; i++) {
            current = current.concat(deaths[data[i].book]);
        }
    }

    data = nest(current);
    root = createTree(data);

    d3.select("#deaths")
        .attr("width", width)
        .attr("height", height);


    var svg = d3.select("#deaths g")
        .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

    var x = d3.scaleLinear()
        .range([0, 2 * Math.PI]);

    var y = d3.scaleSqrt()
        .range([0, radius]);

    var arc = d3.arc()
        .startAngle(function (d) {
            return Math.max(0, Math.min(2 * Math.PI, x(d.x0)));
        })
        .endAngle(function (d) {
            return Math.max(0, Math.min(2 * Math.PI, x(d.x1)));
        })
        .innerRadius(function (d) {
            return Math.max(0, y(d.y0));
        })
        .outerRadius(function (d) {
            return Math.max(0, y(d.y1));
        });

    var partition = d3.partition().padding(0);
    root = d3.hierarchy(root[0]);
    root.sum(function (d) {
        return d.children ? 0 : 1;
    });

    var max = d3.max(data, function (d) {
        var num  = 0;
        for(i = 0; i < d.values.length; i++){
            num += d.values[i].value.name.length;
        }
        return d.values.length + num;
    });

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var luminance = d3.scaleSqrt()
        .domain([0, max])
        .clamp(true)
        .range([90, 20]);

    var paths = svg.selectAll("path")
        .data(partition(root).descendants());
    var newPaths = paths.enter().append("path");
    paths.exit().remove();
    paths = paths.merge(newPaths);
    paths.attr("d", arc)
        .attr("id", function (d) {
            return d.name
        })
        .style("stroke", "#fff")
        .style("fill", function (d) {
            if (d.data.name == "root") {
                return "none";
            }
            var p = d;
            while (p.depth > 1) p = p.parent;
            var c = d3.lab(color(p.data.name));
            if(d.children) {
                c.l = luminance(d.children.length);
            } else {
                c.l = luminance(0);
            }
            return c;
        }).on('mouseover', changeInsideText)
        .on('mouseout', clearText);

};

function changeInsideText(d) {
    var text = d3.select("#deaths g #short");
    var string = "";
    if (d.depth == 3) {
        var name = getName(d.data.name, true);
        if (isNaturalCauses(d.data.parent)) {
            string += name + " died of natural causes";
        } else {
            string += name + " was killed by ";
            d3.select("#long").text(getName(d.data.parent, false));
        }
    } else {
        var killString = getKilledSubstring(d);
        if (d.data.name == "killing curse") {
            string += "The killing curse killed " + killString;
        } else if (d.data.name == "curse" || d.data.name == "wound") {
            string += "A " + d.data.name + " killed " + killString;
        } else if (d.data.name == "unknown" || d.data.name == "other") {
            string += killString + " died of " + d.data.name + " causes.";
        } else if (isNaturalCauses(d.data.name)) {
            string += killString + " died of natural causes";
        } else {
            string += getName(d.data.name, true) + " killed " + killString;
        }
        setMethodOfKilling(d);
    }
    text.text(string);
}

function getName(d, isStart) {
    var name = "";
    if (isObject(d)) {
        if (isStart) {
            name += "A ";
        } else {
            name += " a "
        }
    } else if (isThing(d)) {
        if (isStart) {
            name += "The ";
        } else {
            name += " the "
        }
    }
    name += d;
    return name;
}

function findTotalKilled(d) {
    totalKilled = 0;
    d.children.forEach(function (child) {
        if (child.children) {
            child.children.forEach(function () {
                totalKilled += 1;
            });
        } else {
            totalKilled += 1;
        }
    });
    return totalKilled;
}

function getKilledSubstring(d) {
    totalKilled = findTotalKilled(d);
    if (totalKilled == 1) {
        killString = totalKilled + " person";
    } else {
        killString = totalKilled + " people";
    }
    return killString;
}

function setMethodOfKilling(d) {
    longText = "";
    if (d.children && d.data.parent != "root"
        && !isNaturalCauses(d.data.name)
        && d.data.parent != "other"
        && d.data.parent != "unknown") {
        longText += " by ";
        if (d.data.parent == "wound") {
            longText += "inflicting a " + d.data.parent;
        } else if (d.data.parent == "curse") {
            longText += "using a " + d.data.parent;
        } else if (d.data.parent == "killing curse") {
            longText += "using the " + d.data.parent;
        } else {
            longText += d.data.parent;
        }
        d3.select("#long").text(longText);
    } else {
        d3.select("#long").text("");
    }
}

function isObject(d) {
    return d == "Death Eater" ||
        d == "Dragon";
}

function isThing(d) {
    return d == "Serpent of Slytherin" ||
        d == "Bloody Baron";
}

function isNaturalCauses(d) {
    return d == "" || d == "natural causes";
}

function clearText() {
    d3.select("#deaths g #short").text("");
    d3.select("#deaths g #long").text("");
}

function nest(current) {
    return d3.nest()
        .key(function (d) {
            return d["cause"];
        }).key(function (d) {
            return d["killed_by"];
        }).rollup(function (leaves) {
            return {
                "name": leaves.map(function (leaf) {
                    return leaf.name;
                })
            }
        }).entries(current);
}

function createTree(data) {
    var root = [{"name": "root", "children": []}];
    for (i = 0; i < data.length; i++) {
        var cause = {"name": data[i].key, "parent": "root", "children": []};
        for (j = 0; j < data[i].values.length; j++) {
            var causeChildren = data[i].values;
            var killer = {"name": causeChildren[j].key, "parent": data[i].key, "children": []};
            var newData = causeChildren[j].value.name;
            for (k = 0; k < newData.length; k++) {
                var victim = {"name": newData[k], "parent": causeChildren[j].key};
                killer["children"].push(victim);
            }
            cause["children"].push(killer);
        }
        root[0]["children"].push(cause);
    }
    return root;
}