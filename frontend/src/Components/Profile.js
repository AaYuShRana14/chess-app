import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Box,
  keyframes,
  Flex,
  Text,
  FormControl,
  Heading,
  Stack,
  useColorModeValue,
  Avatar,
  ChakraProvider,
} from "@chakra-ui/react";

export default function Profile() {
  const size = "96px";
  const color = "teal";

  const pulseRing = keyframes`
      0% {
      transform: scale(0.33);
    }
    40%,
    50% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
      `;
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/profile/${id}`);
        setUser(res.data);
      } catch (err) {
        console.log("err");
        return navigate("*");
      }
    };
    getProfile();
  }, [id, navigate]);

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
          bg={useColorModeValue("gray.200", "gray.700")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            {user.name}
          </Heading>
          <FormControl id="userName">
            <Stack direction={["column", "row"]} spacing={6}>
              <Flex
                justifyContent="center"
                alignItems="center"
                h="140px"
                w="full"
                overflow="hidden"
              >
                <Box
                  as="div"
                  position="relative"
                  w={size}
                  h={size}
                  _before={{
                    content: "''",
                    position: "relative",
                    display: "block",
                    width: "300%",
                    height: "300%",
                    boxSizing: "border-box",
                    marginLeft: "-100%",
                    marginTop: "-100%",
                    borderRadius: "50%",
                    bgColor: color,
                    animation: `2.25s ${pulseRing} cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite`,
                  }}
                >
                  <Avatar
                    src={user.avatar}
                    size="full"
                    position="absolute"
                    top={0}
                  />
                </Box>
              </Flex>
            </Stack>
          </FormControl>
          <FormControl id="userName">
            <Text fontSize="lg" fontWeight="bold">
              Username:
            </Text>
            <Text fontSize="lg">{user.handlename}</Text>
          </FormControl>
          <FormControl id="email">
            <Text fontSize="lg" fontWeight="bold">
              Email:
            </Text>
            <Text fontSize="lg">{user.email}</Text>
          </FormControl>
          <FormControl id="rating">
            <Text fontSize="lg" fontWeight="bold">
              Rating:
            </Text>
            <Text fontSize="lg">{user.rating}</Text>
          </FormControl>
          <FormControl id="totalMatches">
            <Text fontSize="lg" fontWeight="bold">
              Total Matches:
            </Text>
            <Text fontSize="lg">{user.totalMatches}</Text>
          </FormControl>
          <FormControl id="totalWins">
            <Text fontSize="lg" fontWeight="bold">
              Wins:
            </Text>
            <Text fontSize="lg">{user.totalWins}</Text>
          </FormControl>
          <Button
            onClick={() => navigate("/")}
            bg={"gray.600"}
            color={"white"}
            w="full"
            _hover={{
              bg: "gray.700",
            }}
          >
            Home
          </Button>
        </Stack>
      </Flex>
    </ChakraProvider>
  );
}
