const Alerts = (function() {
    const alertTemplate = _.template(`
    <div style="visibility: hidden;" class="alert alert-dismissible fade show" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      <%= text %>
    </div>
  `);

    function showAlert(text, type) {
        const className = `alert alert-dismissible fade show ${type}`;
        const alertMarkup = alertTemplate({ text });

        $alert = $(alertMarkup)
            .removeClass()
            .addClass(className)
            .removeAttr("style")
            .show();
        $("#alerts").append($alert);
    }

    return {
        showAlert,
        showSuccess(message) {
            showAlert(message, "alert-success");
        },
        showError(message) {
            showAlert(message, "alert-danger");
        },
    };
})();
