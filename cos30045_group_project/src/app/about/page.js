// /pages/about.js
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProfileCard from '../../components/ProfileCard';

const About = () => {
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

    return (
      <>
        <Navbar />
        <div className='pt-[100px] w-full h-full flex align-center justify-center'>
          <div className='w-[70%] lg:flex md:gap-10'>
            <div className='lg:w-3/4'> {/* Larger column */}
              <h1 className="text-3xl mb-4">Project & Contributors</h1>
              <p className="mb-2 text-sm">We are Chak Joo TAN and Zia Tan. We are excited to present our project, "Exposure to PM2.5 Fine Particles: A Global Perspective," created as part of our university degree. Using advanced data visualization techniques, we analyze the impact of PM2.5 exposure across various countries and regions, focusing on its correlation with population dynamics and mortality rates from respiratory and cardiovascular diseases from 1990 to 2021.</p>

              <p className="mb-2 text-sm">Our website serves as an interactive platform that sheds light on the critical public health implications of air pollution, providing essential insights into trends, health impacts, and opportunities for improved air quality. Throughout every phase of this project, from initial research to final execution, we have collaborated closely to ensure a comprehensive and unified approach.</p>

              <p className="mb-2 text-sm">We invite you to explore our findings and encourage you to reach out with any questions or for further information. Your engagement is vital in raising awareness about the importance of clean air and its impact on public health worldwide.</p>
            </div>

            <div className='lg:w-1/4 mt-4 lg:mt-0'> {/* Smaller column */}
              <div className='my-1'>
                <ProfileCard
                    profilePicture={userData1.profilePicture}
                    name={userData1.name}
                    links={userData1.links}
                />
              </div>
              <div className='my-1'>
                <ProfileCard
                    profilePicture={userData2.profilePicture}
                    name={userData2.name}
                    links={userData2.links}
                />
              </div>

            </div>
          </div>
        </div>

        
        <Footer />
      </>
    );
  };
  
  export default About;