import { useLocation, useNavigate } from "react-router-dom";
import { HStack, Button, Text, IconButton, VStack, Drawer, DrawerBody, DrawerOverlay, DrawerContent, DrawerHeader, DrawerCloseButton, useDisclosure } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useAuth } from "../contexts/Auth";
import { useDownloads } from "../contexts/Downloads";

const navPages = [
    { label: "Home", href: "/", special: true },
    { label: "Experience", href: "/experience" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
    { label: "About", href: "/about" },
    { label: "Resume", href: "/resume" },
];
const adminPages = [
    { label: "My Info", href: "/admin/my-info" },
    { label: "Experience", href: "/admin/experiences" },
    { label: "Projects", href: "/admin/projects" },
    { label: "About", href: "/admin/about" },
]
const contacts = [
    { platform: "L", href: '' },
    { platform: "I", href: '' },
    { platform: "G", href: '' }
];


const NavBar = ({ isAdmin = null }) => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, logout } = useAuth();
    const { resume } = useDownloads();

    const location = useLocation();
    const isLightMode = location.pathname === '/contact' || location.pathname === '/about';


    const handleNavigate = (path) => {
        navigate(path);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.log("error signing out");
            navigate('/');
        }
    }

    // use Effect downloads context needs to go here to fech the resume link

    // needs to be called in this function 
    const handleResume = () => {
        window.open(resume.link, '_blank');
    }

    const NavButton = ({ onClick, item }) => {
        return (
            <Button
                onClick={onClick}
                bg="transparent"
                fontFamily="navbar"
                color={isLightMode ? "appColors.matteBlack" : "white"}
                _hover={{ color: "appColors.pastelYellow" }}
                justifyContent="flex-start"
            >
                {item.label}
            </Button>
        );
    };


    const ContactButton = ({ item }) => {
        return (
            <Button
                onClick={() => handleNavigate(item.href)}
                bg="transparent"
                fontFamily="navbar"
                color={isLightMode ? "appColors.matteBlack" : "white"}
                _hover={{ color: "appColors.pastelYellow" }}
            >
                {item.platform}
            </Button>
        );
    };

    return (
        <>
            <HStack position='relative' minW='100%' overflowX='hidden' w='100%' marginTop='30px' marginBottom='55px' justifyContent='space-evenly'>
                <VStack minW='150px' cursor="pointer" onClick={() => handleNavigate("/")}>
                    {isAdmin ?
                        <Text style={{
                            position: "relative",
                            left: 0,
                            top: 5,
                            fontSize: '34px',
                            w: '200px',
                            whiteSpace: 'nowrap'
                        }}>Return To</Text>
                        :
                        <Text style={{
                            position: "relative",
                            left: 0,
                            top: 5,
                            fontSize: '34px',
                            w: '200px',
                            whiteSpace: 'nowrap'
                        }}>{user?.fname} {user?.lname}</Text>}
                    <Text style={{
                        position: "relative",
                        color: 'rgb(67, 67, 69)',
                        left: -1,
                        top: -7,
                        fontSize: '17px',
                        whiteSpace: 'nowrap'
                    }}>{isAdmin ? "Your Site" : user?.title}</Text>
                </VStack>
                <HStack justifyContent='space-evenly' px='10px' mx='30px' display={{ base: "none", md: "flex" }}>
                    {isAdmin ?
                        adminPages.map((item, index) => {
                            return <NavButton key={index} onClick={() => handleNavigate(item.href)} item={item} />
                        })
                        :
                        navPages.map((item, index) => {
                            if (!item.special) {
                                if (resume && item.href === '/resume') {
                                    return <NavButton key={index} onClick={() => handleResume()} item={item} />
                                } else {
                                    return <NavButton key={index} onClick={() => handleNavigate(item.href)} item={item} />
                                }
                            }
                            return null
                        })
                    }
                </HStack>
                {isAdmin ?
                    <Button
                        onClick={() => handleLogout()}
                        color='red.500'
                        fontFamily='arial'
                        borderRadius='30px'
                        bg='white'
                        _hover={{ bg: 'appColors.greyGoose', color: "appColors.matteBlack" }}>Logout</Button>
                    :
                    <HStack>
                        {contacts.map((item, index) => (
                            <ContactButton key={index} item={item} />
                        ))}
                    </HStack>}
                <IconButton
                    icon={<HamburgerIcon />}
                    onClick={onOpen}
                    bg="transparent"
                    color={isLightMode ? "appColors.matteBlack" : "white"}
                    aria-label="Open Menu"
                    display={{ base: "flex", md: "none" }}
                />
            </HStack>

            {isAdmin ? <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent bg="appColors.matteBlack" color="white">
                    <DrawerCloseButton />
                    <DrawerHeader>Navigation</DrawerHeader>
                    <DrawerBody>
                        <VStack spacing={4}>
                            {adminPages.map((item, index) => (
                                <NavButton key={index} onClick={() => { handleNavigate(item.href); onClose(); }} item={item} />
                            ))}
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer> : <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent bg="appColors.matteBlack" color="white">
                    <DrawerCloseButton />
                    <DrawerHeader>Navigation</DrawerHeader>
                    <DrawerBody>
                        <VStack spacing={4}>
                            {navPages.map((item, index) => (
                                <NavButton key={index} onClick={() => { handleNavigate(item.href); onClose(); }} item={item} />
                            ))}
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>}

        </>
    );
};

export default NavBar;
