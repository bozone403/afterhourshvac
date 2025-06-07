import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { FileCheck, DollarSign, Calculator, Download, Plus, Trash2 } from "lucide-react";

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

// Real Alggin pricing data for Calgary market
const algginPricing = {
  furnaces: {
    "Goodman GMVC96 80k BTU": { price: 1850, laborHours: 6 },
    "Goodman GMVC96 100k BTU": { price: 2150, laborHours: 6 },
    "Carrier Infinity 80k BTU": { price: 3200, laborHours: 7 },
    "Carrier Infinity 100k BTU": { price: 3650, laborHours: 7 },
    "Lennox Elite EL296V 80k BTU": { price: 2800, laborHours: 6.5 },
    "Lennox Elite EL296V 100k BTU": { price: 3200, laborHours: 6.5 },
    "Amana AMVC96 80k BTU": { price: 1650, laborHours: 6 },
    "Amana AMVC96 100k BTU": { price: 1950, laborHours: 6 }
  },
  airConditioning: {
    "Goodman GSX14 2 Ton": { price: 1450, laborHours: 8 },
    "Goodman GSX14 3 Ton": { price: 1750, laborHours: 8 },
    "Carrier Infinity 2 Ton": { price: 2800, laborHours: 10 },
    "Carrier Infinity 3 Ton": { price: 3200, laborHours: 10 },
    "Lennox Elite EL16XC1 2 Ton": { price: 2400, laborHours: 9 },
    "Lennox Elite EL16XC1 3 Ton": { price: 2850, laborHours: 9 }
  },
  waterHeaters: {
    "Bradford White 40 Gal": { price: 850, laborHours: 3 },
    "Bradford White 50 Gal": { price: 950, laborHours: 3 },
    "Rheem Performance 40 Gal": { price: 750, laborHours: 3 },
    "Rheem Performance 50 Gal": { price: 850, laborHours: 3 },
    "AO Smith Vertex 50 Gal": { price: 1200, laborHours: 3.5 }
  },
  ductwork: {
    "6\" Round Galvanized (per ft)": { price: 8.50, laborHours: 0.1 },
    "8\" Round Galvanized (per ft)": { price: 12.50, laborHours: 0.1 },
    "10\" Round Galvanized (per ft)": { price: 16.50, laborHours: 0.1 },
    "12\" Round Galvanized (per ft)": { price: 22.50, laborHours: 0.15 },
    "14\" Round Galvanized (per ft)": { price: 28.50, laborHours: 0.15 },
    "16\" Round Galvanized (per ft)": { price: 35.50, laborHours: 0.2 },
    "6\" Flexible Duct (per ft)": { price: 4.25, laborHours: 0.05 },
    "8\" Flexible Duct (per ft)": { price: 6.50, laborHours: 0.05 },
    "10\" Flexible Duct (per ft)": { price: 8.75, laborHours: 0.05 }
  },
  accessories: {
    "Digital Thermostat": { price: 180, laborHours: 1 },
    "Smart Thermostat (Ecobee)": { price: 320, laborHours: 1.5 },
    "Gas Line Extension (per ft)": { price: 15, laborHours: 0.3 },
    "Electrical Disconnect": { price: 85, laborHours: 1 },
    "Condensate Pump": { price: 150, laborHours: 1.5 },
    "Air Filter (MERV 11)": { price: 25, laborHours: 0 }
  }
};

export default function QuoteBuilder() {
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
  const [laborRate] = useState<number>(95); // $95/hour Calgary rate
  const [markupPercentage] = useState<number>(40); // 40% markup
  const [taxRate] = useState<number>(5); // 5% GST
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: ""
  });

  const categories = Object.keys(algginPricing);
  const availableItems = selectedCategory ? Object.keys(algginPricing[selectedCategory as keyof typeof algginPricing]) : [];

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
          return {
            ...item,
            quantity: qty,
            laborHours: (item.laborHours / item.quantity) * qty,
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
    
    return `AFTERHOURS HVAC - PROFESSIONAL QUOTE
Generated: ${date}

Customer Information:
${customerInfo.name}
${customerInfo.address}
${customerInfo.phone}
${customerInfo.email}

ITEMIZED QUOTE:

${quote.items.map(item => 
  `${item.item} x${item.quantity} @ $${item.unitPrice.toFixed(2)} = $${item.total.toFixed(2)}`
).join('\n')}

TOTALS:
Subtotal (Materials): $${quote.subtotal.toFixed(2)}
Labor (${(quote.labor / laborRate).toFixed(1)} hrs @ $${laborRate}/hr): $${quote.labor.toFixed(2)}
Markup (${markupPercentage}%): $${quote.markup.toFixed(2)}
GST (${taxRate}%): $${quote.tax.toFixed(2)}

TOTAL: $${quote.total.toFixed(2)}

Terms:
- Payment: 40% deposit, 40% at rough-in, 20% completion
- Warranty: 1 year workmanship, manufacturer warranty on equipment
- Pricing valid for 30 days

AfterHours HVAC
Calgary, Alberta
(403) 613-6014`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center bg-green-100 border border-green-200 rounded-full px-4 py-2 mb-4">
          <FileCheck className="h-4 w-4 text-green-600 mr-2" />
          <span className="text-green-600 text-sm font-medium">Pro Tool</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Professional Quote Builder</h1>
        <p className="text-gray-600">Real-time quoting with Alggin Calgary pricing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Smith"
              />
            </div>
            <div>
              <Label htmlFor="customerAddress">Address</Label>
              <Textarea
                id="customerAddress"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                placeholder="123 Main St, Calgary, AB"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">Phone</Label>
              <Input
                id="customerPhone"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(403) 555-0123"
              />
            </div>
            <div>
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Add Items */}
        <Card>
          <CardHeader>
            <CardTitle>Add Quote Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="furnaces">Furnaces</SelectItem>
                  <SelectItem value="airConditioning">Air Conditioning</SelectItem>
                  <SelectItem value="waterHeaters">Water Heaters</SelectItem>
                  <SelectItem value="ductwork">Ductwork</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedCategory && (
              <div>
                <Label htmlFor="item">Item</Label>
                <Select value={selectedItem} onValueChange={setSelectedItem}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableItems.map(item => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedItem && (
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <div className="text-sm text-gray-600 mt-1">
                  Unit Price: ${algginPricing[selectedCategory as keyof typeof algginPricing][selectedItem as any]?.price.toFixed(2)}
                </div>
              </div>
            )}

            <Button 
              onClick={addItem}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!selectedCategory || !selectedItem || !quantity}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardContent>
        </Card>

        {/* Quote Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Quote Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Materials:</span>
                <span>${quote.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Labor:</span>
                <span>${quote.labor.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Markup ({markupPercentage}%):</span>
                <span>${quote.markup.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>GST ({taxRate}%):</span>
                <span>${quote.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-green-600">${quote.total.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              className="w-full"
              onClick={() => {
                const quoteText = generateQuoteText();
                navigator.clipboard.writeText(quoteText);
              }}
              disabled={quote.items.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Copy Quote
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quote Items List */}
      {quote.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quote Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quote.items.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{item.item}</div>
                    <div className="text-sm text-gray-600">
                      {item.category} • ${item.unitPrice.toFixed(2)} each • {item.laborHours.toFixed(1)} labor hrs
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseFloat(e.target.value))}
                      className="w-20"
                    />
                    <Badge variant="outline">${item.total.toFixed(2)}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(item.id)}
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
  );
}