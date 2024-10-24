// pages/_app.js
import './globals.css'; // Make sure to include global styles
import Navbar from '../components/navbar';
import Landing from '../components/landing';
import Footer from '../components/footer';
import Introduction from '../components/introduction';
import Objective from '../components/objective';

function MyApp() {
  return (
    <>
      <Navbar />
      <Landing />
      <Introduction />
      <Objective />
      <Footer />
    </>
  );
}

export default MyApp;
