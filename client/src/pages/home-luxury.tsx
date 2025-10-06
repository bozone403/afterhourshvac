import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Award,
  Shield,
  Star,
  Sparkles,
  Phone,
  Calendar,
  ArrowRight,
  CheckCircle,
  Flame,
  Snowflake,
  Wind,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react';

const HomeLuxury = () => {
  return (
    <>
      <Helmet>
        <title>AfterHours HVAC | Calgary's Premier HVAC Excellence</title>
        <meta name="description" content="Experience unparalleled HVAC service in Calgary. Award-winning technicians, premium installations, and white-glove service since 2009." />
      </Helmet>

      {/* Hero Section - Premium Gradient */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        {/* Premium Badge */}
        <div className="absolute top-8 right-8 z-20">
          <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-6 py-2 rounded-full shadow-xl flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span className="font-semibold text-sm">Calgary's Premier HVAC</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-white/90 text-sm font-medium">Trusted by 5,000+ Calgary Homes</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight">
                  Experience HVAC
                  <br />
                  <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                    Excellence
                  </span>
                </h1>
                
                <p className="text-xl text-blue-100 max-w-xl leading-relaxed">
                  Premium heating, cooling, and air quality solutions delivered with 
                  unmatched precision and care. Your comfort is our commitment.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-2xl shadow-amber-500/50 transition-all hover:scale-105"
                  data-testid="button-emergency-call"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  24/7 Emergency: (403) 613-6014
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white hover:text-slate-900 font-bold text-lg px-8 py-6 rounded-xl transition-all hover:scale-105"
                  asChild
                  data-testid="button-schedule"
                >
                  <Link href="/contact">
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Service
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-black text-amber-400 mb-1">15+</div>
                  <div className="text-sm text-blue-200">Years Excellence</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-amber-400 mb-1">5K+</div>
                  <div className="text-sm text-blue-200">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-amber-400 mb-1">24/7</div>
                  <div className="text-sm text-blue-200">Support</div>
                </div>
              </div>
            </div>

            {/* Right: Premium Feature Cards */}
            <div className="space-y-4">
              <PremiumFeatureCard 
                icon={<Shield className="w-8 h-8" />}
                title="Certified Excellence"
                description="Factory-trained technicians with continuous education"
                accent="from-blue-500 to-blue-600"
              />
              <PremiumFeatureCard 
                icon={<Award className="w-8 h-8" />}
                title="Award-Winning Service"
                description="Calgary's most trusted HVAC service provider"
                accent="from-amber-500 to-amber-600"
              />
              <PremiumFeatureCard 
                icon={<Star className="w-8 h-8" />}
                title="Premium Warranties"
                description="Industry-leading guarantees on all installations"
                accent="from-blue-500 to-blue-600"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Showcase - Elegant Grid */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <Badge className="mb-4 bg-amber-100 text-amber-700 hover:bg-amber-100">
              Our Expertise
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
              Complete HVAC Solutions
            </h2>
            <p className="text-xl text-slate-600">
              From residential comfort to commercial excellence, we deliver perfection
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <LuxuryServiceCard
              icon={<Flame className="w-12 h-12" />}
              title="Premium Heating"
              description="High-efficiency furnaces and heat pumps for ultimate winter comfort"
              features={["Smart Thermostats", "Energy Efficient", "Quiet Operation"]}
              color="from-orange-500 to-red-500"
              link="/shop/furnaces"
            />
            <LuxuryServiceCard
              icon={<Snowflake className="w-12 h-12" />}
              title="Advanced Cooling"
              description="State-of-the-art AC systems for perfect summer climate control"
              features={["Zone Control", "Air Purification", "Smart Integration"]}
              color="from-blue-500 to-cyan-500"
              link="/shop/air-conditioning"
            />
            <LuxuryServiceCard
              icon={<Wind className="w-12 h-12" />}
              title="Air Quality"
              description="Premium filtration and ventilation for healthier living"
              features={["HEPA Filtration", "UV Purification", "Fresh Air Systems"]}
              color="from-emerald-500 to-teal-500"
              link="/services/maintenance"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us - Premium Benefits */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-black mb-8">
                The AfterHours
                <br />
                <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  Difference
                </span>
              </h2>
              <div className="space-y-6">
                <BenefitItem 
                  icon={<CheckCircle className="w-6 h-6" />}
                  title="White-Glove Service"
                  description="Meticulous attention to detail from consultation to completion"
                />
                <BenefitItem 
                  icon={<CheckCircle className="w-6 h-6" />}
                  title="Premium Equipment"
                  description="Top-tier Lennox, Daikin, and Ducane systems"
                />
                <BenefitItem 
                  icon={<CheckCircle className="w-6 h-6" />}
                  title="Transparent Pricing"
                  description="Upfront quotes with no hidden fees or surprises"
                />
                <BenefitItem 
                  icon={<CheckCircle className="w-6 h-6" />}
                  title="Lifetime Support"
                  description="Ongoing maintenance and priority service for life"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900 to-slate-900 p-12 rounded-3xl border border-white/10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-full mb-4">
                  <Star className="w-5 h-5 text-amber-400" />
                  <span className="text-amber-400 font-semibold">Client Testimonial</span>
                </div>
                <div className="flex justify-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xl text-blue-100 italic mb-6">
                  "AfterHours transformed our home comfort. Their attention to detail 
                  and professionalism is unmatched in Calgary."
                </p>
                <div className="text-amber-400 font-semibold">Sarah M. - Calgary SW</div>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-6 rounded-xl"
                asChild
              >
                <Link href="/reviews">
                  View All Reviews
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Premium */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Ready for Excellence?
          </h2>
          <p className="text-xl text-amber-50 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied Calgary homeowners who trust us for their comfort
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-amber-600 hover:bg-amber-50 font-bold text-lg px-8 py-6 rounded-xl shadow-2xl transition-all hover:scale-105"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call (403) 613-6014
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-amber-600 font-bold text-lg px-8 py-6 rounded-xl transition-all hover:scale-105"
              asChild
            >
              <Link href="/calculators">
                Free Quote Calculator
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

// Premium Feature Card
const PremiumFeatureCard = ({ icon, title, description, accent }: any) => (
  <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all hover:scale-105 cursor-pointer">
    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${accent} text-white mb-4`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-blue-200">{description}</p>
  </div>
);

// Luxury Service Card
const LuxuryServiceCard = ({ icon, title, description, features, color, link }: any) => (
  <Link href={link}>
    <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all p-8 hover:-translate-y-2 cursor-pointer border border-slate-100">
      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${color} text-white mb-6`}>
        {icon}
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 mb-6">{description}</p>
      <ul className="space-y-2">
        {features.map((feature: string, i: number) => (
          <li key={i} className="flex items-center text-slate-700">
            <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center text-amber-600 font-semibold group-hover:gap-2 transition-all">
        <span>Learn More</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </Link>
);

// Benefit Item
const BenefitItem = ({ icon, title, description }: any) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 text-amber-400">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-lg mb-1">{title}</h4>
      <p className="text-blue-200">{description}</p>
    </div>
  </div>
);

export default HomeLuxury;
