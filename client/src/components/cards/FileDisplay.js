import React, { useState } from 'react';
import { Box, Button, VStack, Text, Input, Image } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../contexts/Auth';
export const UploadImage = () => {
    const { updateProfileFiles } = useAuth(); // Get the update function from context
    const [document, setDocument] = useState(null);
    const [imageUrl, setImageUrl] = useState(null); // State to store the image URL for display
    const field = 'banner'; // The field you want to update

    // Handle file drop for images
    const handleDocumentDrop = (acceptedFiles) => {
        setDocument(acceptedFiles[0]);
        const url = URL.createObjectURL(acceptedFiles[0]); // Create a URL for the uploaded image
        setImageUrl(url); // Store the URL for display
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDocumentDrop,
        accept: 'image/*', // Accept image files
        multiple: false,
    });

    // Handle form submission for image upload
    const handleSubmit = () => {
        if (!document) {
            alert('Please upload an image.');
            return;
        }

        // Call the updateProfileFiles function from context
        updateProfileFiles(document, field);
    };

    return (
        <VStack spacing={6} mt={6}>
            <Box {...getRootProps()} border="2px dashed #ccc" p={6} borderRadius="md" cursor="pointer">
                <Input {...getInputProps()} />
                {document ? (
                    <>
                        <Text>Uploaded Image: {document.name}</Text>
                        {imageUrl && <Image src={imageUrl} alt="Uploaded Preview" mt={4} />} {/* Display uploaded image */}
                    </>
                ) : (
                    <Text>Drag & drop an image, or click to select one</Text>
                )}
            </Box>

            <Button onClick={handleSubmit} colorScheme="blue">
                Submit
            </Button>
        </VStack>
    );
};

// New component for uploading PDFs
export const UploadPDF = () => {
    const { updateProfileFiles } = useAuth(); // Get the update function from context
    const [pdf, setPdf] = useState(null);
    const field = 'resume'; // The field you want to update for PDF

    // Handle file drop for PDFs
    const handlePdfDrop = (acceptedFiles) => {
        setPdf(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handlePdfDrop,
        accept: 'application/pdf', // Accept PDF files
        multiple: false,
    });

    // Handle form submission for PDF upload
    const handleSubmit = () => {
        if (!pdf) {
            alert('Please upload a PDF.');
            return;
        }

        // Call the updateProfileFiles function from context
        updateProfileFiles(pdf, field);
    };

    return (
        <VStack spacing={6} mt={6}>
            <Box {...getRootProps()} border="2px dashed #ccc" p={6} borderRadius="md" cursor="pointer">
                <Input {...getInputProps()} />
                {pdf ? (
                    <Text>Uploaded PDF: {pdf.name}</Text>
                ) : (
                    <Text>Drag & drop a PDF, or click to select one</Text>
                )}
            </Box>

            <Button onClick={handleSubmit} colorScheme="blue">
                Submit
            </Button>
        </VStack>
    );
};
