import axios from "axios";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  ChakraProvider,
  FormErrorMessage,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import GoogleButton from "./ui/GoogleButton";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const validateInputs = () => {
    const newErrors = {};
    if (!firstNameRef.current.value.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!lastNameRef.current.value.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!emailRef.current.value.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(emailRef.current.value)) {
      newErrors.email = "Email is invalid";
    }
    if (!passwordRef.current.value.trim()) {
      newErrors.password = "Password is required";
    } else if (passwordRef.current.value.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    return newErrors;
  };

  const SubmitHandler = async (e) => {
    e.preventDefault();

    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      const firstName = firstNameRef.current.value;
      const lastName = lastNameRef.current.value;
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      const name = firstName + " " + lastName;

      const data = {
        name,
        email,
        password,
      };

      try {
        const response = await axios.post("http://localhost:8000/signup", data);
        localStorage.setItem("chess-app-token", response.data.token);
        navigate("/game");
        setErrors({});
      } catch (error) {
        const msg = error.response.data.msg || error.response.msg;
        if(msg === "User already exists") {
          setErrors({email: "User already exists"});
        }
        else if(msg === "Invalid data") {
          validateInputs();
        }
        else console.error("Error during signup:", msg);
      }
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
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Sign up
            </Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <form onSubmit={SubmitHandler}>
              <Stack spacing={4}>
                <HStack>
                  <Box>
                    <FormControl id="firstName" isRequired isInvalid={errors.firstName}>
                      <FormLabel>First Name</FormLabel>
                      <Input type="text" ref={firstNameRef} />
                      <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl id="lastName" isRequired isInvalid={errors.lastName}>
                      <FormLabel>Last Name</FormLabel>
                      <Input type="text" ref={lastNameRef} />
                      <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                    </FormControl>
                  </Box>
                </HStack>
                <FormControl id="email" isRequired isInvalid={errors.email}>
                  <FormLabel>Email address</FormLabel>
                  <Input type="email" ref={emailRef} />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
                <FormControl id="password" isRequired isInvalid={errors.password}>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input type={showPassword ? "text" : "password"} ref={passwordRef} />
                    <InputRightElement h={"full"}>
                      <Button
                        variant={"ghost"}
                        onClick={() => setShowPassword((showPassword) => !showPassword)}
                      >
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                <Stack spacing={10} pt={2}>
                  <Button
                    type="submit"
                    loadingText="Submitting"
                    size="lg"
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                  >
                    Sign up
                  </Button>
                </Stack>
                <Stack>
                  <GoogleButton message="up" />
                </Stack>
                <Stack pt={6}>
                  <Text align={"center"}>
                    Already a user? <Link href="/signin" color={"blue.400"}>Signin</Link>
                  </Text>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Flex>
    </ChakraProvider>
  );
}

export default Signup;
