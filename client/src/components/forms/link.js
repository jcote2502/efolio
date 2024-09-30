import React, { useEffect, useState } from 'react';
import { Button, VStack, HStack, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import { useLink } from '../../contexts/Link';


const LinkForm = ({ onClose, selectedLink = null }) => {
    const { addLink, updateLink, deleteLink } = useLink();

    const [linkForm, setLinkForm] = useState({
        href: "",
        platform: "",
        siteHandle: "",
    });

    useEffect(() => {
        function setLinks() {
            if (selectedLink) {
                setLinkForm(selectedLink);
            }
        }
        setLinks();
    }, [selectedLink])

    const platforms = ['Youtube', 'LinkedIn', 'X', 'Instagram', 'TikTok', 'Spotify', 'Github', 'other']

    const handleSubmit = async () => {
        if (selectedLink) {
            await updateLink(linkForm)
        } else {
            await addLink(linkForm)
        }
        onClose();
    }

    const handleDelete = async () => {
        deleteLink(selectedLink._id)
        onClose();
    }

    const handleFormChange = (e) => {
        setLinkForm({ ...linkForm, [e.target.name]: e.target.value });
    };


    return (
        <VStack spacing={4} p={5}>
            <FormControl>
                <FormLabel>Platform Handle</FormLabel>
                <Input
                    name="siteHandle"
                    value={linkForm.siteHandle}
                    onChange={handleFormChange}
                    placeholder='Enter Handle'
                />
            </FormControl>
            <FormControl>
                <FormLabel>URL Address</FormLabel>
                <Input
                    name="href"
                    value={linkForm.href}
                    onChange={handleFormChange}
                    placeholder='Enter URL'
                />
            </FormControl>
            <FormControl>
                <FormLabel>Platform</FormLabel>
                <Select
                    placeholder='Select a Platform'
                    value={linkForm.platform}
                    onChange={handleFormChange}
                    name='platform'
                >
                    {platforms.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </Select>
            </FormControl>
            <HStack flex={1} spacing={4}>
                <Button colorScheme="green" onClick={() => handleSubmit()}>Submit</Button>
                <Button colorScheme="gray" onClick={() => onClose()}>Cancel</Button>
                {selectedLink ? <Button colorScheme="red" onClick={() => handleDelete()}>Delete</Button> : null}
            </HStack>
        </VStack>
    );

}

export default LinkForm;