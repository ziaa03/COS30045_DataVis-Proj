// /pages/about.js
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProfileCard from '../../components/ProfileCard';

const About = () => {
  const userData = [
    {
      profilePicture: '/images/travis_pfp.jpg', 
      name: 'Chak Joo TAN',
      links: [
        { label: 'LinkedIn', url: 'https://www.linkedin.com/in/chak-joo-tan-931638290/', image: '/images/icons/linkedin.png' },
        { label: 'GitHub', url: 'https://github.com/cj-travis', image: '/images/icons/github.png'  },
        { label: 'Gmail', url: 'mailto:tanchakjoo27@gmail.com', image: '/images/icons/gmail.png'  },
      ],
    },
    {
      profilePicture: '/images/zia_pfp.jpg', 
      name: 'Zia Adam Chun Ing TAN',
      links: [
        { label: 'LinkedIn', url: 'https://www.linkedin.com/in/zia-tan-4064562b7', image: '/images/icons/linkedin.png' },
        { label: 'GitHub', url: 'https://github.com/ziaa03', image: '/images/icons/github.png'  },
        { label: 'Gmail', url: 'mailto:tziaa04@gmail.com', image: '/images/icons/gmail.png'  },
      ],
    }
  ];

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
              <h1 className="text-4xl mb-4 duration-500 relative">Project, Contributors & References</h1>
              {texts.map((text, index) => {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2+(index/10) }}
                  >
                    <p className="mb-2 text-sm leading-6 text-slate-300 text-justify">{text.para}</p>
                  </motion.div>
                );
              })}
              
            </div>

            <div className='grid grid-cols-1 gap-6 mt-6 lg:mt-10 mb-12 lg:grid-cols-12'> {/* Smaller column */}
              
              <div className='grid-cols-1 lg:col-span-8 xl:col-span-6'>
                <div className='md:flex w-full justify-center'>
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

              <div className='grid-cols-1 lg:col-span-4 xl:col-span-6'>
                <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}>
                <h1 className="text-xl mb-2 duration-500 relative">OECD: </h1><hr/>
                <p className="mt-2 text-sm leading-6">
                  <Link 
                    href='https://www.oecd-ilibrary.org/environment/data/air-quality-and-health/exposure-to-pm2-5-fine-particles-countries-and-regions_96171c76-en?parent=http%3A%2F%2Finstance.metastore.ingenta.com%2Fcontent%2Fcollection%2Fenv-data-en'
                    target='_blank'
                    className='text-slate-400 hover:text-slate-100 duration-300'
                  >
                    PM2.5 Exposure Levels - Countires and Regions
                  </Link>
                </p>
                <br/>
                </motion.div>
                <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4}}>
                <h1 className="text-xl mb-2 duration-500 relative">World Bank Group: </h1><hr/>
                <p className="mt-2 text-sm leading-6">
                  
                  <Link 
                    href='https://data.worldbank.org/indicator/EN.ATM.PM25.MC.M3'
                    target='_blank'
                    className='text-slate-400 hover:text-slate-100 duration-300'
                  >
                    PM2.5 Air Pollution
                  </Link>
                </p>
                <p className="mt-2 text-sm leading-6">
                  
                  <Link 
                    href='https://data.worldbank.org/indicator/SP.POP.TOTL'
                    target='_blank'
                    className='text-slate-400 hover:text-slate-100 duration-300'
                  >
                    Population - Countries and Regions
                  </Link>
                </p>
                <br/>
                </motion.div>
                <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6}}>
                <h1 className="text-xl mb-2 duration-500 relative">Our World in Data: </h1><hr/>
                <p className="mt-2 text-sm leading-6">
                  
                  <Link 
                    href='https://ourworldindata.org/grapher/cardiovascular-disease-death-rates?tab=table'
                    target='_blank'
                    className='text-slate-400 hover:text-slate-100 duration-300'
                  >
                    Death rate from cardiovascular diseases
                  </Link>
                </p>
                <p className="mt-2 text-sm leading-6">
                  
                  <Link 
                    href='https://ourworldindata.org/grapher/respiratory-disease-death-rate?tab=table'
                    target='_blank'
                    className='text-slate-400 hover:text-slate-100 duration-300'
                  >
                    Chronic respiratory diseases death rate
                  </Link>
                </p>
                <br/>
                </motion.div>
              </div>
              
              
            </div>
          </div> 
        </div>

        
        <Footer />
      </>
    );
  };
  
  export default About;