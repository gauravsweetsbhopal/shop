const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

const ORDERS_FILE = "orders.json";

if (!fs.existsSync(ORDERS_FILE)) {

    fs.writeFileSync(ORDERS_FILE, "[]");

}

app.post("/place-order", (req, res) => {

    const order = req.body;

    const orders = JSON.parse(
        fs.readFileSync(ORDERS_FILE)
    );

    // Simple Order ID
    const orderId = "GS" + (orders.length + 1001);

    orders.push({

    ...order,

    orderId,

    status: "pending",

    time: new Date()

});

    fs.writeFileSync(

        ORDERS_FILE,

        JSON.stringify(orders, null, 2)

    );

    // Create items list
    let itemsList = "";

    order.cart.forEach(item => {

        itemsList += `${item.name} x ${item.qty}\n`;

    });

    // Calculate totals
    let subtotal = 0;

    order.cart.forEach(item => {

        subtotal += item.price * item.qty;

    });

    const deliveryCharge = 20;

    const finalTotal = subtotal + deliveryCharge;

    // WhatsApp confirmation message
    const whatsappMessage = `Hello ${order.name},

Your order ${orderId} has been received successfully.

Items:
${itemsList}
Subtotal: ₹${subtotal}
Platform & Delivery Charges: ₹${deliveryCharge}
*Final Total: ₹${finalTotal}*

Your order will arrive shortly.
Thank you for choosing Gaurav Sweets 🙏`;

    // WhatsApp link
    const whatsappURL =
    `https://wa.me/91${order.phone}?text=${encodeURIComponent(whatsappMessage)}`;

    

    // Response
    res.json({

        success: true,

        message: "Order placed successfully",

        orderId: orderId

    });

});

// Get all orders
app.get("/orders", (req, res) => {

    const orders = JSON.parse(
        fs.readFileSync(ORDERS_FILE)
    );

    res.json(orders);

});

// Complete Order

app.post("/complete-order/:id", (req, res) => {

    let orders = JSON.parse(
        fs.readFileSync(ORDERS_FILE)
    );

    orders = orders.map(order => {

        if(order.orderId === req.params.id){

            order.status = "completed";

        }

        return order;

    });

    fs.writeFileSync(
        ORDERS_FILE,
        JSON.stringify(orders, null, 2)
    );

    res.json({
        success:true
    });

});

// Delete Order

app.delete("/delete-order/:id", (req, res) => {

    let orders = JSON.parse(
        fs.readFileSync(ORDERS_FILE)
    );

    orders = orders.filter(
        order => order.orderId !== req.params.id
    );

    fs.writeFileSync(
        ORDERS_FILE,
        JSON.stringify(orders, null, 2)
    );

    res.json({
        success:true
    });

});


const INVENTORY_FILE = "inventory.json";

// Get Inventory

app.get("/inventory", (req, res) => {

    const inventory = JSON.parse(
        fs.readFileSync(INVENTORY_FILE)
    );

    res.json(inventory);

});

// Update Inventory

app.post("/update-inventory", (req, res) => {

    const updatedItem = req.body;

    let inventory = JSON.parse(
        fs.readFileSync(INVENTORY_FILE)
    );

    inventory = inventory.map(item => {

        if(item.name === updatedItem.name){

            return updatedItem;

        }

        return item;

    });

    fs.writeFileSync(
        INVENTORY_FILE,
        JSON.stringify(inventory, null, 2)
    );

    res.json({
        success:true
    });

});
// Start server
app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});
