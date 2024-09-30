import { Image, VStack, HStack, Text, Box, Spinner } from "@chakra-ui/react";
import { useState } from "react";

// displays image without link attached different onClick 
export const LinkDisplay = ({ item, index, onClick, isDisplay }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const icons = {
        "LinkedIn": `${process.env.PUBLIC_URL}/assets/images/links/linkedin.png`,
        "Youtube": `${process.env.PUBLIC_URL}/assets/images/links/youtube.png`,
        "Github": `${process.env.PUBLIC_URL}/assets/images/links/github.png`,
        'Instagram': `${process.env.PUBLIC_URL}/assets/images/links/instagram.png`,
        "X": `${process.env.PUBLIC_URL}/assets/images/links/x.png`,
        'TikTok': `${process.env.PUBLIC_URL}/assets/images/links/tiktok.png`,
        'Spotify': `${process.env.PUBLIC_URL}/assets/images/links/spotify.png`,
        'other': `${process.env.PUBLIC_URL}/assets/images/links/chain.png`
    }

    const handleLoaded = () => {
        setIsLoading(false);
    }

    const src = icons[item.platform]
    const color = () => (isDisplay ? "yellow.500" : "white")
    return (
        <HStack>

            <VStack h='83px' w='83px' position='relative' overflowX='scroll'>
                <HStack
                    bg={isHovered ? color : 'transparent'}
                    position='absolute'
                    minW='83px'
                    maxW='83px'
                    h='100%'
                    zIndex='5'
                    borderRadius='50%'
                />
                <Image
                    position='absolute'
                    minW='75px'
                    boxSize='75px'
                    top='4px'
                    cursor='pointer'
                    objectFit='cover'
                    borderRadius='50%'
                    key={index}
                    src={src}
                    onLoad={handleLoaded}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => onClick()}
                    zIndex='6'
                />
            </VStack>
            {isDisplay && <Text fontFamily='navbar' color='appColors.greyGoose' fontSize='16px' >@{item.siteHandle}</Text>}
            {isLoading && <Box
                position="absolute"
                w='83px'
                h='83px'
            >
                <Spinner position='absolute' left='36%' top='36%'  size="md" />
            </Box>}
        </HStack>



    )
}