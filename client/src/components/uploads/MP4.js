import React from 'react';
import { Box, VStack, Text, Input } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';

export const UploadVideo = ({ setParentForm, setVideoUrl }) => {
    // Handle file drop for videos
    const handleDocumentDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file && file.type.startsWith('video/')) {
            setParentForm((prev) => ({ ...prev, video: file , isLink:false }));
            const url = URL.createObjectURL(file);
            setVideoUrl(url);
        } else {
            alert('Please upload a valid video file.');
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDocumentDrop,
        accept: 'video/*', // Accept video files
        multiple: false,
    });

    return (
        <VStack spacing={6} mt={6}>
            <Box {...getRootProps()} border="2px dashed #ccc" p={6} borderRadius="md" cursor="pointer">
                <Input {...getInputProps()} />
                <Text>Drag & drop a video, or click to select one</Text>
            </Box>
        </VStack>
    );
};
