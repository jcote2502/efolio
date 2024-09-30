import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";

const EditModal = ({ title, isOpen, onClose, children, isAdd = false }) => {
    let label = 'Edit';
    if(isAdd){
        label = 'Add';
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent maxH='82vh' color='appColors.matteBlack' bg='appColors.coffeeCream'>
                <ModalHeader>{label} {title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody overflowY='scroll'>
                    {children}
                </ModalBody>
            </ModalContent>

        </Modal>
    )
}

export default EditModal;