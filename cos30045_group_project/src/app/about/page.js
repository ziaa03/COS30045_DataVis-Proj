// /pages/about.js
'use client';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProfileCard from '../../components/ProfileCard';

const About = () => {
  const userData = [
    {
      profilePicture: '/images/pfp1.jpeg', // Replace with a dynamic URL
      name: 'Chak Joo TAN',
      links: [
        { label: 'LinkedIn', url: 'https://www.linkedin.com/in/johndoe', image: '/images/icons/linkedin.png' },
        { label: 'GitHub', url: 'https://github.com/johndoe', image: '/images/icons/github.png'  },
        { label: 'Gmail', url: 'https://johndoe.com', image: '/images/icons/gmail.png'  },
      ],
    },
    {
      profilePicture: '/images/pfp2.jpeg', // Replace with a dynamic URL
      name: 'Zia Adam Chun Ing TAN',
      links: [
        { label: 'LinkedIn', url: 'https://www.linkedin.com/in/johndoe', image: '/images/icons/linkedin.png' },
        { label: 'GitHub', url: 'https://github.com/johndoe', image: '/images/icons/github.png'  },
        { label: 'Gmail', url: 'https://johndoe.com', image: '/images/icons/gmail.png'  },
      ],
    }
  ];
  const userData1 = {
    profilePicture: '/images/pfp1.jpeg', // Replace with a dynamic URL
    name: 'Chak Joo TAN',
    links: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/johndoe', image: '/images/icons/linkedin.png' },
      { label: 'GitHub', url: 'https://github.com/johndoe', image: '/images/icons/github.png'  },
      { label: 'Gmail', url: 'https://johndoe.com', image: '/images/icons/gmail.png'  },
    ],
  };

  const userData2 = {
    profilePicture: '/images/pfp2.jpeg', // Replace with a dynamic URL
    name: 'Zia Adam Chun Ing TAN',
    links: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/johndoe', image: '/images/icons/linkedin.png' },
      { label: 'GitHub', url: 'https://github.com/johndoe', image: '/images/icons/github.png'  },
      { label: 'Gmail', url: 'https://johndoe.com', image: '/images/icons/gmail.png'  },
    ],
  };

  const texts = [
    {
      para: 'We are Chak Joo TAN and Zia TAN, excited to present our project, "Exposure to PM2.5 Fine Particles: A Global Perspective", created as part of our university degree. Using data visualization, we analyze the global impact of PM2.5 exposure, focusing on its correlation with population dynamics and mortality rates from respiratory and cardiovascular diseases (1990-2020).'
    },
    {
      para: 'Our interactive website highlights the public health implications of air pollution, offering insights into trends, health impacts, and opportunities to improve air quality. We’ve worked closely throughout this project to provide a comprehensive view.'
    },
    {
      para: 'We invite you to explore our findings and welcome any questions. Your engagement helps raise awareness about the importance of clean air and its global impact on health.'
    }
  ]

    return (
      <>
        <Navbar />
        <div className='pt-[100px] w-full h-full flex align-center justify-center leading-8'>
          <div className='w-[70%] md:gap-10'>
            <div className=''> {/* Larger column */}
              <h1 className="text-4xl mb-4 duration-500 relative">Project & Contributors</h1>
              {texts.map((text, index) => {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2+(index/10) }}
                  >
                    <p className="mb-2 text-sm leading-6">{text.para}</p>
                  </motion.div>
                );
              })}
              
            </div>

            <div className='sm:flex w-full justify-end mt-4 lg:mt-0 mb-12 lg:mb-0'> {/* Smaller column */}
              {userData.map((user, index) => {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2+(index/10) }}
                  >
                    <div className='m-1'>
                      <ProfileCard
                          profilePicture={user.profilePicture}
                          name={user.name}
                          links={user.links}
                      />
                    </div>
                  </motion.div>
                );
              })}
              
            </div>
          </div> 
        </div>

        
        <Footer />
      </>
    );
  };
  
  export default About;