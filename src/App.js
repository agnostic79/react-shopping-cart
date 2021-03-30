import React, { Component } from "react";
import Cart from "./components/Cart";
import Filter from "./components/Filter";
import Products from "./components/Products";

import data from "./data.json";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: data.products,
      size: "",
      sort: "",
      cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
    };
  }

  createOrder = (order) => {
    alert("Need to save order " + order.name);
  };

  removeFromCart = (product) => {
    const cartItems = this.state.cartItems.slice();
    this.setState(
      {
        cartItems: cartItems.filter((item) => item._id !== product._id),
      },
      () => localStorage.setItem("cartItems", JSON.stringify(this.state.cartItems))
    );
  };

  addToCart = (product) => {
    const cartItems = this.state.cartItems.slice();
    let alreadyInCart = false;
    cartItems.forEach((item) => {
      if (item._id === product._id) {
        item.count++;
        alreadyInCart = true;
      }
    });
    if (!alreadyInCart) {
      cartItems.push({ ...product, count: 1 });
    }
    this.setState({ cartItems });
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  };

  sortProducts = (event) => {
    const sort = event.target.value;

    this.setState((state) => ({
      sort,
      products: state.products.slice().sort((a, b) => {
        return event.target.value === "highest" ? b.price - a.price : event.target.value === "lowest" ? a.price - b.price : a._id < b._id ? 1 : -1;
      }),
    }));
  };

  filterProducts = (event) => {
    if (event.target.value === "") {
      this.setState({
        size: event.target.value,
        products: data.products,
      });
    } else {
      this.setState({
        size: event.target.value,
        products: data.products.filter((product) => product.availableSizes.includes(event.target.value)),
      });
    }
  };

  render() {
    return (
      <div className="grid-container">
        <header>
          <a href="/">React Shopping Cart</a>
        </header>
        <main>
          <div className="content">
            <div className="main">
              <Filter count={this.state.products.length} size={this.state.size} sort={this.state.sort} filterProducts={this.filterProducts} sortProducts={this.sortProducts} />
              <Products products={this.state.products} addToCart={this.addToCart} />
            </div>
            <div className="sidebar">
              <Cart cartItems={this.state.cartItems} removeFromCart={this.removeFromCart} createOrder={this.createOrder} />
            </div>
          </div>
        </main>
        <footer>All rights reserved.</footer>
      </div>
    );
  }
}

export default App;

//1:25
