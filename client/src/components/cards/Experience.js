import React, { useState, useEffect } from 'react';
import { Box, Text, Image, VStack, HStack, Spinner } from '@chakra-ui/react';

const ExperienceCard = ({ idx, experience, isAdmin = false, onClick }) => {
    const {
        title, company, image,
        description, duration,
        startDate, stopDate, skills,
        stillEmployed, location
    } = experience;

    const [contentOpacity, setContentOpacity] = useState(0);
    const [imageLoading, setImageLoading] = useState(true);

    const idxIsOdd = () => idx % 2 !== 0;

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const contentElement = document.getElementById(`content-${idx}`);

            if (contentElement) {
                const { top } = contentElement.getBoundingClientRect();
                const newOpacity = Math.max(0, Math.min(1, (windowHeight - top) / windowHeight));
                setContentOpacity(newOpacity);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [idx]);

    const renderContent = () => (
        <VStack
            py='10%'
            paddingLeft='6%'
            paddingRight='3%'
            borderRadius='50%'
            bg='wheat'
            id={`content-${idx}`}
            letterSpacing="1.25px"
            justifyContent='space-between'
            fontFamily='navbar'
            align="center"
            justify='center'
            color='appColors.greyGoose'
            w="50%"
            h='100%'
            boxShadow='0px 0px 30px white'
            style={{ opacity: isAdmin ? 1 : contentOpacity, transition: 'opacity 0.2s ease' }} // Apply opacity effect
        >
            <VStack align='start' w='100%' m='10px'>
                <Text fontFamily='heading' fontSize="36px" fontWeight="bold">{title}</Text>
                <Text fontSize="28px">{company}</Text>
                <Text fontSize="lg">{location}</Text>

                <Text fontSize="sm">{duration}  :  {new Date(startDate).toLocaleDateString()} - {stillEmployed ? 'Currently Employed' : new Date(stopDate).toLocaleDateString()}</Text>
                <Text fontSize="md">{description}</Text>

                {skills.length > 0 && (
                    <Text fontSize="sm">Skills: {skills.join(', ')}</Text>
                )}
            </VStack>
        </VStack>
    );

    const renderImage = () => (

        <VStack
            boxSize='50%'
            position='relative'
            h='100%'
            justify='center'
            align='center'
        >

            {
                imageLoading ?
                    <Box
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                    >
                        <Spinner size="xl" />
                    </Box>
                    : null
            }
            <Image
                src={image}
                objectFit="cover"
                w="100%"
                maxH='425px'
                borderRadius='15px'
                onLoad={() => setImageLoading(false)}
                px='5px'
                boxShadow='0px 15px 25px black'
                style={{ opacity: isAdmin ? 1 : contentOpacity, transition: 'opacity 0.2s ease' }}
            />
        </VStack>

    );

    return (
        <HStack cursor={isAdmin && 'pointer'} w='120%' mb="85px" spacing={10} align="center" justify='space-between' onClick={() => onClick()}>
            {/* Details Section */}
            {idxIsOdd() ? renderContent() : null}
            {/* Carousel Object */}
            {renderImage()}
            {/* Details Section */}
            {idxIsOdd() ? null : renderContent()}
        </HStack>
    );
};

export default ExperienceCard;
