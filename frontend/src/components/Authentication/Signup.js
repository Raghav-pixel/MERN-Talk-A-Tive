import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [ show, setShow ] = useState(false);
  const [ name, setname ] = useState();
  const [ email, setEmail ] = useState();
  const [ password, setPassword ] = useState();
  const [ confirmPassword, setConfirmPassword ] = useState();
  const [ pic, setPic ] = useState();
  const [ loading, setLoading ] = useState(false);
  const history = useHistory();

  const toast = useToast();

  const handleClick = () => {
    setShow(!show);
  }

  const postDetails = (pics) => {
    setLoading(true); 
    if(pics === undefined) {
      toast({
        title: 'Please select an Image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      });
      return;
    }
    if(pics.type === 'image/png' || pics.type === 'image/jpeg') {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dqutisly6");
      fetch('https://api.cloudinary.com/v1_1/dqutisly6/image/upload', {
        method: 'post',
        body: data
      })
      .then(res => res.json())
      .then((data) => {
        console.log(data);
        setPic(data.url.toString());
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    } else {
      toast({
        title: 'Please select an Image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      });
      setLoading(false);
      return;
    }
  }

  const submitHandler = async() => {
    setLoading(true);
    if(!name || !email || !password || !confirmPassword) {
      toast({
        title: 'Please fill all the fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      });
      setLoading(false);
      return;
    }

    if(password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      });
      return;
    }

    try {
      const config = {
        headers: {
          'Content-type': 'application/json'
        },
      };

      const {data} = await axios.post('/api/user', { name, email, password, pic }, config);
      console.log(data, 'data after signup');
      toast({
        title: 'Registration Successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push('/chats');
    } catch(err) {
      toast({
        title: 'Error occured!',
        description: err.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      });
      setLoading(false);
    }
  }

  return (
    <VStack spacing={5} color='black'>
      <FormControl id="first-name" ishandleclickrequired="true">
        <FormLabel>Name</FormLabel>
        <Input
          placeholder='Enter your Name'
          onChange={(e) => setname(e.target.value)} 
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder='Enter your Email'
          onChange={(e) => setEmail(e.target.value)} 
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder='Enter your Password'
            onChange={(e) => setPassword(e.target.value)} 
          />
          <InputRightElement fontSize="4.5rem">
            <Button h="1.7rem" size="sm" onClick={handleClick}>{show ? 'Hide' : 'Show'}</Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder='Confirm Password'
            onChange={(e) => setConfirmPassword(e.target.value)} 
          />
          <InputRightElement fontSize="4.5rem">
            <Button h="1.7rem" size="sm" onClick={handleClick}>{show ? 'Hide' : 'Show'}</Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl>
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type='file'
          p={1.5}
          accept='image/*'
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme='blue'
        width="100%"
        style={{marginTop: 15}}
        onClick={submitHandler}
        isLoading={loading}
      >
        Signup
      </Button>

    </VStack>
  );
}

export default Signup;
