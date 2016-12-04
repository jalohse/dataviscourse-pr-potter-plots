(function () {
    var instance = null;
    var tabWidth = 150;

    function switchColors(current, i){
        var style = current.getAttribute("style");
        style = style.replace("fill: ", "");
        style = style.replace(";", "");
        var text = d3.selectAll("#nav text")._groups[0][i];
        var textFill = text.getAttribute("style");
        textFill = textFill.replace("fill: ", "").replace(";", "");
        current.setAttribute("style", "fill: " + textFill);
        text.setAttribute("style", "fill: " + style);
        current.setAttribute("stroke", style);
        text.setAttribute("class", "selected_text");
    }



    function init() {
        var spellChart = new SpellChart();
        var wordChart = new WordChart();
        var deathChart = new DeathChart();
        var locationChart = new LocationChart();
        var storyChart = new InteractionChart();

        d3.json('data/books.json', function (error, data) {
            bookData = data;
            var tabs = d3.select("#nav").attr("width", tabWidth * bookData.length + tabWidth).append("g").selectAll("rect");
            var tabData = tabs.data(bookData);
            var newTabs = tabData.enter().append("rect")
                .attr("width", tabWidth)
                .attr("height", 50)
                .attr("x", function (d, i) {
                    return i * tabWidth;
                }).style("fill", function (d) {
                    return d.color;
                });
            tabs = newTabs.merge(tabs);
            tabs.attr("width", tabWidth)
                .attr("height", 50)
                .attr("x", function (d, i) {
                    return i * tabWidth;
                }).attr("stroke", function (d) {
                    return d.color;
            });
            d3.select("#nav").append("rect")
                .attr("id", "all")
                .attr("width", tabWidth)
                .attr("height", 50)
                .attr("x", tabWidth * bookData.length)
                .style("fill", 'white')
                .attr("stroke", "black")
                .attr("class", "selected");

            d3.selectAll("#nav rect").on("click", function (d, i) {
                if(this.getAttribute("class") != "selected") {
                    var alreadySelected = d3.select(".selected")._groups[0][0];
                    if(alreadySelected) {
                        var selectedFill = alreadySelected.getAttribute("stroke");
                        alreadySelected.setAttribute("style", "fill: " + selectedFill);
                        text = d3.selectAll("#nav text")._groups[0];
                        for (j = 0; j < text.length; j++) {
                            if (text[j].getAttribute("style") == "fill: " + selectedFill
                            || text[j].getAttribute("style") == "fill: " + selectedFill +";") {
                                text[j].setAttribute("style", "fill: " + "white");
                                text[j].removeAttribute("class");
                            }
                        }
                        alreadySelected.removeAttribute("class");
                    }
                    switchColors(this, i);
                    this.setAttribute("class", "selected");



                    if (this.getAttribute("id") == "all") {
                        d3.select("#gross_head").classed("hidden", false);
                        d3.select("#gross").classed("hidden", false);
                        d3.select("#story_head").classed("hidden", true);
                        d3.select("#story").classed("hidden", true);
                        d3.select("#locationsdiv").classed("hidden", true);
                        console.log("change to all");
                        spellChart.update(bookData);
                        wordChart.update(bookData);
                        deathChart.update(bookData);
                    } else {
                        d3.select("#gross_head").attr("class", "hidden");
                        d3.select("#gross").attr("class", "hidden");
                        d3.select("#story_head").classed("hidden", false);
                        d3.select("#story").classed("hidden", false);
                        d3.select("#locationsdiv").classed("hidden", false);
                        console.log("change to: " + d.book);
                        spellChart.update([d]);
                        wordChart.update([d]);
                        deathChart.update([d]);
                        storyChart.update(d);
                    }
                     locationChart.update(i);
                }
            });

            var text = d3.select("#nav g").selectAll("text").data(bookData);
            text.enter().append("text")
                .text(function (d) {
                    return d.book;
                }).attr("x", function (d, i) {
                return i * tabWidth + tabWidth / 2;
            }).attr("y", 32)
                .attr("text-anchor", "middle")
                .style("fill", "white");
            d3.select("#nav").append("text").text("All")
                .attr("x", tabWidth * bookData.length + tabWidth / 2)
                .attr("y", 32)
                .attr("text-anchor", "middle")
                .style("fill", "black")
                .attr("class", "selected_text");

            spellChart.update(bookData);
            wordChart.update(bookData);
            deathChart.update(bookData);
            new GrossChart(data);
        })

    }


    function Main() {
        if (instance !== null) {
            throw new Error("Cannot instantiate more than one Class");
        }
    }


    Main.getInstance = function () {
        var self = this;
        if (self.instance == null) {
            self.instance = new Main();

            init();
        }
        return instance;
    };

    Main.getInstance();
})();