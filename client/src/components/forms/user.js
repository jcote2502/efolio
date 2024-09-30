// User.js
import React, { useState, useEffect } from 'react';
import { Input, VStack, HStack, FormControl, FormLabel, Button } from '@chakra-ui/react';
import { useAuth } from '../../contexts/Auth';
export const ProfileForm = ({ onClose }) => {
    const { user, updateProfileInfo } = useAuth();

    const [profileData, setProfileData] = useState({
        fname: user?.fname || '',
        lname: user?.lname || '',
        phone: user?.phone || '',
        location: user?.location || '',
        title: user?.title || '',
    });

    useEffect(() => {
        setProfileData({
            fname: user?.fname || '',
            lname: user?.lname || '',
            phone: user?.phone || '',
            location: user?.location || '',
            title: user?.title || '',
        });
    }, [user]);

    // Handle Profile Info Change
    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    // Submit Profile Info Update
    const handleProfileUpdate = async () => {
        await updateProfileInfo(profileData)
        onClose(profileData)
    };

    return (
        <VStack spacing={4} p={5}>
            <Input
                placeholder="First Name"
                name="fname"
                value={profileData.fname}
                onChange={handleProfileChange}
            />
            <Input
                placeholder="Last Name"
                name="lname"
                value={profileData.lname}
                onChange={handleProfileChange}
            />
            <Input
                placeholder="Phone"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
            />
            <Input
                placeholder="Location"
                name="location"
                value={profileData.location}
                onChange={handleProfileChange}
            />
            <Input
                placeholder="Title"
                name="title"
                value={profileData.title}
                onChange={handleProfileChange}
            />

            <HStack flex={1} spacing={4}>
                <Button colorScheme="green" onClick={handleProfileUpdate}>Update Profile</Button>
                <Button bgColor='appColors.greyGoose' color='white' onClick={onClose}>Cancel</Button>
            </HStack>
        </VStack>
    );
};

export const SensitiveForm = ({ onClose, type }) => {
    const { updatePassword, updateEmail } = useAuth();

    const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
    const [emailForm, setEmailForm] = useState({ newEmail: '', password: '' });

    // Handle Form Changes
    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    };

    const handleEmailChange = (e) => {
        setEmailForm({ ...emailForm, [e.target.name]: e.target.value });
    };

    // Submit Password Update
    const handlePasswordUpdate = async () => {
        await updatePassword(passwordForm.oldPassword, passwordForm.newPassword);
        onClose();
    };

    // Submit Email Update
    const handleEmailUpdate = async () => {
        await updateEmail(emailForm.newEmail, emailForm.password);
        onClose();
    };

    return (
        <VStack spacing={4} p={5}>

            <FormControl>
                <FormLabel>{type === 'password' ? "Old Password" : "New Email"}</FormLabel>
                <Input
                    name={type === 'password' ? "oldPassword" : 'newEmail'}
                    type={type === 'password' ? "password" : 'email'}
                    value={type === 'password' ? passwordForm.oldPassword : emailForm.newEmail}
                    onChange={type === 'password' ? handlePasswordChange : handleEmailChange}
                    placeholder={type === 'password' ? "Enter old password" : "Enter new email"}
                />
            </FormControl>
            <FormControl mt={3}>
                <FormLabel>{type === 'password' ? "New Password" : "Password"}</FormLabel>
                <Input
                    name={type === 'password' ? "newPassword" : "password"}
                    type="password"
                    value={type === 'password' ? passwordForm.newPassword : emailForm.password}
                    onChange={type === 'password' ? handlePasswordChange : handleEmailChange}
                    placeholder={type === 'password' ? "Enter new password" : "Enter your password"}
                />
            </FormControl>
            <HStack flex={1} spacing={4}>
                <Button
                    colorScheme="green"
                    onClick={type === 'password' ? handlePasswordUpdate : handleEmailUpdate}
                >Update Profile</Button>
                <Button bgColor='appColors.greyGoose' color='white' onClick={onClose}>Cancel</Button>
            </HStack>
        </VStack>
    )
}
