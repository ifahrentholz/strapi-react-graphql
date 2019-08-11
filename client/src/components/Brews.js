import React from "react";
import Strapi from "strapi-sdk-javascript/build/main";
import {
  Box,
  Heading,
  Card,
  Image,
  Text,
  Button,
  Mask,
  IconButton
} from "gestalt";
import { Link } from "react-router-dom";

import { calculatePrice, setCart, getCart } from "../utils";
import Loader from "./Loader";

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class Brews extends React.Component {
  state = {
    brand: "",
    loadingBrand: true,
    brews: [],
    cartItems: []
  };
  async componentDidMount() {
    const id = this.props.match.params.brandId;
    try {
      const response = await strapi.request("POST", "/graphql", {
        data: {
          query: `query {
            brand(id: "${id}") {
              id
              name
              brews {
                id
                name
                description
                image {
                  url
                }
                price
              }
            }
          }`
        }
      });
      this.setState({
        brand: response.data.brand.name,
        brews: response.data.brand.brews,
        loadingBrand: false,
        cartItems: getCart()
      });
    } catch (error) {
      console.error(error);
      this.setState({ error: true, loadingBrand: false });
    }
  }

  addToCard = brew => {
    const alreadyInCard = this.state.cartItems.findIndex(
      item => item.id === brew.id
    );

    if (alreadyInCard === -1) {
      const updatedItems = this.state.cartItems.concat({
        ...brew,
        quantity: 1
      });

      this.setState({ cartItems: updatedItems }, () => setCart(updatedItems));
    } else {
      const updatedItems = [...this.state.cartItems];
      updatedItems[alreadyInCard].quantity += 1;

      this.setState({ cartItems: updatedItems }, () => setCart(updatedItems));
    }
  };

  deleteItemFromCardById = itemToDeleteId => {
    const filteredItems = this.state.cartItems.filter(
      item => item.id !== itemToDeleteId
    );
    this.setState({ cartItems: filteredItems }, () => setCart(filteredItems));
  };

  render() {
    const { brand, brews, loadingBrand, cartItems } = this.state;
    if (!brews.length) {
      return <Loader show={loadingBrand} />;
    }

    return (
      <Box
        marginTop={4}
        display="flex"
        justifyContent="center"
        alignItems="start"
        dangerouslySetInlineStyle={{
          __style: {
            flexWrap: "wrap-reverse"
          }
        }}
      >
        <Box display="flex" direction="column" alignItems="center">
          <Box margin={2}>
            <Heading color="orchid">{brand}</Heading>
          </Box>
          <Box
            dangerouslySetInlineStyle={{
              __style: {
                backgroundColor: "#bdcdd9"
              }
            }}
            wrap
            shape="rounded"
            display="flex"
            justifyContent="center"
            padding={4}
          >
            {brews.map(brew => (
              <Box paddingY={4} width={210} margin={2} key={brew.id}>
                <Card
                  image={
                    <Box height={250} width={200}>
                      {brew.image && (
                        <Image
                          fit="cover"
                          alt="brew"
                          src={`${apiUrl}${brew.image.url}`}
                          naturalHeight={1}
                          naturalWidth={1}
                        />
                      )}
                    </Box>
                  }
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    direction="column"
                  >
                    <Box margin={2}>
                      <Text bold size="xl">
                        {brew.name}
                      </Text>
                    </Box>
                    <Text>{brew.description}</Text>
                    <Text color="orchid">${brew.price}</Text>
                    <Box margin={2}>
                      <Text bold size="xl">
                        <Button
                          onClick={() => this.addToCard(brew)}
                          color="blue"
                          text="Add to Cart"
                        />
                      </Text>
                    </Box>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
        <Box marginTop={2} marginLeft={8} alignSelf="end">
          <Mask shape="rounded" wash>
            <Box
              display="flex"
              direction="column"
              alignItems="center"
              padding={2}
            >
              <Heading align="center" size="xs">
                Your Card
              </Heading>
              <Text color="gray" italic>
                {cartItems.length} items selected
              </Text>

              {cartItems.map(item => (
                <Box key={item.id} display="flex" alignItems="center">
                  <Text>
                    {item.name} x {item.quantity} -{" "}
                    {(item.quantity * item.price).toFixed(2)}
                  </Text>
                  <IconButton
                    accessibilityLabel="Delete Item"
                    icon="cancel"
                    size="sm"
                    iconColor="red"
                    onClick={() => this.deleteItemFromCardById(item.id)}
                  />
                </Box>
              ))}

              <Box
                display="flex"
                alignItems="center"
                alignContent="center"
                direction="column"
              >
                <Box margin={2}>
                  {cartItems.length === 0 && (
                    <Text color="red">Please select some items</Text>
                  )}
                </Box>
                <Text size="lg">Total: {calculatePrice(cartItems)}</Text>
                <Text>
                  <Link to="/checkout">Checkout</Link>
                </Text>
              </Box>
            </Box>
          </Mask>
        </Box>
      </Box>
    );
  }
}

export default Brews;
