const CSVParser = (function() {
    function parse(file) {
        return new Promise(function(resolve, reject) {
            Papa.parse(file, {
                reject,
                complete: function completeParsing(results, file) {
                    const products = _.map(results.data, function(result) {
                        const product = _.zipObject(
                            ["code", "name", "description", "imageUrl", "price", "quantity"],
                            result,
                        );
                        return {
                            ...product,
                            quantity: parseInt(product.quantity),
                            price: parseFloat(product.price),
                        };
                    }).filter(function(product) {
                        return !!product.code;
                    });

                    resolve(products);
                },
            });
        });
    }

    return {
        parse,
    };
})();
