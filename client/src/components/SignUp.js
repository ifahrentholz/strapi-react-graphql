import React from "react";
import { Container, Box, Button, Heading, Text, TextField } from "gestalt";
import Strapi from "strapi-sdk-javascript/build/main";

import ToastMessage from "./ToastMessage";
import { setToken } from "../utils";

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class SignUp extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    toast: false,
    toastMessage: "",
    loading: false
  };

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  isFormEmpty = ({ username, password, email }) => {
    return !username || !password || !email;
  };
  handleChange = ({ event, value }) => {
    this.setState({ [event.target.name]: value });
  };

  /**
   * @param {form} e
   */
  async handleSubmit(e) {
    e.preventDefault();

    const { username, email, password } = this.state;

    if (this.isFormEmpty(this.state)) {
      this.showToast("Fill in all fields");
      return;
    }

    try {
      this.setState({ loading: true });
      const response = await strapi.register(username, email, password);
      this.setState({ loading: false });
      setToken(response);
      this.redirectUser("/");
    } catch (error) {
      this.setState({ loading: false });
      this.showToast(error.message);
    }
  }

  redirectUser = path => this.props.history.push(path);

  showToast = toastMessage => {
    this.setState({ toast: true, toastMessage });
    setTimeout(() => {
      this.setState({ toast: false, toastMessage: "" });
    }, 5000);
  };

  render() {
    const {
      username,
      email,
      password,
      toast,
      toastMessage,
      loading
    } = this.state;
    return (
      <Container>
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: "#ebe2da"
            }
          }}
          margin={4}
          padding={4}
          shape="rounded"
          display="flex"
          justifyContent="center"
        >
          <form
            style={{
              display: "inlineBlock",
              textAlign: "center",
              maxWidth: 450
            }}
            onSubmit={this.handleSubmit}
          >
            {/* Sign Up Form Heading */}
            <Box
              marginBottom={2}
              display="flex"
              direction="column"
              alignItems="center"
            >
              <Heading color="midnight">Lets get started</Heading>
              <Text italic color="orchid">
                Sign up to order some brews!
              </Text>
            </Box>
            {/* Username input */}
            <TextField
              value={username}
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              onChange={this.handleChange}
            />
            {/* Email input */}
            <TextField
              value={email}
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              onChange={this.handleChange}
            />
            {/* Password input */}
            <TextField
              value={password}
              id="password"
              type="text"
              name="password"
              placeholder="Password"
              onChange={this.handleChange}
            />
            <Button
              disabled={loading}
              inline
              color="blue"
              text="Submit"
              type="submit"
            />
          </form>
        </Box>
        <ToastMessage show={toast} message={toastMessage} />
      </Container>
    );
  }
}

export default SignUp;
