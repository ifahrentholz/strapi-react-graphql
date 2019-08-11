import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Box, Text, Heading, Image, Button } from "gestalt";

import { getToken, clearCart, clearToken } from "../utils";

class Navbar extends React.Component {
  handleSignOut = () => {
    clearToken();
    clearCart();
    this.props.history.push("/");
  };

  render() {
    return getToken() !== null ? (
      <AuthedNavbar handleSignOut={this.handleSignOut} />
    ) : (
      <UnAuthedNavbar />
    );
  }
}

const AuthedNavbar = ({ handleSignOut }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="around"
      height={70}
      color="midnight"
      padding={1}
      shape="roundedBottom"
    >
      {/* Sign In */}
      <NavLink to="/checkout" activeClassName="active">
        <Text size="xl" color="white">
          Checkout
        </Text>
      </NavLink>

      {/* Logo */}
      <NavLink to="/" activeClassName="active" exact>
        <Box display="flex" alignItems="center">
          <Box height={50} width={50} marginRight={2}>
            <Image
              src="./icons/logo.svg"
              alt="BrewHaha Logo"
              naturalWidth={1}
              naturalHeight={1}
            />
          </Box>

          <Heading size="xs" color="orange">
            BrewHaha
          </Heading>
        </Box>
      </NavLink>

      {/* Sign Out */}
      <Button
        color="transparent"
        text="Sign Out"
        inline
        size="md"
        onClick={handleSignOut}
      />
    </Box>
  );
};

const UnAuthedNavbar = () => {
  console.log("render AUTHED NAV");
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="around"
      height={70}
      color="midnight"
      padding={1}
      shape="roundedBottom"
    >
      {/* Sign In */}
      <NavLink to="/signin" activeClassName="active">
        <Text size="xl" color="white">
          Sign In
        </Text>
      </NavLink>

      {/* Logo */}
      <NavLink to="/" activeClassName="active" exact>
        <Box display="flex" alignItems="center">
          <Box height={50} width={50} marginRight={2}>
            <Image
              src="./icons/logo.svg"
              alt="BrewHaha Logo"
              naturalWidth={1}
              naturalHeight={1}
            />
          </Box>

          <Heading size="xs" color="orange">
            BrewHaha
          </Heading>
        </Box>
      </NavLink>

      {/* Sign Up */}
      <NavLink to="/signup" activeClassName="active">
        <Text size="xl" color="white">
          Sign Up
        </Text>
      </NavLink>
    </Box>
  );
};

export default withRouter(Navbar);
