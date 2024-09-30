import React, { useState } from 'react';
import { HStack, Text, useDisclosure, VStack } from "@chakra-ui/react";
import PageFrame, { PageButton } from '../components/Frame';
import { useAbout } from '../contexts/About';
import EditModal from '../components/modals/EditModal';
import { AboutSectionCard } from '../components/cards/About';
import AboutForm from '../components/forms/about';

export const About = () => {

    const { about } = useAbout();

    return (
        <PageFrame>
            {
                about && about.length > 0 ?
                    <VStack align="center" w="100%" mt={6}>
                        <HStack wrap="wrap" align='center' spacing={5} justify="space-evenly" w='100%'>
                            {about.map((section, index) => (
                                <AboutSectionCard
                                    item={section}
                                    key={section._id}
                                    index={index}
                                />
                            ))}
                        </HStack>
                    </VStack>
                    :
                    <Text>Add a Section</Text>
            }
        </PageFrame>
    )
}

export const AdminAbout = () => {

    const { about } = useAbout();

    const [selectedSection, setSelectedSection] = useState(null);

    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

    const handleModalClose = () => {
        onModalClose();
        setSelectedSection(null);
    }

    const handleSelectSection = (item) => {
        setSelectedSection(item);
        onModalOpen();
    }
    return (
        <PageFrame isAdmin={true}>
            <PageButton onClick={onModalOpen}>Add Section</PageButton>

            {
                about && about.length > 0 ?
                    <VStack align="center" w="100%" mt={6}>
                        <Text textAlign='center' mb='60px' mt='60px' fontSize='80px' w='100%'>About Sections</Text>
                        <HStack wrap="wrap" align='center' spacing={5} justify="space-evenly" w='100%'>
                            {about.map((section) => (
                                <AboutSectionCard
                                    item={section}
                                    key={section._id}
                                    isAdmin={true}
                                    onClick={() => handleSelectSection(section)}
                                />
                            ))}
                        </HStack>
                    </VStack>
                    :
                    <Text>Add a Section</Text>
            }


            <EditModal
                title="About Section"
                isOpen={isModalOpen}
                onClose={handleModalClose}
                isAdd={selectedSection ? false : true}
            >
                <AboutForm onClose={handleModalClose} selectedSection={selectedSection} />
            </EditModal>
        </PageFrame>
    )
}