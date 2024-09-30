import { Box, Text, useDisclosure } from "@chakra-ui/react";
import { ProjectBody, ProjectHeader } from "../components/cards/Project";
import PageFrame, { PageButton } from "../components/Frame";
import { useProject } from "../contexts/Project"
import EditModal from "../components/modals/EditModal";
import { EditProjectHeaderForm, ProjectSectionForm } from "../components/forms/project";
import { useEffect } from "react";



export const ProjectPage = () => {
    const { project } = useProject();

    useEffect(()=>{
        // need to fetch project by id from header
    })

    return (
        <PageFrame>
            {
                project ?
                    <>
                        <ProjectHeader project={project} />
                        <ProjectBody sections={project.sections} />
                    </>
                    :
                    <Text> Oops! Couldn't find this project.</Text>
            }
        </PageFrame>
    )
}

export const AdminProject = () => {
    const { project } = useProject();

    const { isOpen: isHeaderModalOpen, onOpen: onHeaderModalOpen, onClose: onHeaderModalClose } = useDisclosure();
    const { isOpen: isBodyModalOpen, onOpen: onBodyModalOpen, onClose: onBodyModalClose } = useDisclosure();

    const handleHeaderModalClose = () => {
        onHeaderModalClose();
        // might need to fetch project again
    }

    const handleBodyModalClose = () => {
        onBodyModalClose();
        // might need to fetch project again
    }

    return (
        <PageFrame isAdmin={true}>
            {
                project ?
                    <>
                        <ProjectHeader project={project} />
                        <PageButton onClick={onHeaderModalOpen}>Edit Info</PageButton>
                        <Box h='30px'/>
                        <Text m='20px' fontSize='48px' fontFamily='monospace' color='appColors.coffeeCream'>Body Sections</Text>
                        <PageButton onClick={onBodyModalOpen}>Add Section</PageButton>
                        <Box h='30px'/>
                        <ProjectBody sections={project.sections} project={project} isAdmin={true}/>
                    </>
                    :
                    <Text> Oops! Couldn't find this project.</Text>

            }
            <EditModal
                title="Information"
                isOpen={isHeaderModalOpen}
                onClose={handleHeaderModalClose}
                isAdd={false}
            >
                <EditProjectHeaderForm onClose={handleHeaderModalClose}/>
            </EditModal>
            <EditModal
                title="Section"
                isOpen={isBodyModalOpen}
                onClose={handleBodyModalClose}
                isAdd={true}
            >
                <ProjectSectionForm onClose={handleBodyModalClose} _id={project._id}/>
            </EditModal>
        </PageFrame>
    )
}