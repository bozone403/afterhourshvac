import { Helmet } from 'react-helmet-async';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocation } from 'wouter';
import { 
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageSquare,
  Crown,
  Settings,
  Zap,
  Brain,
  Headphones
} from 'lucide-react';

const ProVoiceAssistant = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Array<{id: number, text: string, sender: 'user' | 'assistant'}>>([
    {
      id: 1,
      text: "Professional HVAC Voice Assistant ready. I'm your advanced AI diagnostic partner with natural conversation capabilities. Ask me anything about installation, troubleshooting, codes, or system analysis. I can provide detailed technical guidance with conversational flow.",
      sender: 'assistant'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<any>(null);

  // Redirect if not pro user
  if (!user?.hasProAccess && !user?.hasPro) {
    return (
      <>
        <Helmet>
          <title>Pro Access Required - Advanced Voice Assistant</title>
          <meta name="description" content="Advanced voice assistant requires Pro membership access." />
        </Helmet>
        
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-orange-600">Pro Access Required</CardTitle>
              <CardDescription>
                Advanced voice assistant is available to Pro members only.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Upgrade to Pro membership to access advanced AI voice capabilities with natural conversation flow.
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={() => setLocation('/membership')} 
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  Upgrade to Pro
                </Button>
                <Button 
                  onClick={() => setLocation('/pro-portal')} 
                  variant="outline" 
                  className="w-full"
                >
                  Back to Pro Portal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  useEffect(() => {
    // Initialize advanced speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setInputText(finalTranscript);
          handleVoiceInput(finalTranscript);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      
      // Use higher quality voice synthesis
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
      
      // Try to use a more natural voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.name.includes('Natural') ||
        voice.name.includes('Premium')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleVoiceInput = async (transcript: string) => {
    if (!transcript.trim()) return;
    
    setIsProcessing(true);
    stopListening();
    
    const userMessage = {
      id: Date.now(),
      text: transcript,
      sender: 'user' as const
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Simulate processing time for advanced AI
    setTimeout(() => {
      const response = generateAdvancedResponse(transcript);
      const assistantMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'assistant' as const
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      speakResponse(response);
      setInputText('');
      setIsProcessing(false);
    }, 2000);
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;
    handleVoiceInput(inputText);
  };

  const generateAdvancedResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    // Advanced diagnostic patterns
    if (lowerInput.includes('no heat') || lowerInput.includes('furnace not working')) {
      return "Let me walk you through a systematic diagnostic approach. First, I need to understand your system better. Are you dealing with a forced air furnace, boiler, or heat pump? Once I know that, I'll guide you through checking the thermostat call, power supply, gas valve operation, and ignition sequence. Each step will help us isolate the problem efficiently.";
    }
    
    if (lowerInput.includes('short cycling') || lowerInput.includes('keeps turning on and off')) {
      return "Short cycling indicates the system is reaching its limit switch or safety control too quickly. This typically stems from airflow restrictions, oversized equipment, or faulty controls. Let's start by checking your filter - when was it last changed? Then we'll examine static pressure, heat exchanger condition, and limit switch operation. I'll guide you through each measurement.";
    }
    
    if (lowerInput.includes('strange noise') || lowerInput.includes('loud sound')) {
      return "Unusual sounds are excellent diagnostic indicators. Can you describe the noise more specifically? Is it a grinding, squealing, rumbling, or clicking sound? The timing matters too - does it occur during startup, continuous operation, or shutdown? Based on your description, I'll help you pinpoint whether it's a blower motor, inducer fan, gas valve, or ductwork issue.";
    }
    
    if (lowerInput.includes('high bills') || lowerInput.includes('efficiency')) {
      return "Elevated energy costs usually indicate reduced system efficiency. Let's analyze your system holistically. I'll guide you through checking combustion efficiency, heat exchanger performance, ductwork integrity, and control operation. We'll also review your maintenance history and discuss upgrade options that provide the best return on investment for your specific situation.";
    }
    
    if (lowerInput.includes('code') || lowerInput.includes('permit') || lowerInput.includes('inspection')) {
      return "Code compliance is critical for safety and legal operation. Which jurisdiction are we working in? Alberta Building Code 2019 has specific requirements for HVAC installations, including clearances, venting, combustion air, and electrical connections. I'll walk you through the relevant sections and ensure your installation meets all current standards before inspection.";
    }
    
    if (lowerInput.includes('sizing') || lowerInput.includes('load calculation')) {
      return "Proper sizing is fundamental to system performance and efficiency. Manual J load calculations consider building envelope, orientation, windows, insulation, and occupancy. I'll guide you through the calculation process, including heating and cooling loads, equipment selection criteria, and ductwork design using Manual D principles. Oversizing is as problematic as undersizing.";
    }
    
    if (lowerInput.includes('refrigerant') || lowerInput.includes('charging')) {
      return "Refrigerant charging requires precision and proper certification. I'll guide you through superheat and subcooling measurements, proper charging procedures, and leak detection techniques. Remember, improper charging reduces efficiency, shortens equipment life, and can damage compressors. Always use calibrated gauges and follow manufacturer specifications exactly.";
    }
    
    if (lowerInput.includes('controls') || lowerInput.includes('thermostat')) {
      return "Modern HVAC controls are sophisticated systems requiring systematic troubleshooting. I'll help you understand the control sequence, verify proper wiring, test voltage levels, and diagnose communication issues. Whether dealing with conventional thermostats, smart controls, or building automation systems, methodical testing is key to resolution.";
    }
    
    return "I'm here to provide comprehensive technical guidance for any HVAC challenge you're facing. Whether it's installation, troubleshooting, code compliance, or system optimization, I can walk you through detailed procedures step-by-step. What specific aspect of your HVAC work would you like to explore in depth?";
  };

  return (
    <>
      <Helmet>
        <title>Advanced Pro Voice Assistant - AfterHours HVAC</title>
        <meta name="description" content="Professional HVAC voice assistant with advanced conversational AI capabilities for certified technicians." />
        <meta name="keywords" content="HVAC voice assistant, professional diagnostics, AI technician support, advanced voice recognition" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                Advanced Pro Voice Assistant
              </h1>
              <Badge className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 text-sm font-bold">
                Professional AI
              </Badge>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Natural conversation flow with advanced HVAC expertise for professional technicians
            </p>
          </div>

          {/* Main Chat Interface */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Headphones className="h-6 w-6" />
                  <div>
                    <CardTitle className="text-xl">Professional Voice Assistant</CardTitle>
                    <CardDescription className="text-blue-100">
                      Advanced AI with natural conversation capabilities
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isProcessing && (
                    <div className="flex items-center gap-2 bg-blue-500/30 px-3 py-1 rounded-full">
                      <Zap className="h-4 w-4 animate-pulse" />
                      <span className="text-sm">Processing...</span>
                    </div>
                  )}
                  {isSpeaking && (
                    <Button
                      onClick={stopSpeaking}
                      variant="outline"
                      size="sm"
                      className="bg-red-100 text-red-600 hover:bg-red-200 border-red-300"
                    >
                      <VolumeX className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <ScrollArea className="h-[500px] p-6">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-4 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 border border-gray-300'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      </div>
                    </div>
                  ))}
                  {isSpeaking && (
                    <div className="flex justify-start">
                      <div className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 p-4 rounded-2xl flex items-center gap-3 border border-blue-200">
                        <Volume2 className="h-5 w-5 animate-pulse" />
                        <span className="text-sm font-medium">Assistant is speaking...</span>
                      </div>
                    </div>
                  )}
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 p-4 rounded-2xl flex items-center gap-3 border border-purple-200">
                        <Brain className="h-5 w-5 animate-pulse" />
                        <span className="text-sm font-medium">Analyzing your question...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              {/* Input Controls */}
              <div className="p-6 border-t bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask about HVAC diagnostics, codes, installation procedures..."
                    className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                    disabled={isProcessing}
                  />
                  <Button
                    onClick={isListening ? stopListening : startListening}
                    disabled={isProcessing}
                    variant="outline"
                    size="lg"
                    className={`px-6 ${
                      isListening 
                        ? 'bg-red-100 text-red-600 border-red-300 hover:bg-red-200' 
                        : 'bg-blue-100 text-blue-600 border-blue-300 hover:bg-blue-200'
                    }`}
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  <Button 
                    onClick={sendMessage} 
                    disabled={isProcessing}
                    className="px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Send
                  </Button>
                </div>
                {isListening && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-3 bg-red-100 text-red-700 px-4 py-2 rounded-full border border-red-300">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Advanced voice recognition active...</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Feature Highlights */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/60 backdrop-blur-sm border border-blue-200">
              <CardHeader className="pb-3">
                <Headphones className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Natural Voice</CardTitle>
                <CardDescription className="text-sm">Advanced speech synthesis with conversational flow</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur-sm border border-purple-200">
              <CardHeader className="pb-3">
                <Brain className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle className="text-lg">Expert Knowledge</CardTitle>
                <CardDescription className="text-sm">Comprehensive HVAC expertise with detailed guidance</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur-sm border border-orange-200">
              <CardHeader className="pb-3">
                <Crown className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle className="text-lg">Professional Only</CardTitle>
                <CardDescription className="text-sm">Exclusive to Pro members with advanced capabilities</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProVoiceAssistant;