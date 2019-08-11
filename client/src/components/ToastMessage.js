import React from "react";
import { Box, Toast } from "gestalt";

const ToastMessage = ({ show, message }) =>
  show && (
    <Box
      position="fixed"
      dangerouslySetInlineStyle={{
        __style: {
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)"
        }
      }}
    >
      <Toast color="orange" text={message} />
    </Box>
  );

export default ToastMessage;
