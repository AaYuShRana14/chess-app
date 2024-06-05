import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,
    ChakraProvider,
    FormErrorMessage,
  } from "@chakra-ui/react";
  import GoogleButton from "./ui/GoogleButton";
  import { useState } from "react";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  
  export default function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isEmailInvalid, setIsEmailInvalid] = useState(false);
    const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
    const [formError, setFormError] = useState("");
  
    const navigate = useNavigate();
  
    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };
  
    const validatePassword = (password) => {
      return password.length >= 6;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const emailValid = validateEmail(email);
      const passwordValid = validatePassword(password);
  
      setIsEmailInvalid(!emailValid);
      setIsPasswordInvalid(!passwordValid);
  
      if (emailValid && passwordValid) {
        try {
          const response = await axios.post("https://chess-app-opin.onrender.com/login", { email, password });
          localStorage.setItem("chess-app-token", response.data.token);
          navigate("/");
          setFormError("");
        } catch (error) {
          if (error.response.data.msg==="Invalid credentials") {
            setFormError("Invalid email or password");
          } else {
            setFormError("An error occurred. Please try again later.");
          }
        }
      } else {
        setFormError("");
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
              <Heading fontSize={"4xl"}>Sign in to your account</Heading>
              <Text fontSize={"lg"} color={"gray.600"}>
              Strategize. Compete. Triumph
              </Text>
            </Stack>
            <Box
              rounded={"lg"}
              bg={useColorModeValue("white", "gray.700")}
              boxShadow={"lg"}
              p={8}
            >
              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <FormControl id="email" isInvalid={isEmailInvalid}>
                    <FormLabel>Email address</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {isEmailInvalid && (
                      <FormErrorMessage>Invalid email address</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl id="password" isInvalid={isPasswordInvalid}>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {isPasswordInvalid && (
                      <FormErrorMessage>
                        Password must be at least 6 characters long
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  {formError && (
                    <Text color="red.500" textAlign="center">
                      {formError}
                    </Text>
                  )}
                  <Stack spacing={10}>
                    <Stack
                      direction={{ base: "column", sm: "row" }}
                      align={"start"}
                      justify={"space-between"}
                    >
                      <Checkbox>Remember me</Checkbox>
                      <Link href="/forgot-password" color={"blue.400"}>Forgot password?</Link>
                    </Stack>
                    <Button
                      type="submit"
                      bg={"blue.400"}
                      color={"white"}
                      _hover={{
                        bg: "blue.500",
                      }}
                    >
                      Sign in
                    </Button>
                  </Stack>
                  <Stack>
                    <GoogleButton message="in" />
                  </Stack>
                  <Stack pt={6}>
                    <Text align={"center"}>
                      New Here? <Link href="/signup" color={"blue.400"}>Signup</Link>
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
  