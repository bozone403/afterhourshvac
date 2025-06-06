import { Helmet } from 'react-helmet-async';
import HeroSection from '@/components/home/HeroSection';
import ServicesCarousel from '@/components/home/ServicesCarousel';
import QuickContactWidget from '@/components/home/QuickContactWidget';
import GoogleReviews from '@/components/home/GoogleReviews';
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
      
      {/* Google Reviews Section */}
      <GoogleReviews />
      
      {/* Service Area Section */}
      <section className="bg-slate-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Serving Southern & Central Alberta</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Professional HVAC services across Alberta's major cities and communities
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
            {[
              'Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat', 'Airdrie',
              'Okotoks', 'Cochrane', 'Canmore', 'Banff', 'Camrose', 'Lacombe',
              'Innisfail', 'Olds', 'Didsbury', 'Strathmore', 'High River', 'Turner Valley',
              'Black Diamond', 'Chestermere', 'Rocky View County', 'Foothills County',
              'Mountain View County', 'Drumheller'
            ].map((city) => (
              <div key={city} className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 hover:bg-slate-700 transition-all">
                <span className="text-white text-sm font-medium">{city}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-slate-400 text-sm">
              Don't see your city? We serve many more communities across Alberta. 
              <Link href="/contact" className="text-blue-400 hover:text-blue-300 ml-1">Contact us</Link> to confirm service availability.
            </p>
          </div>
        </div>
      </section>
      
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
