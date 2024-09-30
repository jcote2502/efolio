import React, { useState } from 'react';
import { Box, Button, VStack, Text, Input } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { useDownloads } from '../../contexts/Downloads';

// New component for uploading PDFs
export const UploadPDF = ({onClose, isAdd}) => {
    const { addResume , updateResume} = useDownloads();
    const [pdf, setPdf] = useState(null);

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
    const handleSubmit = async () => {
        if (!pdf) {
            alert('Please upload a PDF.');
            return;
        }

        if (isAdd){
            await addResume(pdf);
        }else{
            await updateResume(pdf);
        }
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
