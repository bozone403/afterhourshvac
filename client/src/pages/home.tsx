import React from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from '@/components/home/HeroSection';
import ServicesCarousel from '@/components/home/ServicesCarousel';
import QuickContactWidget from '@/components/home/QuickContactWidget';
import GoogleReviews from '@/components/home/GoogleReviews';
import ForumPreview from '@/components/home/ForumPreview';
import { Carousel } from '@/components/ui/carousel';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';

const Home = () => {
  const { data: carouselImages, isLoading } = useQuery({
    queryKey: ['/api/carousel'],
    retry: false,
  });

  return (
    <>
      <Helmet>
        <title>AfterHours HVAC - When Everyone Else Closes, We Keep The Heat On</title>
        <meta name="description" content="Professional HVAC services in Calgary and surrounding areas. 24/7 emergency repairs, installations, and maintenance for residential and commercial properties." />
      </Helmet>
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Photo Carousel Section */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Work</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              See examples of our professional HVAC installations and services across Calgary
            </p>
          </div>
          
          {!isLoading && carouselImages && Array.isArray(carouselImages) && carouselImages.length > 0 && (
            <Carousel 
              images={carouselImages.map((img: any) => ({
                id: img.id,
                url: img.imageUrl,
                title: img.title,
                description: img.description || ''
              }))}
              autoPlay={true}
              interval={6000}
              className="max-w-4xl mx-auto"
            />
          )}
        </div>
      </section>
      
      {/* Services Carousel */}
      <ServicesCarousel />
      
      {/* Quick Contact Widget */}
      <QuickContactWidget />
      
      {/* Google Reviews Section */}
      <GoogleReviews />
      
      {/* Forum Preview Section */}
      <ForumPreview />
      
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
