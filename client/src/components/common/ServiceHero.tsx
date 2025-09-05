import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { Link } from "wouter";
import { ReactNode } from "react";

interface ServiceHeroProps {
  title: string;
  description: string;
  icon: ReactNode;
  ctaText?: string;
  ctaLink?: string;
  className?: string;
}

export const ServiceHero = ({ 
  title, 
  description, 
  icon, 
  ctaText = "Get Free Estimate",
  ctaLink = "/quote",
  className = "" 
}: ServiceHeroProps) => {
  return (
    <section className={`hvac-section hvac-gradient-hero ${className}`}>
      <div className="hvac-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8">
            <h1 className="text-4xl lg:text-5xl font-bold font-header leading-tight">
              {title}
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                <Phone className="w-5 h-5 mr-2" />
                Call (403) 613-6014
              </Button>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 bg-white hover:bg-blue-50" asChild>
                <Link href={ctaLink}>{ctaText}</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="mb-4">
                {icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Professional Service</h3>
              <ul className="space-y-2 text-blue-100">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                  Licensed & Insured Technicians
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                  24/7 Emergency Service
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                  Satisfaction Guaranteed
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                  Upfront Pricing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
