$(document).ready(
    (function () {
        const productTemplate = _.template(`<div class="card">
    <img class="card-img-top" src="<%= imageUrl %>" alt="<%= name %>" height="180">
    <div class="card-body">
      <h5 class="card-title"><%= name %></h5>
      <p class="card-text"><%= description %></p>
      <p class="card-text"><%= quantity %> left</p>
    </div>
    <div class="card-footer">
      <button type="button" id="button-buy-<%= id %>" class="btn btn-primary btn-lg btn-block">
        Buy for <strong class="price"><%= price %> TѦ</strong>
      </button>
    </div>
  </div>`);
        const $productsContainer = $(".products-container");

        function updateProductsContainer(content) {
            $productsContainer.html(content);
        }

        function addProductToProductsContainer(product, onBuyProduct) {
            const productMarkup = productTemplate(product);
            $productsContainer.append($(productMarkup));

            const $addToCartBtn = $(`#button-buy-${product.id}`);
            $addToCartBtn.on("click", function addToCartHandler() {
                if (_.isFunction(onBuyProduct)) onBuyProduct(product);
            });
        }

        function renderProducts(products, onBuyProduct, sortBy = "name") {
            $productsContainer.html("");

            const availableProducts = products.filter(function (product) {
                return product.quantity > 0;
            });

            if (availableProducts.length < 1) {
                updateProductsContainer('<div class="text-center">No stock available</span>');
                return;
            }

            _.sortBy(availableProducts, sortBy).forEach(function renderProduct(product) {
                addProductToProductsContainer(product, onBuyProduct);
            });
        }

        function loadProducts() {
            Api.getProducts()
                .then(function (fetchedProducts) {
                    renderProducts(fetchedProducts, buyProduct);
                })
                .catch(function (error) {
                    Alerts.showError(error, "alert-error");
                    updateProductsContainer('<div class="text-center">Sorry, try again later!</span>');
                });
        }

        function buyProduct(product) {
            Api.createOrder({
                id: product.id,
                price: product.price
            }).then(function (transaction) {
                const message = `Thank you for your purchase! Transaction number: ${transaction.id}`;
                Alerts.showSuccess(message, "alert-success");
                loadProducts();
            });
        }

        loadProducts();
    })(),
);
