import { FcGoogle } from 'react-icons/fc';
import { Button, Center, Text } from '@chakra-ui/react';
import axios from 'axios';

export default function GoogleButton({message}) {
  const googleHandler = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/googleauth`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        const { url } = response.data;
        window.location.href = url;
    } catch (error) {
        console.error('Error during Google auth:', error);
    }
};
  return (
    <Center>
      <Button
        onClick={googleHandler}
        w={'full'}
        maxW={'lg'}
        variant={'solid'}
        leftIcon={<FcGoogle />}>
        <Center>
          <Text>Sign {message} with Google</Text>
        </Center>
      </Button>
    </Center>
  );
}