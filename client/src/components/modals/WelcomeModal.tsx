import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Phone, Users, Wrench, X } from "lucide-react";
import { useLocation } from "wouter";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [, setLocation] = useLocation();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowEmergencyModal(true);
      setShowUserTypeModal(false);
    }
  }, [isOpen]);

  const handleEmergencyYes = () => {
    setShowEmergencyModal(false);
    onClose();
    setLocation("/emergency");
  };

  const handleEmergencyNo = () => {
    setShowEmergencyModal(false);
    setShowUserTypeModal(true);
  };

  const handleUserTypeSelection = (userType: 'customer' | 'pro') => {
    setShowUserTypeModal(false);
    onClose();
    if (userType === 'customer') {
      setLocation("/auth");
    } else {
      setLocation("/auth?type=pro");
    }
  };

  const handleClose = () => {
    setShowEmergencyModal(false);
    setShowUserTypeModal(false);
    onClose();
  };

  return (
    <>
      <Dialog open={showEmergencyModal} onOpenChange={() => {}}>
        <DialogContent className="max-w-md bg-white border-2 border-red-200 shadow-2xl">
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-2 top-2 h-8 w-8 p-0 z-50" 
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogHeader className="bg-red-50 -m-6 mb-6 p-6 rounded-t-lg">
            <DialogTitle className="text-xl font-bold text-red-900 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              Emergency HVAC Service
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Do you need emergency HVAC service?
              </p>
              <p className="text-sm text-gray-600">
                We're available 24/7 for heating and cooling emergencies
              </p>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-5 w-5 text-red-600" />
                <span className="font-bold text-red-900">24/7 Emergency Line</span>
              </div>
              <a 
                href="tel:4036136014" 
                className="text-2xl font-black text-red-600 hover:text-red-700"
              >
                (403) 613-6014
              </a>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleEmergencyYes}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
              >
                Yes, I Need Emergency Service
              </Button>
              <Button 
                onClick={handleEmergencyNo}
                variant="outline"
                className="flex-1 border-gray-300 hover:bg-gray-50 py-3"
              >
                No, Continue to Site
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showUserTypeModal} onOpenChange={() => {}}>
        <DialogContent className="max-w-2xl bg-white border-2 border-blue-200 shadow-2xl">
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-2 top-2 h-8 w-8 p-0 z-50" 
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogHeader className="bg-blue-50 -m-6 mb-6 p-6 rounded-t-lg">
            <DialogTitle className="text-xl font-bold text-blue-900 flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              Welcome to AfterHours HVAC
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900 mb-2">
                How would you like to access our services?
              </p>
              <p className="text-sm text-gray-600">
                Choose your account type to get started
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300"
                onClick={() => handleUserTypeSelection('customer')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl text-blue-900">Customer Portal</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <ul className="text-sm text-gray-600 space-y-2 mb-4">
                    <li>• Schedule service appointments</li>
                    <li>• Request quotes and estimates</li>
                    <li>• Access maintenance plans</li>
                    <li>• Track service history</li>
                    <li>• Emergency service requests</li>
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Continue as Customer
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-300"
                onClick={() => handleUserTypeSelection('pro')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <Wrench className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl text-orange-900">Professional Portal</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <ul className="text-sm text-gray-600 space-y-2 mb-4">
                    <li>• Advanced HVAC calculators</li>
                    <li>• Professional quote tools</li>
                    <li>• Industry forum access</li>
                    <li>• Technical resources</li>
                    <li>• Contractor networking</li>
                  </ul>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    Continue as Professional
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                Skip for now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}