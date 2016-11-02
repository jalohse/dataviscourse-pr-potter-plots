
(function(){
    var instance = null;

    function init() {
        var spellChart = new SpellChart();



        d3.json('data/books.json', function(error, data) {
            bookData = data;
            console.log(bookData);
            spellChart.update(bookData);
        })
    }


    function Main(){
        if(instance  !== null){
            throw new Error("Cannot instantiate more than one Class");
        }
    }


    Main.getInstance = function(){
        var self = this;
        if(self.instance == null){
            self.instance = new Main();

            init();
        }
        return instance;
    };

    Main.getInstance();
})();