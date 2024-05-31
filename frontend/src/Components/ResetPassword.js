import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Text,
  ChakraProvider,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [errorMessage, setErrorMessage] = useState("");

  const submitHandler = async () => {
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    if(password.length < 6) {
        setErrorMessage("Password must be at least 6 characters long");
        return;
    }
    try {
      const response = await axios.post(`http://localhost:8000/reset-password/${token}`, {
        password
      });
      localStorage.setItem("chess-app-token", response.data.token);
      navigate("/");
    } catch (error) {
        if(error.response.status !== 500) {
            setErrorMessage(error.response.data.msg);
        }
        else setErrorMessage("An error occurred. Please try again later.");
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
            Enter new password
          </Heading>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" ref={passwordRef} />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input type="password" ref={confirmPasswordRef} />
          </FormControl>
          <Stack spacing={6}>
            <Button
              onClick={submitHandler}
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
            >
              Submit
            </Button>
          </Stack>
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
