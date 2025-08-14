<script>
document.addEventListener('DOMContentLoaded', function () {
  var client = new window.Statsig.StatsigClient("client-kEbKZd20ib2d5gM0Gb8xiOv3z3XVvjDVx36E9MIRq5X", {
    userID: "user_123" // Replace with dynamic user ID if available
  });

  client.initializeAsync().then(function () {
    var experiment = client.getExperiment("add_to_cart_color_test");
    var buttonColor = experiment.get("button_color", "red"); // Default to red if not set

    var buttons = document.querySelectorAll(".add-to-cart"); // Update selector if needed

    for (var i = 0; i < buttons.length; i++) {
      var button = buttons[i];
      if (buttonColor === "red") {
        button.style.backgroundColor = "#ff0000";
      } else if (buttonColor === "green") {
        button.style.backgroundColor = "#00cc00";
      }
    }
  });
});
</script>
