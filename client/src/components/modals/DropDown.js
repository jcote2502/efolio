import React from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';

const ExperienceDrop = ({ experience }) => {
    
    const handleSubmit = () => {
        return (null)
    }

    return (
        <Box mt={4} w="100%" borderTop="1px solid #ccc" pt={4}>
            <VStack color='white' spacing={3} align="start">
                <Text><strong>Start Date:</strong> {experience.startDate}</Text>
                <Text><strong>End Date:</strong> {experience.stillEmployed ? 'Present' : experience.stopDate}</Text>
                <Text><strong>Location:</strong> {experience.location}</Text>
                <Text><strong>Duration:</strong> {experience.duration}</Text>
                <Text><strong>Description:</strong> {experience.description}</Text>
                {/* Display skills, images, links */}
                <Text><strong>Skills:</strong> {experience.skills.join(', ')}</Text>
                {experience.images.length > 0 && (
                    <Text><strong>Images:</strong> {experience.images.join(', ')}</Text>
                )}
                {experience.links.length > 0 && (
                    <Text><strong>Links:</strong> {experience.links.join(', ')}</Text>
                )}
            </VStack>
        </Box>
    );
};

export default ExperienceDrop;
