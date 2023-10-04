import express from 'express';
import ViteExpress from 'vite-express';

const app = express();

const totalPrice = { totalPrice: 0.0 };
let retObject;
const groceryList = [];
const grocerItemTemp = {itemName: "Bread", price: 1.99}
console.log(grocerItemTemp)
const modifyPrice = function(data){

  groceryList[data.idx].price = data.price;
}
const calcTotalPrice = function () {
    totalPrice.totalPrice = 0.0;
    if(groceryList.length !== 0){groceryList.forEach((item) => {
      if (!isNaN(parseFloat(item.price))) {
        totalPrice.totalPrice += parseFloat(item.price);
      } else {
        totalPrice.totalPrice += 0.0;
      }
    })}
  };

app.use(express.json());

app.post("/submit", (req, res) => {
    groceryList.push(req.body.item)
    calcTotalPrice()
    retObject = {groceryList, totalPrice}
    res.json(retObject)

})
app.post("/modify", (req, res) => {
    modifyPrice(req.body)
    calcTotalPrice()
    retObject = {groceryList, totalPrice}
    res.json(retObject)

})

app.delete("/reset", (req, res) => {

    groceryList.splice(0, groceryList.length);
    totalPrice.totalPrice = 0;
    retObject = {groceryList, totalPrice}
    res.json(retObject)
})

app.delete("/delete", (req, res) => {
  groceryList.splice(req.body.idx, 1)
  calcTotalPrice();
  retObject = {groceryList, totalPrice}
  res.json(retObject)
})

app.get("/items", (req, res) => {
    calcTotalPrice();
    retObject = {groceryList, totalPrice}
    res.json(retObject)
})


ViteExpress.listen(app, 3000)