import React from "react";

import FeatureCards from "../components/FeatureCards";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

function Home() {
  return (
    <div className="public-page">
      <Hero />
      <FeatureCards />
      <Footer />
    </div>
  );
}

export default Home;