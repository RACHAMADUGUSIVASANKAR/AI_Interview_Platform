import React from 'react';
import Navbar from '../common/Navbar';
import Hero from './Hero';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Advantages from './Advantages';
import Pricing from './Pricing';
import FAQ from './FAQ';
import CallToAction from './CallToAction';
import Footer from './Footer';
import '../../styles/landing.css';

function LandingPage() {
    return (
        <div className="landing-page">
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <Advantages />
            <Pricing />
            <FAQ />
            <CallToAction />
            <Footer />
        </div>
    );
}

export default LandingPage;
