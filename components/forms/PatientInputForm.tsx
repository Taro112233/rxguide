// components/forms/PatientInputForm.tsx
// Complete PatientInputForm with ESLint fixes and TypeScript improvements

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Calculator, Pill, User, Weight, Calendar, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PatientInputSchema, validateWeightForAge } from '@/lib/validations/patient';
import { type DrugConcentration, type FrequencyKey } from '@/lib/constants/drugs';

// Interfaces for type safety
interface PatientFormData {
  ageYears: number;
  ageMonths?: number;
  weight: number;
  gender?: string;
  symptoms?: string[];
  allergies?: string;
  medicalHistory?: string;
}

interface ApiDrug {
  id: string;
  genericName: string;
  brandNames: string[];
  category: string;
  availableConcentrations: DrugConcentration[];
  ageRanges: string[];
  dosingRules?: {
    type: string;
    dose?: number;
    minDose?: number;
    maxDose?: number;
    unit: string;
  }[];
}

interface CalculationResult {
  patient: {
    ageYears: number;
    ageMonths: number;
    totalAgeYears: number;
    weight?: number;
  };
  drug: {
    id: string;
    name: string;
    category: string;
  };
  calculation: {
    doseInMg: number;
    volumeInMl: number;
    frequency: string;
    frequencyLabel: string;
    timesPerDay: number;
    concentration: DrugConcentration & { mgPerMl: number };
  };
  steps: {
    step1: string;
    step2: string;
    step3: string;
  };
  warnings: string[];
  measurementGuidance: string;
}

const PatientInputForm: React.FC = () => {
  // State management
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [availableDrugs, setAvailableDrugs] = useState<ApiDrug[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<ApiDrug | null>(null);
  const [selectedConcentration, setSelectedConcentration] = useState<DrugConcentration | null>(null);
  const [customConcentration, setCustomConcentration] = useState<{ mg: string; ml: string }>({ mg: '', ml: '' });
  const [selectedFrequency, setSelectedFrequency] = useState<FrequencyKey | ''>('');
  const [availableFrequencies, setAvailableFrequencies] = useState<FrequencyKey[]>([]);
  const [calculation, setCalculation] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  // Form setup with validation
  const form = useForm<PatientFormData>({
    resolver: zodResolver(PatientInputSchema),
    defaultValues: {
      ageYears: 0,
      ageMonths: 0,
      weight: 0,
      gender: '',
      symptoms: [],
      allergies: '',
      medicalHistory: ''
    }
  });

  // Watch form values for validation
  const watchedAge = form.watch('ageYears');
  const watchedWeight = form.watch('weight');

  // Calculate if we should show months input
  const shouldShowMonths = watchedAge < 3;

  // Load available drugs on component mount
  useEffect(() => {
    const loadDrugs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/drugs');
        const data = await response.json();
        
        if (data.success) {
          setAvailableDrugs(data.data.drugs);
        }
      } catch (error) {
        console.error('Failed to load drugs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDrugs();
  }, []);

  // Load available frequencies when drug is selected
  useEffect(() => {
    if (selectedDrug) {
      const frequencies: FrequencyKey[] = ['q4h', 'q6h', 'q8h', 'q12h', 'q24h'];
      setAvailableFrequencies(frequencies);
    }
  }, [selectedDrug]);

  // Validate weight for age
  useEffect(() => {
    if (watchedAge > 0 && watchedWeight > 0) {
      const validation = validateWeightForAge(watchedAge, watchedWeight);
      setValidationWarnings(validation.warning ? [validation.warning] : []);
    }
  }, [watchedAge, watchedWeight]);

  // Calculate dose
  const handleCalculate = async (): Promise<void> => {
    if (!selectedDrug || !selectedConcentration || !selectedFrequency) {
      return;
    }

    try {
      setLoading(true);
      
      const formData = form.getValues();
      
      const requestBody = {
        patientData: {
          ageYears: formData.ageYears,
          ageMonths: formData.ageMonths || 0,
          weight: formData.weight,
          gender: formData.gender
        },
        drugId: selectedDrug.id,
        concentration: selectedConcentration,
        frequency: selectedFrequency
      };

      const response = await fetch('/api/calculations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (data.success) {
        setCalculation(data.data);
        setCurrentStep(6); // Show results
      } else {
        console.error('Calculation failed:', data.error);
        // TODO: Show error toast/alert
      }
    } catch (error) {
      console.error('Calculation request failed:', error);
      // TODO: Show error toast/alert
    } finally {
      setLoading(false);
    }
  };

  // Form submission handler
  const onSubmit = (values: PatientFormData): void => {
    console.log('Form submitted:', values);
    
    // Validate required fields
    if (!values.ageYears || !values.weight) {
      console.error('Required fields missing');
      return;
    }

    // Calculate total age in months
    const totalAgeInMonths = (values.ageYears * 12) + (values.ageMonths || 0);
    
    // Age validation
    if (totalAgeInMonths > 216) { // 18 years
      console.warn('Patient age exceeds recommended range');
    }

    // Proceed to next step
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCalculate();
    }
  };

  // Reset form
  const resetForm = (): void => {
    setCurrentStep(1);
    form.reset();
    setSelectedDrug(null);
    setSelectedConcentration(null);
    setCustomConcentration({ mg: '', ml: '' });
    setSelectedFrequency('');
    setCalculation(null);
    setValidationWarnings([]);
  };

  // Animation variants
  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  // Group drugs by category
  const drugsByCategory = React.useMemo(() => {
    return availableDrugs.reduce((acc, drug) => {
      if (!acc[drug.category]) {
        acc[drug.category] = [];
      }
      acc[drug.category].push(drug);
      return acc;
    }, {} as Record<string, ApiDrug[]>);
  }, [availableDrugs]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="space-y-8">
        {/* Progress Steps */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-center">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${step <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}
                  ${step === currentStep ? 'ring-2 ring-blue-300' : ''}
                `}>
                  {step}
                </div>
                {step < 6 && (
                  <div className={`w-8 h-0.5 mx-2 
                    ${step < currentStep ? 'bg-blue-500' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && <><User className="w-5 h-5" /> ข้อมูลผู้ป่วย</>}
              {currentStep === 2 && <><Pill className="w-5 h-5" /> เลือกยา</>}
              {currentStep === 3 && <><Pill className="w-5 h-5" /> ขนาดยา</>}
              {currentStep === 4 && <><Calculator className="w-5 h-5" /> ความถี่การให้ยา</>}
              {currentStep === 5 && <><Calculator className="w-5 h-5" /> ตรวจสอบข้อมูล</>}
              {currentStep === 6 && <><Calculator className="w-5 h-5" /> ผลการคำนวณ</>}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {/* Step 1: Patient Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="ageYears"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                อายุ (ปี) *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="กรอกอายุเป็นปี"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <AnimatePresence>
                          {shouldShowMonths && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <FormField
                                control={form.control}
                                name="ageMonths"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>เดือนเพิ่มเติม</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        placeholder="0"
                                        min="0"
                                        max="11"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Weight className="w-4 h-4" />
                                น้ำหนัก (kg) *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="น้ำหนักเป็นกิโลกรัม"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>เพศ</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="เลือกเพศ" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">ชาย</SelectItem>
                                  <SelectItem value="female">หญิง</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Validation Warnings */}
                    {validationWarnings.length > 0 && (
                      <Alert className="border-yellow-200 bg-yellow-50">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-800">
                          {validationWarnings.map((warning, index) => (
                            <div key={index}>• {warning}</div>
                          ))}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex justify-end">
                      <Button 
                        onClick={() => {
                          const isValid = form.trigger(['ageYears', 'weight']);
                          if (isValid) {
                            setCurrentStep(2);
                          }
                        }}
                        disabled={!watchedAge || !watchedWeight}
                      >
                        ถัดไป
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Drug Selection */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    {loading ? (
                      <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                        <p>กำลังโหลดข้อมูลยา...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">เลือกยาที่ต้องการคำนวณ</h3>
                        
                        <div className="grid gap-3 max-h-96 overflow-y-auto">
                          {Object.entries(drugsByCategory).map(([category, drugs]) => (
                            <div key={category}>
                              <h4 className="font-medium text-gray-700 mb-2 sticky top-0 bg-white py-1">
                                {category} ({drugs.length} รายการ)
                              </h4>
                              <div className="grid gap-2 ml-4">
                                {drugs.map((drug) => (
                                  <div
                                    key={drug.id}
                                    className={`p-3 border rounded-lg cursor-pointer transition-colors
                                      ${selectedDrug?.id === drug.id 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                      }`}
                                    onClick={() => setSelectedDrug(drug)}
                                  >
                                    <div className="font-medium">{drug.genericName}</div>
                                    {drug.brandNames.length > 0 && (
                                      <div className="text-sm text-gray-600">
                                        ({drug.brandNames.join(', ')})
                                      </div>
                                    )}
                                    <div className="flex gap-1 mt-2">
                                      {drug.availableConcentrations.map((conc, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                          {conc.mg}mg/{conc.ml}mL
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setCurrentStep(1)}>
                        ก่อนหน้า
                      </Button>
                      <Button 
                        onClick={() => setCurrentStep(3)}
                        disabled={!selectedDrug}
                      >
                        ถัดไป
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Concentration Selection */}
                {currentStep === 3 && selectedDrug && (
                  <motion.div
                    key="step3"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        เลือกความเข้มข้นของ {selectedDrug.genericName}
                      </h3>
                      
                      <div className="space-y-3">
                        {selectedDrug.availableConcentrations.map((conc, index) => (
                          <div
                            key={index}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors
                              ${selectedConcentration?.mg === conc.mg && selectedConcentration?.ml === conc.ml
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                              }`}
                            onClick={() => setSelectedConcentration(conc)}
                          >
                            <div className="font-medium">
                              {conc.mg} mg / {conc.ml} mL
                            </div>
                            <div className="text-sm text-gray-600">
                              ความเข้มข้น: {(conc.mg / conc.ml).toFixed(1)} mg/mL
                            </div>
                            {conc.form && (
                              <div className="text-sm text-gray-500">
                                รูปแบบ: {conc.form}
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {/* Custom concentration option */}
                        <div className="border-t py-4">
                          <h4 className="font-medium mb-3">หรือกรอกความเข้มข้นเอง</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                ปริมาณยา (mg)
                              </label>
                              <Input
                                type="number"
                                placeholder="เช่น 120"
                                value={customConcentration.mg}
                                onChange={(e) => setCustomConcentration(prev => ({
                                  ...prev,
                                  mg: e.target.value
                                }))}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                ปริมาตร (mL)
                              </label>
                              <Input
                                type="number"
                                placeholder="เช่น 5"
                                value={customConcentration.ml}
                                onChange={(e) => setCustomConcentration(prev => ({
                                  ...prev,
                                  ml: e.target.value
                                }))}
                              />
                            </div>
                          </div>
                          {customConcentration.mg && customConcentration.ml && (
                            <Button
                              variant="outline"
                              className="mt-3"
                              onClick={() => {
                                const mg = parseFloat(customConcentration.mg);
                                const ml = parseFloat(customConcentration.ml);
                                if (mg > 0 && ml > 0) {
                                  setSelectedConcentration({ mg, ml });
                                }
                              }}
                            >
                              ใช้ความเข้มข้นนี้
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setCurrentStep(2)}>
                        ก่อนหน้า
                      </Button>
                      <Button 
                        onClick={() => setCurrentStep(4)}
                        disabled={!selectedConcentration}
                      >
                        ถัดไป
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Frequency Selection */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-medium mb-4">เลือกความถี่ในการให้ยา</h3>
                      
                      <div className="grid gap-3">
                        {availableFrequencies.map((freq) => {
                          const frequencyLabels: Record<FrequencyKey, string> = {
                            'q4h': 'ทุก 4 ชั่วโมง (6 ครั้งต่อวัน)',
                            'q6h': 'ทุก 6 ชั่วโมง (4 ครั้งต่อวัน)',
                            'q8h': 'ทุก 8 ชั่วโมง (3 ครั้งต่อวัน)',
                            'q12h': 'ทุก 12 ชั่วโมง (2 ครั้งต่อวัน)',
                            'q24h': 'ทุก 24 ชั่วโมง (1 ครั้งต่อวัน)'
                          };

                          return (
                            <div
                              key={freq}
                              className={`p-4 border rounded-lg cursor-pointer transition-colors
                                ${selectedFrequency === freq
                                  ? 'border-blue-500 bg-blue-50' 
                                  : 'border-gray-200 hover:border-gray-300'
                                }`}
                              onClick={() => setSelectedFrequency(freq)}
                            >
                              <div className="font-medium">
                                {frequencyLabels[freq]}
                              </div>
                              <div className="text-sm text-gray-600">
                                รหัส: {freq.toUpperCase()}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setCurrentStep(3)}>
                        ก่อนหน้า
                      </Button>
                      <Button 
                        onClick={() => setCurrentStep(5)}
                        disabled={!selectedFrequency}
                      >
                        ถัดไป
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Review */}
                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-medium mb-4">ตรวจสอบข้อมูลก่อนคำนวณ</h3>
                      
                      <div className="space-y-4">
                        {/* Patient Info */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">ข้อมูลผู้ป่วย</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex justify-between">
                              <span>อายุ:</span>
                              <span>{form.getValues('ageYears')} ปี {form.getValues('ageMonths') || 0} เดือน</span>
                            </div>
                            <div className="flex justify-between">
                              <span>น้ำหนัก:</span>
                              <span>{form.getValues('weight')} kg</span>
                            </div>
                            <div className="flex justify-between">
                              <span>เพศ:</span>
                              <span>{form.getValues('gender') === 'male' ? 'ชาย' : 'หญิง'}</span>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Drug Info */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">ข้อมูลยา</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex justify-between">
                              <span>ยา:</span>
                              <span>{selectedDrug?.genericName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>ความเข้มข้น:</span>
                              <span>
                                {selectedConcentration?.mg} mg / {selectedConcentration?.ml} mL
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>ความถี่:</span>
                              <span>{selectedFrequency}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setCurrentStep(4)}>
                        ก่อนหน้า
                      </Button>
                      <Button onClick={handleCalculate} disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            กำลังคำนวณ...
                          </>
                        ) : (
                          'คำนวณขนาดยา'
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 6: Results */}
                {currentStep === 6 && calculation && (
                  <motion.div
                    key="step6"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-medium mb-4">ผลการคำนวณขนาดยา</h3>
                      
                      <div className="space-y-4">
                        {/* Main Results */}
                        <Card className="border-green-200 bg-green-50">
                          <CardHeader>
                            <CardTitle className="text-green-800">ขนาดยาที่แนะนำ</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm text-green-600">ขนาดยา</div>
                                <div className="text-2xl font-bold text-green-800">
                                  {calculation.calculation.doseInMg} mg
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-green-600">ปริมาตร</div>
                                <div className="text-2xl font-bold text-green-800">
                                  {calculation.calculation.volumeInMl.toFixed(1)} mL
                                </div>
                              </div>
                            </div>
                            <div className="border-t pt-3">
                              <div className="text-sm text-green-600">ความถี่การให้ยา</div>
                              <div className="font-semibold text-green-800">
                                {calculation.calculation.frequencyLabel} ({calculation.calculation.timesPerDay} ครั้งต่อวัน)
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Calculation Steps */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">ขั้นตอนการคำนวณ</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2 text-sm">
                              {calculation.steps.step1 && <div>1. {calculation.steps.step1}</div>}
                              {calculation.steps.step2 && <div>2. {calculation.steps.step2}</div>}
                              {calculation.steps.step3 && <div>3. {calculation.steps.step3}</div>}
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Measurement Guidance */}
                        <Card className="bg-blue-50 border-blue-200">
                          <CardHeader>
                            <CardTitle className="text-blue-800 text-base">คำแนะนำการวัดยา</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm text-blue-700">
                              {calculation.measurementGuidance}
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Warnings */}
                        {calculation.warnings.length > 0 && (
                          <Alert className="border-yellow-200 bg-yellow-50">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <AlertDescription className="text-yellow-800">
                              <div className="font-medium mb-1">ข้อควรระวัง:</div>
                              {calculation.warnings.map((warning, index) => (
                                <div key={index}>• {warning}</div>
                              ))}
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        {/* Action buttons */}
                        <div className="flex gap-2 pt-4">
                          <Button 
                            variant="outline" 
                            onClick={() => setCurrentStep(5)}
                            className="flex-1"
                          >
                            แก้ไขข้อมูล
                          </Button>
                          <Button 
                            onClick={resetForm}
                            className="flex-1"
                          >
                            ผู้ป่วยใหม่
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Form>
          </CardContent>
        </Card>

        {/* Footer - Drug Database Stats */}
        {currentStep === 2 && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg">ยาในระบบ ({availableDrugs.length} รายการ)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(drugsByCategory).map(([category, drugs]) => (
                    <Badge key={category} variant="secondary" className="text-xs">
                      {category} ({drugs.length})
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  * อิงจากแนวทางปฏิบัติ TPPG และกรมการแพทย์
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PatientInputForm;