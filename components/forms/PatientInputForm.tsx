// components/forms/PatientInputForm.tsx
// Updated PatientInputForm with API integration

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Calculator, Pill, User, Weight, Calendar, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { PatientInputSchema, type PatientInput, validateWeightForAge } from '@/lib/validations/patient';
import { type Drug, type DrugConcentration, type FrequencyKey } from '@/lib/constants/drugs';

interface ApiDrug {
  id: string;
  genericName: string;
  brandNames: string[];
  category: string;
  availableConcentrations: DrugConcentration[];
  ageRanges: string[];
  dosingRules?: any[];
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
  const [currentStep, setCurrentStep] = useState(1);
  const [availableDrugs, setAvailableDrugs] = useState<ApiDrug[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<ApiDrug | null>(null);
  const [selectedConcentration, setSelectedConcentration] = useState<DrugConcentration | null>(null);
  const [customConcentration, setCustomConcentration] = useState({ mg: '', ml: '' });
  const [selectedFrequency, setSelectedFrequency] = useState<FrequencyKey | ''>('');
  const [availableFrequencies, setAvailableFrequencies] = useState<FrequencyKey[]>([]);
  const [calculation, setCalculation] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultUnit, setResultUnit] = useState<'ml' | 'mg'>('ml');

  const form = useForm<PatientInput>({
    resolver: zodResolver(PatientInputSchema),
    defaultValues: {
      ageYears: 0,
      ageMonths: 0,
      weight: undefined,
      gender: undefined
    }
  });

  const watchedAge = form.watch('ageYears');
  const watchedWeight = form.watch('weight');
  const shouldShowMonths = watchedAge && watchedAge < 10;

  // Load drugs on component mount
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

  // Load drug details when selected
  useEffect(() => {
    const loadDrugDetails = async () => {
      if (!selectedDrug) return;

      try {
        const response = await fetch(`/api/drugs/${selectedDrug.id}`);
        const data = await response.json();
        
        if (data.success) {
          const drugData = data.data;
          
          // Extract available frequencies from dosing rules
          const frequencies = new Set<FrequencyKey>();
          drugData.dosingRules.forEach((rule: any) => {
            rule.frequencies.forEach((freq: FrequencyKey) => frequencies.add(freq));
          });
          
          setAvailableFrequencies(Array.from(frequencies));
        }
      } catch (error) {
        console.error('Failed to load drug details:', error);
      }
    };

    loadDrugDetails();
  }, [selectedDrug]);

  // Weight validation warnings
  const weightWarnings = React.useMemo(() => {
    if (!watchedAge || !watchedWeight) return [];
    
    const validation = validateWeightForAge(watchedAge, watchedWeight);
    return validation.warning ? [validation.warning] : [];
  }, [watchedAge, watchedWeight]);

  // Calculate dose
  const handleCalculate = async () => {
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
        // Handle calculation error
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

  const resetForm = () => {
    setCurrentStep(1);
    form.reset();
    setSelectedDrug(null);
    setSelectedConcentration(null);
    setCustomConcentration({ mg: '', ml: '' });
    setSelectedFrequency('');
    setCalculation(null);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            เครื่องคำนวณขนาดยาเด็ก
          </h1>
          <p className="text-gray-600">
            Pharmacy Assistant Toolkit - Pediatric Dose Calculator
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
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
            <Form {...form}>
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
                    
                    {/* Weight Warnings */}
                    {weightWarnings.length > 0 && (
                      <Alert className="border-yellow-200 bg-yellow-50">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-800">
                          {weightWarnings.map((warning, index) => (
                            <div key={index}>{warning}</div>
                          ))}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => setCurrentStep(2)}
                        disabled={!form.watch('ageYears') || !form.watch('weight')}
                        className="px-8"
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
                      <div>
                        <Label>เลือกยา</Label>
                        <div className="mt-2 space-y-4">
                          {Object.entries(drugsByCategory).map(([category, drugs]) => (
                            <div key={category}>
                              <h3 className="font-medium text-gray-900 mb-2">{category}</h3>
                              <div className="grid gap-2">
                                {drugs.map((drug) => (
                                  <div 
                                    key={drug.id}
                                    className={`p-3 border rounded-lg cursor-pointer transition-all
                                      ${selectedDrug?.id === drug.id 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-200 hover:border-gray-300'}
                                    `}
                                    onClick={() => setSelectedDrug(drug)}
                                  >
                                    <div className="font-medium">{drug.genericName}</div>
                                    <div className="text-sm text-gray-500 mt-1">
                                      {drug.brandNames.join(', ')}
                                    </div>
                                    {drug.ageRanges.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {drug.ageRanges.map((range) => (
                                          <Badge key={range} variant="secondary" className="text-xs">
                                            {range}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentStep(1)}
                      >
                        ย้อนกลับ
                      </Button>
                      <Button 
                        onClick={() => setCurrentStep(3)}
                        disabled={!selectedDrug}
                        className="px-8"
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
                      <Label>ขนาดยาที่มี</Label>
                      <div className="mt-2 space-y-2">
                        {selectedDrug.availableConcentrations.map((conc, index) => (
                          <div 
                            key={index}
                            className={`p-3 border rounded-lg cursor-pointer transition-all
                              ${selectedConcentration === conc 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'}
                            `}
                            onClick={() => setSelectedConcentration(conc)}
                          >
                            <div className="font-medium">{conc.label}</div>
                            <div className="text-sm text-gray-500">
                              {conc.mg} mg ใน {conc.ml} mL
                            </div>
                          </div>
                        ))}
                        
                        {/* Custom concentration */}
                        <div className="p-3 border border-dashed border-gray-300 rounded-lg">
                          <div className="font-medium mb-2">ขนาดยาอื่นๆ</div>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              placeholder="mg"
                              value={customConcentration.mg}
                              onChange={(e) => setCustomConcentration({
                                ...customConcentration, 
                                mg: e.target.value
                              })}
                            />
                            <Input
                              placeholder="mL"
                              value={customConcentration.ml}
                              onChange={(e) => setCustomConcentration({
                                ...customConcentration, 
                                ml: e.target.value
                              })}
                            />
                          </div>
                          {customConcentration.mg && customConcentration.ml && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => {
                                const customConc = {
                                  mg: parseFloat(customConcentration.mg),
                                  ml: parseFloat(customConcentration.ml),
                                  label: `${customConcentration.mg}mg/${customConcentration.ml}mL`
                                };
                                setSelectedConcentration(customConc);
                              }}
                            >
                              ใช้ขนาดนี้
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentStep(2)}
                      >
                        ย้อนกลับ
                      </Button>
                      <Button 
                        onClick={() => setCurrentStep(4)}
                        disabled={!selectedConcentration}
                        className="px-8"
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
                      <Label>เลือกความถี่การให้ยา</Label>
                      <div className="mt-2 grid gap-2">
                        {availableFrequencies.map((freq) => {
                          const labels: Record<FrequencyKey, string> = {
                            'OD': 'วันละ 1 ครั้ง',
                            'BID': 'วันละ 2 ครั้ง',
                            'TID': 'วันละ 3 ครั้ง',
                            'QID': 'วันละ 4 ครั้ง',
                            'q4-6h': 'ทุก 4-6 ชั่วโมง',
                            'q6-8h': 'ทุก 6-8 ชั่วโมง',
                            'q8h': 'ทุก 8 ชั่วโมง',
                            'q12h': 'ทุก 12 ชั่วโมง',
                            'PRN': 'เมื่อจำเป็น'
                          };
                          
                          return (
                            <div 
                              key={freq}
                              className={`p-3 border rounded-lg cursor-pointer transition-all
                                ${selectedFrequency === freq 
                                  ? 'border-blue-500 bg-blue-50' 
                                  : 'border-gray-200 hover:border-gray-300'}
                              `}
                              onClick={() => setSelectedFrequency(freq)}
                            >
                              <div className="font-medium">{labels[freq]}</div>
                              <div className="text-sm text-gray-500">{freq}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentStep(3)}
                      >
                        ย้อนกลับ
                      </Button>
                      <Button 
                        onClick={() => setCurrentStep(5)}
                        disabled={!selectedFrequency}
                        className="px-8"
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
                    <div className="text-center p-6 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">ตรวจสอบข้อมูล</h3>
                      <div className="space-y-2 text-sm">
                        <div>อายุ: {form.watch('ageYears')} ปี {form.watch('ageMonths') && `${form.watch('ageMonths')} เดือน`}</div>
                        <div>น้ำหนัก: {form.watch('weight')} kg</div>
                        <div>ยา: {selectedDrug?.genericName}</div>
                        <div>ขนาดยา: {selectedConcentration?.label}</div>
                        <div>ความถี่: {selectedFrequency}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentStep(4)}
                      >
                        ย้อนกลับ
                      </Button>
                      <Button 
                        onClick={handleCalculate}
                        disabled={loading}
                        className="px-8"
                      >
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
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-50 border border-green-200 rounded-lg p-6"
                    >
                      <h3 className="text-xl font-bold text-green-800 mb-4 text-center">
                        ผลการคำนวณ
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="flex justify-center items-center gap-2 mb-2">
                            <Button
                              variant={resultUnit === 'ml' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setResultUnit('ml')}
                            >
                              mL
                            </Button>
                            <Button
                              variant={resultUnit === 'mg' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setResultUnit('mg')}
                            >
                              mg
                            </Button>
                          </div>
                          
                          <div className="text-4xl font-bold text-green-600">
                            {resultUnit === 'ml' 
                              ? `${calculation.calculation.volumeInMl} mL` 
                              : `${calculation.calculation.doseInMg} mg`}
                          </div>
                          <div className="text-lg text-gray-600 mt-1">
                            ต่อมื้อ ({calculation.calculation.frequencyLabel})
                          </div>
                        </div>
                        
                        <div className="border-t pt-4 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>ยา:</span>
                            <span className="font-medium">{calculation.drug.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>ขนาดยา:</span>
                            <span className="font-medium">{calculation.calculation.concentration.label}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>ขนาดต่อมื้อ:</span>
                            <span className="font-medium">
                              {calculation.calculation.doseInMg} mg = {calculation.calculation.volumeInMl} mL
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>ความถี่:</span>
                            <span className="font-medium">{calculation.calculation.frequencyLabel}</span>
                          </div>
                        </div>

                        {/* Calculation Steps */}
                        <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
                          <h4 className="font-medium text-blue-800 mb-2">ขั้นตอนการคำนวณ</h4>
                          <div className="text-sm text-blue-700 space-y-1">
                            {calculation.steps.step1 && <div>1. {calculation.steps.step1}</div>}
                            {calculation.steps.step2 && <div>2. {calculation.steps.step2}</div>}
                            {calculation.steps.step3 && <div>3. {calculation.steps.step3}</div>}
                          </div>
                        </div>
                        
                        {/* Measurement Guidance */}
                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                          <h4 className="font-medium text-blue-800 mb-2">คำแนะนำการวัดยา</h4>
                          <div className="text-sm text-blue-700">
                            {calculation.measurementGuidance}
                          </div>
                        </div>
                        
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
                    </motion.div>
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