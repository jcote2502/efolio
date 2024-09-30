import { useEffect, useState } from "react";
import { Image, Button, useDisclosure, Box, HStack, Text, VStack, Spinner, Link } from "@chakra-ui/react";
import { useSummary } from '../contexts/Summary';
import { useSkills } from "../contexts/Skill";
import { useEducation } from "../contexts/Education";
import { useAuth } from "../contexts/Auth";
import { AdminSkillDisplay, SkillCard } from "../components/cards/Skills";
import { EducationCard } from "../components/cards/Education";
import { renderLoading } from "../utils";
import PageFrame from "../components/Frame";
import EditModal from "../components/modals/EditModal";
import { ProfileForm, SensitiveForm } from "../components/forms/user";
import { UploadProfileImage } from "../components/uploads/Photo";
import SummaryForm from "../components/forms/summary";
import SkillsForm from "../components/forms/skill";
import { useLink } from "../contexts/Link";
import { LinkDisplay } from "../components/Links";
import LinkForm from "../components/forms/link";
import EducationForm from "../components/forms/education";
import { useDownloads } from "../contexts/Downloads";
import { UploadPDF } from "../components/uploads/PDF";

// done its all good completely good
export const Home = () => {
    const [loading, setLoading] = useState(true);
    const { skills } = useSkills();
    const { summary } = useSummary();
    const { educations } = useEducation();
    const { user } = useAuth();
    const [educationOpacity, setEducationOpacity] = useState(0);
    const [skillsOpacity, setSkillsOpacity] = useState(0);
    const [isLoadingPFP, setLoadingPFP] = useState(true);
    const [isLoadingBanner, setLoadingBanner] = useState(true);

    const handleLoadedPFP = () => {
        setLoadingPFP(false);
    };

    const handleErrorPFP = () => {
        setLoadingPFP(false);
    };

    const handleLoadedBanner = () => {
        setLoadingBanner(false);
    };

    const handleErrorBanner = () => {
        setLoadingBanner(false);
    };


    useEffect(() => {
        if (user) {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const educationSection = document.getElementById('education-section');
            const skillsText = document.getElementById('skills-text');

            if (educationSection) {
                const { top, bottom } = educationSection.getBoundingClientRect();

                // Check if the section is in view (or partially in view)
                if (top < windowHeight && bottom > 0) {
                    const newOpacity = Math.max(0, Math.min(1, (windowHeight - top) / windowHeight));
                    setEducationOpacity(newOpacity);
                } else if (top > windowHeight) {
                    setEducationOpacity(0);
                }
            }


            if (skillsText) {
                const { top, bottom } = skillsText.getBoundingClientRect();

                // Check how close the skills text is to the viewport
                if (top < windowHeight && bottom > 0) {
                    const newOpacity = Math.max(0, Math.min(1, (windowHeight - top) / windowHeight));
                    setSkillsOpacity(newOpacity);
                } else if (top > windowHeight) {
                    setSkillsOpacity(0);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const renderPage = () => {
        return (
            <>
                <VStack position="relative" w="100%" h="575px">
                    {/* Headshot Image */}
                    <Box
                        as="img"
                        onLoad={handleLoadedPFP} onError={handleErrorPFP}
                        src={user?.headshot ? user?.headshot : process.env.PUBLIC_URL + "/assets/images/defaultHomeCard.jpg"}
                        alt="Background"
                        position="absolute"
                        right="20"
                        top="0"
                        width="450px"
                        height="550px"
                        borderRadius="220px/250px"
                        objectFit="cover"
                        objectPosition="center"
                        zIndex="-1"
                    />
                    {/* Overlay */}
                    <Box
                        position="absolute"
                        bg='black'
                        opacity={user.image ? '.2' : 0}
                        right="20"
                        top="0"
                        width="450px"
                        height="550px"
                        borderRadius="220px/250px"
                        objectFit="cover"
                        objectPosition="left"
                        zIndex="-1"
                    />
                    {/* Title And Location */}
                    <Text color='white' position="absolute" left='100px' top='75px' zIndex="1" p="20px" fontSize="32px">
                        {user?.location}
                    </Text>
                    <Text
                        textAlign='left'
                        position="absolute"
                        left={{ md: '50px', base: '70px' }}
                        top={{ md: '100px', base: '-70px' }}  // Moves up on medium screens
                        zIndex="2"
                        p="20px"
                        fontSize={{ md: '120px', base: '70px' }}  // Decreases font size on medium screens
                    >
                        {user?.fname.toLowerCase()} {user?.lname.toLowerCase()}
                    </Text>
                </VStack>

                {/* Summary */}
                <VStack position='relative' h='80px' w="100%">
                    <Text
                        borderRadius='20px'
                        bg='appColors.matteBlack'
                        w='520px'
                        textAlign='center'
                        color='appColors.barelyGrey'
                        position="absolute"
                        p='5px' left='70px'
                        top='-280px' zIndex="2"
                        fontSize="22px">
                        {summary?.summary}
                    </Text>
                </VStack>

                {/* Skills */}
                <VStack backgroundColor='appColors.coffeeCream' w='125%' id="skills-text" opacity={skillsOpacity}
                    transition="opacity 0.2s linear"
                >
                    <VStack position="relative" w="80%" h="450px">
                        <Box
                            as="img"
                            onLoad={handleLoadedBanner} onError={handleErrorBanner}
                            src={user?.banner ? user?.banner : process.env.PUBLIC_URL + "/assets/images/defaultBannerCard.png"}
                            alt="Background"
                            position="absolute"
                            w='93%'
                            h='100%'
                            objectFit="cover"
                            objectPosition="center"
                            zIndex="1"
                        />
                        <Text
                            position='absolute'
                            top='10'
                            right='15%'
                            color='black'
                            fontSize='68px'
                            zIndex="2"
                        >Foundations & Skills</Text>
                    </VStack>

                    <HStack pb='25px' backgroundColor='appColors.coffeeCream' justifyContent='space-evenly' wrap='wrap' w='80%'>
                        {skills.map((item, index) => (
                            <SkillCard item={item} index={index} key={index} />
                        ))}
                    </HStack>
                </VStack>

                {/* Education */}
                <VStack w='100%' py='50px' id="education-section" transition="opacity 0.5s ease" opacity={educationOpacity}  >
                    <Text fontSize='68px' pb='15px'>Academia</Text>
                    <HStack
                        justifyContent='space-evenly'
                        alignItems='center'
                        wrap='wrap'
                        w='100%'
                        zIndex="2"
                        p='15px'
                    >
                        {educations.map((education, index) => (
                            <EducationCard key={index} education={education} />
                        ))}
                    </HStack>
                </VStack>
            </>
        );
    }

    return (
        <PageFrame>
            {loading && isLoadingBanner && isLoadingPFP ? renderLoading() : renderPage()}
        </PageFrame>
    );
}


export const AdminHome = () => {

    const { user } = useAuth();
    const { summary } = useSummary();
    const { skills } = useSkills();
    const { links } = useLink();
    const { educations } = useEducation();
    const { resume } = useDownloads();

    const [selectedSkill, setSetlectedSkill] = useState(null);
    const [selectedLink, setSelectedLink] = useState(null);
    const [selectedEducation, setSelectedEducation] = useState(null);
    const [isLoadingPFP, setLoadingPFP] = useState(true);
    const [isLoadingBanner, setLoadingBanner] = useState(true);

    const { isOpen: isPasswordModalOpen, onOpen: onPasswordModalOpen, onClose: onPasswordModalClose } = useDisclosure();
    const { isOpen: isEmailModalOpen, onOpen: onEmailModalOpen, onClose: onEmailModalClose } = useDisclosure();
    const { isOpen: isProfileModalOpen, onOpen: onProfileModalOpen, onClose: onProfileModalClose } = useDisclosure();
    const { isOpen: isPFPModalOpen, onOpen: onPFPModalOpen, onClose: onPFPModalClose } = useDisclosure();
    const { isOpen: isBannerModalOpen, onOpen: onBannerModalOpen, onClose: onBannerModalClose } = useDisclosure();
    const { isOpen: isSkillsModalOpen, onOpen: onSkillsModalOpen, onClose: onSkillsModalClose } = useDisclosure();
    const { isOpen: isEducationModalOpen, onOpen: onEducationModalOpen, onClose: onEducationModalClose } = useDisclosure();
    const { isOpen: isSummaryModalOpen, onOpen: onSummaryModalOpen, onClose: onSummaryModalClose } = useDisclosure();
    const { isOpen: isLinksModalOpen, onOpen: onLinksModalOpen, onClose: onLinksModalClose } = useDisclosure();
    const { isOpen: isResumeModalOpen, onOpen: onResumeModalOpen, onClose: onResumeModalClose } = useDisclosure();



    const handleLoadedPFP = () => {
        setLoadingPFP(false);
    };

    const handleErrorPFP = () => {
        setLoadingPFP(false);
    };

    const handleLoadedBanner = () => {
        setLoadingBanner(false);
    };

    const handleErrorBanner = () => {
        setLoadingBanner(false);
    };

    const handleSelectSkill = (item) => {
        setSetlectedSkill(item)
        onSkillsModalOpen();
    }

    const handleSkillsClose = () => {
        onSkillsModalClose();
        setSetlectedSkill(null);
    }

    const handleSelectLink = (item) => {
        setSelectedLink(item);
        onLinksModalOpen();
    }

    const handleLinksClose = () => {
        onLinksModalClose();
        setSelectedLink(null);
    }

    const handleSelectEducation = (item) => {
        setSelectedEducation(item);
        onEducationModalOpen();
    }

    const handleEducationClose = () => {
        onEducationModalClose();
        setSelectedEducation(null);
    }

    const TitleText = ({ children }) => (
        <Text textAlign="center" fontSize="24px" color="appColors.coffeeCream">{children}</Text>
    );

    const PageButton = ({ onClick, children }) => (
        <Button w='150px' onClick={onClick}>{children}</Button>
    )

    const VerticalContainer = ({ children, w = '100%', title, buttonLabel, isBottomPage = false, onClick }) => (
        <>
            {
                isBottomPage ?
                    <VStack mb='10px' flex={1} m={2} w={w} justifyContent='center' alignContent='center' alignSelf='center'>
                        <HStack w='30%' m='10px' justifyContent='space-between'>
                            <TitleText>{title}</TitleText>
                            <PageButton onClick={onClick}>{buttonLabel}</PageButton>
                        </HStack>
                        {children}
                    </VStack>
                    : null

            }
        </>


    )

    return (
        <PageFrame isAdmin={true}>

            {/* Profile and Login info and skills */}
            <HStack w='80%' wrap='wrap' position='relative' spacing={10} align='stretch' justify='stretch' justifyContent='space-evenly'>


                {/* Headshot and banner */}
                <VStack h='100%' flex={1} align='center'>
                    <Image
                        boxSize='250px'
                        onLoad={handleLoadedPFP}
                        onError={handleErrorPFP}
                        objectFit='cover'
                        borderRadius='50%'
                        src={user?.headshot ? user?.headshot : process.env.PUBLIC_URL + "/assets/images/defaultHomeCard.jpg"}
                    />
                    {!isLoadingBanner && !isLoadingPFP && <PageButton onClick={onPFPModalOpen}>Change PFP</PageButton>}
                </VStack>

                <VStack flex={1} align='center' justifyContent='center' alignContent='center'>
                    <Image
                        w='600px'
                        objectFit='cover'
                        borderRadius='20px'
                        onLoad={handleLoadedBanner}
                        onError={handleErrorBanner}
                        src={user?.banner ? user?.banner : process.env.PUBLIC_URL + "/assets/images/defaultBannerCard.png"}
                    />
                    {!isLoadingBanner && !isLoadingPFP && <PageButton onClick={onBannerModalOpen}>Change Banner</PageButton>}
                </VStack>
                {isLoadingBanner && isLoadingPFP && (
                    <Box
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                    >
                        <Spinner size="xl" />
                    </Box>
                )}
            </HStack>


            {/* Credentials, Profile Info, Links */}
            <HStack w='80%' wrap='wrap' position='relative' spacing={10} align='stretch'>

                {/* Password and Email */}
                <VStack minH='275px' flex={1} justifyContent='space-between'>
                    <TitleText>Auth Credentials</TitleText>
                    <Text p='10px' textAlign='center'>{user?.email}</Text>
                    <HStack w='100%' justifyContent='space-around'>
                        <PageButton onClick={onEmailModalOpen}>Change Email</PageButton>
                        <PageButton onClick={onPasswordModalOpen}>Change Password</PageButton>
                    </HStack>
                </VStack>

                {/* Profile Information */}
                <VStack  minH='275px' flex={1} justifyContent='space-between'>
                    <TitleText>Profile Information</TitleText>
                    <HStack w='100%' justifyContent='space-between'>
                        <Text>Name :</Text>
                        <Text>{user?.fname} {user?.lname}</Text>
                    </HStack>
                    <HStack w='100%' justifyContent='space-between'>
                        <Text>Phone :</Text>
                        <Text>{user?.phone ? user?.phone : '--'}</Text>
                    </HStack>
                    <HStack w='100%' justifyContent='space-between'>
                        <Text>Location :</Text>
                        <Text>{user?.location ? user?.location : '--'}</Text>
                    </HStack>                    <HStack w='100%' justifyContent='space-between'>
                        <Text>Job Title :</Text>
                        <Text>{user?.title ? user?.title : '--'}</Text>
                    </HStack>
                    <PageButton w='100%' onClick={onProfileModalOpen}>Update Profile</PageButton>
                </VStack>

                {/* Links */}
                <VStack minH='275px' flex={1} justifyContent='space-between'>
                    <TitleText>Links</TitleText>
                    <HStack maxH='200px' pb='10px' wrap='wrap' justifyContent='center'>
                        {links ? links.map((item, index) => (
                            <LinkDisplay item={item} index={index} onClick={() => handleSelectLink(item)} />
                        )) : <Text>Add Some Skills Below !</Text>}
                    </HStack>
                    <HStack w='100%' justifyContent='space-around'>
                        <PageButton onClick={onLinksModalOpen}>Add Link</PageButton>
                    </HStack>
                </VStack>
            </HStack>








            <VStack flex={2} m='10px' p='20px' align='stretch'>
                {/* Summary */}
                <VerticalContainer title='Summary' isBottomPage={true} onClick={onSummaryModalOpen} buttonLabel="Update Summary">
                    <Text w='60%' textAlign='center'>{summary?.summary ? summary?.summary : "Add a Summary Below !"}</Text>
                </VerticalContainer>

                {/* Resume */}
                <VerticalContainer title='Resume' isBottomPage={true} onClick={onResumeModalOpen} buttonLabel="Upload Resume">
                    {!resume ? <Text textAlign='center' pb='10px'>Upload a Resume Below !</Text> : <Link align='center' color href={resume.link} target="_blank" rel="noopener noreferrer">{resume.link}</Link>}
                </VerticalContainer>

                {/* Skills */}
                <VerticalContainer title='Skills' isBottomPage={true} onClick={onSkillsModalOpen} buttonLabel="Add Skill">
                    <HStack wrap='wrap' justifyContent='center'>
                        {skills ? skills.map((item, index) => (
                            <AdminSkillDisplay item={item} index={index} onClick={() => handleSelectSkill(item)} />
                        )) : <Text>Add Some Skills Below !</Text>}
                    </HStack>
                </VerticalContainer>

                {/* Education */}
                <VStack m={1}>
                    <TitleText>Academia</TitleText>
                    <PageButton onClick={onEducationModalOpen}>Add Education</PageButton>
                    <HStack
                        justifyContent='space-evenly'
                        alignItems='center'
                        wrap='wrap'
                        w='100%'
                        zIndex="2"
                        p='15px'
                    >
                        {educations.map((item, index) => (
                            <EducationCard key={index} education={item} isAdmin={true} onClick={() => handleSelectEducation(item)} />
                        ))}
                    </HStack>
                </VStack>
            </VStack>







            {/* Modals For Editing Info */}

            <EditModal
                title="Password"
                isOpen={isPasswordModalOpen}
                onClose={onPasswordModalClose}
            >
                <SensitiveForm type="password" onClose={onPasswordModalClose} />
            </EditModal>

            <EditModal
                title="Email"
                isOpen={isEmailModalOpen}
                onClose={onEmailModalClose}
            >
                <SensitiveForm type="email" onClose={onEmailModalClose} />
            </EditModal>

            <EditModal
                title="Profile Info"
                isOpen={isProfileModalOpen}
                onClose={onProfileModalClose}
            >
                <ProfileForm onClose={onProfileModalClose} />
            </EditModal>

            <EditModal
                title="Headshot Image"
                isOpen={isPFPModalOpen}
                onClose={onPFPModalClose}
            >
                <UploadProfileImage onClose={onPFPModalClose} field='headshot' />
            </EditModal>

            <EditModal
                title="Resume"
                isOpen={isResumeModalOpen}
                onClose={onResumeModalClose}
            >
                <UploadPDF onClose={onResumeModalClose} isAdd={resume ? false : true} />
            </EditModal>

            <EditModal
                title="Banner Image"
                isOpen={isBannerModalOpen}
                onClose={onBannerModalClose}
            >
                <UploadProfileImage onClose={onBannerModalClose} field='banner' />
            </EditModal>

            <EditModal
                title="Summary"
                isOpen={isSummaryModalOpen}
                onClose={onSummaryModalClose}
            >
                <SummaryForm onClose={onSummaryModalClose} />
            </EditModal>

            <EditModal
                title="Skill"
                isOpen={isSkillsModalOpen}
                onClose={handleSkillsClose}
                isAdd={selectedSkill ? false : true}
            >
                <SkillsForm onClose={handleSkillsClose} selectedSkill={selectedSkill} />
            </EditModal>

            <EditModal
                title="Link"
                isOpen={isLinksModalOpen}
                onClose={handleLinksClose}
                isAdd={selectedLink ? false : true}
            >
                <LinkForm onClose={handleLinksClose} selectedLink={selectedLink} />
            </EditModal>


            <EditModal
                title="Education"
                isOpen={isEducationModalOpen}
                onClose={handleEducationClose}
                isAdd={selectedEducation ? false : true}
            >
                <EducationForm onClose={handleEducationClose} selectedEducation={selectedEducation} />
            </EditModal>

        </PageFrame >
    );
};
