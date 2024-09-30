import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Select,
    HStack,
    VStack,
    Image,
    Text
} from '@chakra-ui/react';
import { useAbout } from '../../contexts/About';
import { UploadImage } from '../uploads/Photo';
import { UploadVideo } from '../uploads/MP4';

const AboutForm = ({ onClose, selectedSection }) => {
    const { updateSection, addSection, deleteSection } = useAbout();

    const [formState, setFormState] = useState({
        blockType: 'text',
        text: {
            header: '',
            body: ''
        }
    });

    const [previousHref, setPreviousHref] = useState(null);
    const [fileUrl, setFileUrl] = useState('');

    useEffect(() => {
        function populateForm() {
            if (selectedSection) {
                if (selectedSection.blockType === 'spacer') {
                    const stringWithPx = "230px";
                    const numberValue = parseInt(stringWithPx, 10);
                    selectedSection.spacerSize = numberValue;
                }
                setFormState(selectedSection);
                setPreviousHref(selectedSection.image || selectedSection.video);
                if (selectedSection.image || selectedSection.video) {
                    setFileUrl(selectedSection.image || selectedSection.video);
                }

            }
        }

        populateForm();
    }, [selectedSection]);

    const handleTextChange = (field, value) => {
        const updatedFormState = {
            ...formState,
            text: {
                ...formState.text,
                [field]: value,
            },
        };
        setFormState(updatedFormState);
    };

    const handleSpacerChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    }

    const handleLinkUpload = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value , isLink:true})
        setFileUrl(e.target.value)
    }

    const handleTypeToggle = (blockType) => {
        let newState;
        if (blockType === 'text') {
            newState = { blockType: 'text', text: { header: '', body: '' } };
        } else if (blockType === 'image') {
            newState = { blockType: 'image', image: null };
        } else if (blockType === 'video') {
            newState = { blockType: 'video', video: null };
        } else if (blockType === 'spacer') {
            newState = { blockType: 'spacer', spacerSize: '350' };
        } else { return }
        setFormState(newState);
        setFileUrl('');
    };

    const handleSubmit = () => {
        if (formState.blockType === 'spacer') {
            formState.spacerSize = formState.spacerSize + 'px'
        }
        if (selectedSection) {
            updateSection(selectedSection._id, formState, previousHref);
        } else {
            addSection(formState);
        }
        onClose();
    };

    const handleDelete = async () => {
        deleteSection(selectedSection._id);
        onClose();
    }

    return (
        <VStack align='center' p={5}>
            <Box width="100%">
                <FormControl mb={4}>
                    <FormLabel>Upload Type</FormLabel>
                    <Select
                        value={formState.blockType}
                        onChange={(e) => handleTypeToggle(e.target.value)}
                    >
                        <option value="text">Text</option>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                        <option value="spacer">Spacer</option>
                    </Select>
                </FormControl>

                {formState.blockType === 'text' && (
                    <>
                        <FormControl mb={4}>
                            <FormLabel>Header</FormLabel>
                            <Input
                                value={formState.text.header}
                                onChange={(e) => handleTextChange('header', e.target.value)}
                            />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Body</FormLabel>
                            <Textarea
                                value={formState.text.body}
                                onChange={(e) => handleTextChange('body', e.target.value)}
                            />
                        </FormControl>
                    </>
                )}

                {formState.blockType === 'image' && (
                    <FormControl mb={4}>
                        <FormLabel>Image</FormLabel>
                        <UploadImage
                            setParentForm={setFormState}
                            setImageUrl={setFileUrl}
                        />
                        {formState.image || fileUrl ? <Image pt='15px' src={fileUrl || formState.image} boxSize="200px" objectFit='cover' /> : <Text pt="15px">Upload an Image Below</Text>}
                    </FormControl>
                )}

                {formState.blockType === 'video' && (
                    <>
                        <FormControl mb={4}>
                            <FormLabel>Video URL</FormLabel>
                            <UploadVideo
                                setParentForm={setFormState}
                                setVideoUrl={setFileUrl}
                            />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Or Upload a Link</FormLabel>
                            <Textarea
                                name='video'
                                value={ typeof formState.video === 'string' ? formState.video : 'upload link'}
                                onChange={(e) => handleLinkUpload(e)}
                            />
                        </FormControl>
                        {formState.video || fileUrl ? <Text pt='10px' fontSize='14px'>Video: { fileUrl || formState.video}</Text> : <Text pt="15px">Upload a Video Below</Text>}
                    </>
                )}



                {formState.blockType === 'spacer' && (
                    <FormControl mb={4}>
                        <FormControl mb={4}>
                            <FormLabel>Spacer Width</FormLabel>
                            <Input
                                type='number'
                                step={1}
                                min='50px'
                                max='600px'
                                name='spacerSize'
                                value={formState.spacerSize}
                                onChange={handleSpacerChange}
                            />
                        </FormControl>
                    </FormControl>
                )}
            </Box>
            <HStack flex={1} spacing={4}>
                <Button colorScheme="green" onClick={handleSubmit}>Submit</Button>
                <Button colorScheme="gray" onClick={onClose}>Cancel</Button>
                {selectedSection && <Button colorScheme="red" onClick={handleDelete}>Delete</Button>}
            </HStack>
        </VStack>
    );
};

export default AboutForm;
