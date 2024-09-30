import React, { useState } from "react";
import { VStack, Wrap, Text, Box, useDisclosure } from "@chakra-ui/react";
import ExperienceCard from "../components/cards/Experience";
import PageFrame, { PageButton } from "../components/Frame";
import { useExperience } from "../contexts/Experience";
import EditModal from "../components/modals/EditModal";
import ExperienceForm from "../components/forms/experience";

export const Experiences = () => {
    const { experiences } = useExperience();
    


    return (
        <PageFrame>
            {experiences.length > 0 ?
                <VStack align="center" w="100%" mt={6}>
                    {/* Wrap allows for responsive layout */}
                    <Text mb='60px' fontSize='80px' w='100%'>Work Experience</Text>
                    <Wrap position='relative' justify="center" w="115%">
                        {experiences.map((exp, idx) => (
                            <ExperienceCard
                                key={idx}
                                idx={idx}
                                experience={exp}
                                onClick={()=> {}}
                            />
                        ))}
                    </Wrap>
                </VStack> :


                // No experiences exist display
                <Box height='40vh' alignContent='center'>
                                <Text>Seems like the admin hasn't set any experiences. Come back at later time!</Text>

                </Box>
}
        </PageFrame>
    );
};

export const AdminExperiences = () => {

    const { experiences } = useExperience();


    const [selectedExperience, setSelectedExperience] = useState(null);

    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

    const handleModalClose = () => {
        onModalClose();
        setSelectedExperience(null);
    }

    const handleSelectExperience = (item) => {
        setSelectedExperience(item);
        onModalOpen();
    }

    return (
        <PageFrame isAdmin={true}>
            <VStack align="center" w="80%" mt={6}>
                <Text mb='60px' fontSize='80px' w='100%'>Work Experience</Text>
                <PageButton onClick={onModalOpen}>Add Experience</PageButton>
                <Wrap position='relative' justify="center" w="120%">
                    {experiences.map((exp, idx) => (
                        <ExperienceCard
                            key={idx}
                            idx={idx}
                            experience={exp}
                            isAdmin={true}
                            onClick={() => handleSelectExperience(exp)}
                        />
                    ))}
                </Wrap>
            </VStack>

            <EditModal
                title="Experience"
                isOpen={isModalOpen}
                onClose={handleModalClose}
                isAdd={selectedExperience ? false : true}
            >
                <ExperienceForm onClose={handleModalClose} selectedExperience={selectedExperience} />
            </EditModal>
        </PageFrame>
    )
}
