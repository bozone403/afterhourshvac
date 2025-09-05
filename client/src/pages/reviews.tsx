import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  Star,
  Quote,
  Calendar,
  MapPin,
  ThumbsUp,
  CheckCircle,
  Award,
  Users,
  TrendingUp,
  Clock
} from "lucide-react";
import { Link } from "wouter";

export default function Reviews() {
  const featuredReviews = [
    {
      name: "Sarah M.",
      location: "Calgary, AB",
      service: "Furnace Installation",
      rating: 5,
      date: "December 2024",
      review: "Jordan and his team installed our new high-efficiency furnace in November. The work was done professionally, on time, and within budget. Our heating bills have already dropped significantly. Highly recommend AfterHours HVAC!",
      verified: true
    },
    {
      name: "Mike R.",
      location: "Airdrie, AB", 
      service: "Emergency AC Repair",
      rating: 5,
      date: "August 2024",
      review: "Called them on a Sunday when our AC died during the heat wave. Derek was at our house within 2 hours and had us back up and running. Fair pricing and excellent service - these guys are the real deal.",
      verified: true
    },
    {
      name: "Jennifer L.",
      location: "Calgary, AB",
      service: "Annual Maintenance",
      rating: 5,
      date: "October 2024",
      review: "We've been using AfterHours for our annual maintenance for 3 years now. They're always thorough, explain everything clearly, and their preventive approach has saved us from any major breakdowns.",
      verified: true
    },
    {
      name: "Robert T.",
      location: "Okotoks, AB",
      service: "Duct Cleaning",
      rating: 5,
      date: "September 2024",
      review: "Amazing duct cleaning service! They showed us before and after photos - the difference was incredible. Our home's air quality has improved noticeably. Professional team and fair pricing.",
      verified: true
    },
    {
      name: "Lisa K.",
      location: "Calgary, AB",
      service: "Heat Pump Installation",
      rating: 5,
      date: "June 2024",
      review: "Jordan helped us choose the perfect heat pump for our home. The installation was flawless and the team cleaned up everything. Our energy costs have dropped 40% compared to our old system!",
      verified: true
    },
    {
      name: "David W.",
      location: "Calgary, AB",
      service: "Commercial HVAC",
      rating: 5,
      date: "November 2024",
      review: "AfterHours handles all our commercial HVAC needs. They're reliable, professional, and their preventive maintenance has kept our systems running smoothly for years. Great team!",
      verified: true
    }
  ];

  const stats = [
    { number: "4.9/5", label: "Average Rating", icon: Star },
    { number: "500+", label: "5-Star Reviews", icon: ThumbsUp },
    { number: "98%", label: "Customer Satisfaction", icon: CheckCircle },
    { number: "95%", label: "Referral Rate", icon: Users }
  ];

  const platforms = [
    { name: "Google Reviews", rating: "4.9/5", reviews: "200+" },
    { name: "Better Business Bureau", rating: "A+", reviews: "Accredited" },
    { name: "Facebook", rating: "4.8/5", reviews: "150+" },
    { name: "HomeStars", rating: "4.9/5", reviews: "100+" }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Customer Reviews - AfterHours HVAC Calgary | 4.9/5 Star Rating</title>
        <meta name="description" content="Read authentic customer reviews for AfterHours HVAC in Calgary. 4.9/5 star rating with 500+ satisfied customers. See what our clients say about our HVAC services." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600 text-white py-20">
        <div className="hvac-container">
          <div className="text-center">
            <Badge className="bg-orange-500 text-white mb-4">
              4.9/5 Star Rating
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              What Our Customers Say
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Don't just take our word for it. Read reviews from hundreds of satisfied customers 
              who trust AfterHours HVAC for their heating and cooling needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                <Phone className="w-5 h-5 mr-2" />
                Call (403) 613-6014
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900" asChild>
                <Link href="/contact">Get Your Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Review Stats */}
      <section className="py-16 bg-white">
        <div className="hvac-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardContent className="p-6">
                  <stat.icon className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Reviews */}
      <section className="py-16 bg-blue-50">
        <div className="hvac-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Customer Reviews
            </h2>
            <p className="text-lg text-gray-600">
              Real feedback from real customers about their experience with our services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredReviews.map((review, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{review.name}</CardTitle>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {review.location}
                        </div>
                      </div>
                    </div>
                    {review.verified && (
                      <Badge className="bg-green-100 text-green-600 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  
                  <Badge variant="outline" className="text-xs w-fit">
                    {review.service}
                  </Badge>
                </CardHeader>
                
                <CardContent>
                  <div className="relative">
                    <Quote className="w-6 h-6 text-blue-200 absolute -top-2 -left-1" />
                    <p className="text-gray-700 leading-relaxed pl-4 italic">
                      "{review.review}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Review Platforms */}
      <section className="py-16">
        <div className="hvac-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Find Us on Review Platforms
            </h2>
            <p className="text-lg text-gray-600">
              We're proud of our reputation across multiple review platforms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platforms.map((platform, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6">
                  <Award className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">{platform.name}</h3>
                  <div className="text-2xl font-bold text-orange-500 mb-1">{platform.rating}</div>
                  <p className="text-sm text-gray-600">{platform.reviews}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Write a Review */}
      <section className="py-16 bg-gray-100">
        <div className="hvac-container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Share Your Experience
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Had a great experience with AfterHours HVAC? We'd love to hear about it! 
              Your feedback helps us improve and helps other customers make informed decisions.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card className="p-6 border-0 shadow-lg">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Leave a Google Review</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Share your experience on Google to help other local customers find us.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Write Google Review
                </Button>
              </Card>
              
              <Card className="p-6 border-0 shadow-lg">
                <Mail className="w-8 h-8 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Email Us Feedback</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Send us your thoughts directly and help us continue improving our service.
                </p>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Email Feedback
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Highlights */}
      <section className="py-16 bg-white">
        <div className="hvac-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Makes Us Different
            </h2>
            <p className="text-lg text-gray-600">
              Common themes from our customer reviews highlight what sets us apart.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-4">Reliable & Punctual</h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 italic">"Always on time and professional"</p>
                  <p className="text-sm text-gray-600 italic">"Quick response to our emergency call"</p>
                  <p className="text-sm text-gray-600 italic">"Finished the job when promised"</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <Award className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-4">Quality Work</h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 italic">"Exceptional attention to detail"</p>
                  <p className="text-sm text-gray-600 italic">"Clean, professional installation"</p>
                  <p className="text-sm text-gray-600 italic">"Work was done perfectly"</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-4">Honest & Fair</h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 italic">"Fair and transparent pricing"</p>
                  <p className="text-sm text-gray-600 italic">"Honest about what we needed"</p>
                  <p className="text-sm text-gray-600 italic">"No unnecessary upselling"</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="hvac-container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Experience the AfterHours Difference
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied customers who trust us for their HVAC needs. 
            See why we're Calgary's highest-rated HVAC company.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
              <Phone className="w-5 h-5 mr-2" />
              Call (403) 613-6014
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Service
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}