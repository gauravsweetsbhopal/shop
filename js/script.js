function searchSweets() {

let input =
document.getElementById("searchInput")
.value.toLowerCase();

let cards =
document.querySelectorAll(".product-wrapper");

cards.forEach(card => {

let name =
card.innerText.toLowerCase();

if(name.includes(input)){

card.style.display = "";

}else{

card.style.display = "none";

}

});

}

function addToCart(name, price){

let cart =
JSON.parse(localStorage.getItem("cart")) || [];

let item =
cart.find(p => p.name === name);

if(item){

item.qty += 1;

}else{

cart.push({
name,
price,
qty:1
});

}

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

updateButtons();

}

function removeFromCart(name){

let cart =
JSON.parse(localStorage.getItem("cart")) || [];

let item =
cart.find(p => p.name === name);

if(item){

item.qty--;

if(item.qty <= 0){

cart =
cart.filter(p => p.name !== name);

}

}

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

updateButtons();

}

function updateButtons(){

let cart =
JSON.parse(localStorage.getItem("cart")) || [];

let totalItems = 0;
let totalPrice = 0;

document.querySelectorAll(".product-card")
.forEach(card => {

let name = card.dataset.name;
let price = Number(card.dataset.price);

let btn =
card.querySelector(".cart-btn");

if(btn.style.display === "none"){
return;
}

let item =
cart.find(p => p.name === name);

if(item){

totalItems += item.qty;
totalPrice += item.qty * item.price;

btn.innerHTML = `

<div class="d-flex justify-content-center align-items-center gap-2">

<button class="btn btn-danger btn-sm"
onclick="removeFromCart('${name}')">

-

</button>

<span class="fw-bold">

${item.qty}

</span>

<button class="btn btn-danger btn-sm"
onclick="addToCart('${name}', ${price})">

+

</button>

</div>
`;

}else{

btn.innerHTML = `

<button class="btn btn-danger btn-sm"
onclick="addToCart('${name}', ${price})">

Add +

</button>
`;

}

});

const floatingCart =
document.getElementById("floatingCart");

const floatingCartText =
document.getElementById("floatingCartText");

if(floatingCart){

if(totalItems > 0){

floatingCart.classList.remove("d-none");

floatingCartText.innerText =
`${totalItems} item(s) • ₹${totalPrice}`;

}else{

floatingCart.classList.add("d-none");

}

}

}

async function loadInventory(){

let response =
await fetch("https://gauravsweets-backend.onrender.com/inventory");

let inventory =
await response.json();

inventory.forEach(item => {

let product =
document.getElementById(item.name);

if(!product) return;

let statusDiv =
product.querySelector(".inventory-status");

let cartBtn =
product.querySelector(".cart-btn");

product.classList.remove("out-of-stock");

if(item.status === "in-stock"){

statusDiv.innerHTML = "";

cartBtn.style.display = "block";

}

if(item.status === "out-of-stock"){

statusDiv.innerHTML = `

<span class="badge bg-danger">

Out Of Stock

</span>
`;

product.classList.add("out-of-stock");

cartBtn.style.display = "none";

}

});

updateButtons();

}

window.onload = () => {

loadInventory();

};