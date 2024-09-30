import React, { useEffect, useState } from 'react';
import { Box, Text, Image, VStack, HStack, useDisclosure } from '@chakra-ui/react';
import { useProject } from '../contexts/Project';
import { renderLoading } from '../utils';
import AppCarousel from '../components/Carousel';
import PageFrame, { PageButton } from '../components/Frame';
import { FeaturedProjectCard, ProjectCard } from '../components/cards/Project';
import { useNavigate } from 'react-router-dom';
import EditModal from '../components/modals/EditModal';
import { AddProjectForm } from '../components/forms/project';


export const Projects = () => {
    const [loading, setLoading] = useState(true);
    const { projects, fetchProject } = useProject();
    const [featuredProjects, setFeaturedProjects] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (projects) {
            const features = projects.filter(project => project.featured === true);
            setFeaturedProjects(features);
            setLoading(false);
        }
    }, [projects]);

    async function handleNavigate(_id) {
        await fetchProject(_id);
        navigate(`/project/${_id}`);
    }

    const handleBannerLoad = () => {
        setIsLoaded(true);
    }

    const renderPage = () => (
        <>
            <Text w='100%' borderRadius='10px'
                p='10px' m='10px' ml='25px'
                fontSize='64px' fontWeight='bold'
                fontFamily='navbar'
                textShadow="20px 25px 20px black"
            >Featured Projects
            </Text>
            <VStack width="100%" mb="5" position='relative'>
                {/* Project Carousel */}
                <Box id='feature-banner'
                    zIndex='-3' h='780px' position='absolute' w='125%'
                    opacity='.6' transition="display .5s linear"
                    display={isLoaded ? 'flex' : 'none'}
                >
                    <Image onLoad={handleBannerLoad}
                        h='100%' w='100%' src={process.env.PUBLIC_URL + "/assets/images/background.jpg"}
                        backgroundSize="cover"
                    />
                </Box>
                <Box pt='35px' borderRadius='30px' w='120%'>
                    <AppCarousel isImages={false}>
                        {featuredProjects?.map((project) => (
                            <FeaturedProjectCard project={project} onClick={() => handleNavigate(project._id)} />
                        ))}
                    </AppCarousel>
                </Box>
                {/* Flex Wrap Row of Projects */}
                <VStack bg='appColors.coffeeCream' justifyContent="center">

                </VStack>
                <HStack mt='15px' w='125%' bg='appColors.coffeeCream' py='50px' wrap="wrap" justifyContent="center">
                    {projects.map((project) => (
                        <ProjectCard project={project} onClick={() => handleNavigate(project._id)} />
                    ))}
                </HStack>
            </VStack>
        </>

    )



    return (
        <PageFrame>
            {loading ? renderLoading() : renderPage()}
        </PageFrame>
    )
};


export const AdminProjects = () => {
    const { projects, fetchProject } = useProject();
    const navigate = useNavigate();

    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

    async function handleNavigate(_id) {
        // fetch project by id and store in context
        await fetchProject(_id);
        navigate(`/admin/project/${_id}`);
    }

    return (
        <PageFrame isAdmin={true}>
            <PageButton onClick={onModalOpen}>Add Project</PageButton>
            <HStack w='125%' bg='appColors.coffeeCream' py='50px' wrap="wrap" justifyContent="center" mt="10">
                {projects.map((project) => (
                    <ProjectCard project={project} onClick={() => handleNavigate(project._id)} />
                ))}
            </HStack>

            <EditModal
                title="Project"
                isOpen={isModalOpen}
                onClose={onModalClose}
                isAdd={true}
            >
                <AddProjectForm onClose={onModalClose} />
            </EditModal>

        </PageFrame>
    )
}