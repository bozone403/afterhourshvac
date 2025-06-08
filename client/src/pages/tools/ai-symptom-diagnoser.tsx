import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bot, MessageSquare, AlertTriangle, CheckCircle, Wrench, Phone, ArrowRight, Lightbulb, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
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
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();

  // Initialize voice capabilities
  useEffect(() => {
    // Check for speech recognition support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCurrentInput(transcript);
        setIsListening(false);
        toast({
          title: "Voice Input Captured",
          description: `Heard: "${transcript}"`,
        });
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Please try speaking again or use text input.",
          variant: "destructive"
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Check for speech synthesis support
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      setVoiceEnabled(true);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [toast]);

  // Voice recognition functions
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
      toast({
        title: "Listening...",
        description: "Describe your HVAC problem",
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Text-to-speech functions
  const speakResponse = (text: string) => {
    if (synthRef.current && voiceEnabled) {
      synthRef.current.cancel(); // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // AI logic for basic homeowner troubleshooting
  const analyzeSymptoms = (userInput: string): { response: ChatMessage, diagnoses: Diagnosis[] } => {
    const input = userInput.toLowerCase();
    
    // AC not cooling issues
    if (input.includes('ac') && (input.includes('not cool') || input.includes('warm air') || input.includes('not cold'))) {
      return {
        response: {
          id: Date.now().toString(),
          type: 'earl',
          content: "Let's check the basic things first before calling for service. Here's what you can safely check yourself:",
          timestamp: new Date(),
          nextQuestions: [
            "Check your thermostat - is it set to COOL and below room temperature?",
            "Check your air filter - when did you last replace it?",
            "Check your electrical panel - are all breakers on?",
            "Look at your outdoor unit - is it running and free of debris?"
          ]
        },
        diagnoses: [
          {
            issue: "Thermostat Settings",
            probability: 40,
            severity: 'low',
            description: "Thermostat may be set incorrectly or batteries are dead",
            diyFix: "Set thermostat to COOL, lower temperature by 5 degrees, replace batteries if display is dim.",
            whenToCallPro: "If thermostat doesn't respond or display stays blank after battery replacement"
          },
          {
            issue: "Dirty Air Filter",
            probability: 85,
            severity: 'low',
            description: "A clogged filter stops airflow and can freeze the system",
            diyFix: "Turn off system, replace air filter, wait 2 hours, then turn back on.",
            whenToCallPro: "If no improvement after filter replacement and 2-hour wait"
          },
          {
            issue: "Electrical Issue",
            probability: 30,
            severity: 'medium',
            description: "Tripped breaker or blown fuse stops the system",
            diyFix: "Check electrical panel, flip any tripped breakers OFF then ON. Check outdoor disconnect switch.",
            whenToCallPro: "If breakers keep tripping or system still won't start"
          }
        ]
      };
    }

    // Furnace noise issues - safety focused
    if ((input.includes('furnace') || input.includes('heater')) && (input.includes('noise') || input.includes('loud') || input.includes('bang') || input.includes('rattle'))) {
      return {
        response: {
          id: Date.now().toString(),
          type: 'earl',
          content: "Furnace noises can be serious safety issues. Let's check the basics first, but some sounds mean you need to call us immediately:",
          timestamp: new Date(),
          nextQuestions: [
            "Is it a loud BANG when starting? If yes, turn off your furnace NOW",
            "Check your filter - is it dirty or clogged?",
            "Check your thermostat fan setting - is it on AUTO or ON?",
            "Are there any burning smells with the noise?"
          ]
        },
        diagnoses: [
          {
            issue: "Loud Banging - SAFETY ISSUE",
            probability: 30,
            severity: 'high',
            description: "Loud banging during startup can indicate dangerous gas buildup",
            diyFix: "TURN OFF YOUR FURNACE IMMEDIATELY at the thermostat and at the emergency switch. Do not use until repaired.",
            whenToCallPro: "Call immediately for emergency service. This is a safety hazard."
          },
          {
            issue: "Dirty Filter Restricting Airflow",
            probability: 70,
            severity: 'medium',
            description: "Dirty filter makes the blower work harder and creates noise",
            diyFix: "Turn off furnace, replace air filter, check that return vents aren't blocked.",
            whenToCallPro: "If noise continues after filter replacement"
          },
          {
            issue: "Thermostat Fan Setting",
            probability: 50,
            severity: 'low',
            description: "Fan set to ON runs continuously and may seem louder than normal",
            diyFix: "Set thermostat fan to AUTO instead of ON. This runs the fan only when heating.",
            whenToCallPro: "If noise persists with fan on AUTO setting"
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

    // High energy bills - basic checks
    if (input.includes('high bill') || input.includes('expensive') || input.includes('energy cost')) {
      return {
        response: {
          id: Date.now().toString(),
          type: 'earl',
          content: "High energy bills mean your system is working too hard. Here are the basic things you can check yourself:",
          timestamp: new Date(),
          nextQuestions: [
            "Check your air filter - when did you last replace it?",
            "Check your thermostat settings - are you heating/cooling unnecessarily?",
            "Walk around your home - do you feel any drafts near windows/doors?",
            "Check that all vents are open and unblocked by furniture"
          ]
        },
        diagnoses: [
          {
            issue: "Dirty Air Filter",
            probability: 90,
            severity: 'medium',
            description: "Dirty filter makes your system work 3x harder and costs more money",
            diyFix: "Replace air filter immediately. Set phone reminder to check monthly.",
            whenToCallPro: "If bills stay high after replacing filter and waiting one month"
          },
          {
            issue: "Inefficient Thermostat Settings",
            probability: 70,
            severity: 'low',
            description: "Heating too high or cooling too low wastes energy",
            diyFix: "Set thermostat to 68°F in winter, 76°F in summer. Use AUTO fan setting, not ON.",
            whenToCallPro: "If you want a programmable or smart thermostat installed"
          },
          {
            issue: "Air Leaks and Blocked Vents",
            probability: 80,
            severity: 'low',
            description: "Drafts and blocked vents force your system to run longer",
            diyFix: "Feel around windows/doors for drafts. Move furniture away from vents. Close curtains on sunny days.",
            whenToCallPro: "For professional weatherization and duct sealing"
          }
        ]
      };
    }

    // No heat emergency
    if (input.includes('no heat') || (input.includes('furnace') && input.includes('not working'))) {
      return {
        response: {
          id: Date.now().toString(),
          type: 'earl',
          content: "No heat can be an emergency in winter. Let's check the most common causes first - many are simple fixes:",
          timestamp: new Date(),
          nextQuestions: [
            "Check your thermostat - is it set to HEAT and above current temperature?",
            "Check your electrical panel - are any breakers tripped?",
            "Check your furnace area - is the emergency switch ON?",
            "Do you smell gas? If YES, leave the house and call us immediately!"
          ]
        },
        diagnoses: [
          {
            issue: "GAS SMELL - EMERGENCY",
            probability: 5,
            severity: 'high',
            description: "Gas smell means dangerous leak - immediate evacuation required",
            diyFix: "LEAVE THE HOUSE IMMEDIATELY. Do not turn on lights or use phones inside. Call 911 and gas company from outside.",
            whenToCallPro: "CALL IMMEDIATELY from outside the house: (403) 613-6014"
          },
          {
            issue: "Thermostat Issue",
            probability: 60,
            severity: 'low',
            description: "Wrong settings or dead batteries prevent heating",
            diyFix: "Set to HEAT, raise temperature 5 degrees above room temp, replace batteries if display is dim.",
            whenToCallPro: "If thermostat doesn't respond after battery replacement"
          },
          {
            issue: "Electrical Problem",
            probability: 40,
            severity: 'medium',
            description: "Tripped breaker or emergency switch stops furnace",
            diyFix: "Check electrical panel - flip any tripped breakers OFF then ON. Check emergency switch near furnace is ON.",
            whenToCallPro: "If breakers keep tripping or furnace won't start after reset"
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
    const inputText = currentInput;
    setCurrentInput("");
    setIsAnalyzing(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const { response, diagnoses } = analyzeSymptoms(inputText);
      setMessages(prev => [...prev, response]);
      setCurrentDiagnosis(diagnoses);
      
      // Auto-speak response if voice is enabled
      if (voiceEnabled && response.content) {
        speakResponse(response.content);
      }
      
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
                    
                    {/* Voice Controls */}
                    {voiceEnabled && (
                      <>
                        <Button
                          onClick={isListening ? stopListening : startListening}
                          disabled={isAnalyzing}
                          variant={isListening ? "destructive" : "outline"}
                          size="sm"
                          title={isListening ? "Stop listening" : "Start voice input"}
                        >
                          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>
                        
                        <Button
                          onClick={isSpeaking ? stopSpeaking : () => speakResponse("Voice is ready")}
                          disabled={isAnalyzing}
                          variant={isSpeaking ? "destructive" : "outline"}
                          size="sm"
                          title={isSpeaking ? "Stop speaking" : "Test voice output"}
                        >
                          {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                      </>
                    )}
                    
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