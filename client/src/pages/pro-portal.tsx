import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  MessageSquare
} from 'lucide-react';

const EarlChatbot = () => {
  const [messages, setMessages] = useState<Array<{id: number, text: string, sender: 'user' | 'earl'}>>([
    {
      id: 1,
      text: "Hey there! I'm Earl, your expert HVAC assistant. I've got decades of experience with Alberta and BC codes, installation best practices, and troubleshooting. What can I help you with today?",
      sender: 'earl'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user' as const
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate Earl's response (in production, this would call the AI API)
    setTimeout(() => {
      const earlResponse = {
        id: Date.now() + 1,
        text: generateEarlResponse(inputText),
        sender: 'earl' as const
      };
      setMessages(prev => [...prev, earlResponse]);
      setIsTyping(false);
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
    
    return "I hear ya. Can you be more specific about what you're dealing with? Are we talking installation, troubleshooting, code compliance, or something else? The more details you give me, the better I can help you avoid the common mistakes I see techs make every day.";
  };

  return (
    <div className="flex flex-col h-[600px] bg-white border rounded-lg">
      <div className="bg-orange-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <h3 className="font-bold">Earl - HVAC Expert Assistant</h3>
          <Badge variant="secondary" className="bg-orange-700 text-white">Pro Only</Badge>
        </div>
        <p className="text-sm opacity-90 mt-1">Your gruff but knowledgeable HVAC expert</p>
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
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                <p className="text-sm">Earl is typing...</p>
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
          <Button onClick={sendMessage} className="bg-orange-600 hover:bg-orange-700">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

const DocumentViewer = ({ title, content }: { title: string; content: string }) => {
  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>
      <ScrollArea className="h-[500px]">
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
            {content}
          </pre>
        </div>
      </ScrollArea>
    </div>
  );
};

const ProPortal = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if not pro user
  if (!user?.hasPro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <CardTitle>Pro Membership Required</CardTitle>
            <CardDescription>
              You need an active Pro membership to access these tools.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/membership">
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Pro
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const calgaryCheatSheet = `"Don't Be a Dumbass" - Calgary HVAC Rough-In Cheat Sheet

IMPORTANT DISCLAIMERS:
- This is NOT a substitute for the codes
- This is for RESIDENTIAL rough-in ONLY
- Always verify with current, official code documents
- Check with City of Calgary building department for local amendments

I. General Building Code (Alberta Building Code 2019):

STANDATA - CRUCIAL:
- Alberta Municipal Affairs publishes STANDATA (variations/interpretations of building code)
- Search for "HVAC" and "Building Code STANDATA"
- These take precedence over general code wording

Load Calculations:
- Use Manual J, CSA F280, or approved method
- STANDATA often have specific requirements

Ductwork Materials:
- Galvanized steel (most common)
- Aluminum (less common)  
- Rigid fiberglass duct board (with limitations - check STANDATA)
- Flexible duct (limited lengths, proper support)

Ductwork Support:
- Rigid Metal Duct: Every 8-10 feet
- Flex Duct: Every 4 feet (support at connections)
- Use metal hanger straps or wire and saddles

Ductwork Sealing:
- Mastic is primary sealant
- Foil tape over zip ties for flex connections
- ALL joints, seams, connections must be sealed

II. Gas Code (CSA B149.1-20):

High-Efficiency Furnace Venting (Category IV):
- Material: System 636 certified PVC, CPVC, or polypropylene
- Slope: Minimum 1/4" per foot downward (back towards furnace)
- Support: Every 3-5 feet (follow manufacturer instructions)

Termination Clearances:
- From property lines: 3 feet or more (check local bylaws)
- From windows/doors: 3 feet (>100k BTU), 1 foot (<100k BTU)
- From air intakes: 6 feet minimum
- Above grade/snow: 12 inches minimum
- From gas meter: Check B149.1 and utility requirements

Natural Draft Venting (B-Vent):
- Material: B-vent (double-walled metal)
- Slope: 1/4" per foot upward (away from appliance)
- Must extend above roof with proper cap

III. Electrical Code (CEC):
- Disconnect within sight of furnace
- Proper wire sizing for load
- Grounding required
- GFCI for condensate pumps
- All connections in junction boxes

IV. Plumbing Code (NPC):
- Condensate drain: 1/4" per foot slope
- P-trap may be required
- Proper termination (floor drain, pump, indirect waste)

V. HRV Specific:
- Intake/exhaust separation: 6 feet minimum
- Insulate intake duct
- Follow manufacturer condensate drain instructions

Earl's Key Points:
- "Measure twice, cut once"
- "Seal every joint with mastic"
- "Support ductwork properly"  
- "Slope vents correctly"
- "Read the code book"
- "When in doubt, ask"`;

  const termsOfService = `AFTERHOURS HVAC - TERMS OF SERVICE

These Terms of Service ("Terms"), together with the specific written Quotation ("Quote") 
provided by AfterHours HVAC ("Company") constitute the binding legal agreement governing 
the provision of HVAC and related services.

I. AGREEMENT AND ACCEPTANCE
Binding Effect: These Terms, with the accepted Quote, form the complete legal agreement. 
Acceptance by written confirmation, electronic acceptance, or payment constitutes 
unconditional acceptance of these Terms.

II. SCOPE OF WORK
Defined by Quote: Company's obligation is to perform Work detailed in the written Quote. 
Standard inclusions cover supply/installation of itemized equipment and standard connections 
to compatible utility points.

Express Exclusions:
- Thermostats (unless specified)
- Existing system modifications beyond connection points
- Structural alterations
- Cosmetic restoration
- Hazardous material handling
- System balancing beyond standard startup
- Existing equipment disposal

III. PRICE AND PAYMENT
Payment Schedule (unless otherwise specified):
- First Payment: 40% before delivery/commencement
- Second Payment: 40% at rough-in completion
- Final Payment: 20% at substantial completion

Methods: E-transfer or Credit Card (3.5% processing fee)
Delinquent accounts accrue 2.5% monthly interest (30% annual)

IV. CLIENT OBLIGATIONS
- Provide safe, continuous site access (8 AM - 4 PM, M-F)
- Ensure site safety and structural soundness
- Guarantee utility availability
- Protect/remove personal property
- Mark property lines and private utilities

V. WARRANTIES
Equipment covered by manufacturer warranty only.
Workmanship warranty: 1 year on installation labor.
No warranty on pre-existing conditions or client-caused damage.

VI. LIABILITY LIMITATIONS
Company liability limited to contract amount.
No liability for consequential, indirect, or special damages.
Client assumes risk for undisclosed site conditions.

For complete terms, consult full legal document.`;

  return (
    <>
      <Helmet>
        <title>Pro Portal | AfterHours HVAC</title>
        <meta name="description" content="Access professional HVAC tools, Earl AI assistant, and comprehensive documentation for contractors and engineers." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="container mx-auto px-4 py-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-orange-100 border border-orange-200 rounded-full px-4 py-2 mb-4">
              <Crown className="h-4 w-4 text-orange-600 mr-2" />
              <span className="text-orange-600 text-sm font-medium">Pro Member</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              Welcome to the <span className="text-orange-600">Pro Portal</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access professional HVAC tools, expert AI assistance, and comprehensive documentation
            </p>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="earl" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="earl" className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Earl AI
              </TabsTrigger>
              <TabsTrigger value="calculators" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Calculators
              </TabsTrigger>
              <TabsTrigger value="cheatsheet" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Calgary Codes
              </TabsTrigger>
              <TabsTrigger value="docs" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="earl">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-orange-600" />
                    Earl - Your HVAC Expert Assistant
                  </CardTitle>
                  <CardDescription>
                    Chat with Earl, your gruff but knowledgeable HVAC expert. He knows Alberta and BC codes inside out.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EarlChatbot />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calculators">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Thermometer className="h-8 w-8 text-orange-600 mb-2" />
                    <CardTitle>Load Calculator</CardTitle>
                    <CardDescription>Manual J load calculations for residential systems</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/pro-calculator">
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
                        Open Calculator
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Settings className="h-8 w-8 text-blue-600 mb-2" />
                    <CardTitle>Duct Sizing</CardTitle>
                    <CardDescription>Manual D ductwork design and sizing tool</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <FileCheck className="h-8 w-8 text-green-600 mb-2" />
                    <CardTitle>Quote Builder</CardTitle>
                    <CardDescription>Real-time quoting with Alggin pricing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="cheatsheet">
              <DocumentViewer 
                title="Calgary HVAC Rough-In Cheat Sheet" 
                content={calgaryCheatSheet}
              />
            </TabsContent>

            <TabsContent value="docs">
              <DocumentViewer 
                title="AfterHours HVAC Terms of Service" 
                content={termsOfService}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ProPortal;