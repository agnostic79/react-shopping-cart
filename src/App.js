import React, { Component } from "react";
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
    };
  }

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
              <Products products={this.state.products} />
            </div>
            <div className="sidebar">Cart Items</div>
          </div>
        </main>
        <footer>All rights reserved.</footer>
      </div>
    );
  }
}

export default App;
