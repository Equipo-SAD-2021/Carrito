
var mongoclient = require("mongodb").MongoClient;

class Item {
    /**
     * Object representing an Item with a certain amount of units.
     * 
     * @param {string} name Name of the item.
     * @param {number} amount Amount of the item.
     */
    constructor(name, amount) {
        this.name = name;
        if (amount <= 0) throw new Exception("Item amount can't be negative.");
        this.amount = amount;
    }
    /**
     * 
     * @returns {string} Name of the item.
     */
    GetName() {
        return this.name;
    }
    /**
     * 
     * @returns {number} Amount of the item.
     */
    GetAmount() {
        return this.amount;
    }
    /**
     * 
     * @param {number} amm Number of units to add or remove from the item.
     * @returns {number} The resulting amount after performing the operation.
     */
    AddAmount(amm) {
        if (amm < 0) return RemoveAmount(-amm);
        else this.amount += amm;
        return this.amount;
    }
    /**
     * 
     * @param {number} amm Number of units to remove from the item (must be >0).
     * @returns {number} The resulting amount after performing the operation.
     */
    RemoveAmount(amm) {
        if (amm < 0) throw new Exception("Invalid item amount specified.");
        var newAm = this.amount - amm;
        if (newAm < 0) throw new Exception("Item amount can't be negative.");
        this.amount = newAm;
        return this.amount;
    }
    /**
     * 
     * @returns {string} The string representation of the object.
     */
    toString() {
        return this.name + " (" + this.amount + ")";
    }
}

class ItemDBControllerConnection {

    constructor() {
        this.db = null;
        this.client = null;
    }

    /**
     * Closes the connection to the database.
     * 
     * @returns {Promise}
     */
    Close() {
        return this.client.close();
    }

    /**
     * Obtains an Item object from the item name, with the stock present in the warehouse.
     * 
     * @param {string} itemName Name of the item to obtain.
     * @returns {Promise<Item>} Item object obtained from the name.
     */
    GetItem(itemName) {
        var collection = this.db.collection('products');
        return collection.findOne({ name: itemName }).then((data) => {
            return new Promise((cb) => {
                if (data)
                    cb(new Item(data.name, data.stock));
                else
                    cb(null);
            });
        });
    }

    /**
     * Adds several items to the warehouse, for testing purposes.
     * 
     * @returns {Promise}
     */
    Populate() {
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

class ItemDBController {
    /**
     * Connects to a database containing a collection of items.
     * 
     * @param {string} url 
     * @returns {Promise<ItemDBControllerConnection>} Connection object to use.
     */ 
    static Connect(url) {
        return new Promise((ret, error) => {
            mongoclient.connect(url).then((client) => {
                var controller = new ItemDBControllerConnection();
                controller.db = client.db("warehouse");
                controller.client = client;
                ret(controller);
            }).catch(function(err) {
                error(new Error("MongoDB connection failed: " + err));
            });
        });
    }
}

class ShoppingCart {
    /**
     * Represents a shopping cart that stores multiple items.
     * 
     * @param {ItemDBControllerConnection} dbController DB controller to check for availability.
     */
    constructor(dbController) {
        this.items = {};
        this.controller = dbController;
    }
    /**
     * Adds an item and its quantity to the shopping cart.
     * 
     * @param {Item} item The item object to add.
     * @returns {Promise<Item>} Item object with the new amount stored in the cart.
     */
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
    /**
     * Removes an item and its quantity from the shopping cart.
     * 
     * @param {Item} item The item object to remove.
     * @returns {Promise<Item>} Item object with the new amount stored in the cart, or null if all units removed.
     */
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
    /**
     * 
     * @returns {string} The string representation of the object.
     */
    toString() {
        var res = "Shopping cart:\n";
        res += "\tContents: \n";
        Object.keys(this.items).forEach(name => res += "\t\t- " + this.items[name] + "\n");
        return res;
    }
}

module.exports = {ShoppingCart, ItemDBController, Item};
