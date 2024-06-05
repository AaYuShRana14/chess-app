import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  Stack,
  useColorModeValue,
  Avatar,
  AvatarBadge,
  Center,
  ChakraProvider,
} from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function UpdateProfile() {
  const [user, setUser] = useState({});
  const token = localStorage.getItem('chess-app-token');
  const [handlename, setHandlename] = useState('');
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (!token) {
      window.location.href = '/signin';
    }

    async function getUser() {
      try {
        const res = await axios.get('http://localhost:8000/profile/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
        setAvatar(res.data.avatar);
        setHandlename(res.data.handlename);
      } catch (err) {
        console.error(err);
      }
    }

    getUser();
  }, [token]);

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: 'dli5g7kbs',
        uploadPreset: 'ltcyvgkv',
      },
      (err, result) => {
        if (result.event === 'success') {
          setAvatar(result.info.secure_url); 
        }
      }
    );
  }, []);

  const updateHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:8000/updateProfile', 
        {
          handlename,
          avatar,
        }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      window.location.href = '/';
    } catch (err) {
      console.error(err);
    }
  };

  const handleHandlenameChange = (e) => {
    setHandlename(e.target.value);
    setUser((prevUser) => ({
      ...prevUser,
      handlename: e.target.value,
    }));
  };

  return (
    <ChakraProvider>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            {user.name}
          </Heading>
          <FormControl id="userName">
            <FormLabel>Profile Picture</FormLabel>
            <Stack direction={['column', 'row']} spacing={6}>
              <Center>
                <Avatar size="xl" src={avatar}>
                  <AvatarBadge size="m" rounded="full" top="100px" />
                </Avatar>
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => widgetRef.current.open()}>
                  Change Picture
                </Button>
              </Center>
            </Stack>
          </FormControl>
          <FormControl id="userName" isRequired>
            <FormLabel>Handle Name</FormLabel>
            <Input
              placeholder={user.handlename}
              _placeholder={{ color: 'gray.500' }}
              type="text"
              value={handlename}
              onChange={handleHandlenameChange}
            />
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
          <Stack spacing={6} direction={['column', 'row']}>
            <Button
              bg={'red.400'}
              color={'white'}
              w="full"
              _hover={{ bg: 'blue.500' }}
              onClick={() => {
                localStorage.removeItem('chess-app-token');
                window.location.href = '/signin';
              }}
            >
             logout
            </Button>
            <Button
              bg={'blue.400'}
              color={'white'}
              w="full"
              _hover={{ bg: 'blue.500' }}
              onClick={updateHandler}
            >
              Update
            </Button>
            <Button
              bg={'blue.400'}
              color={'white'}
              w="full"
              _hover={{ bg: 'blue.500' }}
              onClick={() => (window.location.href = '/')}
            >
              Home
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </ChakraProvider>
  );
}
