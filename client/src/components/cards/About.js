import React, { useEffect, useState } from 'react';
import { Box, Text, Image, VStack } from "@chakra-ui/react";
import YouTube from 'react-youtube';


export const AboutSectionCard = ({ index, item, isAdmin, onClick = () => { } }) => {
    const [videoId, setVideoId] = useState('');
    const [contentOpacity, setContentOpacity] = useState(0);


    useEffect(() => {
        function embed() {
            if (item.isLink) {
                const videoId = item.video.split('v=')[1];
                setVideoId(videoId);
            }
        }
        embed();
    }, [item.isLink, item.video])

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const contentElement = document.getElementById(`content-${index}`);

            if (contentElement) {
                const { top } = contentElement.getBoundingClientRect();
                const newOpacity = Math.max(0, Math.min(1, (windowHeight - top) / windowHeight));
                setContentOpacity(newOpacity);
            }

        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [index]);


    const opts = {
        height: '390',
        width: '640',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0, // Set to 1 to autoplay the video
        },
    };

    const renderItem = () => {
        if (item.blockType === 'text') {
            return (
                <VStack maxW='400px'
                    id={`content-${index}`}
                    justify='space-around'
                    style={{ opacity: isAdmin ? 1 : contentOpacity, transition: 'opacity 0.2s ease' }}
                >
                    {item.text.header && <Text fontSize='48px' color={isAdmin ? 'white' : 'appColors.matteBlack'}>{item.text.header}</Text>}
                    {item.text.body && <Text fontSize='24px' color={isAdmin ? 'white' : 'appColors.barelyGrey'}>{item.text.body}</Text>}
                </VStack>)
        }
        else if (item.blockType === 'image') {
            return (item.image && <Image borderRadius='20px' objectFit='contain' maxH='600px' minH='50px' maxW='600px' minW='250px' src={item.image} alt={item._id} />)
        }
        else if (item.blockType === 'video') {
            return (
                item.video && item.isLink ?
                    !isAdmin ?
                        <YouTube videoId={videoId} opts={opts} />
                        :
                        <Text h='75px' fontSize='32px'>URL Video Upload will appear on ViewerPage</Text>
                    :
                    <video controls style={{
                        borderRadius: '8px',
                        boxShadow: '0px 15px 15px black',
                        maxHeight: '400px', minHeight: '50px', maxWidth: '600px', minWidth: '250px'
                    }}>
                        <source src={item.video} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>)
        }
        else if (item.blockType === 'spacer') {
            return (
                <Box alignContent='center' h='100%' w={item.spacerSize}>
                    {isAdmin && <Text fontSize='20px' w='100%' textAlign='center'>Spacer Width : {item.spacerSize}px</Text>}
                </Box>
            )
        }
    }

    return (
        <VStack
            textAlign="center"
            py={{ base: '10px', md: "25px" }}
            cursor={isAdmin && 'pointer'} onClick={onClick}
        >
            {renderItem()}
        </VStack>
    )
}
