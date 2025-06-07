import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Settings, Wind, Calculator } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProAccessGuard } from "@/components/ProAccessGuard";

interface DuctSizing {
  supply: { [key: string]: { diameter: number; velocity: number; friction: number } };
  return: { diameter: number; velocity: number; friction: number };
  mainTrunk: { diameter: number; velocity: number };
}

function DuctSizingCalculatorContent() {
  const [cfm, setCfm] = useState<string>("");
  const [ductType, setDuctType] = useState<string>("");
  const [rooms, setRooms] = useState<Array<{ name: string; cfm: string }>>([
    { name: "Living Room", cfm: "" },
    { name: "Kitchen", cfm: "" },
    { name: "Master Bedroom", cfm: "" }
  ]);
  const [result, setResult] = useState<DuctSizing | null>(null);

  const addRoom = () => {
    setRooms([...rooms, { name: "", cfm: "" }]);
  };

  const updateRoom = (index: number, field: string, value: string) => {
    const updatedRooms = [...rooms];
    updatedRooms[index] = { ...updatedRooms[index], [field]: value };
    setRooms(updatedRooms);
  };

  const removeRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const calculateDuctSizing = () => {
    if (!cfm || !ductType) return;

    const totalCFM = parseFloat(cfm);
    
    // Calculate individual room duct sizes
    const supply: { [key: string]: { diameter: number; velocity: number; friction: number } } = {};
    
    rooms.forEach(room => {
      if (room.name && room.cfm) {
        const roomCFM = parseFloat(room.cfm);
        
        // Calculate duct diameter using velocity method
        // Target velocity: 600-900 FPM for supply, 500-700 FPM for return
        const targetVelocity = 750; // FPM
        const area = roomCFM / targetVelocity; // sq ft
        const diameter = Math.sqrt(area * 4 / Math.PI) * 12; // inches
        
        // Round to standard duct sizes
        const standardSizes = [4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20];
        const roundedDiameter = standardSizes.find(size => size >= diameter) || standardSizes[standardSizes.length - 1];
        
        // Recalculate actual velocity
        const actualArea = Math.PI * Math.pow(roundedDiameter / 12, 2) / 4;
        const actualVelocity = roomCFM / actualArea;
        
        // Calculate friction loss (simplified)
        const friction = 0.1 * Math.pow(actualVelocity / 1000, 1.85); // inches of water per 100 ft
        
        supply[room.name] = {
          diameter: roundedDiameter,
          velocity: Math.round(actualVelocity),
          friction: Math.round(friction * 100) / 100
        };
      }
    });

    // Calculate return duct sizing (typically 20% larger than supply)
    const returnCFM = totalCFM * 0.9; // Account for some supply air leakage
    const returnTargetVelocity = 600; // Lower velocity for return
    const returnArea = returnCFM / returnTargetVelocity;
    const returnDiameter = Math.sqrt(returnArea * 4 / Math.PI) * 12;
    
    // For rectangular return, convert to equivalent round
    const standardReturnSizes = [14, 16, 18, 20, 24, 28, 30];
    const roundedReturnDiameter = standardReturnSizes.find(size => size >= returnDiameter) || standardReturnSizes[standardReturnSizes.length - 1];
    
    const actualReturnArea = Math.PI * Math.pow(roundedReturnDiameter / 12, 2) / 4;
    const actualReturnVelocity = returnCFM / actualReturnArea;
    const returnFriction = 0.1 * Math.pow(actualReturnVelocity / 1000, 1.85);

    // Calculate main trunk sizing
    const trunkVelocity = 1200; // Higher velocity acceptable for main trunk
    const trunkArea = totalCFM / trunkVelocity;
    const trunkDiameter = Math.sqrt(trunkArea * 4 / Math.PI) * 12;
    const standardTrunkSizes = [16, 18, 20, 24, 28, 30, 36];
    const roundedTrunkDiameter = standardTrunkSizes.find(size => size >= trunkDiameter) || standardTrunkSizes[standardTrunkSizes.length - 1];
    
    const actualTrunkArea = Math.PI * Math.pow(roundedTrunkDiameter / 12, 2) / 4;
    const actualTrunkVelocity = totalCFM / actualTrunkArea;

    setResult({
      supply,
      return: {
        diameter: roundedReturnDiameter,
        velocity: Math.round(actualReturnVelocity),
        friction: Math.round(returnFriction * 100) / 100
      },
      mainTrunk: {
        diameter: roundedTrunkDiameter,
        velocity: Math.round(actualTrunkVelocity)
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center bg-blue-100 border border-blue-200 rounded-full px-4 py-2 mb-4">
          <Settings className="h-4 w-4 text-blue-600 mr-2" />
          <span className="text-blue-600 text-sm font-medium">Pro Tool</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manual D Duct Sizing Calculator</h1>
        <p className="text-gray-600">Professional ductwork design and sizing for optimal airflow</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-blue-600" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="totalCFM">Total System CFM</Label>
              <Input
                id="totalCFM"
                type="number"
                placeholder="e.g., 1200"
                value={cfm}
                onChange={(e) => setCfm(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="ductType">Duct Material</Label>
              <Select value={ductType} onValueChange={setDuctType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duct type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="galvanized">Galvanized Steel</SelectItem>
                  <SelectItem value="flexible">Flexible Duct</SelectItem>
                  <SelectItem value="ductboard">Duct Board</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Room CFM Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Room CFM Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rooms.map((room, index) => (
              <div key={index} className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Room name"
                  value={room.name}
                  onChange={(e) => updateRoom(index, "name", e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="CFM"
                  value={room.cfm}
                  onChange={(e) => updateRoom(index, "cfm", e.target.value)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeRoom(index)}
                  disabled={rooms.length <= 1}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addRoom} className="w-full">
              Add Room
            </Button>
            
            <Button 
              onClick={calculateDuctSizing} 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!cfm || !ductType}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Duct Sizes
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Duct Sizing Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Trunk */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Main Trunk</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span>Diameter:</span>
                  <Badge variant="outline">{result.mainTrunk.diameter}"</Badge>
                  <span>Velocity:</span>
                  <Badge variant="outline">{result.mainTrunk.velocity} FPM</Badge>
                </div>
              </div>

              {/* Return Duct */}
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Return Duct</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span>Diameter:</span>
                  <Badge variant="outline">{result.return.diameter}"</Badge>
                  <span>Velocity:</span>
                  <Badge variant="outline">{result.return.velocity} FPM</Badge>
                  <span>Friction:</span>
                  <Badge variant="outline">{result.return.friction}" WC</Badge>
                </div>
              </div>

              <Separator />

              {/* Supply Ducts */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Supply Ducts</h4>
                <div className="space-y-2">
                  {Object.entries(result.supply).map(([roomName, ductInfo]) => (
                    <div key={roomName} className="p-3 bg-orange-50 rounded-lg">
                      <div className="font-medium text-orange-900 mb-1">{roomName}</div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Diameter:</span>
                          <div className="font-medium">{ductInfo.diameter}"</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Velocity:</span>
                          <div className="font-medium">{ductInfo.velocity} FPM</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Friction:</span>
                          <div className="font-medium">{ductInfo.friction}" WC</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Calculations based on Manual D principles. Actual installation may require 
                  adjustments for fittings, length, and local codes.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function DuctSizingCalculator() {
  return (
    <ProAccessGuard>
      <DuctSizingCalculatorContent />
    </ProAccessGuard>
  );
}