# Analytics

HashiCorp Developer Portal uses some Analytics tooling so we better understand how users are interacting with the website to make informed decisions to improve it for users.

Our Analytics tracking is explicitly opt-in, prompted by a banner that pops up on your first visit. You do not need to enable tracking to use the website. You can also adjust your tracking preferences by clicking the `Cookie Manager` link in the website footer.

## Tracking Plan Spec

The `spec` folder contains the JSON Schema specification of our web tracking events.

You can run `make` in the root analytics directory to compile the spec down to a single json file (`analytics_tracking_plan.json`).
