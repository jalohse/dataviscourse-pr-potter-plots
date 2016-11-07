function WordChart() {

}


WordChart.prototype.update = function (data) {

    var width = 1500;
    var height = 200;

    var word_counts = [];
    if (data.length == 7) {
        for (i = 0; i < data.length; i++) {
            var book = data[i];
            var total = d3.sum(book.chapters, function (d) {
                return d.word_count;
            });
            word_counts.push({name: book.book, number: total, color: book.color});
        }
    } else {
        for (i = 0; i < data[0].chapters.length; i++) {
            var chapter = data[0].chapters[i];
            word_counts.push({name: chapter.name, number: chapter.word_count, color: data[0].color});
        }
    }

    var wordChart = d3.select("#word_count")
        .attr("width", width)
        .attr("height", height);

    var totalWords = d3.sum(word_counts, function (d) {
        return d.number;
    });


    var widthScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width]);

    var rects = wordChart.append("g").selectAll("rect").data(word_counts);
    var newRects = rects.enter().append("rect");
    rects.exit().remove();
    rects = rects.merge(newRects);
    percent_so_far = 0.0;
    rects.attr("x", function (d) {
        var percent = (d.number / totalWords);
        var newX = widthScale(percent_so_far);
        percent_so_far += percent;
        return newX;
    }).attr("height", 100)
        .attr("width", function (d) {
            var percent = (d.number / totalWords);
            return percent * 100 + "%";
        }).style("fill", function (d) {
            return d.color;
        });


};