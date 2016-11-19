function InteractionChart() {
    d3.json('data/interactions.json', function (error, data) {
        interactions = data;
    });
}


InteractionChart.prototype.update = function (data) {

    var width = 720,
        height = 720,
        matrix = [];

    var svg = d3.select("#story svg")
        .attr("width", width)
        .attr("height", height);

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
                matrix[i][otherCharIndex].z += count;
                matrix[otherCharIndex][i].z += count;
                matrix[i][i].z += count;
                matrix[otherCharIndex][i].z += count;
                charCount[i].count += count;
                charCount[otherCharIndex].count += count;
            }
        });
    });


};
