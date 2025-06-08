import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { FileCheck, DollarSign, Calculator, Download, Plus, Trash2, Search, Package, Clock } from "lucide-react";
import { ProAccessGuard } from "@/components/ProAccessGuard";

interface QuoteItem {
  id: string;
  category: string;
  item: string;
  quantity: number;
  unitPrice: number;
  laborHours: number;
  total: number;
}

interface Quote {
  items: QuoteItem[];
  subtotal: number;
  labor: number;
  markup: number;
  tax: number;
  total: number;
}

// Complete Alggin pricing data from Calgary catalog with enhanced structure
const algginPricing = {
  plenums: {
    "Plenum 16.5x20.25x59\" with End Cap": { price: 155.82, laborHours: 2 },
    "Plenum 20x20.25x59\" with End Cap": { price: 170.41, laborHours: 2 },
    "Plenum 23.5x20.25x59\" with End Cap": { price: 183.93, laborHours: 2 },
    "Plenum 13.5x20.25x71\" with End Cap": { price: 142.00, laborHours: 2 },
    "Plenum 16.5x20.25x71\" with End Cap": { price: 140.00, laborHours: 2 },
    "Plenum 20x20.25x71\" with End Cap": { price: 144.00, laborHours: 2 }
  },
  filterFrames: {
    "Filter Frame 20x16x6.5\"": { price: 53.15, laborHours: 0.5 },
    "Filter Frame 25x16x6.5\"": { price: 55.72, laborHours: 0.5 },
    "Filter Frame 25x20x6.5\"": { price: 61.56, laborHours: 0.5 },
    "Filter Frame 25x16x3\"": { price: 37.57, laborHours: 0.5 },
    "Filter Frame 25x20x3\"": { price: 44.95, laborHours: 0.5 },
    "Filter Frame 25x16x1\"": { price: 21.95, laborHours: 0.5 }
  },
  ductwork: {
    "Duct 8x8x5' 30ga Button Lock": { price: 38.70, laborHours: 0.3 },
    "Duct 10x8x5' 30ga Button Lock": { price: 43.20, laborHours: 0.3 },
    "Duct 12x8x5' 30ga Button Lock": { price: 45.90, laborHours: 0.3 },
    "Duct 14x8x5' 30ga Button Lock": { price: 51.60, laborHours: 0.3 },
    "Duct 16x8x5' 28ga Button Lock": { price: 58.95, laborHours: 0.3 },
    "Duct 18x8x5' 28ga Button Lock": { price: 66.00, laborHours: 0.3 },
    "Duct 20x8x5' 28ga Button Lock": { price: 71.90, laborHours: 0.3 },
    "Duct 10x10x5' 30ga Button Lock": { price: 50.70, laborHours: 0.3 },
    "Duct 12x10x5' 30ga Button Lock": { price: 54.00, laborHours: 0.3 },
    "Duct 14x10x5' 30ga Button Lock": { price: 57.30, laborHours: 0.3 },
    "Duct 16x10x5' 28ga Button Lock": { price: 68.10, laborHours: 0.3 },
    "Duct 18x10x5' 28ga Button Lock": { price: 73.65, laborHours: 0.3 },
    "Duct 20x10x5' 28ga Button Lock": { price: 79.55, laborHours: 0.3 }
  },
  elbows: {
    "90° Long Way Elbow 8x8": { price: 30.35, laborHours: 0.2 },
    "90° Long Way Elbow 10x8": { price: 36.59, laborHours: 0.2 },
    "45° Long Way Elbow 10x8": { price: 25.81, laborHours: 0.2 },
    "90° Long Way Elbow 12x8": { price: 40.44, laborHours: 0.2 },
    "45° Long Way Elbow 12x8": { price: 29.84, laborHours: 0.2 },
    "90° Long Way Elbow 14x8": { price: 49.31, laborHours: 0.2 },
    "45° Long Way Elbow 14x8": { price: 37.94, laborHours: 0.2 },
    "90° Long Way Elbow 16x8": { price: 54.64, laborHours: 0.2 },
    "45° Long Way Elbow 16x8": { price: 37.70, laborHours: 0.2 },
    "90° Long Way Elbow 18x8": { price: 67.13, laborHours: 0.2 },
    "45° Long Way Elbow 18x8": { price: 42.38, laborHours: 0.2 },
    "90° Short Way Elbow 10x8": { price: 34.86, laborHours: 0.2 },
    "45° Short Way Elbow 10x8": { price: 23.97, laborHours: 0.2 },
    "90° Short Way Elbow 12x8": { price: 38.34, laborHours: 0.2 },
    "45° Short Way Elbow 12x8": { price: 24.49, laborHours: 0.2 },
    "90° Short Way Elbow 14x8": { price: 40.21, laborHours: 0.2 },
    "45° Short Way Elbow 14x8": { price: 26.77, laborHours: 0.2 },
    "90° Short Way Elbow 16x8": { price: 51.22, laborHours: 0.2 },
    "45° Short Way Elbow 16x8": { price: 36.33, laborHours: 0.2 }
  },
  takeOffs: {
    "Side Take Off 4\"": { price: 6.28, laborHours: 0.2 },
    "Top Take Off 4\"": { price: 7.38, laborHours: 0.2 },
    "Side Take Off 5\"": { price: 6.61, laborHours: 0.2 },
    "Top Take Off 5\"": { price: 7.38, laborHours: 0.2 },
    "Side Take Off 6\"": { price: 8.89, laborHours: 0.2 },
    "Top Take Off 6\"": { price: 8.58, laborHours: 0.2 },
    "Side Take Off 7\"": { price: 11.94, laborHours: 0.2 },
    "Top Take Off 7\"": { price: 16.86, laborHours: 0.2 },
    "Side Take Off 8\"": { price: 16.24, laborHours: 0.2 },
    "Top Take Off 8\"": { price: 24.18, laborHours: 0.2 },
    "Side Take Off 9\"": { price: 22.36, laborHours: 0.2 },
    "Top Take Off 9\"": { price: 29.28, laborHours: 0.2 },
    "Universal Take Off 4\"": { price: 5.22, laborHours: 0.2 },
    "Universal Take Off 5\"": { price: 5.37, laborHours: 0.2 },
    "Universal Take Off 6\"": { price: 6.12, laborHours: 0.2 },
    "Saddle Take Off 4\"": { price: 4.75, laborHours: 0.2 },
    "Saddle Take Off 5\"": { price: 5.04, laborHours: 0.2 },
    "Saddle Take Off 6\"": { price: 7.05, laborHours: 0.2 }
  },
  boots: {
    "Right Angle Boot 4\" 3x10": { price: 7.36, laborHours: 0.3 },
    "Universal Boot 4\" 3x10": { price: 7.36, laborHours: 0.3 },
    "End Boot 4\" 3x10": { price: 7.36, laborHours: 0.3 },
    "Right Angle Boot 4\" 4x10": { price: 8.28, laborHours: 0.3 },
    "Universal Boot 4\" 4x10": { price: 8.28, laborHours: 0.3 },
    "End Boot 4\" 4x10": { price: 8.28, laborHours: 0.3 },
    "Right Angle Boot 5\" 2.25x12": { price: 16.22, laborHours: 0.3 },
    "Universal Boot 5\" 2.25x12": { price: 16.22, laborHours: 0.3 },
    "End Boot 5\" 2.25x12": { price: 16.22, laborHours: 0.3 },
    "Right Angle Boot 5\" 3x10": { price: 7.04, laborHours: 0.3 },
    "Universal Boot 5\" 3x10": { price: 7.04, laborHours: 0.3 },
    "End Boot 5\" 3x10": { price: 7.04, laborHours: 0.3 },
    "Right Angle Boot 6\" 3x10": { price: 8.13, laborHours: 0.3 },
    "Universal Boot 6\" 3x10": { price: 8.13, laborHours: 0.3 },
    "End Boot 6\" 3x10": { price: 8.13, laborHours: 0.3 }
  },
  dampers: {
    "Galvanized Damper 4\"": { price: 2.80, laborHours: 0.2 },
    "Galvanized Damper 5\"": { price: 3.04, laborHours: 0.2 },
    "Galvanized Damper 6\"": { price: 3.55, laborHours: 0.2 },
    "Inline Damper 4\"": { price: 20.55, laborHours: 0.3 },
    "Inline Damper 5\"": { price: 24.66, laborHours: 0.3 },
    "Inline Damper 6\"": { price: 27.41, laborHours: 0.3 },
    "Inline Damper 8\"": { price: 34.25, laborHours: 0.3 }
  },
  pipe: {
    "Galvanized Pipe 3\" x60\" 30ga": { price: 3.19, laborHours: 0.05 },
    "Galvanized Pipe 4\" x60\" Light": { price: 1.73, laborHours: 0.05 },
    "Galvanized Pipe 4\" x60\" 30ga": { price: 2.58, laborHours: 0.05 },
    "Galvanized Pipe 4\" x60\" 28ga": { price: 4.29, laborHours: 0.05 },
    "Galvanized Pipe 5\" x60\" Light": { price: 1.98, laborHours: 0.05 },
    "Galvanized Pipe 5\" x60\" 30ga": { price: 3.14, laborHours: 0.05 },
    "Galvanized Pipe 5\" x60\" 28ga": { price: 5.45, laborHours: 0.05 },
    "Galvanized Pipe 6\" x60\" Light": { price: 2.40, laborHours: 0.05 },
    "Galvanized Pipe 6\" x60\" 30ga": { price: 3.52, laborHours: 0.05 },
    "Galvanized Pipe 6\" x60\" 28ga": { price: 6.07, laborHours: 0.05 }
  }
};

function EnhancedQuoteBuilderContent() {
  const [quote, setQuote] = useState<Quote>({
    items: [],
    subtotal: 0,
    labor: 0,
    markup: 0,
    tax: 0,
    total: 0
  });
  
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [laborRate] = useState<number>(95); // $95/hour Calgary rate
  const [markupPercentage, setMarkupPercentage] = useState<number>(40); // 40% markup
  const [taxRate] = useState<number>(5); // 5% GST
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    jobDescription: ""
  });

  const categories = Object.keys(algginPricing);
  const availableItems = selectedCategory ? Object.keys(algginPricing[selectedCategory as keyof typeof algginPricing]) : [];
  
  // Filter items based on search term
  const filteredItems = availableItems.filter(item => 
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = () => {
    if (!selectedCategory || !selectedItem || !quantity) return;

    const categoryData = algginPricing[selectedCategory as keyof typeof algginPricing];
    const itemData = categoryData[selectedItem as keyof typeof categoryData];
    const qty = parseFloat(quantity);
    
    const newItem: QuoteItem = {
      id: `${Date.now()}-${Math.random()}`,
      category: selectedCategory,
      item: selectedItem,
      quantity: qty,
      unitPrice: itemData.price,
      laborHours: itemData.laborHours * qty,
      total: itemData.price * qty
    };

    setQuote(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    // Reset form
    setSelectedItem("");
    setQuantity("1");
    setSearchTerm("");
  };

  const removeItem = (id: string) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const qty = Math.max(0.1, newQuantity);
          const originalLaborHours = item.laborHours / item.quantity;
          return {
            ...item,
            quantity: qty,
            laborHours: originalLaborHours * qty,
            total: item.unitPrice * qty
          };
        }
        return item;
      })
    }));
  };

  // Calculate totals whenever items change
  useEffect(() => {
    const subtotal = quote.items.reduce((sum, item) => sum + item.total, 0);
    const totalLaborHours = quote.items.reduce((sum, item) => sum + item.laborHours, 0);
    const labor = totalLaborHours * laborRate;
    const markup = (subtotal + labor) * (markupPercentage / 100);
    const beforeTax = subtotal + labor + markup;
    const tax = beforeTax * (taxRate / 100);
    const total = beforeTax + tax;

    setQuote(prev => ({
      ...prev,
      subtotal,
      labor,
      markup,
      tax,
      total
    }));
  }, [quote.items, laborRate, markupPercentage, taxRate]);

  const generateQuoteText = () => {
    const date = new Date().toLocaleDateString();
    const totalHours = quote.items.reduce((sum, item) => sum + item.laborHours, 0);
    
    return `AFTERHOURS HVAC - PROFESSIONAL ESTIMATE
Quote #: AH-${Date.now().toString().slice(-6)}
Generated: ${date}

CUSTOMER INFORMATION:
${customerInfo.name}
${customerInfo.address}
Phone: ${customerInfo.phone}
Email: ${customerInfo.email}

JOB DESCRIPTION:
${customerInfo.jobDescription}

MATERIALS & LABOR BREAKDOWN:

${quote.items.map((item, index) => 
  `${index + 1}. ${item.item}
   Quantity: ${item.quantity} @ $${item.unitPrice.toFixed(2)} each
   Labor: ${item.laborHours.toFixed(1)} hours
   Line Total: $${item.total.toFixed(2)}`
).join('\n\n')}

QUOTE SUMMARY:
Materials Subtotal: $${quote.subtotal.toFixed(2)}
Labor (${totalHours.toFixed(1)} hrs @ $${laborRate}/hr): $${quote.labor.toFixed(2)}
Contractor Markup (${markupPercentage}%): $${quote.markup.toFixed(2)}
Subtotal: $${(quote.subtotal + quote.labor + quote.markup).toFixed(2)}
GST (${taxRate}%): $${quote.tax.toFixed(2)}

TOTAL PROJECT COST: $${quote.total.toFixed(2)}

TERMS & CONDITIONS:
• Payment Schedule: 40% deposit, 40% at rough-in, 20% completion
• Quote valid for 30 days from date issued
• Warranty: 1 year workmanship, manufacturer warranty on materials
• All work performed to Alberta Building Code standards
• Permits and inspections included where applicable

AfterHours HVAC
Calgary, Alberta
Phone: (403) 613-6014
Email: info@afterhourshvac.ca

Thank you for choosing AfterHours HVAC for your project needs.`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-green-100 border border-green-200 rounded-full px-6 py-3 mb-6">
            <FileCheck className="h-5 w-5 text-green-700 mr-3" />
            <span className="text-green-800 text-lg font-bold">Professional Quote Builder</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Calgary HVAC Material Calculator</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Complete job estimating with real Alggin pricing data. Build comprehensive quotes for residential and commercial HVAC projects.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Customer Information */}
          <Card className="xl:col-span-1 shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <CardTitle className="text-xl flex items-center gap-2">
                <Package className="h-5 w-5" />
                Customer & Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="customerName" className="text-gray-800 font-semibold">Customer Name</Label>
                <Input
                  id="customerName"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Smith"
                  className="mt-1 text-gray-900"
                />
              </div>
              <div>
                <Label htmlFor="customerAddress" className="text-gray-800 font-semibold">Project Address</Label>
                <Textarea
                  id="customerAddress"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Main St, Calgary, AB T2P 1A1"
                  rows={2}
                  className="mt-1 text-gray-900"
                />
              </div>
              <div>
                <Label htmlFor="customerPhone" className="text-gray-800 font-semibold">Phone Number</Label>
                <Input
                  id="customerPhone"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(403) 555-0123"
                  className="mt-1 text-gray-900"
                />
              </div>
              <div>
                <Label htmlFor="customerEmail" className="text-gray-800 font-semibold">Email Address</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                  className="mt-1 text-gray-900"
                />
              </div>
              <div>
                <Label htmlFor="jobDescription" className="text-gray-800 font-semibold">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  value={customerInfo.jobDescription}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, jobDescription: e.target.value }))}
                  placeholder="Describe the scope of work, special requirements, or project details..."
                  rows={3}
                  className="mt-1 text-gray-900"
                />
              </div>
            </CardContent>
          </Card>

          {/* Add Items */}
          <Card className="xl:col-span-1 shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
              <CardTitle className="text-xl flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Materials & Components
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="category" className="text-gray-800 font-semibold">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select material category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plenums">Plenums</SelectItem>
                    <SelectItem value="filterFrames">Filter Frames</SelectItem>
                    <SelectItem value="ductwork">Ductwork</SelectItem>
                    <SelectItem value="elbows">Elbows</SelectItem>
                    <SelectItem value="takeOffs">Take Offs</SelectItem>
                    <SelectItem value="boots">Boots</SelectItem>
                    <SelectItem value="dampers">Dampers</SelectItem>
                    <SelectItem value="pipe">Galvanized Pipe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedCategory && (
                <>
                  <div>
                    <Label htmlFor="search" className="text-gray-800 font-semibold">Search Items</Label>
                    <div className="relative mt-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search materials..."
                        className="pl-10 text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="item" className="text-gray-800 font-semibold">Select Item</Label>
                    <Select value={selectedItem} onValueChange={setSelectedItem}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose specific item" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {filteredItems.map(item => {
                          const itemData = algginPricing[selectedCategory as keyof typeof algginPricing][item as any];
                          return (
                            <SelectItem key={item} value={item}>
                              <div className="flex justify-between items-center w-full">
                                <span className="text-gray-900 font-medium">{item}</span>
                                <span className="text-green-600 font-bold ml-4">${itemData.price.toFixed(2)}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {selectedItem && (
                <div>
                  <Label htmlFor="quantity" className="text-gray-800 font-semibold">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="mt-1 text-gray-900"
                  />
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm text-gray-800">
                      <div className="font-semibold text-blue-800">Item Details:</div>
                      <div>Unit Price: <span className="font-bold text-green-600">${algginPricing[selectedCategory as keyof typeof algginPricing][selectedItem as any]?.price.toFixed(2)}</span></div>
                      <div>Labor Hours: <span className="font-bold text-orange-600">{algginPricing[selectedCategory as keyof typeof algginPricing][selectedItem as any]?.laborHours} hrs</span></div>
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={addItem}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3"
                disabled={!selectedCategory || !selectedItem || !quantity}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Quote
              </Button>
            </CardContent>
          </Card>

          {/* Quote Summary */}
          <Card className="xl:col-span-1 shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
              <CardTitle className="text-xl flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Quote Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-800">
                  <span className="font-medium">Materials:</span>
                  <span className="font-bold">${quote.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-800">
                  <span className="font-medium">Labor ({(quote.labor / laborRate).toFixed(1)} hrs):</span>
                  <span className="font-bold">${quote.labor.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-800">
                  <span className="font-medium">Markup:</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={markupPercentage}
                      onChange={(e) => setMarkupPercentage(parseFloat(e.target.value) || 0)}
                      className="w-16 h-8 text-xs text-center"
                      min="0"
                      max="100"
                    />
                    <span className="text-sm">%</span>
                    <span className="font-bold">${quote.markup.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between text-gray-800">
                  <span className="font-medium">GST ({taxRate}%):</span>
                  <span className="font-bold">${quote.tax.toFixed(2)}</span>
                </div>
                <Separator className="bg-gray-300" />
                <div className="flex justify-between text-xl font-bold text-green-700">
                  <span>Total:</span>
                  <span>${quote.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  onClick={() => {
                    const quoteText = generateQuoteText();
                    navigator.clipboard.writeText(quoteText);
                  }}
                  disabled={quote.items.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Copy Professional Quote
                </Button>
                
                <div className="text-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Estimated completion: {(quote.labor / laborRate / 8).toFixed(1)} days
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quote Items List */}
        {quote.items.length > 0 && (
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg">
              <CardTitle className="text-xl">Quote Line Items</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {quote.items.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-lg">{index + 1}. {item.item}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                          {item.category}
                        </span>
                        <span className="mr-4">${item.unitPrice.toFixed(2)} each</span>
                        <span className="mr-4">{item.laborHours.toFixed(1)} labor hrs</span>
                        <span className="font-bold text-green-600">Line Total: ${item.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      <Input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseFloat(e.target.value))}
                        className="w-20 text-center text-gray-900"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function EnhancedQuoteBuilder() {
  return (
    <ProAccessGuard>
      <EnhancedQuoteBuilderContent />
    </ProAccessGuard>
  );
}