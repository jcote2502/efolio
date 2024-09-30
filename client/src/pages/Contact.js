import { HStack, Image, Text, VStack } from "@chakra-ui/react";
import { useAuth } from "../contexts/Auth";
import { useLink } from "../contexts/Link";
import { ContactForm } from "../components/forms/contact";
import PageFrame from "../components/Frame";
import { LinkDisplay } from "../components/Links";

const Contact = () => {
    const { user } = useAuth();
    const { links } = useLink();

    return (
        <PageFrame>
            <VStack>
                <HStack align='left' alignContent='start' w='110%' justifyContent='space-around'>
                    <VStack h='100%' w='70%' align='center' spacing={5} >

                        <Text whiteSpace='nowrap' fontSize='80px' fontFamily='body' fontWeight='bold' color='appColors.barelyGrey'>Find Me On</Text>

                        {/* Links */}
                        <HStack w='800px' pb='10px' wrap='wrap' justifyContent='center'>
                            {links ? links.map((item, index) => (
                                <LinkDisplay isDisplay={true} item={item} index={index} onClick={() => window.open(item.href, '_blank')} />
                            )) : <Text>Add Some Skills Below !</Text>}
                        </HStack>

                        <Text whiteSpace='nowrap' fontSize='68px' fontFamily='body' fontWeight='bold' color='appColors.barelyGrey' >Contact Me At</Text>
                        {/* Check if user is defined before accessing its properties */}
                        {user ? (
                            <>
                                <Text fontFamily='navbar' color='appColors.greyGoose' fontSize='20px'>{user.email}</Text>
                                <Text fontFamily='navbar' color='appColors.greyGoose' fontSize='20px'>{user.phone}</Text>
                            </>
                        ) : (
                            <Text fontFamily='navbar' color='appColors.greyGoose' fontSize='20px'>User information is not available.</Text>
                        )}
                    </VStack>
                    <Image src={process.env.PUBLIC_URL + '/assets/images/contact.png'} />
                </HStack>
                <Text textAlign='center' whiteSpace='nowrap' fontSize='56px' fontFamily='body' fontWeight='bold' color='appColors.barelyGrey' >Want a Site ? ...</Text>
                <ContactForm />
            </VStack>
        </PageFrame>
    );
}

export default Contact;
