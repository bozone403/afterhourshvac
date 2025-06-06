import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Phone, Star, ExternalLink, Calendar, MessageCircle } from 'lucide-react';

const QuickContactWidget = () => {
  const [showFullInfo, setShowFullInfo] = useState(false);

  return (
    <section className="bg-dark py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/95 border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="text-2xl font-bold">AH</div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">AfterHours HVAC</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-sm opacity-90">4.9 • 127 reviews</span>
                      </div>
                      <p className="text-sm opacity-90 mt-1">HVAC contractor • Open 24 hours</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500 text-white border-0">
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                    Open
                  </Badge>
                </div>
              </div>

              {/* Main Info */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Info */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Phone className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">(403) 613-6014</p>
                        <p className="text-sm text-gray-600">24/7 Emergency Service</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Calgary & Surrounding Areas</p>
                        <p className="text-sm text-gray-600">Serving residential & commercial</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Open 24 hours</p>
                        <p className="text-sm text-gray-600">Emergency repairs available</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => window.open('tel:4036136014')}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                      onClick={() => window.open('/contact')}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Get Quote
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowFullInfo(!showFullInfo)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {showFullInfo ? 'Less Info' : 'More Info'}
                    </Button>
                  </div>
                </div>

                {/* Expandable Info */}
                {showFullInfo && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">24/7</div>
                        <div className="text-sm text-gray-600">Emergency Service</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">15+</div>
                        <div className="text-sm text-gray-600">Years Experience</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">100%</div>
                        <div className="text-sm text-gray-600">Satisfaction</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Services</h4>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Furnace Repair', 'AC Installation', 'Emergency Service',
                          'Maintenance', 'Commercial HVAC', 'Residential HVAC'
                        ].map((service) => (
                          <Badge key={service} variant="secondary" className="bg-gray-100 text-gray-700">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Recent Reviews</h4>
                      <div className="space-y-3">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex">
                              {[1,2,3,4,5].map(star => (
                                <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-sm font-medium">Sarah M.</span>
                            <span className="text-xs text-gray-500">2 days ago</span>
                          </div>
                          <p className="text-sm text-gray-700">"Excellent service! They fixed our furnace at 2 AM on a weekend. Professional and fair pricing."</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex">
                              {[1,2,3,4,5].map(star => (
                                <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-sm font-medium">Mike R.</span>
                            <span className="text-xs text-gray-500">1 week ago</span>
                          </div>
                          <p className="text-sm text-gray-700">"Best HVAC company in Calgary. Quick response time and they explain everything clearly."</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 text-center">
                <p className="text-xs text-gray-500">
                  Licensed & Insured • Same Day Service Available • Free Estimates
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default QuickContactWidget;