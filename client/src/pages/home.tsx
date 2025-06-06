import { Helmet } from 'react-helmet-async';
import HeroSection from '@/components/home/HeroSection';
import ServicesCarousel from '@/components/home/ServicesCarousel';
import QuickContactWidget from '@/components/home/QuickContactWidget';
import { Link } from 'wouter';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>AfterHours HVAC - When Everyone Else Closes, We Keep The Heat On</title>
        <meta name="description" content="Professional HVAC services in Calgary and surrounding areas. 24/7 emergency repairs, installations, and maintenance for residential and commercial properties." />
      </Helmet>
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Services Carousel */}
      <ServicesCarousel />
      
      {/* Quick Contact Widget */}
      <QuickContactWidget />
      
      {/* Simple CTA Section */}
      <section className="bg-darkgray py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-header mb-6">Need HVAC Service?</h2>
          <p className="text-lightgray max-w-2xl mx-auto mb-8">
            Professional heating and cooling solutions when you need them most. Available 24/7 for emergency repairs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <div className="bg-primary hover:bg-primarydark text-dark font-bold py-3 px-8 rounded-lg transition-colors cursor-pointer">
                Get Quote
              </div>
            </Link>
            <Link href="/calculators">
              <div className="bg-dark hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg border border-gray-600 transition-colors cursor-pointer">
                Cost Calculator
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
