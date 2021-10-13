
var mongoclient = require("mongodb").MongoClient;

class Item {
    constructor(name, amount) {
        this.name = name;
        if (amount <= 0) throw new Exception("Item Amount can't be negative.");
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
        if (amm < 0) throw new Exception("Invalid amount specified.");
        var newAm = this.amount - amm;
        if (newAm < 0) throw new Exception("Item Amount can't be negative.");
        this.amount = newAm;
    }
}

class ItemDBController {
    constructor(url) {
        this.db = null;
    }
    Connect(url) {
        return mongoclient.connect(url).then((db) => {
            this.db = db;
        }).catch(function(err) {
            throw new Exception("MongoDB connection failed:\n" + err);
        });
    }

    Close() {
        return this.db.close();
    }

    GetItem(itemName) {
        
    }

    Populate() { // Debug method to populate the db with items.
        var collection = this.db.collection('products');
        collection.insertMany([
            {name: 'Tomate',stock: 10},
            {name: 'Agua',stock: 10},
            {name: 'Carne',stock: 10},
            {name: 'Leche',stock: 10},
            {name: 'Cola Zero',stock: 10},
          ], function(err, _result) {
            assert.equal(err, null);
            console.log("Collection populated successfully.");
          });
    }
}

class ShoppingCart {
    constructor() {
        this.items = {};
    }
    Add(item) {
        return new Promise((res) => {
            if (item in this.items) {
                this.items[item.GetName()].AddAmount(item.GetAmount());
            } else {
                this.items[item.GetName()] = item;
            }
            res(this.items[item.GetName()]);
        });
    }
    Remove(item) {
        return new Promise((res) => {
            if (!(item.GetName() in this.items)) throw new Exception("Item not in cart.");
            this.items[item.GetName()].RemoveAmount(item.GetAmount());
            if (this.items[item.GetName()].GetAmount() === 0) {
                delete this.items[item.GetName()];
                res(null);
            } else res(this.items[item.GetName()]);
        });
    }
    toString() {
        var res = "Shopping cart:\n";
        res += "\tContents: \n";
        Object.keys(this.items).forEach(name => res += "\t\t- " + name + " (" + this.items[name].GetAmount() + ")\n");
        return res;
    }
}

cart = new ShoppingCart();

cart.Add(new Item("Tomate", 3)).then((a) => {
    cart.Add(new Item("Agua", 5)).then((a2) => {
        cart.Add(new Item("Carne", 2)).then((a3) => {
            console.log("" + cart);
        })
    })
});

setTimeout(async () => {
    await cart.Add(new Item("Leche", 4));
    await cart.Remove(new Item("Agua", 2));
    await cart.Add(new Item("Cola Zero", 8));
    console.log("" + cart);
}, 1000);

console.log("All operations queued.");