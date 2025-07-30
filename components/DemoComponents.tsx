// components/DemoComponents.tsx
'use client'

import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from "sonner"
import { 
  FileText, 
  Loader2, 
  XCircle, 
  CheckCircle, 
  Home, 
  Users, 
  Settings,
  Activity
} from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Schema for form validation
const formSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อ').max(32, 'ชื่อยาวเกินไป'),
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
})

type FormData = z.infer<typeof formSchema>

// Stateful UI Pattern Demo
export function StatefulUIPatternDemo() {
  const [state, setState] = React.useState<'empty' | 'loading' | 'error' | 'success'>('empty')

  React.useEffect(() => {
    if (state === 'success') {
      toast('โหลดยูสำเร็จ!')
    }
  }, [state])

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        {(['empty', 'loading', 'error', 'success'] as const).map((s) => (
          <Button
            key={s}
            variant={state === s ? "default" : "outline"}
            size="sm"
            onClick={() => setState(s)}
            className="capitalize"
          >
            {s}
          </Button>
        ))}
      </div>
      <Card className="min-h-[120px] flex items-center justify-center">
        <CardContent className="p-6">
          {state === 'empty' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-muted-foreground">
              <FileText className="w-8 h-8 mb-2" />
              <div className="text-sm">ไม่มีข้อมูลในระบบ</div>
            </motion.div>
          )}
          {state === 'loading' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-blue-500">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <div className="text-sm">กำลังโหลดข้อมูล...</div>
            </motion.div>
          )}
          {state === 'error' && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1, x: [0, -8, 8, -8, 8, 0] }}
              transition={{ type: 'tween', duration: 0.5 }}
              className="flex flex-col items-center text-destructive"
            >
              <XCircle className="w-8 h-8 mb-2" />
              <div className="text-sm mb-2">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>
              <Button size="sm" variant="outline" onClick={() => setState('loading')}>
                ลองใหม่
              </Button>
            </motion.div>
          )}
          {state === 'success' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-green-500">
              <CheckCircle className="w-8 h-8 mb-2" />
              <div className="text-sm">โหลดข้อมูลสำเร็จ!</div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Role-based UI Demo
export function RoleBasedUIDemo() {
  const [role, setRole] = React.useState<'admin' | 'doctor' | 'nurse' | 'clerk'>('admin')

  const sidebarMenus = {
    admin: [
      { icon: Home, label: 'Dashboard' },
      { icon: Users, label: 'User Management' },
      { icon: FileText, label: 'Reports' },
      { icon: Settings, label: 'Settings' },
    ],
    doctor: [
      { icon: Home, label: 'Dashboard' },
      { icon: FileText, label: 'Patient Records' },
      { icon: Users, label: 'Appointments' },
      { icon: Activity, label: 'Prescriptions' },
    ],
    nurse: [
      { icon: Home, label: 'Dashboard' },
      { icon: FileText, label: 'Patient Care' },
      { icon: Users, label: 'Schedules' },
    ],
    clerk: [
      { icon: Home, label: 'Dashboard' },
      { icon: FileText, label: 'Registration' },
      { icon: Users, label: 'Appointments' },
    ],
  }

  const dashboardMetrics = {
    admin: [
      { label: 'Users', value: 120 },
      { label: 'Revenue', value: '฿1.2M' },
      { label: 'Active Sessions', value: 32 },
    ],
    doctor: [
      { label: 'Patients Today', value: 18 },
      { label: 'Appointments', value: 6 },
      { label: 'Pending Labs', value: 2 },
    ],
    nurse: [
      { label: 'Patients Assigned', value: 12 },
      { label: 'Tasks', value: 8 },
    ],
    clerk: [
      { label: 'Registrations', value: 24 },
      { label: 'Appointments', value: 10 },
    ],
  }

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        {(['admin', 'doctor', 'nurse', 'clerk'] as const).map((r) => (
          <Button
            key={r}
            variant={role === r ? "default" : "outline"}
            size="sm"
            onClick={() => setRole(r)}
            className="capitalize"
          >
            {r}
          </Button>
        ))}
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <motion.div
          key={role}
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-full md:w-1/3"
        >
          <Card>
            <CardContent className="p-4">
              <div className="font-semibold mb-2">Sidebar ({role})</div>
              <nav className="space-y-2">
                {sidebarMenus[role].map((item, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </motion.div>
        {/* Dashboard Metrics */}
        <motion.div
          key={role + '-metrics'}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {dashboardMetrics[role].map((metric, idx) => (
            <Card key={idx} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-1">{metric.label}</div>
                <div className="text-2xl font-bold">{metric.value}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// Form Validation Demo
export function FormValidationDemo() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
  })

  const [submitting, setSubmitting] = React.useState(false)

  const onSubmit = (data: FormData) => {
    setSubmitting(true)
    setTimeout(() => {
      form.reset()
      setSubmitting(false)
      toast('ส่งข้อมูลสำเร็จ!')
    }, 2000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อ <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="กรอกชื่อ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>อีเมล <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="example@email.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>รหัสผ่าน <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="อย่างน้อย 6 ตัวอักษร" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              กำลังส่ง...
            </>
          ) : (
            'ส่งข้อมูล'
          )}
        </Button>
      </form>
    </Form>
  )
}

// Accessibility Demo
export function AccessibilityDemo() {
  const [modalOpen, setModalOpen] = React.useState(false)

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button>เปิด Modal (Enter/Space)</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modal ตัวอย่าง</DialogTitle>
              <DialogDescription>
                Modal นี้สามารถปิดด้วยปุ่ม Esc หรือคลิกปุ่มปิด
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setModalOpen(false)}>ปิด Modal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button variant="outline" size="icon" aria-label="Icon button">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex space-x-2">
        <Input placeholder="Tab เพื่อเปลี่ยน focus" />
        <Button variant="secondary">ปุ่มถัดไป</Button>
      </div>
    </div>
  )
}

// Data Fetching Demo
export function DataFetchingDemo() {
  const [state, setState] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [data, setData] = React.useState<string[]>([])

  const fetchData = () => {
    setState('loading')
    setTimeout(() => {
      if (Math.random() < 0.2) {
        setState('error')
        setData([])
      } else {
        setData(['ผู้ป่วย A', 'ผู้ป่วย B', 'ผู้ป่วย C'])
        setState('success')
      }
    }, 1500)
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  return (
    <Card className="min-h-[120px]">
      <CardContent className="p-6">
        {state === 'loading' && (
          <div className="flex items-center space-x-2 text-blue-500">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>กำลังโหลดข้อมูล...</span>
          </div>
        )}
        {state === 'error' && (
          <div className="flex flex-col items-center text-destructive">
            <XCircle className="h-6 w-6 mb-2" />
            <div className="text-sm mb-2">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>
            <Button size="sm" variant="outline" onClick={fetchData}>
              ลองใหม่
            </Button>
          </div>
        )}
        {state === 'success' && (
          <div className="space-y-2">
            {data.map((item, idx) => (
              <Card key={idx} className="p-2 cursor-pointer hover:bg-accent">
                <span className="text-sm">{item}</span>
              </Card>
            ))}
          </div>
        )}
        {state === 'idle' && (
          <Button onClick={fetchData}>โหลดข้อมูล</Button>
        )}
      </CardContent>
    </Card>
  )
}