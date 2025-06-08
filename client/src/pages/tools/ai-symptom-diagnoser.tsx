import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bot, MessageSquare, AlertTriangle, CheckCircle, Wrench, Phone, ArrowRight, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  type: 'user' | 'earl';
  content: string;
  timestamp: Date;
  severity?: 'low' | 'medium' | 'high';
  suggestions?: string[];
  nextQuestions?: string[];
  callToAction?: {
    text: string;
    action: string;
    urgent?: boolean;
  };
}

interface Diagnosis {
  issue: string;
  probability: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
  diyFix?: string;
  whenToCallPro: string;
}

export default function AISymptomDiagnoser() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'earl',
      content: "Hi there! I'm Earl, your HVAC diagnostic assistant. Tell me what's happening with your heating or cooling system, and I'll help you figure out what might be wrong. Don't worry about technical terms - just describe what you're experiencing in your own words.",
      timestamp: new Date(),
      nextQuestions: [
        "My AC is running but not cooling",
        "My furnace is making strange noises", 
        "My house isn't heating evenly",
        "My energy bills are really high"
      ]
    }
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentDiagnosis, setCurrentDiagnosis] = useState<Diagnosis[]>([]);
  const { toast } = useToast();

  // AI logic for diagnosing HVAC issues
  const analyzeSymptoms = (userInput: string): { response: ChatMessage, diagnoses: Diagnosis[] } => {
    const input = userInput.toLowerCase();
    
    // AC not cooling issues
    if (input.includes('ac') && (input.includes('not cool') || input.includes('warm air') || input.includes('not cold'))) {
      return {
        response: {
          id: Date.now().toString(),
          type: 'earl',
          content: "I see your AC is running but not cooling properly. Let me ask a few quick questions to narrow this down:",
          timestamp: new Date(),
          nextQuestions: [
            "Is the outdoor unit running and making noise?",
            "Are you getting any airflow from the vents?",
            "When did you last change your air filter?",
            "Is the large copper pipe going to the outdoor unit cold and sweating?"
          ]
        },
        diagnoses: [
          {
            issue: "Dirty Air Filter",
            probability: 85,
            severity: 'low',
            description: "A clogged filter restricts airflow and reduces cooling efficiency",
            diyFix: "Replace your air filter with a new one. Check monthly during peak season.",
            whenToCallPro: "If replacing the filter doesn't solve the issue within 2 hours"
          },
          {
            issue: "Low Refrigerant",
            probability: 70,
            severity: 'high',
            description: "Refrigerant leak causes poor cooling and can damage the compressor",
            whenToCallPro: "This requires professional diagnosis and repair. Continuing to run the system could cause expensive compressor damage."
          },
          {
            issue: "Dirty Evaporator Coil",
            probability: 60,
            severity: 'medium',
            description: "Ice buildup or dirt on indoor coil reduces heat transfer",
            whenToCallPro: "Professional cleaning required. This is part of regular maintenance."
          }
        ]
      };
    }

    // Furnace noise issues
    if ((input.includes('furnace') || input.includes('heater')) && (input.includes('noise') || input.includes('loud') || input.includes('bang') || input.includes('rattle'))) {
      return {
        response: {
          id: Date.now().toString(),
          type: 'earl',
          content: "Furnace noises can range from normal to concerning. Help me understand what you're hearing:",
          timestamp: new Date(),
          nextQuestions: [
            "Is it a banging sound when it first starts up?",
            "Does it rattle continuously while running?",
            "Is it a high-pitched squealing or screeching?",
            "Is it coming from the ductwork or the furnace itself?"
          ]
        },
        diagnoses: [
          {
            issue: "Delayed Ignition",
            probability: 75,
            severity: 'high',
            description: "Gas buildup causes loud bang when it finally ignites",
            whenToCallPro: "This is a safety issue that requires immediate professional attention. Stop using the system."
          },
          {
            issue: "Loose Ductwork",
            probability: 60,
            severity: 'low',
            description: "Metal ducts expand and contract, causing popping sounds",
            diyFix: "Check visible ductwork for loose joints. Secure with metal tape if accessible.",
            whenToCallPro: "If noise persists or you can't locate the source"
          },
          {
            issue: "Worn Blower Motor Bearings",
            probability: 55,
            severity: 'medium',
            description: "Squealing or grinding indicates motor bearing wear",
            whenToCallPro: "Requires professional motor service or replacement"
          }
        ]
      };
    }

    // Uneven heating
    if (input.includes('uneven') || input.includes('cold spots') || input.includes('some rooms')) {
      return {
        response: {
          id: Date.now().toString(),
          type: 'earl',
          content: "Uneven heating is a common issue with several possible causes. Let me help you identify the most likely culprit:",
          timestamp: new Date(),
          nextQuestions: [
            "Are the cold rooms upstairs or downstairs?",
            "Do the cold rooms have vents that are open?",
            "Is this a new problem or has it always been this way?",
            "Do you have a two-story home with one thermostat?"
          ]
        },
        diagnoses: [
          {
            issue: "Blocked or Closed Vents",
            probability: 80,
            severity: 'low',
            description: "Furniture, curtains, or closed dampers prevent proper airflow",
            diyFix: "Check all vents are open and unobstructed. Ensure register dampers are open.",
            whenToCallPro: "If all vents are clear but problem persists"
          },
          {
            issue: "Ductwork Issues",
            probability: 65,
            severity: 'medium',
            description: "Leaky or disconnected ducts lose heated air before reaching rooms",
            whenToCallPro: "Professional duct inspection and sealing may be needed"
          },
          {
            issue: "Undersized System",
            probability: 40,
            severity: 'high',
            description: "System lacks capacity to heat entire home properly",
            whenToCallPro: "Requires professional load calculation and potential system upgrade"
          }
        ]
      };
    }

    // High energy bills
    if (input.includes('high bill') || input.includes('expensive') || input.includes('energy cost')) {
      return {
        response: {
          id: Date.now().toString(),
          type: 'earl',
          content: "High energy bills usually indicate your system is working harder than it should. Let's find out why:",
          timestamp: new Date(),
          nextQuestions: [
            "How old is your current system?",
            "When was the last time you had maintenance done?",
            "Have you noticed the system running more often?",
            "Are there any comfort issues with temperature?"
          ]
        },
        diagnoses: [
          {
            issue: "Dirty Air Filter",
            probability: 90,
            severity: 'low',
            description: "Clogged filter forces system to work harder",
            diyFix: "Replace air filter immediately. Check monthly during heating/cooling season.",
            whenToCallPro: "If bills remain high after filter replacement"
          },
          {
            issue: "Lack of Maintenance",
            probability: 75,
            severity: 'medium',
            description: "Dirty coils and worn parts reduce efficiency",
            whenToCallPro: "Annual maintenance prevents most efficiency issues and extends equipment life"
          },
          {
            issue: "Aging Equipment",
            probability: 60,
            severity: 'high',
            description: "Systems over 15 years old lose efficiency significantly",
            whenToCallPro: "Professional efficiency evaluation and replacement options discussion"
          }
        ]
      };
    }

    // Generic response for other issues
    return {
      response: {
        id: Date.now().toString(),
        type: 'earl',
        content: "I'd like to help you with that issue. Can you provide more specific details about what's happening? For example:",
        timestamp: new Date(),
        nextQuestions: [
          "Is this a heating or cooling problem?",
          "What exactly is the system doing or not doing?",
          "When did you first notice this issue?",
          "Have you tried anything to fix it already?"
        ]
      },
      diagnoses: []
    };
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput("");
    setIsAnalyzing(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const { response, diagnoses } = analyzeSymptoms(currentInput);
      setMessages(prev => [...prev, response]);
      setCurrentDiagnosis(diagnoses);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setCurrentInput(question);
  };

  const handleCallToAction = (action: string) => {
    if (action === 'book_diagnostic') {
      toast({
        title: "Booking Diagnostic",
        description: "Redirecting to our booking system...",
      });
      window.location.href = '/emergency-service';
    }
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-blue-100 border border-blue-200 rounded-full px-6 py-3 mb-6">
            <Bot className="h-6 w-6 text-blue-700 mr-3" />
            <span className="text-blue-800 text-lg font-bold">AI Diagnostic Assistant</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Meet Earl - Your HVAC Expert</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Get instant, professional help diagnosing your heating and cooling problems. Earl asks the right questions 
            to help identify issues and guide you to the best solution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white h-96">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5" />
                  Chat with Earl
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-full flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        {message.nextQuestions && (
                          <div className="mt-3 space-y-2">
                            {message.nextQuestions.map((question, index) => (
                              <button
                                key={index}
                                onClick={() => handleQuickQuestion(question)}
                                className="block w-full text-left text-xs bg-white/20 hover:bg-white/30 rounded px-2 py-1 transition-colors"
                              >
                                {question}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isAnalyzing && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                          <span className="text-sm">Earl is analyzing your symptoms...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      placeholder="Describe your HVAC problem..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={isAnalyzing || !currentInput.trim()}>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Diagnosis Results */}
          <div className="space-y-4">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <Wrench className="h-5 w-5" />
                  Possible Diagnoses
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {currentDiagnosis.length > 0 ? (
                  <div className="space-y-4">
                    {currentDiagnosis.map((diagnosis, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{diagnosis.issue}</h4>
                          <Badge className={`text-xs ${getSeverityColor(diagnosis.severity)}`}>
                            <span className="flex items-center gap-1">
                              {getSeverityIcon(diagnosis.severity)}
                              {diagnosis.probability}%
                            </span>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{diagnosis.description}</p>
                        
                        {diagnosis.diyFix && (
                          <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
                            <p className="text-xs font-medium text-blue-800 mb-1">DIY Fix:</p>
                            <p className="text-xs text-blue-700">{diagnosis.diyFix}</p>
                          </div>
                        )}
                        
                        <div className="bg-gray-50 border border-gray-200 rounded p-2">
                          <p className="text-xs font-medium text-gray-800 mb-1">Call Professional When:</p>
                          <p className="text-xs text-gray-700">{diagnosis.whenToCallPro}</p>
                        </div>
                      </div>
                    ))}
                    
                    {currentDiagnosis.some(d => d.severity === 'high') && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-bold text-red-900 mb-2">Professional Service Recommended</h4>
                        <p className="text-sm text-red-800 mb-3">
                          Based on your symptoms, this issue requires professional diagnosis and repair. 
                          Our certified technicians can properly diagnose and fix the problem safely.
                        </p>
                        <Button 
                          onClick={() => handleCallToAction('book_diagnostic')}
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Book Diagnostic - $149
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Bot className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>Start chatting with Earl to get your diagnosis</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card className="shadow-lg border-0 bg-white">
              <CardContent className="p-4">
                <div className="text-center">
                  <h4 className="font-bold text-gray-900 mb-2">Need Immediate Help?</h4>
                  <p className="text-sm text-gray-700 mb-3">Call our emergency line</p>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    <Phone className="h-4 w-4 mr-2" />
                    (403) 613-6014
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6 text-center">
              <Bot className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Intelligent Diagnosis</h3>
              <p className="text-gray-700">
                Earl asks smart follow-up questions to narrow down the exact problem with your HVAC system.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6 text-center">
              <Lightbulb className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">DIY Solutions</h3>
              <p className="text-gray-700">
                Get simple fixes you can try yourself before calling a technician, saving time and money.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6 text-center">
              <Phone className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Direct Booking</h3>
              <p className="text-gray-700">
                When professional help is needed, book a diagnostic appointment instantly with transparent pricing.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}