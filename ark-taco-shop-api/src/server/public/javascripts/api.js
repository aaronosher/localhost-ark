const Api = (function() {
    const API_URL = "/api/taco";

    function postData(url = "", data = {}) {
        return fetch(url, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                // "Content-Type": "application/x-www-form-urlencoded",
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
    }

    return {
        createInventory(products) {
            return postData(`${API_URL}/inventory`, products)
                .then(async function(response) {
                    if (!response.ok) {
                        throw new Error(`Error (${response.status}): ${await response.text()}`);
                    }
                    return response.json();
                })
                .then(function(response) {
                    if (!response) {
                        throw new Error(`Error (${response.status})`);
                    }
                    return response.results;
                });
        },

        getProducts() {
            return fetch(`${API_URL}/products`)
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
