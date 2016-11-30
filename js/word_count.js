function WordChart() {

}


WordChart.prototype.update = function (data) {

    var width = 1000;
    var height = 200;
    var color = "";

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
        color = data[0].color;
    }

    var wordChart = d3.select("#word_count")
        .attr("width", width)
        .attr("height", height);

    var totalWords = d3.sum(word_counts, function (d) {
        return d.number;
    });

    var maxPercent = d3.max(word_counts, function(d){
        return d.number / totalWords;
    });

    var widthScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width]);

    var colorScale = d3.scaleLinear()
        .domain([0,maxPercent]).range(["#FFFFFF", color]);

    var wordTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([0, 0])
        .html(function (d) {
            return d.name + ": " + d.number + " words.";
        });

    wordChart.call(wordTip);


    var rects = wordChart.select("g").selectAll("rect").data(word_counts);
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
            if(data.length != 7){
                return colorScale(d.number / totalWords);
            }
            return d.color;
        }).on('mouseover', wordTip.show)
        .on('mouseout', wordTip.hide);


};