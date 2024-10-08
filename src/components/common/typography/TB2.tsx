// components/TD1.tsx
import React, { FC } from "react";
import { Text, TextProps } from "@chakra-ui/react";

interface TB2Props extends TextProps {
  children: React.ReactNode; // Type for children
}

const TB2: FC<TB2Props> = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize="14px" fontWeight="400">
      {children}
    </Text>
  );
};

export default TB2;
