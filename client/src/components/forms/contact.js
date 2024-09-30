import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { VStack, Input, Textarea, Button, useToast } from '@chakra-ui/react';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate formData here if needed

    emailjs
      .send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData, 'YOUR_USER_ID')
      .then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
          toast({
            title: 'Email sent.',
            description: 'Your message has been sent successfully!',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          setFormData({
            name: '',
            email: '',
            phone: '',
            message: '',
          });
        },
        (error) => {
          console.log('FAILED...', error);
          toast({
            title: 'Error sending email.',
            description: 'There was a problem sending your message.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      );
  };

  return (
    <VStack w='50%' spacing={4} as="form" onSubmit={handleSubmit} p={5}>
      <Input 
        name="name" 
        placeholder="Your Name" 
        value={formData.name} 
        onChange={handleChange} 
        color='black'
        required 
      />
      <Input 
        name="email" 
        type="email" 
        placeholder="Your Email" 
        value={formData.email} 
        onChange={handleChange} 
        required 
        color='black'
      />
      <Input 
        name="phone" 
        type="tel" 
        placeholder="Your Phone" 
        value={formData.phone} 
        onChange={handleChange} 
        color='black'
        required 
      />
      <Textarea 
        name="message" 
        placeholder="Whats on your mind ?" 
        value={formData.message} 
        onChange={handleChange} 
        color='black'
        required 
      />
      <Button type="submit" bg='rgb(85, 172, 59)'>Reach Out!</Button>
    </VStack>
  );
};

