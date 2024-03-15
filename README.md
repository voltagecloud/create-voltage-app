# create-voltage-app

Kickstart your new bitcoin lightning app in less than a minute with 1 command:

```
npx create-voltage-app
```

Follow the instructions and happy hacking!

## Contribute your own boilerplate app

It's easy to contribute to create-voltage-app with your own boilerplate.
For example, imagine you wanted to add an awesome boilerplate you created called "rust-invoice-generator".

First you would add it to the `apps` directory with the source code under `apps/rust-invoice-generator/app`. Then, create a `apps/rust-invoice-generator/voltage-create-app-script.js` file where you can configure the way the project is setup.

As a general rule the script file should:

1. Specify your app's name that will be shown in the `create-voltage-app` selector.
2. Configure the node's admin macaroon and endpoint to your app (typically an `.env` file).
3. Install dependencies.
4. Instructions on how to run the app.

Take a look at some of the `voltage-create-app-script.js` files that already exist in other apps for reference.
