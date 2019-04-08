const Api = (function() {
    const API_URL = "/api";

    function postData(url = "", data = {}) {
        return fetch(url, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify(data),
        });
    }

    return {
        createOrder(order) {
            return postData(`${API_URL}/orders`, { ts: Date.now(), ...order })
                .then(async function(response) {
                    if (!response.ok) {
                        throw new Error(`Error (${response.status}): ${await response.text()}`);
                    }
                    return response.json();
                })
                .then(function(response) {
                    return response.data;
                })
                .catch(function(error) {
                    const message = "Error creating order - " + error.message;
                    console.error(message);
                    throw message;
                });
        },

        getOrders() {
            return fetch(`${API_URL}/orders`)
                .then(async function(response) {
                    if (!response.ok) {
                        throw new Error(`Error (${response.status}): ${await response.text()}`);
                    }
                    return response.json();
                })
                .then(function(response) {
                    return response.results;
                })
                .catch(function(error) {
                    const message = "Error fetching orders - " + error.message;
                    console.error(message);
                    throw message;
                });
        },

        getProducts() {
            return fetch(`${API_URL}/taco/products`)
                .then(async function(response) {
                    if (!response.ok) {
                        throw new Error(`Error (${response.status}): ${await response.text()}`);
                    }
                    return response.json();
                })
                .then(function(response) {
                    return response.results;
                })
                .catch(function(error) {
                    const message = "Error fetching products - " + error.message;
                    console.error(message);
                    throw message;
                });
        },
    };
})();
