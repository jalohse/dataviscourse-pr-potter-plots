(function () {
    var instance = null;
    var tabWidth = 200;

    function init() {
        var spellChart = new SpellChart();


        d3.json('data/books.json', function (error, data) {
            bookData = data;
            var tabs = d3.select("#nav").attr("width", tabWidth * bookData.length + tabWidth).append("g").selectAll("rect");
            var tabData = tabs.data(bookData);
            var newTabs = tabData.enter().append("rect")
                .attr("width", tabWidth)
                .attr("height", 50)
                .attr("x", function (d, i) {
                    return i * tabWidth;
                }).style("fill", function(d){
                    return d.color;
                });
            tabs = newTabs.merge(tabs);
            tabs.attr("width", tabWidth)
                .attr("height", 50)
                .attr("x", function (d, i) {
                    return i * tabWidth;
                });
            d3.select("#nav").append("rect")
                .attr("id", "all")
                .attr("width", tabWidth)
                .attr("height", 50)
                .attr("x", tabWidth * bookData.length)
                .style("fill", 'black');

            d3.selectAll("#nav rect").on("click", function(d){
                if(this.getAttribute("id") == "all"){
                    console.log("change to all");
                    spellChart.update(bookData);
                } else {
                    console.log("change to: " + d.book);
                    spellChart.update([d])
                }
            });

            var text = d3.select("#nav g").selectAll("text").data(bookData);
            text.enter().append("text")
                .text(function (d) {
                    return d.book;
                }).attr("x", function (d, i) {
                return i * tabWidth + tabWidth/2;
                }).attr("y", 25)
                .attr("text-anchor", "middle");
            d3.select("#nav").append("text").text("All")
                .attr("x", tabWidth * bookData.length + tabWidth/2)
                .attr("y", 25)
                .attr("text-anchor", "middle");

            spellChart.update(bookData);
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