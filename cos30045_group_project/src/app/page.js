// pages/_app.js
import './globals.css'; // Make sure to include global styles
import Navbar from '../components/Navbar';
import Landing from '../components/Landing';
import Introduction from '../components/Introduction';
import Objectives from '../components/Objectives';
import Visual from '../components/Visual';
import Footer from '../components/Footer';
import React from 'react';

function MyApp() {
  return (
    <>
      <Navbar />
      <Landing />
      <Introduction />
      <Objectives />
      <Visual />
      <Footer />
    </>
  );
}

export default MyApp;
