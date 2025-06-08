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
    
    if (lowerInput.includes('vent') || lowerInput.includes('flue')) {
      return "Alright, venting. First thing - what type of furnace are we dealing with? High-efficiency condensing unit or conventional? For high-efficiency, you need System 636 certified PVC/CPVC, sloped 1/4\" per foot back toward the unit. Conventional uses B-vent, sloped 1/4\" per foot UP toward the termination. And for the love of all that's holy, check your clearances from windows, doors, and property lines. B149.1 Table 7.3 has all the termination clearances.";
    }
    
    if (lowerInput.includes('duct') || lowerInput.includes('size')) {
      return "Ductwork sizing, eh? Manual D is your bible here. Don't just guess - do the calculations. Support every 8-10 feet for rigid metal, every 4 feet for flex. Seal every joint with mastic, not just tape. And insulate according to the current STANDATA requirements. Trust me, the inspector will check.";
    }
    
    if (lowerInput.includes('code') || lowerInput.includes('alberta') || lowerInput.includes('calgary')) {
      return "Alberta codes - now you're speaking my language. ABC 2019 is current, but you MUST check the STANDATA. They're constantly updating interpretations. B149.1-20 for gas work, Section 7 for venting. City of Calgary has their own amendments too. When in doubt, call the building department. Better to ask than to fail inspection.";
    }
    
    if (lowerInput.includes('combustion') || lowerInput.includes('air')) {
      return "Combustion air - critical stuff. High-efficiency units usually pull air directly from outside through concentric or twin-pipe systems. For confined spaces with conventional units, you need openings sized per B149.1 Section 8. Two openings minimum - one high, one low. Each needs to be sized for the appliance BTU input. Don't screw this up - it's a safety issue.";
    }

    if (lowerInput.includes('pressure') || lowerInput.includes('gas')) {
      return "Gas pressure testing - listen up. Before you fire anything up, you better test that system. Incoming pressure should be 7\" WC for natural gas, 11\" WC for propane. Manifold pressure varies by unit - check the rating plate. Use a manometer, not some janky gauge. And don't forget to check for leaks with proper soap solution. One small leak can kill someone.";
    }

    if (lowerInput.includes('electrical') || lowerInput.includes('wire')) {
      return "Electrical work on HVAC? Better know what you're doing. Disconnect within sight of the unit, proper wire sizing for the amp draw, and don't forget your grounding. Low voltage thermostat wires are usually 18 AWG, but check your heat pump requirements - some need heavier gauge for the heat strips. And for God's sake, turn the power off before you start poking around.";
    }

    if (lowerInput.includes('refrigerant') || lowerInput.includes('charge')) {
      return "Refrigerant work? You better have your tickets for this. Proper charging is critical - overcharge and you'll kill efficiency and shorten compressor life. Undercharge and same thing happens. Use manifold gauges, know your superheat and subcooling numbers. And recovery - don't you dare vent refrigerant to atmosphere. EPA will have your hide.";
    }
    
    return "I hear ya. Can you be more specific about what you're dealing with? Are we talking installation, troubleshooting, code compliance, or something else? The more details you give me, the better I can help you avoid the common mistakes I see techs make every day. I've been doing this for 30+ years and seen every screw-up in the book.";
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

          {/* Main Content */}
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Earl AI Assistant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                  Earl - Professional HVAC Expert Assistant
                </CardTitle>
                <CardDescription>
                  Your gruff but knowledgeable HVAC expert. Earl specializes in Alberta/BC codes, installation best practices, troubleshooting, and professional guidance. He's your go-to for technical questions and industry expertise.
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
                      <Calculator className="h-8 w-8 text-green-600 mb-2" />
                      <CardTitle className="text-lg">Alberta Rebates</CardTitle>
                      <CardDescription className="text-sm">Calculate rebates and incentives</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/tools/alberta-rebate-calculator">
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          Calculate Rebates
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Calculators Carousel */}
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

            {/* Literature & Codes Carousel */}
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
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        View ABC 2019
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
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
                        View B149.1
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-yellow-50 to-yellow-100">
                    <CardHeader className="pb-3">
                      <Crown className="h-8 w-8 text-yellow-600 mb-2" />
                      <CardTitle className="text-lg">Calgary Cheat Sheet</CardTitle>
                      <CardDescription className="text-sm">Earl's field reference guide</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                        View Cheat Sheet
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-green-100">
                    <CardHeader className="pb-3">
                      <Settings className="h-8 w-8 text-green-600 mb-2" />
                      <CardTitle className="text-lg">HVAC Installation Guide</CardTitle>
                      <CardDescription className="text-sm">Best practices and procedures</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        View Guide
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
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        View CEC
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardHeader className="pb-3">
                      <Download className="h-8 w-8 text-purple-600 mb-2" />
                      <CardTitle className="text-lg">Pricing Guides</CardTitle>
                      <CardDescription className="text-sm">Alberta HVAC pricing standards</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        View Pricing
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