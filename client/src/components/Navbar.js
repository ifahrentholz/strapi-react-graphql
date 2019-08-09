import React from "react";
import { NavLink } from "react-router-dom";
import { Box, Text, Heading, Image } from "gestalt";

const Navbar = () => (
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

export default Navbar;
