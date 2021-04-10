import React, { Component } from "react";
import Modal from "react-modal";
import { connect } from "react-redux";
import Fade from "react-reveal/Fade";
import Zoom from "react-reveal/Zoom";
import { removeFromCart } from "../actions/cartActions";
import { createOrder, clearOrder } from "../actions/orderActions";

import { formatCurrency } from "../util";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCheckout: false,
      name: "",
      email: "",
      address: "",
    };
  }

  closeModal = () => {
    this.props.clearOrder();
  };

  handleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  createOrder = (e) => {
    e.preventDefault();
    const order = {
      name: this.state.name,
      email: this.state.email,
      address: this.state.address,
      cartItems: this.props.cartItems,
      total: this.props.cartItems.reduce((acc, curr) => acc + curr.price * curr.count, 0),
    };
    this.props.createOrder(order);
  };

  render() {
    const { cartItems, order } = this.props;

    return (
      <div>
        {cartItems.length === 0 ? <div className="cart cart-header">Cart is empty</div> : <div className="cart cart-header">You have {cartItems.length} items in the cart</div>}

        {order && (
          <Modal isOpen={true} onRequestClose={this.closeModal} ariaHideApp={false}>
            <Zoom>
              <button className="close-modal" onClick={this.closeModal}>
                x
              </button>
              <div className="order-details">
                <h3 className="success-message">Your order has been placed</h3>
                <h2>Order {order._id}</h2>
                <ul>
                  <li>
                    <div>Name:</div>
                    <div>{order.name}</div>
                  </li>
                  <li>
                    <div>Email:</div>
                    <div>{order.email}</div>
                  </li>
                  <li>
                    <div>Address:</div>
                    <div>{order.address}</div>
                  </li>
                  <li>
                    <div>Date:</div>
                    <div>{order.createdAt}</div>
                  </li>
                  <li>
                    <div>Total:</div>
                    <div>{formatCurrency(order.total)}</div>
                  </li>
                  <li>
                    <div>Cart Items:</div>
                    <div>
                      {order.cartItems.map((item, i) => (
                        <div key={i}>
                          {item.count} {" x "} {item.title}
                        </div>
                      ))}
                    </div>
                  </li>
                </ul>
              </div>
            </Zoom>
          </Modal>
        )}
        <div className="cart">
          <Fade left cascade>
            <ul className="cart-items">
              {cartItems.map((item) => (
                <li key={item._id}>
                  <div>
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div>
                    <div>{item.title}</div>
                    <div className="right">
                      {formatCurrency(item.price)} x {item.count}{" "}
                      <button className="button" onClick={() => this.props.removeFromCart(item)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Fade>
        </div>
        {cartItems.length !== 0 && (
          <div className="cart">
            <div className="total">
              <div>Total: {formatCurrency(cartItems.reduce((acc, curr) => acc + curr.price * curr.count, 0))}</div>
              <button className="button primary" onClick={() => this.setState({ showCheckout: true })}>
                Proceed
              </button>
            </div>
          </div>
        )}

        {this.state.showCheckout && (
          <div className="cart">
            <Fade right cascade>
              <form onSubmit={this.createOrder} className="form">
                <ul className="form-container">
                  <li>
                    <label>Email</label>
                    <input type="email" required onChange={this.handleInput} name="email" value={this.state.email} />
                  </li>
                  <li>
                    <label>Name</label>
                    <input type="text" required onChange={this.handleInput} name="name" value={this.state.name} />
                  </li>
                  <li>
                    <label>Address</label>
                    <input type="text" required onChange={this.handleInput} name="address" value={this.state.address} />
                  </li>
                  <li>
                    <button type="submit" className="button primary">
                      Checkout
                    </button>
                  </li>
                </ul>
              </form>
            </Fade>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  cartItems: state.cart.cartItems,
  order: state.order.order,
});

const mapDispatchToProps = {
  removeFromCart,
  createOrder,
  clearOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
