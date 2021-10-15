
var mongoclient = require("mongodb").MongoClient;

class Item {
    constructor(name, amount) {
        this.name = name;
        if (amount <= 0) throw new Exception("Item amount can't be negative.");
        this.amount = amount;
    }
    GetName() {
        return this.name;
    }
    GetAmount() {
        return this.amount;
    }
    AddAmount(amm) {
        if (amm < 0) return RemoveAmount(-amm);
        else this.amount += amm;
    }
    RemoveAmount(amm) {
        if (amm < 0) throw new Exception("Invalid item amount specified.");
        var newAm = this.amount - amm;
        if (newAm < 0) throw new Exception("Item amount can't be negative.");
        this.amount = newAm;
    }
    toString() {
        return this.name + " (" + this.amount + ")";
    }
}

class ItemDBController {
    constructor() {
        this.db = null;
        this.client = null;
    }
    Connect(url) {
        return mongoclient.connect(url).then((client) => {
            this.db = client.db("warehouse");
            this.client = client;
        }).catch(function(err) {
            throw new Exception("MongoDB connection failed:\n" + err);
        });
    }

    Close() {
        return this.client.close();
    }

    GetItem(itemName) {
        var collection = this.db.collection('products');
        return collection.findOne({ name: itemName }).then(async (data) => {
            return new Promise((cb) => {
                cb(new Item(data.name, data.stock));
            });
        });
    }

    Populate() { // Debug method to populate the db with items.
        var collection = this.db.collection('products');
        return collection.insertMany([
            {name: 'Tomato',stock: 10},
            {name: 'Water',stock: 10},
            {name: 'Meat',stock: 10},
            {name: 'Milk',stock: 10},
            {name: 'Cola Zero',stock: 10},
          ]);
    }
}

class ShoppingCart {
    constructor(dbController) {
        this.items = {};
        this.controller = dbController;
    }
    Add(item) {
        return new Promise((res, err) => {
            this.controller.GetItem(item.GetName()).then((dbItem) => {
                var cartAmount = 0;
                var hasItem = item.GetName() in this.items
                if (hasItem) {
                    cartAmount = this.items[item.GetName()].GetAmount();
                }
                if (cartAmount + item.GetAmount() > dbItem.GetAmount()) {
                    err(new Error("Not enough stock in the warehouse. Requested (" + (cartAmount + item.GetAmount()) + ") but stock is (" + dbItem.GetAmount() + ")."));
                } else {
                    if (hasItem) {
                        this.items[item.GetName()].AddAmount(item.GetAmount());
                    } else {
                        this.items[item.GetName()] = item;
                    }
                    res(this.items[item.GetName()]);
                }
            });
        });
    }
    Remove(item) {
        return new Promise((res,err) => {
            if (!(item.GetName() in this.items)) {
                err(new Error("Item not present in cart."));
            } else {
                this.items[item.GetName()].RemoveAmount(item.GetAmount());
                if (this.items[item.GetName()].GetAmount() === 0) {
                    delete this.items[item.GetName()];
                    res(null);
                } else res(this.items[item.GetName()]);
            }
        });
    }
    toString() {
        var res = "Shopping cart:\n";
        res += "\tContents: \n";
        Object.keys(this.items).forEach(name => res += "\t\t- " + name + " (" + this.items[name].GetAmount() + ")\n");
        return res;
    }
}

module.exports = {ShoppingCart, ItemDBController, Item};
