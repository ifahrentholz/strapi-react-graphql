import React from "react";
import { Container, Box, Heading, TextField, Text } from "gestalt";
import Strapi from "strapi-sdk-javascript/build/main";

import { getCart, calculatePrice } from "../utils";
import ToastMessage from "./ToastMessage";

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class Checkout extends React.Component {
  state = {
    cartItems: [],
    address: "",
    postalCode: "",
    city: "",
    confirmationEmailAddress: "",
    toast: false,
    toastMessage: ""
  };

  constructor(props) {
    super(props);

    this.handleConfirmOrder = this.handleConfirmOrder.bind(this);
  }

  componentDidMount() {
    this.setState({ cartItems: getCart() });
  }

  isFormEmpty = ({ address, postalCode, city, confirmationEmailAddress }) => {
    return !address || !postalCode || !city || !confirmationEmailAddress;
  };

  showToast = toastMessage => {
    this.setState({ toast: true, toastMessage });
    setTimeout(() => {
      this.setState({ toast: false, toastMessage: "" });
    }, 5000);
  };

  handleChange = ({ event, value }) => {
    this.setState({ [event.target.name]: value });
  };

  /**
   * @param {form} e
   */
  async handleConfirmOrder(e) {
    e.preventDefault();

    const { username, email, password } = this.state;

    if (this.isFormEmpty(this.state)) {
      this.showToast("Fill in all fields");
      return;
    }
  }

  render() {
    const {
      address,
      city,
      postalCode,
      confirmationEmailAddress,
      toast,
      toastMessage,
      cartItems
    } = this.state;

    return (
      <Container>
        <Box
          color="darkWash"
          margin={4}
          padding={4}
          shape="rounded"
          display="flex"
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          {/* Checkout Form Heading */}
          <Heading color="midnight">Checkout</Heading>
          {cartItems.length > 0 ? (
            <React.Fragment>
              {/* User Cart */}
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                direction="column"
                marginTop={2}
                marginBottom={6}
              >
                <Text color="darkWash" italic>
                  {cartItems.length} items for checkout
                </Text>
                <Box padding={2}>
                  {cartItems.map(item => (
                    <Box key={item.id} padding={1}>
                      <Text color="midnight">
                        {item.name} x {item.quantity} - $
                        {item.quantity * item.price}
                      </Text>
                    </Box>
                  ))}
                </Box>
                <Text bold>Total Amount: {calculatePrice(cartItems)}</Text>
              </Box>
              {/* Checkout form */}
              <form
                style={{
                  display: "inlineBlock",
                  textAlign: "center",
                  maxWidth: 450
                }}
                onSubmit={this.handleConfirmOrder}
              >
                {/* address input */}
                <TextField
                  value={address}
                  id="address"
                  type="text"
                  name="address"
                  placeholder="Shipping Address"
                  onChange={this.handleChange}
                />
                {/* postalCode input */}
                <TextField
                  value={postalCode}
                  id="postalCode"
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  onChange={this.handleChange}
                />
                {/* city input */}
                <TextField
                  value={city}
                  id="city"
                  type="text"
                  name="city"
                  placeholder="City of residence"
                  onChange={this.handleChange}
                />
                {/* confirmationEmailAddress input */}
                <TextField
                  value={confirmationEmailAddress}
                  id="confirmationEmailAddress"
                  type="email"
                  name="confirmationEmailAddress"
                  placeholder="Confirmation Email Address"
                  onChange={this.handleChange}
                />
                <button id="strip__button" type="submit">
                  Submit
                </button>
              </form>
            </React.Fragment>
          ) : (
            // Default Text
            <Box color="darkWash" shape="rounded" padding={4}>
              <Heading align="center" color="watermelon" size="xs">
                Your cart is empty
              </Heading>
              <Text align="center" italic color="green">
                Add some brews
              </Text>
            </Box>
          )}
        </Box>
        <ToastMessage show={toast} message={toastMessage} />
      </Container>
    );
  }
}

export default Checkout;
