// components/DemoComponents.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calculator, 
  Pill, 
  Heart, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend?: number;
}

interface DoseCalculation {
  drugName: string;
  dose: string;
  volume: string;
  frequency: string;
  duration: string;
}

const DemoStats = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setProgress(85), 500);
    return () => clearTimeout(timer);
  }, []);

  const stats: StatItem[] = [
    {
      label: 'ยาในระบบ',
      value: '524',
      icon: Pill,
      color: 'text-blue-600',
      trend: 12
    },
    {
      label: 'การคำนวณวันนี้',
      value: '148',
      icon: Calculator,
      color: 'text-green-600',
      trend: 8
    },
    {
      label: 'ผู้ใช้งานออนไลน์',
      value: '32',
      icon: Users,
      color: 'text-purple-600',
      trend: -3
    },
    {
      label: 'ความแม่นยำ',
      value: '99.7%',
      icon: CheckCircle,
      color: 'text-emerald-600',
      trend: 0.2
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    {stat.trend !== undefined && (
                      <div className={`flex items-center text-sm mt-1 ${
                        stat.trend > 0 ? 'text-green-600' : 
                        stat.trend < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.trend > 0 ? '+' : ''}{stat.trend}%
                      </div>
                    )}
                  </div>
                  <IconComponent className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            ประสิทธิภาพระบบ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>ความแม่นยำการคำนวณ</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Clock className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                <div className="text-sm text-gray-600">เวลาตอบสนอง</div>
                <div className="font-semibold">&lt; 100ms</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
                <div className="text-sm text-gray-600">ความปลอดภัย</div>
                <div className="font-semibold">100%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DemoDoseCalculator = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<DoseCalculation | null>(null);

  const mockCalculation = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setResult({
        drugName: 'Paracetamol Syrup 120mg/5mL',
        dose: '180 mg (15 mg/kg)',
        volume: '7.5 mL',
        frequency: 'ทุก 6 ชั่วโมง',
        duration: '3-5 วัน'
      });
      setIsCalculating(false);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          ตัวอย่างการคำนวณขนาดยา
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">ข้อมูลผู้ป่วย (ตัวอย่าง)</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">อายุ:</span>
                <span className="ml-2 font-medium">2 ปี</span>
              </div>
              <div>
                <span className="text-gray-600">น้ำหนัก:</span>
                <span className="ml-2 font-medium">12 kg</span>
              </div>
              <div>
                <span className="text-gray-600">อาการ:</span>
                <span className="ml-2 font-medium">ไข้</span>
              </div>
              <div>
                <span className="text-gray-600">อุณหภูมิ:</span>
                <span className="ml-2 font-medium">38.5°C</span>
              </div>
            </div>
          </div>

          {!result && !isCalculating && (
            <Button onClick={mockCalculation} className="w-full">
              คำนวณขนาดยา
            </Button>
          )}

          {isCalculating && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">กำลังคำนวณ...</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium text-green-800">ผลการคำนวณ</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">ยาที่แนะนำ:</span>
                    <span className="ml-2">{result.drugName}</span>
                  </div>
                  <div>
                    <span className="font-medium">ขนาดยา:</span>
                    <span className="ml-2">{result.dose}</span>
                  </div>
                  <div>
                    <span className="font-medium">ปริมาตร:</span>
                    <span className="ml-2">{result.volume}</span>
                  </div>
                  <div>
                    <span className="font-medium">ความถี่:</span>
                    <span className="ml-2">{result.frequency}</span>
                  </div>
                  <div>
                    <span className="font-medium">ระยะเวลา:</span>
                    <span className="ml-2">{result.duration}</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <h5 className="font-medium text-yellow-800">ข้อควรระวัง</h5>
                </div>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• ไม่ควรเกิน 4 ครั้งต่อวัน</li>
                  <li>• หากไข้ไม่ลดหลัง 3 วัน ควรพบแพทย์</li>
                  <li>• ระวังการแพ้ยา Paracetamol</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setResult(null);
                    setIsCalculating(false);
                  }}
                  className="flex-1"
                >
                  คำนวณใหม่
                </Button>
                <Button className="flex-1">
                  บันทึกผล
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const DemoSystemAlerts = () => {
  const alerts = [
    {
      type: 'warning',
      title: 'ข้อห้ามใช้',
      message: 'Aspirin ไม่แนะนำสำหรับเด็กอายุต่ำกว่า 16 ปี',
      time: '2 นาทีที่แล้ว'
    },
    {
      type: 'info',
      title: 'อัปเดตแนวทาง',
      message: 'แนวทางการรักษาโรคหวัดใหม่จาก TPPG',
      time: '1 ชั่วโมงที่แล้ว'
    },
    {
      type: 'success',
      title: 'การคำนวณเสร็จสิ้น',
      message: 'บันทึกข้อมูลการคำนวณสำเร็จ',
      time: '3 ชั่วโมงที่แล้ว'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          การแจ้งเตือนระบบ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg border-l-4 ${
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                alert.type === 'info' ? 'bg-blue-50 border-blue-400' :
                'bg-green-50 border-green-400'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-medium text-sm">{alert.title}</h5>
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    alert.type === 'info' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}
                >
                  {alert.time}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { DemoStats, DemoDoseCalculator, DemoSystemAlerts };