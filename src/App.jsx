import React from "react";
let count = 1;
let defaultValue = 0;
defaultValue = defaultValue.toFixed(2);
let totalCost = defaultValue;
let budget = defaultValue;
let remaining = defaultValue;
let groceryList = [];

class App extends React.Component {
  
  toPriceString(price) {
    if (price >= 0) {
      return "$" + `${price.toString()}`;
    } else {
      return "-$" + `${(price * -1).toString()}`;
    }
  }

  updateBudget() {
    let budgetInput = document.querySelector("#budgetInput").value;
    budget = parseFloat(budgetInput).toFixed(2);
    budget = isNaN(budget) ? defaultValue : budget;
    this.updateBudgetCostLabels();
  }

  getCost(price, quantity) {
    let priceItem = parseFloat(price).toFixed(2);
    return parseFloat(quantity * priceItem)
      .toFixed(2)
      .toString();
  }

  updateBudgetCostLabels() {
    // get labels
    let totalBudgetLabel = document.querySelector("#totalBudget");
    let totalCostLabel = document.querySelector("#totalCost");
    let remainingBudgetLabel = document.querySelector("#remainingBudget");
    // if budget is not 0, update the remaining budget
    if (budget != 0) {
      remaining =
        isNaN(budget) || isNaN(totalCost) ? defaultValue : budget - totalCost;
      remaining = remaining.toFixed(2);
    }
    // update labels
    totalBudgetLabel.innerHTML = "Total Budget: " + this.toPriceString(budget);
    totalCostLabel.innerHTML = "Total Cost: " + this.toPriceString(totalCost);
    remainingBudgetLabel.innerHTML =
      "Remaining Budget: " + this.toPriceString(remaining);
  }
  
  remove() {
    let num = document.querySelector("#removeNum").value;
    console.log("remove " + num);
    let index = -1;
    for(let i = 0; i < groceryList.length; i++){
      console.log(groceryList[i].num);
      if(groceryList[i].num == num){
        index = i;
      }
    }
    if(index != -1){
      groceryList.splice(index, 1);
    }
    console.log("groceryList after removal: " + JSON.stringify(groceryList));
    this.showResults(groceryList);
  }

  formatTable(grocery, resultsTable) {
    // console.log(resultsTable);
    let price = parseFloat(grocery.price).toFixed(2);
    let priceText = this.toPriceString(price);
    let costText = this.toPriceString(grocery.cost);
    let num = count-1;
    const row = resultsTable.insertRow();
    const cellNum = row.insertCell();
    cellNum.innerHTML = grocery.num;
    const cellItem = row.insertCell();
    cellItem.innerHTML = grocery.item;
    const cellQuantity = row.insertCell();
    cellQuantity.innerHTML = grocery.quantity;
    const cellPrice = row.insertCell();
    cellPrice.innerHTML = priceText;
    const cellCost = row.insertCell();
    cellCost.innerHTML = costText;
    const cellProductType = row.insertCell();
    cellProductType.innerHTML = grocery.productType;
    const cellProductDetails = row.insertCell();
    cellProductDetails.innerHTML = grocery.productDetails;
  }

  showResults(data) {
    let cost = 0.0;
    let resultsTable = document.querySelector("#resultsTable");
    resultsTable.innerHTML =
      "<tr><th>#</th><th>Item</th><th>Quantity</th><th>Price</th><th>Cost</th><th>Product Type</th><th>Product Details</th></tr>";

    // console.log(data);
    data.forEach((item) => {
      // console.log("show results: " + JSON.stringify(Object.values(item)));
      this.formatTable(item, resultsTable);
    });

    totalCost = defaultValue;
    data.forEach((item) => {
      cost = parseFloat(item.cost);
      totalCost = (parseFloat(totalCost) + parseFloat(cost)).toFixed(2);
    });

    this.updateBudgetCostLabels();
  }

  add(event, text) {
    event.preventDefault();
    count = count + 1;
    this.setState({ text });
    const itemInput = document.querySelector("#item").value;
    const quantityInput = document.querySelector("#quantity").value;
    const priceInput = document.querySelector("#price").value;
    const productTypeInput = document.querySelector("#productType").value;
    const productDetailsInput = document.querySelector("#productDetails").value;

    const json = {
      num: count-1,
      item: itemInput,
      quantity: quantityInput,
      price: priceInput,
      productType: productTypeInput,
      productDetails: productDetailsInput,
    };
    const body = JSON.stringify(json);

    let item = JSON.parse(body);
    let cost = this.getCost(item.price, item.quantity);
    groceryList.push({
      num: item.num,
      item: item.item,
      quantity: item.quantity,
      price: item.price,
      cost: cost,
      productType: item.productType,
      productDetails: item.productDetails,
    });

    // console.log(groceryList);
    this.showResults(groceryList);
  }

  render() {
    const { name } = this.props;
    return (
      <>
        <h1 id="title">Shopping List</h1>

        <div className="budgetCost">
          <div id="budget" className="budgetBox">
            <form>
              <label id="budgetInputLabel">
                What is the budget for your upcoming shopping trip?
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                id="budgetInput"
                name="budget"
              />
            </form>
            <button id="addBudget" onClick={() => this.updateBudget()}>
              Add Budget
            </button>
          </div>

          <div className="labelsBox">
            <label id="totalBudget">Total Budget: $0.00</label>
            <label id="totalCost">Total Cost: $0.00</label>
            <label id="remainingBudget">Remaining Budget: $0.00</label>
          </div>
        </div>

        <div className="itemBox">
          <form id="addForm">
            <label>
              What item are you looking to buy?
              <span aria-label="required">*</span>
            </label>
            <input type="text" id="item" name="item" required />

            <div className="numbersInput">
              <div className="priceInput">
                <label>
                  What quantity?<span aria-label="required">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="1"
                  id="quantity"
                  name="quantity"
                  required
                />
              </div>

              <div className="quantityInput">
                <label>
                  What is the unit price?<span aria-label="required">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  id="price"
                  name="price"
                  required
                />
              </div>
            </div>

            <label>
              What type of product is this?<span aria-label="required">*</span>
            </label>
            <input
              type="text"
              id="productType"
              name="productType"
              list="productTypeList"
              required
            />
            <datalist id="productTypeList">
              <option>Refrigerated</option>
              <option>Frozen</option>
              <option>Produce</option>
              <option>Ambient</option>
              <option>Homegoods</option>
              <option>Clothing</option>
              <option>Garden</option>
              <option>Pharmacy</option>
              <option>Automotive</option>
              <option>Other</option>
            </datalist>

            <label>Add product details or additional notes</label>
            <textarea
              id="productDetails"
              name="productDetails"
              maxLength="140"
              rows="5"
            ></textarea>

            <button id="add" onClick={(event) => this.add(event)}>
              Add Item {count}
            </button>
          </form>
        </div>
        
        <div className="removeBox">
          <div className="removeItem">
            <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="1"
                  id="removeNum"
                  name="removeNum"
                />
            <button id="remove" onClick={() => this.remove()}>
                Remove Item
            </button>
          </div>
        </div>

        <div className="itemTable">
          <table id="resultsTable">
            <tbody>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Cost</th>
                <th>Product Type</th>
                <th>Product Details</th>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default App;
