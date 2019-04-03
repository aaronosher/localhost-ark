$(document).ready(function() {
    let products = [];
    let $productsFileButton = $("#productsFile");

    function reset() {
        products = [];
        showProducts([]);
        $productsFileButton.val("");
    }

    function getPreviewContainer() {
        return $("#productsPreview");
    }

    function showProducts(products) {
        const template = _.template(`<div class="card">
      <img class="card-img-top" src="<%= imageUrl %>" alt="<%= name %>" height="180">
        <div class="card-body">
          <h5 class="card-title"><%= name %></h5>
          <p class="card-text"><%= description %></p>
        </div>
        <div class="card-footer">
          <ul>
            <li>Code: <%= code %></li>
            <li>Quantity: <%= quantity %></li>
            <li>Price: <%= price %></li>
          </ul>
        </div>
      </div>`);

        const productsMarkup = products
            .map(function(product) {
                return template(product);
            })
            .join("");

        getPreviewContainer().html(productsMarkup);
    }

    function initializeProductsFileField() {
        $productsFileButton.on("change", function onChangeFiles($input) {
            if (!this.files || !this.files[0]) {
                reset();
                return;
            }

            const file = this.files[0];

            getPreviewContainer().html('<span class="loading">Loading ... </span>');
            CSVParser.parse(file).then(function handleParsedProducts(parsedProducts) {
                products = parsedProducts;
                showProducts(products);
            });
        });
    }

    function initializeForm() {
        $("#products-form").on("submit", function(ev) {
            ev.preventDefault();

            if (!products.length) {
                Alerts.showError("Please select a CSV");
                return;
            }

            Api.createInventory(products)
                .then(function(response) {
                    Alerts.showAlert("Products successfully added", "alert-success");
                    reset();
                })
                .catch(function(Error) {
                    Alerts.showError(`${Error.message}`, "alert-danger");
                });
        });

        initializeProductsFileField();
    }

    initializeForm();
});
