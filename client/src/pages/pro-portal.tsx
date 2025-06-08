import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link, useLocation } from 'wouter';
import { 
  Calculator, 
  FileText, 
  Bot, 
  BookOpen, 
  Download,
  Crown,
  AlertTriangle,
  Thermometer,
  Settings,
  FileCheck,
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';

const EarlChatbot = () => {
  const [messages, setMessages] = useState<Array<{id: number, text: string, sender: 'user' | 'earl'}>>([
    {
      id: 1,
      text: "Earl here. Been working HVAC for 30+ years in Alberta. What's your problem? Don't waste my time with the basics - give me the details and I'll tell you how to fix it right the first time.",
      sender: 'earl'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user' as const
    };

    setMessages(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      const response = generateEarlResponse(inputText);
      const earlMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'earl' as const
      };
      
      setMessages(prev => [...prev, earlMessage]);
      speakResponse(response);
      setInputText('');
    }, 1500);
  };

  const generateEarlResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    // Venting and flue systems
    if (lowerInput.includes('vent') || lowerInput.includes('flue')) {
      return "Alright, venting. First thing - what type of furnace are we dealing with? High-efficiency condensing unit or conventional? For high-efficiency, you need System 636 certified PVC/CPVC, sloped 1/4\" per foot back toward the unit. Conventional uses B-vent, sloped 1/4\" per foot UP toward the termination. And for the love of all that's holy, check your clearances from windows, doors, and property lines. B149.1 Table 7.3 has all the termination clearances.";
    }
    
    // Ductwork and sizing
    if (lowerInput.includes('duct') || lowerInput.includes('size')) {
      return "Ductwork sizing, eh? Manual D is your bible here. Don't just guess - do the calculations. Support every 8-10 feet for rigid metal, every 4 feet for flex. Seal every joint with mastic, not just tape. And insulate according to the current STANDATA requirements. Trust me, the inspector will check.";
    }
    
    // Heat pumps and system types
    if (lowerInput.includes('heat pump') || lowerInput.includes('heat strip') || lowerInput.includes('auxiliary heat')) {
      return "Heat pumps in Alberta? You're dealing with cold climate units here. Look for models rated down to -25°C minimum. Dual fuel setups work great - heat pump above 0°C, gas backup below. Heat strips are electric resistance - check your amp draw, most units pull 20-40 amps per strip. And don't forget your crankcase heater in cold climates.";
    }
    
    // Furnace troubleshooting
    if (lowerInput.includes('furnace') && (lowerInput.includes('not') || lowerInput.includes('problem') || lowerInput.includes('issue'))) {
      return "Furnace acting up? Start with the basics - thermostat calling for heat? Power to the unit? Gas valve open? Check your sequence: thermostat calls, inducer starts, pressure switch closes, igniter glows, gas valve opens, burner lights, blower delay, then heat. If it's stopping anywhere in that sequence, that's your problem area.";
    }
    
    // Boiler systems
    if (lowerInput.includes('boiler') || lowerInput.includes('hydronic') || lowerInput.includes('radiant')) {
      return "Boiler work, eh? Cast iron, steel fire tube, or condensing? Each has its quirks. Operating temps: cast iron 160-180°F, condensing 130-140°F for efficiency. Watch your water quality - hardness over 7 grains, you need treatment. Expansion tank sizing is critical - 1 gallon per 50 gallons system volume. And don't forget your low water cutoff.";
    }
    
    // Air conditioning and cooling
    if (lowerInput.includes('ac') || lowerInput.includes('air condition') || lowerInput.includes('cooling') || lowerInput.includes('evaporator')) {
      return "AC problems? First check - is the outdoor unit running? Dirty filter will kill airflow and freeze your evap coil. Refrigerant leak? Look for oil stains, ice buildup, or short cycling. Superheat should be 8-12°F for most systems, subcooling 10-15°F. Low superheat = overcharge or restriction, high superheat = undercharge or airflow issues.";
    }
    
    // Refrigeration and commercial
    if (lowerInput.includes('refrigeration') || lowerInput.includes('commercial') || lowerInput.includes('walk-in') || lowerInput.includes('freezer')) {
      return "Commercial refrigeration? That's a different beast. Walk-ins typically run R-404A or R-449A now. Evap temp for coolers: 28-32°F, freezers: -10 to -5°F. Defrost is critical - electric, hot gas, or reverse cycle. TXV bulb placement matters - secure contact, insulated. And always check your oil return in low-temp systems.";
    }
    
    // Controls and thermostats
    if (lowerInput.includes('thermostat') || lowerInput.includes('control') || lowerInput.includes('zone')) {
      return "Controls giving you grief? Old mercury stats are simple but done. Digital programmables need proper wire sizing - 18 AWG minimum for runs over 50 feet. Heat pump stats need O/B wire - O for cooling, B for heating call. Zone systems? Check your damper motors, end switches, and static pressure. Bypass damper might be needed.";
    }
    
    // Combustion air and ventilation
    if (lowerInput.includes('combustion') || lowerInput.includes('air') || lowerInput.includes('ventilation')) {
      return "Combustion air - critical stuff. High-efficiency units usually pull air directly from outside through concentric or twin-pipe systems. For confined spaces with conventional units, you need openings sized per B149.1 Section 8. Two openings minimum - one high, one low. Each needs to be sized for the appliance BTU input. Don't screw this up - it's a safety issue.";
    }

    // Gas pressure and testing
    if (lowerInput.includes('pressure') || lowerInput.includes('gas')) {
      return "Gas pressure testing - listen up. Before you fire anything up, you better test that system. Incoming pressure should be 7\" WC for natural gas, 11\" WC for propane. Manifold pressure varies by unit - check the rating plate. Use a manometer, not some janky gauge. And don't forget to check for leaks with proper soap solution. One small leak can kill someone.";
    }

    // Electrical systems
    if (lowerInput.includes('electrical') || lowerInput.includes('wire') || lowerInput.includes('motor')) {
      return "Electrical work on HVAC? Better know what you're doing. Disconnect within sight of the unit, proper wire sizing for the amp draw, and don't forget your grounding. Low voltage thermostat wires are usually 18 AWG, but check your heat pump requirements - some need heavier gauge for the heat strips. Compressor motors - check your start components: contactor, capacitors, and overloads.";
    }

    // Refrigerant and charging
    if (lowerInput.includes('refrigerant') || lowerInput.includes('charge') || lowerInput.includes('leak')) {
      return "Refrigerant work? You better have your tickets for this. Proper charging is critical - overcharge and you'll kill efficiency and shorten compressor life. Undercharge and same thing happens. Use manifold gauges, know your superheat and subcooling numbers. And recovery - don't you dare vent refrigerant to atmosphere. EPA will have your hide.";
    }
    
    // Codes and regulations
    if (lowerInput.includes('code') || lowerInput.includes('alberta') || lowerInput.includes('calgary') || lowerInput.includes('inspection')) {
      return "Alberta codes - now you're speaking my language. ABC 2019 is current, but you MUST check the STANDATA. They're constantly updating interpretations. B149.1-20 for gas work, Section 7 for venting. City of Calgary has their own amendments too. When in doubt, call the building department. Better to ask than to fail inspection.";
    }
    
    // Installation and startup
    if (lowerInput.includes('install') || lowerInput.includes('startup') || lowerInput.includes('commission')) {
      return "Installation time? Do it right the first time. Level the unit, proper clearances, secure gas connections with pipe dope or thread sealant - never Teflon tape on gas threads. Electrical connections tight, condensate drain sloped properly. Startup sequence: gas leak test, electrical check, airflow verification, temperature rise check, and document everything.";
    }
    
    // Maintenance and service
    if (lowerInput.includes('maintenance') || lowerInput.includes('service') || lowerInput.includes('tune') || lowerInput.includes('clean')) {
      return "Maintenance keeps you in business. Annual service minimum - change filters, check gas pressures, clean flame sensor, inspect heat exchanger, test safety controls. Coil cleaning with proper chemicals, not just water. Belt tension - 1\" deflection per foot of span. And always check your combustion analysis - CO levels, draft, and efficiency.";
    }
    
    // Safety and troubleshooting
    if (lowerInput.includes('safety') || lowerInput.includes('carbon monoxide') || lowerInput.includes('co') || lowerInput.includes('dangerous')) {
      return "Safety first - that's not just talk. Carbon monoxide kills. Test every gas appliance annually with a combustion analyzer. Cracked heat exchangers, blocked vents, improper installations - all potential killers. If you smell gas, shut it down immediately. When in doubt, tag it out. Your reputation and someone's life depends on it.";
    }
    
    // Specific equipment brands
    if (lowerInput.includes('carrier') || lowerInput.includes('lennox') || lowerInput.includes('trane') || lowerInput.includes('goodman') || lowerInput.includes('rheem')) {
      return "Brand-specific issues? Each manufacturer has their quirks. Carrier - watch their integrated controls. Lennox - heat exchanger issues on older units. Trane - solid but parts cost more. Goodman - budget option but check your installation manual closely. Rheem - good mid-range, watch for pressure switch issues on newer models.";
    }
    
    // Tools and equipment
    if (lowerInput.includes('tool') || lowerInput.includes('equipment') || lowerInput.includes('meter') || lowerInput.includes('gauge')) {
      return "Tools make the job. Digital manifold gauges are worth the investment - faster evacuation, better accuracy. Combustion analyzer is mandatory for gas work. Good multimeter, megohmmeter for motor testing, manometer for pressures. Don't cheap out on recovery equipment - it'll cost you more in the long run when it breaks down.";
    }
    
    // Energy efficiency and upgrades
    if (lowerInput.includes('efficiency') || lowerInput.includes('upgrade') || lowerInput.includes('rebate') || lowerInput.includes('energy')) {
      return "Efficiency upgrades? AFUE ratings: 80% minimum, 90%+ for condensing. SEER ratings for cooling: 13 minimum, 16+ for high efficiency. Variable speed equipment costs more upfront but saves long-term. Don't forget about proper sizing - oversized equipment short cycles and wastes energy. Load calculations are mandatory.";
    }

    // Default comprehensive response
    return "I hear ya. Can you be more specific about what you're dealing with? Are we talking installation, troubleshooting, code compliance, or something else? I've got 30+ years in this trade - furnaces, boilers, heat pumps, AC, refrigeration, controls, you name it. Gas, electric, oil - seen it all. The more details you give me, the better I can help you avoid the common mistakes I see techs make every day.";
  };

  return (
    <div className="flex flex-col h-[600px] bg-white border rounded-lg">
      <div className="bg-orange-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <span className="font-semibold">Earl</span>
            <Badge variant="secondary" className="bg-orange-500 text-white">
              Professional HVAC Expert
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {isSpeaking && (
              <Button
                onClick={stopSpeaking}
                variant="outline"
                size="sm"
                className="bg-red-100 text-red-600 hover:bg-red-200"
              >
                <VolumeX className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
            </div>
          ))}
          {isSpeaking && (
            <div className="flex justify-start">
              <div className="bg-orange-100 text-orange-600 p-3 rounded-lg flex items-center gap-2">
                <Volume2 className="h-4 w-4 animate-pulse" />
                <span className="text-sm">Earl is speaking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask Earl about HVAC codes, installation, troubleshooting..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <Button
            onClick={startListening}
            disabled={isListening}
            variant="outline"
            size="sm"
            className={`${isListening ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'}`}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button onClick={sendMessage} className="bg-orange-600 hover:bg-orange-700">
            Send
          </Button>
        </div>
        {isListening && (
          <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            Listening for voice input...
          </div>
        )}
      </div>
    </div>
  );
};

const ProPortal = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if not pro user
  if (!user?.hasProAccess && !user?.hasPro) {
    return (
      <>
        <Helmet>
          <title>Pro Portal Access Required - AfterHours HVAC</title>
          <meta name="description" content="Professional HVAC tools and resources require Pro membership access." />
        </Helmet>
        
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-orange-600">Pro Access Required</CardTitle>
              <CardDescription>
                Professional HVAC tools and resources are available to Pro members only.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Upgrade to Pro membership to access Earl AI, professional calculators, diagnostic tools, and Alberta/BC code documentation.
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={() => setLocation('/membership')} 
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  Upgrade to Pro
                </Button>
                <Button 
                  onClick={() => setLocation('/')} 
                  variant="outline" 
                  className="w-full"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Pro Portal - Professional HVAC Tools | AfterHours HVAC</title>
        <meta name="description" content="Professional HVAC tools, Earl AI assistant, diagnostic systems, calculators, and Alberta/BC building codes for certified technicians." />
        <meta name="keywords" content="HVAC professional tools, Earl AI, Alberta building code, diagnostic tools, HVAC calculators, pro portal" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Professional HVAC Portal
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access professional HVAC tools, expert AI assistance, and comprehensive documentation
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-8">
            {/* Earl AI Assistant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                  Earl - Professional HVAC Expert Assistant
                </CardTitle>
                <CardDescription>
                  Your gruff but knowledgeable HVAC expert. Earl specializes in Alberta/BC codes, installation best practices, troubleshooting, and professional guidance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EarlChatbot />
              </CardContent>
            </Card>

            {/* Diagnostic Tools Carousel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  Diagnostic Tools
                </CardTitle>
                <CardDescription>
                  AI-powered diagnostic assistants for field work and troubleshooting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-50 to-orange-100">
                    <CardHeader className="pb-3">
                      <Bot className="h-8 w-8 text-orange-600 mb-2" />
                      <CardTitle className="text-lg">Pro Diagnostic Assistant</CardTitle>
                      <CardDescription className="text-sm">Advanced AI technical diagnostics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/tools/pro-diagnostic-assistant">
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                          Launch Diagnostics
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardHeader className="pb-3">
                      <MessageSquare className="h-8 w-8 text-blue-600 mb-2" />
                      <CardTitle className="text-lg">Voice Diagnostics</CardTitle>
                      <CardDescription className="text-sm">Hands-free diagnostic assistant</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/tools/ai-symptom-diagnoser">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          Start Voice Mode
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-green-100">
                    <CardHeader className="pb-3">
                      <Settings className="h-8 w-8 text-green-600 mb-2" />
                      <CardTitle className="text-lg">System Analyzer</CardTitle>
                      <CardDescription className="text-sm">Advanced system performance analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/tools/system-analyzer">
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          Analyze System
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Professional Calculators Carousel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-purple-600" />
                  Professional Calculators
                </CardTitle>
                <CardDescription>
                  Load calculations, sizing tools, and professional estimating
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardHeader className="pb-3">
                      <Thermometer className="h-8 w-8 text-purple-600 mb-2" />
                      <CardTitle className="text-lg">Load Calculator</CardTitle>
                      <CardDescription className="text-sm">Manual J load calculations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/calculators/pro-btu">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700">
                          Open Calculator
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-indigo-50 to-indigo-100">
                    <CardHeader className="pb-3">
                      <Settings className="h-8 w-8 text-indigo-600 mb-2" />
                      <CardTitle className="text-lg">Duct Sizing</CardTitle>
                      <CardDescription className="text-sm">Manual D ductwork design</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/calculators/duct-sizing">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                          Size Ducts
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-emerald-50 to-emerald-100">
                    <CardHeader className="pb-3">
                      <FileCheck className="h-8 w-8 text-emerald-600 mb-2" />
                      <CardTitle className="text-lg">Quote Builder</CardTitle>
                      <CardDescription className="text-sm">Professional job estimating</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/calculators/enhanced-quote-builder">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                          Build Quote
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Professional Literature & Codes Carousel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-teal-600" />
                  Professional Literature & Codes
                </CardTitle>
                <CardDescription>
                  Alberta Building Code, Canadian Gas Code, and professional documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-red-50 to-red-100">
                    <CardHeader className="pb-3">
                      <FileText className="h-8 w-8 text-red-600 mb-2" />
                      <CardTitle className="text-lg">Alberta Building Code</CardTitle>
                      <CardDescription className="text-sm">ABC 2019 with STANDATA updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full bg-red-600 hover:bg-red-700"
                        onClick={() => window.open('https://www.alberta.ca/building-code', '_blank')}
                      >
                        View Official ABC
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-50 to-orange-100">
                    <CardHeader className="pb-3">
                      <AlertTriangle className="h-8 w-8 text-orange-600 mb-2" />
                      <CardTitle className="text-lg">Canadian Gas Code</CardTitle>
                      <CardDescription className="text-sm">CSA B149.1-20 Installation Code</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        onClick={() => window.open('https://www.csagroup.org/store/product/CSA%20B149.1-20/', '_blank')}
                      >
                        View CSA B149.1
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-yellow-50 to-yellow-100">
                    <CardHeader className="pb-3">
                      <Crown className="h-8 w-8 text-yellow-600 mb-2" />
                      <CardTitle className="text-lg">Calgary Permit Guide</CardTitle>
                      <CardDescription className="text-sm">City of Calgary HVAC requirements</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full bg-yellow-600 hover:bg-yellow-700"
                        onClick={() => window.open('https://www.calgary.ca/pda/pd/permits/residential-permits.html', '_blank')}
                      >
                        View City Requirements
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-green-100">
                    <CardHeader className="pb-3">
                      <Settings className="h-8 w-8 text-green-600 mb-2" />
                      <CardTitle className="text-lg">TSSA Guidelines</CardTitle>
                      <CardDescription className="text-sm">Technical Standards & Safety Authority</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => window.open('https://www.tssa.org/', '_blank')}
                      >
                        View TSSA Resources
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardHeader className="pb-3">
                      <FileText className="h-8 w-8 text-blue-600 mb-2" />
                      <CardTitle className="text-lg">Electrical Code</CardTitle>
                      <CardDescription className="text-sm">Canadian Electrical Code (CEC)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => window.open('https://www.csagroup.org/store/product/2403604/', '_blank')}
                      >
                        View CEC Standards
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardHeader className="pb-3">
                      <Download className="h-8 w-8 text-purple-600 mb-2" />
                      <CardTitle className="text-lg">HRAI Resources</CardTitle>
                      <CardDescription className="text-sm">Heating, Refrigeration & Air Conditioning Institute</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={() => window.open('https://www.hrai.ca/', '_blank')}
                      >
                        View Industry Standards
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProPortal;