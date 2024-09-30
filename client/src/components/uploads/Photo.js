import React, { useState } from 'react';
import { Box, Button, VStack, Text, Input, Image, HStack } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../contexts/Auth'; // Import AuthContext

// do NOT MODIFY

export const UploadProfileImage = ({ field, onClose }) => {
    const { updateProfileFiles } = useAuth();
    const [document, setDocument] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    const handleDocumentDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file && file.type.startsWith('image/')) {
            setDocument(file);
            const url = URL.createObjectURL(file);
            setImageUrl(url);
        } else {
            alert('Please upload a valid image file.');
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDocumentDrop,
        accept: 'image/*', // Accept image files
        multiple: false,
    });

    const handleSubmit = () => {
        if (!document) {
            alert('Please upload an image.');
            return;
        }
        // Call the updateProfileFiles function from context
        updateProfileFiles(document, field);
        onClose();
    };

    return (
        <VStack spacing={6} mt={6}>
            <Box {...getRootProps()} border="2px dashed #ccc" p={6} borderRadius="md" cursor="pointer">
                <Input {...getInputProps()} />
                {document ? (
                    <>
                        {imageUrl && <Image borderRadius='50%' my='75px' w='300px' h='300px' objectFit='cover' src={imageUrl} alt="Uploaded Preview" mt={4} />}
                        <Text>Uploaded Image: {document.name}</Text>
                    </>
                ) : (
                    <Text>Drag & drop an image, or click to select one</Text>
                )}
            </Box>
            <HStack flex={1} spacing={4}>
                <Button onClick={() => handleSubmit()} colorScheme="green">
                    Submit
                </Button>
                <Button bgColor='appColors.greyGoose' color='white' onClick={onClose}>Cancel</Button>
            </HStack>
        </VStack>
    );
};

export const UploadImage = ({ setParentForm, setImageUrl}) => {

    // Handle file drop for images
    const handleDocumentDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file && file.type.startsWith('image/')) {

            setParentForm((prev) => ({ ...prev, image: file }));

            const url = URL.createObjectURL(file);
            setImageUrl(url);
        } else {
            alert('Please upload a valid image file.');
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDocumentDrop,
        accept: 'image/*', // Accept image files
        multiple: false,
    });



    return (
        <VStack spacing={6} mt={6}>
            <Box {...getRootProps()} border="2px dashed #ccc" p={6} borderRadius="md" cursor="pointer">
                <Input {...getInputProps()} />
                <Text>Drag & drop an image, or click to select one</Text>
            </Box>
        </VStack>
    );
};