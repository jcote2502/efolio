import { ChakraProvider, extendTheme, VStack } from "@chakra-ui/react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import { SummaryProvider } from "./contexts/Summary.js";
import { SkillsProvider } from "./contexts/Skill.js";
import { EducationProvider } from "./contexts/Education.js";
import { ProjectProvider } from "./contexts/Project.js";
import { AboutProvider } from "./contexts/About.js";
import { LinkProvider } from "./contexts/Link.js";
import { ExperienceProvider } from "./contexts/Experience.js";


import { Home, AdminHome } from "./pages/Home";
import { Experiences, AdminExperiences } from "./pages/Experience";
import { Projects, AdminProjects } from "./pages/Projects";
import { About, AdminAbout } from "./pages/About";
import Contact from "./pages/Contact";
import { useAuth } from "./contexts/Auth.js";
import Login from "./pages/auth/Login.js";
import Admin from "./pages/Admin.js";
import { DownloadProvider } from "./contexts/Downloads.js";
import { AdminProject, ProjectPage } from "./pages/Project.js";


function App() {

  const theme = extendTheme({

    fonts: {
      body: `'Playfair Display', serif`,
      heading: `'Times New Roman', serif`,
      navbar: `'Roboto', sans-serif`,
      merri: `'Merriweather', serif`,
    },
    colors: {
      appColors: {
        matteBlack: 'rgb(24, 24, 24)',
        pastelYellow: 'rgb(255, 250, 194)',
        barelyGrey: 'rgb(67, 67, 69)',
        coffeeCream: "rgb(218, 215, 208)",
        greyGoose: 'rgb(68,68,68)',
      },
    },
    styles: {
      global: {
        'html, body': {
          overflowY: "scroll", // Ensure vertical scroll is enabled
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // Internet Explorer and Edge
        },
        '*::-webkit-scrollbar': {
          display: "none",  // Chrome , Safari , Opera
        },
        body: {
          margin: 0,
          padding: 0,
          backgroundColor: 'rgb(24, 24, 24)',
          color: 'rgb(255, 250, 194)',
        },
      },
    },
  });

  const location = useLocation();
  const isLightMode = location.pathname === '/contact' || location.pathname === '/about';

  const { isLoggedIn } = useAuth();


  return (
    <>
      <ChakraProvider theme={theme}>
        {/* Context Providers GO BELOW HERE */}
        <AboutProvider>
          <ProjectProvider>
            <ExperienceProvider>
              <SummaryProvider>
                <LinkProvider>
                  <SkillsProvider>
                    <EducationProvider>
                      <DownloadProvider>
                        <VStack bg={isLightMode ? 'appColors.coffeeCream' : 'transparent'}
                          transition="background-color 1s linear">
                          <Routes>
                            <Route path='/' exact element={<Home />} />
                            <Route path='/contact' exact element={<Contact />} />
                            <Route path='/projects' exact element={<Projects />} />
                            <Route path='/project/:_id' element={<ProjectPage />} />
                            <Route path='/experience' exact element={<Experiences />} />
                            <Route path='/about' exact element={<About />} />
                            <Route path='/admin/*' exact element={<Admin />}>
                              <Route index element={isLoggedIn ? <AdminHome /> : <Login />} />
                              <Route path="login" element={<Login />} />
                              <Route path="my-info" element={!isLoggedIn ? <Navigate to="/admin/login" /> : <AdminHome />} />
                              <Route path="experiences" element={!isLoggedIn ? <Navigate to="/admin/login" /> : <AdminExperiences />} />
                              <Route path="projects" element={!isLoggedIn ? <Navigate to="/admin/login" /> : <AdminProjects />} />
                              <Route path="about" element={!isLoggedIn ? <Navigate to="/admin/login" /> : <AdminAbout />} />
                              <Route path='project/:_id'element={!isLoggedIn ? <Navigate to="/admin/login" /> : <AdminProject />}/>
                            </Route>
                          </Routes>
                        </VStack>
                      </DownloadProvider>
                    </EducationProvider>
                  </SkillsProvider>
                </LinkProvider>
              </SummaryProvider>
            </ExperienceProvider>
          </ProjectProvider>
        </AboutProvider>
      </ChakraProvider>
    </>
  );
}

export default App;
