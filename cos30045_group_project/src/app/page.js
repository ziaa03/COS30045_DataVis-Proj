// pages/_app.js
import './globals.css'; // Make sure to include global styles
import Navbar from '../components/Navbar';
import Landing from '../components/Landing';
import Footer from '../components/Footer';
import Introduction from '../components/Introduction';
import Objectives from '../components/Objectives';
import Visual from '../components/Visual';
import Graph from '../components/Graph';
import React from 'react';

function MyApp() {
  return (
    <>
      <Navbar />
      <Landing />
      <Introduction />
      <Objectives />
      <Visual />
      <Graph />
      <Footer />
    </>
  );
}

export default MyApp;
