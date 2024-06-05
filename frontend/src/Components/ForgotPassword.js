import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  ChakraProvider,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailValid = validateEmail(email);
    setIsEmailInvalid(!emailValid);

    if (emailValid) {
      try {
        const response = await axios.post(
          "https://chess-app-opin.onrender.com/forgot-password",
          { email }
        );
        setSuccessMessage("You will receive a password reset link shortly.");
        setErrorMessage("");
      } catch (error) {
        if (error.response.data.msg === "User not found") {
          setErrorMessage("User not found");
        } else setErrorMessage("An error occurred. Please try again later.");
        setSuccessMessage("");
      }
    } else {
      setErrorMessage("");
    }
  };

  return (
    <ChakraProvider>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.700")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
            Forgot your password?
          </Heading>
          <Text
            fontSize={{ base: "sm", sm: "md" }}
            color={useColorModeValue("gray.800", "gray.400")}
          >
            You&apos;ll get an email with a reset link
          </Text>
          
            <FormControl id="email" isInvalid={isEmailInvalid}>
              <Input
                placeholder="your-email@example.com"
                _placeholder={{ color: "gray.500" }}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {isEmailInvalid && (
                <FormErrorMessage>Invalid email address</FormErrorMessage>
              )}
            </FormControl>
            <Stack spacing={6}>
              <Button
              onClick={handleSubmit}
                type="submit"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Request Reset
              </Button>
            </Stack>
          
          {successMessage && (
            <Text color="green.700" textAlign="center">
              {successMessage}
            </Text>
          )}
          {errorMessage && (
            <Text color="red.700" textAlign="center">
              {errorMessage}
            </Text>
          )}
        </Stack>
      </Flex>
    </ChakraProvider>
  );
}
