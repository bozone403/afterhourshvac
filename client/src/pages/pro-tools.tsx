import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useStaticAuth } from '@/hooks/use-static-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  VolumeX,
  Wrench,
  ClipboardList,
  BarChart3,
  Users,
  Calendar,
  DollarSign,
  Zap,
  Building2
} from 'lucide-react';

// Earl AI Chatbot Component
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

const ProTools = () => {
  const { user } = useStaticAuth();
  const [, setLocation] = useLocation();

  // Redirect if not pro user
  if (!user?.isAdmin && !(user?.membershipType === 'pro' || user?.membershipType === 'lifetime')) {
    return (
      <>
        <Helmet>
          <title>Pro Tools Access Required - AfterHours HVAC</title>
          <meta name="description" content="Professional HVAC tools require Pro membership access." />
        </Helmet>
        
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-orange-600">Pro Access Required</CardTitle>
              <CardDescription>
                Professional HVAC tools are available to Pro members only.
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
        <title>Pro Tools - Professional HVAC Toolkit | AfterHours HVAC</title>
        <meta name="description" content="Complete professional HVAC toolkit with Earl AI, calculators, diagnostics, and business tools for certified technicians." />
        <meta name="keywords" content="HVAC professional tools, Earl AI, calculators, diagnostics, pro toolkit" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Crown className="h-10 w-10 text-orange-500" />
              Professional HVAC Toolkit
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete suite of professional tools, AI assistance, and business resources
            </p>
            <Badge className="mt-4 bg-orange-100 text-orange-800 border-orange-200">
              <Crown className="h-3 w-3 mr-1" />
              Pro Member Access
            </Badge>
          </div>

          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="earl" className="space-y-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="earl">Earl AI Expert</TabsTrigger>
                <TabsTrigger value="calculators">Calculators</TabsTrigger>
                <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

              {/* Earl AI Tab */}
              <TabsContent value="earl" className="space-y-6">
                <Card className="bg-gradient-to-br from-orange-50 to-red-100 border-orange-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-800">
                      <MessageSquare className="h-6 w-6" />
                      Earl AI - Your HVAC Expert
                    </CardTitle>
                    <CardDescription className="text-orange-700">
                      30+ years of Alberta HVAC expertise in an AI assistant. Get instant answers on codes, troubleshooting, and installation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EarlChatbot />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Calculators Tab */}
              <TabsContent value="calculators" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Enhanced Quote Builder - Most Comprehensive */}
                  <Link href="/calculators/enhanced-quote-builder">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                      <CardHeader>
                        <FileCheck className="h-10 w-10 text-emerald-600 mb-2" />
                        <CardTitle className="text-emerald-800">Enhanced Quote Builder</CardTitle>
                        <CardDescription className="text-emerald-700">
                          Complete professional estimating with supplier pricing
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Badge className="bg-emerald-200 text-emerald-800">Most Accurate</Badge>
                      </CardContent>
                    </Card>
                  </Link>

                  {/* Pro BTU Calculator - Professional Load Calc */}
                  <Link href="/calculators/pro-btu">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                      <CardHeader>
                        <Thermometer className="h-10 w-10 text-purple-600 mb-2" />
                        <CardTitle className="text-purple-800">Pro Load Calculator</CardTitle>
                        <CardDescription className="text-purple-700">
                          Manual J load calculations for professionals
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Badge className="bg-purple-200 text-purple-800">Manual J</Badge>
                      </CardContent>
                    </Card>
                  </Link>

                  {/* Duct Sizing Calculator */}
                  <Link href="/calculators/duct-sizing">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                      <CardHeader>
                        <Settings className="h-10 w-10 text-indigo-600 mb-2" />
                        <CardTitle className="text-indigo-800">Duct Sizing</CardTitle>
                        <CardDescription className="text-indigo-700">
                          Manual D ductwork design calculations
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Badge className="bg-indigo-200 text-indigo-800">Manual D</Badge>
                      </CardContent>
                    </Card>
                  </Link>

                  {/* Commercial Estimator */}
                  <Link href="/calculators/commercial-estimator">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                      <CardHeader>
                        <Building2 className="h-10 w-10 text-blue-600 mb-2" />
                        <CardTitle className="text-blue-800">Commercial Estimator</CardTitle>
                        <CardDescription className="text-blue-700">
                          Large-scale commercial HVAC calculations
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Badge className="bg-blue-200 text-blue-800">Commercial</Badge>
                      </CardContent>
                    </Card>
                  </Link>

                  {/* Energy Savings Calculator */}
                  <Link href="/calculators/energy-savings">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                      <CardHeader>
                        <Zap className="h-10 w-10 text-green-600 mb-2" />
                        <CardTitle className="text-green-800">Energy Savings</CardTitle>
                        <CardDescription className="text-green-700">
                          Calculate efficiency improvements and savings
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Badge className="bg-green-200 text-green-800">Efficiency</Badge>
                      </CardContent>
                    </Card>
                  </Link>

                  {/* Basic BTU Calculator */}
                  <Link href="/calculators/btu">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                      <CardHeader>
                        <Calculator className="h-10 w-10 text-gray-600 mb-2" />
                        <CardTitle className="text-gray-800">Basic BTU Calculator</CardTitle>
                        <CardDescription className="text-gray-700">
                          Simple BTU calculations for basic sizing
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Badge className="bg-gray-200 text-gray-800">Basic</Badge>
                      </CardContent>
                    </Card>
                  </Link>

                </div>
              </TabsContent>

              {/* Diagnostics Tab */}
              <TabsContent value="diagnostics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  <Link href="/tools/pro-voice-assistant">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100">
                      <CardHeader>
                        <MessageSquare className="h-10 w-10 text-blue-600 mb-2" />
                        <CardTitle>Advanced Voice Diagnostics</CardTitle>
                        <CardDescription>Professional AI with natural conversation flow</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>

                  <Link href="/tools/pro-diagnostic-assistant">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-green-100">
                      <CardHeader>
                        <Settings className="h-10 w-10 text-green-600 mb-2" />
                        <CardTitle>System Analyzer</CardTitle>
                        <CardDescription>Advanced system performance analysis</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>

                  <Link href="/tools/ai-symptom-diagnoser">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100">
                      <CardHeader>
                        <Bot className="h-10 w-10 text-purple-600 mb-2" />
                        <CardTitle>AI Symptom Diagnoser</CardTitle>
                        <CardDescription>Automated troubleshooting assistant</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>

                </div>
              </TabsContent>

              {/* Resources Tab */}
              <TabsContent value="resources" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-red-50 to-red-100">
                    <CardHeader>
                      <FileText className="h-10 w-10 text-red-600 mb-2" />
                      <CardTitle>Alberta Building Code</CardTitle>
                      <CardDescription>ABC 2019 with STANDATA updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full bg-red-600 hover:bg-red-700"
                        onClick={() => window.open('https://www.google.com/search?q=buy+alberta+building+code', '_blank')}
                      >
                        Buy Alberta Building Code
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100">
                    <CardHeader>
                      <AlertTriangle className="h-10 w-10 text-orange-600 mb-2" />
                      <CardTitle>Canadian Gas Code</CardTitle>
                      <CardDescription>CSA B149.1-20 Installation Code</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        onClick={() => window.open('https://www.google.com/search?q=buy+canadian+gas+code+CSA+B149.1', '_blank')}
                      >
                        Buy Canadian Gas Code
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardHeader>
                      <Download className="h-10 w-10 text-blue-600 mb-2" />
                      <CardTitle>Technical Manuals</CardTitle>
                      <CardDescription>Equipment guides and documentation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => window.open('https://www.google.com/search?q=HVAC+technical+manuals', '_blank')}
                      >
                        Access Manuals
                      </Button>
                    </CardContent>
                  </Card>

                </div>
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProTools;
