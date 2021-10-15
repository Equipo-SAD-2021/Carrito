var Carro = require("./CarroCompra");
const ItemDBController = Carro.ItemDBController;
const Item = Carro.Item;
const ShoppingCart = Carro.ShoppingCart;

const dburl = "mongodb://localhost:27017/";

async function main() {
    var idbc = new ItemDBController();
    console.log("Trying to connect to the database.");
    await idbc.Connect(dburl);
    console.log("Populate the database with the items.");
    await idbc.Populate();


    cart = new ShoppingCart(idbc);

    console.log("Adding 3 of Tomato...");
    await cart.Add(new Item("Tomato", 3)).then((data) => {
        console.log("=> Cart has now " + data.GetAmount() + " of " + data.GetName());
    }).catch((data) => {
        console.log("=> Adding 3 of Tomato failed, reason: \"" + data + "\"");
    });

    console.log("Adding 5 of Water...");
    await cart.Add(new Item("Water", 5)).then((data) => {
        console.log("=> Cart has now " + data.GetAmount() + " of " + data.GetName());
    }).catch((data) => {
        console.log("=> Adding 5 of Water failed, reason: \"" + data + "\"");
    });

    console.log("Trying to add 12 of Meat...");
    await cart.Add(new Item("Meat", 12)).then((data) => {
        console.log("=> Cart has now " + data.GetAmount() + " of " + data.GetName());
    }).catch((data) => {
        console.log("=> Adding 12 of Meat failed, reason: \"" + data + "\"");
    });

    console.log("Cart contents right now:\n" + cart);

    console.log("Adding 3 of Water...");
    await cart.Add(new Item("Water", 3)).then((data) => {
        console.log("=> Cart has now " + data.GetAmount() + " of " + data.GetName());
    }).catch((data) => {
        console.log("=> Adding 3 of Water failed, reason: \"" + data + "\"");
    });

    console.log("Trying to remove 1 of Cola Zero...");
    await cart.Remove(new Item("Cola Zero", 1)).then((data) => {
        console.log("=> Cart has now " + data.GetAmount() + " of " + data.GetName());
    }).catch((data) => {
        console.log("=> Removing 1 of Cola Zero failed, reason: \"" + data + "\"");
    });

    console.log("Trying to add 3 of Water...");
    await cart.Add(new Item("Water", 3)).then((data) => {
        console.log("=> Cart has now " + data.GetAmount() + " of " + data.GetName());
    }).catch((data) => {
        console.log("=> Adding 3 of Water failed, reason: \"" + data + "\"");
    });

    console.log("Trying to add 6 of Cola Zero...");
    await cart.Add(new Item("Cola Zero", 6)).then((data) => {
        console.log("=> Cart has now " + data.GetAmount() + " of " + data.GetName());
    }).catch((data) => {
        console.log("=> Adding 6 of Cola Zero failed, reason: \"" + data + "\"");
    });

    console.log("Cart contents right now:\n" + cart);

    console.log("Closing the database...");
    await idbc.Close();
    console.log("Done!");
}

main();