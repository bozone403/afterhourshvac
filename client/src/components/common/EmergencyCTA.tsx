import { Button } from "@/components/ui/button";
import { Phone, Clock, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

interface EmergencyCTAProps {
  variant?: "default" | "compact" | "hero";
  showEmergencyButton?: boolean;
  className?: string;
}

export const EmergencyCTA = ({ 
  variant = "default", 
  showEmergencyButton = true,
  className = "" 
}: EmergencyCTAProps) => {
  if (variant === "compact") {
    return (
      <div className={`flex flex-col sm:flex-row gap-4 justify-center ${className}`}>
        <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
          <Phone className="w-5 h-5 mr-2" />
          Call (403) 613-6014
        </Button>
        {showEmergencyButton && (
          <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 bg-white hover:bg-blue-50" asChild>
            <Link href="/emergency">
              <Clock className="w-5 h-5 mr-2" />
              Emergency Service
            </Link>
          </Button>
        )}
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
        <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-lg px-8 py-4">
          <Phone className="w-5 h-5 mr-2" />
          Call (403) 613-6014
        </Button>
        {showEmergencyButton && (
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-50 text-lg px-8 py-4"
            asChild
          >
            <Link href="/emergency">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Emergency Service
            </Link>
          </Button>
        )}
      </div>
    );
  }

  // Default variant - full emergency section
  return (
    <section className={`py-16 bg-gradient-to-r from-red-600 to-orange-600 ${className}`}>
      <div className="hvac-container text-center">
        <div className="max-w-4xl mx-auto text-white space-y-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="h-8 w-8" />
            <h2 className="text-3xl lg:text-4xl font-bold">24/7 Emergency HVAC Service</h2>
          </div>
          <p className="text-xl text-red-100">
            Don't let heating or cooling problems disrupt your comfort. Our emergency team is standing by 24/7 
            to restore your system quickly and efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 font-bold text-lg px-8 py-4">
              <Phone className="w-5 h-5 mr-2" />
              Emergency: (403) 613-6014
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-50 text-lg px-8 py-4"
              asChild
            >
              <Link href="/emergency">
                <Clock className="w-5 h-5 mr-2" />
                Request Emergency Service
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
