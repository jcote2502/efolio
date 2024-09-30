import React, { useState } from 'react';
import {
    Box,
    Image,
    VStack,
    HStack,
    Text,
    Link as ChakraLink,
    Divider,
    Spinner,
    useDisclosure,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { PageButton } from '../Frame';
import { ProjectSectionForm } from '../forms/project';
import EditModal from '../modals/EditModal';

export const ProjectCard = ({ project, onClick = () => { } }) => {

    const { image, title, shortSummary } = project;

    return (
        <VStack pt='20px' p='25px' position='relative' onClick={onClick} cursor='pointer'>
            <Image borderRadius='lg' boxShadow='2xl'
                src={image} alt={title} boxSize="265px" objectFit="cover" position='absolute' top='-10px' zIndex='2' />
            <VStack
                color="appColors.matteBlack"
                height="375px"
                key={project._id}
                borderWidth="1.5px"
                borderColor="appColors.matteBlack"
                borderRadius="lg" overflow="hidden"
                p="4" width="300px"
                justifyContent='flex-end'
                align='start'
                bg='black'
                opacity='.1'
                boxShadow='md'
                _hover={{ boxShadow: "2xl" }}
            />
            <Text w='280px' position='absolute' mt="1" bottom='80px' color="appColors.greyGoose" fontSize="18">
                {shortSummary}
            </Text>

            <Text position='absolute' mt="2" left='10%' bottom='7%' fontSize="xl" fontWeight="semibold">
                {title}
            </Text>

        </VStack>

    )

}

export const FeaturedProjectCard = ({ project, onClick = () => { } }) => {
    const { image, title, shortSummary } = project;

    return (
        <VStack position='relative'
            onClick={onClick} cursor='pointer'
            height="350px"
            key={project._id}
            overflow="hidden"
            py="25px" px='30px' m="10px"
            h='550px'
        >
            <Box bg='rgb(24, 24, 24)' w="325px" h='600px' borderRadius="17px" borderWidth="1px"
            />
            <Image pos='absolute' top='0px' src={image} alt={title} boxSize='250px' borderRadius='25px' left='50px' boxShadow='2xl' objectFit="cover" />
            <StarIcon position='absolute' right='15%' top='2%' boxSize='68px' ml='10px' boxShadow='2xl' mb='15px' color="yellow.400" />
            <VStack align='start' pos='absolute' bottom='0px' w='70%' h='55%' pb='30px' justify='space-around'>
                <Text textAlign='left' fontSize="4xl" fontWeight="semibold">
                    {title}
                </Text>
                <Text color="gray.500" fontSize="2xl">
                    {shortSummary}
                </Text>
            </VStack>
        </VStack>
    )
}

export const ProjectHeader = ({ project }) => {
    const {
        title,
        subtitle,
        associatedCompany,
        location,
        image,
        featured,
        startDate,
        duration,
        currentlyWorking,
        skills,
        links,
        summary,
        endDate,
    } = project;

    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <VStack
            overflow="hidden"
            p={5}
            color="white"
            w='100%'
        >
            {/* First row: image + Title, Subtitle, Associated Company */}
            <HStack wrap='wrap' mb={4} w='100%' align='stretch' justifyContent='space-evenly'>
                {/* image (left) */}
                <Box flexShrink={0} mr={{ base: 0, md: 4 }}>
                    <Image
                        src={image}
                        alt={title}
                        borderRadius="md"
                        objectFit="cover"
                        boxSize="350px"
                        onLoad={() => setIsLoaded(true)}
                    />
                </Box>
                {!isLoaded && <Spinner boxSize='350px' />}
                {/* Project details (right) */}
                <VStack paddingTop='35px' align="start" spacing={2}>
                    <HStack>
                        {/* Title with optional featured star */}
                        <Text fontSize="48px" fontWeight="bold">
                            {title}
                        </Text>
                        {featured && <StarIcon boxSize='25px' ml='10px' mb='15px' color="yellow.400" />}
                    </HStack>

                    {/* Subtitle */}
                    {subtitle && (
                        <Text fontFamily='body' fontStyle='italic' fontSize="36px" color="gray.300">
                            {subtitle}
                        </Text>
                    )}

                    {/* Associated company */}
                    {associatedCompany && (
                        <Text fontFamily='body' fontSize="36px" color="gray.500">
                            {associatedCompany}
                        </Text>
                    )}
                </VStack>
            </HStack>

            {/* Divider between the two sections */}
            <Divider my={4} />

            {/* Second row: Location, Dates, Skills, Links, Summary */}
            <HStack w='100%' align='stretch' justify='space-evenly'>
                {/* Left side: Location, Dates, Skills, Links */}
                <VStack justify='center' align="start" spacing={2} >
                    {/* Location */}
                    {location && (
                        <Text fontSize="28px" fontWeight="semibold">
                            {location}
                        </Text>
                    )}

                    {/* Duration: Start Date - End Date */}
                    <HStack>
                        <Text fontSize="24px">
                            {duration} :
                        </Text>
                        <Text fontSize="24px">
                            {new Date(startDate).toLocaleDateString()} - {currentlyWorking ? 'Current' : new Date(endDate).toLocaleDateString()}
                        </Text>
                    </HStack>

                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <Text fontSize="22px" color="appColors.pastelYellow">
                            Skills: {skills.join(', ')}
                        </Text>
                    )}

                    {/* Links */}
                    {links && links.length > 0 && (
                        <HStack spacing={2}>
                            {links.map((link, idx) => (
                                <ChakraLink
                                    key={idx}
                                    href={link}
                                    isExternal
                                    color="appColors.coffeeCream"
                                    fontSize="md"
                                >
                                    {link}
                                </ChakraLink>
                            ))}
                        </HStack>
                    )}
                </VStack>

                {/* Right side: Summary */}
                <VStack align="start" spacing={2} w='45%'>
                    {summary && (
                        <Text fontSize="md" color="gray.300">
                            {summary}
                        </Text>
                    )}
                </VStack>
            </HStack>

            <Divider my={4} />

        </VStack>
    );
}

export const ProjectBody = ({ sections, isAdmin, project }) => {


    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
    const [section, setSection] = useState(null);

    const handleModalClose = () => {
        onModalClose();
        // might need to fetch project again
    }

    const handleModalOpen = (section) => {
        setSection(section);
        onModalOpen();
    }

    if (!sections || sections.length === 0) {
        return <Text>No sections available.</Text>;
    }

    function isOdd(num) {
        return num % 2 !== 0;
    }

    const IFrame = ({ src }) => (
        <Image maxW='550' alignSelf='center' objectFit='cover' m='20px' borderRadius='15px' maxH='650px' src={src} alt={src} />
    )
    return (
        <VStack spacing={6}>
            {sections.map((section, index) => (
                <VStack key={index} spacing={3} w='100%'>
                    <HStack alignItems='stretch' justify='center' w='100%'>
                        {isOdd(index) && section.image && <IFrame src={section.image} />}
                        {section.body || section.header ? <VStack w='100%' align='left'>
                            <Text
                                fontFamily={section.body ? 'heading' : 'monospace'}
                                fontSize={section.body ? '38px' : '48px'}
                                textAlign={section.body ? 'left' : 'center'}
                                fontWeight={section.body ? 'normal' : 'bold'}
                                color={section.body ? 'appColors.canaryYellow' : 'appColors.coffeeCream'}
                            >
                                {section.header}
                            </Text>
                            <Text fontSize='22px' ml='25px' w='100%' color='appColors.coffeeCream'>
                                {section.body}
                            </Text>
                        </VStack> : null}
                        {!isOdd(index) && section.image && <IFrame src={section.image} />}
                    </HStack>
                    {isAdmin && <PageButton onClick={() => handleModalOpen(section)}>Edit Section</PageButton>}
                </VStack>
            ))}
            {isAdmin &&
                < EditModal
                    title="Section"
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    isAdd={false}
                >
                    <ProjectSectionForm onClose={handleModalClose} _id={project._id} selectedSection={section} />
                </EditModal>
            }
        </VStack >
    );
}