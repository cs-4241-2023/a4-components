import React, { useState, useEffect } from 'react'
import './App.css'

const CartItem = props => (
  <li id={"cartItem-" + props.num}>
    {props.name} : {props.price}
  </li>
)

function GroceryItem(props){

  return (
    <li id={"gItem-" + props.num}>
    <input type="checkbox" className='cartbox' onChange ={e => props.onclick(props.name, props.price, e.target.checked)}/>
    {props.name} : ${props.price}
     <button className="itemBut" onClick={e => props.modClick(props.num)}> Modify </button>
     <button className="itemBut" onClick={e=> props.delItem(props.num)}>Delete</button>
    </li>)
}

function App() {
  const [groceryList, setList] = useState([])
  const [cartList, setCart] = useState([])
  const [totalPrice, setPrice] = useState()
  const [cartPrice, setCartPrice] = useState()
  const [gotList, setCheck] = useState()

  function modify (idx){

    console.log("Hey im in here")
    let price = parseFloat(document.querySelector('#price').value)
    fetch( '/modify', {
      method:'POST',
      body: JSON.stringify({ idx, price }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then( response => response.json() )
    .then( json => {
      console.log(json)
       setList( json.groceryList )
       setCart (cartList)
       setPrice( json.totalPrice.totalPrice)
    })
  }

  function moveToCart(item, price, checkstate){
    if(checkstate)
    {
      let arr = cartList.concat({item, price});
      let num = parseFloat(cartPrice) + parseFloat(price)
      setCart(arr)
      setCartPrice(num)
    }
    else{
      if(cartList.length === 1){
        setCart([])
        setCartPrice(0.00)
      }
      else{
        let idx = cartList.indexOf({item, price})
        let arr = cartList.splice(idx, 1)
        let num = parseFloat(cartPrice) - parseFloat(price)
        setCart(arr)
        setCartPrice(num)
      }
    }
  }

  function deleteItem(idx) {

    fetch( '/delete', {
      method:'DELETE',
      body: JSON.stringify({idx}),
      headers: { 'Content-Type': 'application/json' }
    })
    .then( response => response.json() )
    .then( json => {
      console.log(json)
       setList( json.groceryList )
       setPrice( json.totalPrice.totalPrice)
       setCart ([])
    })
  }
  function reset(){
    fetch( '/reset', {
      method:'DELETE',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' }
    })
    .then( response => response.json() )
    .then( json => {
      console.log(json)
       setList( json.groceryList )
       setPrice( json.totalPrice.totalPrice)
       setCart ([])
    })

  }

  function submit () {

    const itemIn = document.querySelector("#item").value,
    priceIn = parseFloat(document.querySelector("#price").value);

    console.log(itemIn, priceIn)

    if(!isNaN(parseFloat(priceIn))){
    fetch( '/submit', {
      method:'POST',
      body: JSON.stringify({ item: {itemName:itemIn, price:priceIn }}),
      headers: { 'Content-Type': 'application/json' }
    })
    .then( response => response.json() )
    .then( json => {
      console.log(json)
       setList( json.groceryList )
       setCart (cartList)
       setPrice( json.totalPrice.totalPrice)
    })
  }
}

if(!gotList)
{
  fetch( '/items' )
  .then( response => response.json() )
  .then( json => {
    setList( json.groceryList )
    setPrice( json.totalPrice.totalPrice)
  })
  setCartPrice(0.00)
  setCart([])
  setCheck (true)
}

useEffect( ()=> {
  document.title = "Grocery List"

})

  return (
    <>
      <h1>Grocery List</h1>
      <div className="card">
      <input type='text' id="item" placeholder="Item Name" /> $<input type="text" id="price" placeholder="X.XX"/><button onClick={ e => submit()}>submit</button>
      <button onClick={ e => reset()}>reset</button>
      <div className="prices-container">
      <label>Total Price: ${(isNaN(totalPrice))?0.00:(totalPrice.toFixed(2))}</label>
      <label>Price In Cart: ${(isNaN(cartPrice))?0.00:(cartPrice.toFixed(2))}</label>
      <label>Difference: ${(isNaN(totalPrice) || isNaN(cartPrice))?0.00:(totalPrice.toFixed(2) - cartPrice.toFixed(2)).toFixed(2)}</label>
      </div>
      <div id="list-container">

      <label id="glist-lab">Check items In Cart
      <ul id="groceryList">
        { groceryList.map( (grocery,i) => <GroceryItem key={i} num={i}name={grocery.itemName} price={grocery.price.toFixed(2)} onclick={ moveToCart } modClick={ modify } delItem={deleteItem} /> ) }
     </ul>
     </label>

     <label id="cartLab"> In Your Cart<ul id="cartList">
     { cartList.map( (grocery,i) => <CartItem key={i} num={i}name={grocery.item} price={grocery.price}/> ) }
     </ul>
     </label>
     </div>
      </div>
    </>
  )
}

export default App
