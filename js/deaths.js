function DeathChart() {
    d3.json('data/deaths.json', function (error, data) {
        deaths = data;
    });
}

DeathChart.prototype.update = function (data) {

    var width = 960,
        height = 700,
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

    var color = d3.scaleOrdinal(d3.schemeCategory20);

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
            return color((d.children ? d : d.parent).data.name);
        })
        .append("title")
        .text(function (d) {
            return d.data.name;
        });

};

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