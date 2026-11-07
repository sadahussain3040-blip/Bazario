const products = [
  {id:1,name:"Classic T-Shirt",category:"Fashion",price:1499,icon:"👕"},
  {id:2,name:"Wireless Earbuds",category:"Electronics",price:2999,icon:"🎧"},
  {id:3,name:"Smart Watch",category:"Electronics",price:3999,icon:"⌚"},
  {id:4,name:"Home Organizer",category:"Home",price:1299,icon:"🧺"},
  {id:5,name:"Beauty Essentials",category:"Beauty",price:1999,icon:"💄"},
  {id:6,name:"Everyday Backpack",category:"Accessories",price:2499,icon:"🎒"},
  {id:7,name:"Running Shoes",category:"Fashion",price:3499,icon:"👟"},
  {id:8,name:"Table Lamp",category:"Home",price:1799,icon:"💡"}
];

let selectedCategory = "all";
let cart = JSON.parse(localStorage.getItem("bazarioCart") || "[]");

const money = n => "Rs. " + n.toLocaleString("en-PK");

function filterProducts(category){
  selectedCategory = category;
  document.getElementById("products").scrollIntoView({behavior:"smooth"});
  renderProducts();
}

function renderProducts(){
  let list = selectedCategory === "all" ? [...products] : products.filter(p=>p.category===selectedCategory);
  const sort = document.getElementById("sort").value;
  if(sort==="low") list.sort((a,b)=>a.price-b.price);
  if(sort==="high") list.sort((a,b)=>b.price-a.price);

  document.getElementById("productsGrid").innerHTML = list.map(p => `
    <article class="product">
      <div class="product-image">${p.icon}</div>
      <div class="product-info">
        <div class="category">${p.category}</div>
        <h3>${p.name}</h3>
        <div class="price">${money(p.price)}</div>
        <button class="add" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </article>`).join("");
}

function addToCart(id){
  const found = cart.find(x=>x.id===id);
  if(found) found.qty++;
  else cart.push({id,qty:1});
  saveCart();
  openCart();
}

function saveCart(){
  localStorage.setItem("bazarioCart",JSON.stringify(cart));
  updateCart();
}

function updateCart(){
  const count = cart.reduce((sum,x)=>sum+x.qty,0);
  document.getElementById("cartCount").textContent = count;
  const box = document.getElementById("cartItems");
  if(!cart.length){
    box.innerHTML = '<div class="empty">Your cart is empty.<br>Add some products to get started.</div>';
    document.getElementById("cartTotal").textContent = money(0);
    return;
  }
  let total = 0;
  box.innerHTML = cart.map(item=>{
    const p = products.find(x=>x.id===item.id);
    total += p.price * item.qty;
    return `<div class="cart-item">
      <div class="mini">${p.icon}</div>
      <div style="flex:1"><h4>${p.name}</h4><p>${money(p.price)} × ${item.qty}</p>
      <button class="remove" onclick="removeItem(${p.id})">Remove</button></div>
    </div>`;
  }).join("");
  document.getElementById("cartTotal").textContent = money(total);
}

function removeItem(id){
  cart = cart.filter(x=>x.id!==id);
  saveCart();
}

function openCart(){
  document.getElementById("cartPanel").classList.add("open");
  document.getElementById("overlay").classList.add("show");
  updateCart();
}
function closeCart(){
  document.getElementById("cartPanel").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}

function sendWhatsApp(){
  if(!cart.length){alert("Your cart is empty.");return;}
  const lines = cart.map(item=>{
    const p=products.find(x=>x.id===item.id);
    return `• ${p.name} × ${item.qty} — ${money(p.price*item.qty)}`;
  });
  const total = cart.reduce((s,item)=>{
    const p=products.find(x=>x.id===item.id);
    return s+p.price*item.qty;
  },0);
  const message = `Hello Bazario! I want to place an order:\n\n${lines.join("\n")}\n\nTotal: ${money(total)}\n\nName:\nAddress:\nPhone:`;
  // Replace 923001234567 with your real WhatsApp number.
  const phone = "923101395419";
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`,"_blank");
}

renderProducts();
updateCart();
