import React, { Component } from "react";
import {
  Container,
  Box,
  Heading,
  Card,
  Image,
  Text,
  SearchField,
  Icon
} from "gestalt";
import Strapi from "strapi-sdk-javascript/build/main";
import { Link } from "react-router-dom";

import Loader from "./Loader";
import "./App.css";

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class App extends Component {
  state = {
    brands: [],
    searchTerm: "",
    loadingBrands: true
  };

  async componentDidMount() {
    try {
      const response = await strapi.request("POST", "/graphql", {
        data: {
          query: `query {
            brands {
              id
              name
              description
              image {
                name
                size
                url
              }
            }
          }`
        }
      });
      this.setState({ brands: response.data.brands, loadingBrands: false });
    } catch (err) {
      console.error(err);
      this.setState({ loadingBrands: false });
    }
  }

  /**
   * Handle search
   * @param {Event} e - onChange event
   */
  handleSearchInput = ({ value }) => {
    this.setState({ searchTerm: value });
  };

  filteredBrands = ({ searchTerm, brands }) => {
    return brands.filter(brand => {
      return (
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  render() {
    const { searchTerm, loadingBrands } = this.state;
    return (
      <Container>
        {/* Brands Search Field */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginTop={4}
        >
          <SearchField
            value={this.state.searchTerm}
            id="searchField"
            accessibilityLabel="Brands Search Field"
            onChange={this.handleSearchInput}
            placeholder="Search Brands"
          />
          <Box marginLeft={4}>
            <Icon
              icon="filter"
              color={searchTerm ? "orange" : "gray"}
              size={20}
              accessibilityLabel="Filter"
            />
          </Box>
        </Box>

        {/* Brands Section */}
        <Box display="flex" justifyContent="center" marginBottom={2}>
          {/* Brands Header */}
          <Heading color="midnight" size="md">
            Brew Brands
          </Heading>
        </Box>
        {/* Brands  */}
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: "#d6c8ec"
            }
          }}
          shape="rounded"
          wrap
          display="flex"
          justifyContent="around"
        >
          {this.filteredBrands(this.state).map(brand => (
            <Box paddingY={4} width={200} margin={2} key={brand.id}>
              <Card
                image={
                  <Box height={200} width={200}>
                    {brand.image && (
                      <Image
                        fit="cover"
                        alt="Brand"
                        src={`${apiUrl}${brand.image.url}`}
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
                  <Text bold size="xl">
                    {brand.name}
                  </Text>
                  <Text>{brand.description}</Text>
                  <Text bold size="xl">
                    <Link to={`/${brand.id}`}>See Brews</Link>
                  </Text>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
        <Loader show={loadingBrands} />
      </Container>
    );
  }
}

export default App;
