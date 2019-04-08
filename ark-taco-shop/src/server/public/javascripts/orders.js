$(document).ready(
    (function () {
        const orderTemplate = _.template(`
  <tr>
    <th scope="row"><%= id %></th>
    <td><%= name %></td>
    <td><%= amount %> TѦ</td>
  </tr>
`);
        const $ordersContainer = $("#orders tbody");

        function updateOrdersContainer(content) {
            $ordersContainer.html(content);
        }

        function addProductToProductsContainer(product) {
            const orderMarkup = orderTemplate(product);
            $ordersContainer.append($(orderMarkup));
        }

        function renderOrders(orders, products = [], sortBy = "id") {
            $ordersContainer.html("");

            if (orders.length < 1) {
                updateOrdersContainer('<td colspan="4" class="text-center">Your orders will be displayed here!</td>');
                return;
            }

            _.sortBy(orders, sortBy).forEach(function renderOrders(order) {
                const {
                    name
                } = products.find(function (product) {
                    return product.id == order.vendorField.id;
                });
                const orderMarkup = orderTemplate({
                    ...order,
                    name
                });
                $ordersContainer.append($(orderMarkup));
            });
        }

        function loadOrders() {
            Api.getOrders()
                .then(function (fetchedOrders) {
                    Api.getProducts().then(function (fetchedProducts) {
                        renderOrders(fetchedOrders, fetchedProducts);
                    });
                })
                .catch(function (error) {
                    Alerts.showError(error, "alert-error");
                    updateOrdersContainer('<div class="text-center">Sorry, try again later!</span>');
                });
        }

        loadOrders();
    })(),
);
