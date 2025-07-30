// app/showcase2/page.tsx
'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  Home, 
  Calendar, 
  Users, 
  FileText, 
  Activity,
  ChevronDown,
  ChevronRight,
  Star,
  Heart,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Plus,
  Check,
  X,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  EyeOff,
  Menu,
  Filter,
  Download,
  Upload
} from 'lucide-react'
import { useTheme } from "next-themes"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from "sonner"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

// Mock data
const patients = [
  { id: '001', name: 'นายสมชาย ใจดี', age: 45, department: 'Internal Medicine', status: 'active' },
  { id: '002', name: 'นางสาวมาลี สวยงาม', age: 28, department: 'Pediatrics', status: 'waiting' },
  { id: '003', name: 'นายวิชัย มั่นคง', age: 62, department: 'Cardiology', status: 'completed' }
]

const appointments = [
  { time: '09:00', patient: 'นายสมชาย ใจดี', doctor: 'นพ.วิทยา', type: 'ตรวจทั่วไป' },
  { time: '10:30', patient: 'นางสาวมาลี สวยงาม', doctor: 'นพ.สุดา', type: 'ตรวจครรภ์' },
  { time: '14:00', patient: 'นายวิชัย มั่นคง', doctor: 'นพ.ประยุทธ', type: 'ตรวจหัวใจ' }
]

const formSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อ').max(32, 'ชื่อยาวเกินไป'),
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
});

type FormData = z.infer<typeof formSchema>;

function StatefulUIPatternDemo() {
  const [state, setState] = React.useState<'empty' | 'loading' | 'error' | 'success'>('empty');

  React.useEffect(() => {
    if (state === 'success') {
      toast('โหลดยูสำเร็จ!');
    }
  }, [state]);

  // Animation variants
  const cardVariants = {
    empty: { opacity: 1, scale: 1, rotate: 0 },
    loading: { opacity: 1, scale: 1.04, rotate: 2 },
    error: {
      opacity: 1,
      scale: 1,
      x: [0, -8, 8, -8, 8, 0],
      transition: { type: 'tween' as const, duration: 0.5 }
    },
    success: { opacity: 1, scale: 1.08, rotate: -2 },
  };

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        {(['empty', 'loading', 'error', 'success'] as const).map((s) => (
          <motion.button
            key={s}
            onClick={() => setState(s)}
            whileHover={{ scale: 1.08, boxShadow: '0 2px 8px #3b82f6' }}
            whileTap={{ scale: 0.96 }}
            className={`px-3 py-1 rounded-lg border text-sm font-medium capitalize transition-colors ${state===s ? 'bg-blue-500 text-white border-blue-500' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700'}`}
          >
            {s}
          </motion.button>
        ))}
      </div>
      <motion.div
        key={state}
        variants={cardVariants}
        animate={state}
        initial="empty"
        transition={{ type: 'spring', duration: 0.5 }}
        className="border rounded-lg p-6 min-h-[120px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 transition-colors"
      >
        {state === 'empty' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-gray-400 dark:text-gray-500">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M4 7V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1m-16 0v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7m-16 0h16m-8 4h.01m-.01 4h.01m-.01-2h.01"/></svg>
            <div className="mt-2 text-sm">ไม่มีข้อมูลในระบบ</div>
          </motion.div>
        )}
        {state === 'loading' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-blue-400">
            <motion.svg className="animate-spin" width="32" height="32" fill="none" viewBox="0 0 24 24" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.2"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4"/></motion.svg>
            <div className="mt-2 text-sm">กำลังโหลดข้อมูล...</div>
          </motion.div>
        )}
        {state === 'error' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-red-400">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2"/></svg>
            <div className="mt-2 text-sm">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>
            <motion.button
              onClick={() => setState('loading')}
              whileHover={{ scale: 1.08, backgroundColor: '#fecaca' }}
              whileTap={{ scale: 0.96 }}
              className="mt-2 px-3 py-1 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 text-xs font-medium"
            >ลองใหม่</motion.button>
          </motion.div>
        )}
        {state === 'success' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-green-500">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2"/></svg>
            <div className="mt-2 text-sm">โหลดข้อมูลสำเร็จ!</div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function RoleBasedUIDemo() {
  const [role, setRole] = React.useState<'admin' | 'doctor' | 'nurse' | 'clerk'>('admin');

  const sidebarMenus = {
    admin: [
      { icon: '🏥', label: 'Dashboard' },
      { icon: '👥', label: 'User Management' },
      { icon: '📊', label: 'Reports' },
      { icon: '⚙️', label: 'Settings' },
    ],
    doctor: [
      { icon: '🏥', label: 'Dashboard' },
      { icon: '📝', label: 'Patient Records' },
      { icon: '📅', label: 'Appointments' },
      { icon: '💊', label: 'Prescriptions' },
    ],
    nurse: [
      { icon: '🏥', label: 'Dashboard' },
      { icon: '📝', label: 'Patient Care' },
      { icon: '📅', label: 'Schedules' },
    ],
    clerk: [
      { icon: '🏥', label: 'Dashboard' },
      { icon: '📝', label: 'Registration' },
      { icon: '📅', label: 'Appointments' },
    ],
  };

  const dashboardMetrics = {
    admin: [
      { label: 'Users', value: 120, color: 'bg-blue-500' },
      { label: 'Revenue', value: '฿1.2M', color: 'bg-green-500' },
      { label: 'Active Sessions', value: 32, color: 'bg-purple-500' },
    ],
    doctor: [
      { label: 'Patients Today', value: 18, color: 'bg-blue-500' },
      { label: 'Appointments', value: 6, color: 'bg-green-500' },
      { label: 'Pending Labs', value: 2, color: 'bg-yellow-500' },
    ],
    nurse: [
      { label: 'Patients Assigned', value: 12, color: 'bg-blue-500' },
      { label: 'Tasks', value: 8, color: 'bg-green-500' },
    ],
    clerk: [
      { label: 'Registrations', value: 24, color: 'bg-blue-500' },
      { label: 'Appointments', value: 10, color: 'bg-green-500' },
    ],
  };

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        {(['admin', 'doctor', 'nurse', 'clerk'] as const).map((r) => (
          <motion.button
            key={r}
            onClick={() => setRole(r)}
            whileHover={{ scale: 1.08, boxShadow: '0 2px 8px #3b82f6' }}
            whileTap={{ scale: 0.96 }}
            className={`px-3 py-1 rounded-lg border text-sm font-medium capitalize ${role===r ? 'bg-blue-500 text-white border-blue-500' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700'}`}
          >
            {r}
          </motion.button>
        ))}
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <motion.div
          key={role}
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-full md:w-1/3 bg-gray-100 dark:bg-gray-800 rounded-lg p-4"
        >
          <div className="font-semibold mb-2">Sidebar ({role})</div>
          <motion.ul
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="space-y-2"
          >
            {sidebarMenus[role].map((item, idx) => (
              <motion.li
                key={idx}
                whileHover={{ scale: 1.08, backgroundColor: '#e0e7ff' }}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 rounded px-2 py-1 cursor-pointer"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </motion.li>
            ))}
          </motion.ul>
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
            <motion.div
              key={idx}
              whileHover={{ scale: 1.08, boxShadow: '0 2px 12px #3b82f6' }}
              className={`rounded-lg p-4 text-white shadow ${metric.color} cursor-pointer`}
            >
              <div className="text-xs mb-1 opacity-80">{metric.label}</div>
              <div className="text-2xl font-bold">{metric.value}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function FormValidationDemo() {
  const { register, handleSubmit, formState: { errors, isSubmitSuccessful }, reset, trigger } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
  });

  const [submitting, setSubmitting] = React.useState(false);

  const onSubmit = (data: FormData) => {
    setSubmitting(true);
    setTimeout(() => {
      reset();
      setSubmitting(false);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">ชื่อ <span className="text-red-500">*</span></label>
        <motion.input
          {...register('name')}
          onBlur={() => trigger('name')}
          animate={errors.name ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }}
          transition={errors.name ? { type: 'tween' as const, duration: 0.4 } : { type: 'spring', duration: 0.4 }}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
          placeholder="กรอกชื่อ"
        />
        {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name.message}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">อีเมล <span className="text-red-500">*</span></label>
        <motion.input
          {...register('email')}
          onBlur={() => trigger('email')}
          animate={errors.email ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }}
          transition={errors.email ? { type: 'tween' as const, duration: 0.4 } : { type: 'spring', duration: 0.4 }}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
          placeholder="example@email.com"
        />
        {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email.message}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">รหัสผ่าน <span className="text-red-500">*</span></label>
        <motion.input
          type="password"
          {...register('password')}
          onBlur={() => trigger('password')}
          animate={errors.password ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }}
          transition={errors.password ? { type: 'tween' as const, duration: 0.4 } : { type: 'spring', duration: 0.4 }}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
          placeholder="อย่างน้อย 6 ตัวอักษร"
        />
        {errors.password && <div className="text-xs text-red-500 mt-1">{errors.password.message}</div>}
      </div>
      <motion.button
        type="submit"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        disabled={submitting}
        className="w-full py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-60"
      >
        {submitting ? 'กำลังส่ง...' : 'ส่งข้อมูล'}
      </motion.button>
      <AnimatePresence>
        {isSubmitSuccessful && !submitting && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-green-600 dark:text-green-400 text-sm text-center"
          >ส่งข้อมูลสำเร็จ!</motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

function AccessibilityDemo() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const closeBtnRef = React.useRef<HTMLButtonElement>(null);

  // Trap focus in modal
  React.useEffect(() => {
    if (modalOpen && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length) focusable[0].focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setModalOpen(false);
        if (e.key === 'Tab' && modalRef.current) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
            e.preventDefault();
            (e.shiftKey ? last : first).focus();
          }
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [modalOpen]);

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <motion.button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Open modal"
          whileHover={{ scale: 1.08, boxShadow: '0 2px 8px #3b82f6' }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setModalOpen(true)}
        >
          เปิด Modal (Enter/Space)
        </motion.button>
        <motion.button
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Icon button"
          whileHover={{ scale: 1.13, rotate: 10 }}
          whileTap={{ scale: 0.96 }}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/></svg>
        </motion.button>
      </div>
      <div className="flex space-x-2">
        <motion.input
          className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          placeholder="Tab เพื่อเปลี่ยน focus"
          whileFocus={{ scale: 1.04, boxShadow: '0 2px 8px #3b82f6' }}
        />
        <motion.button
          className="px-4 py-2 bg-green-500 text-white rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
        >
          ปุ่มถัดไป
        </motion.button>
      </div>
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-sm w-full shadow-lg outline-none"
              tabIndex={-1}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Modal ตัวอย่าง</h3>
                <motion.button
                  ref={closeBtnRef}
                  onClick={() => setModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="Close modal"
                  whileHover={{ scale: 1.13, rotate: 10 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2"/></svg>
                </motion.button>
              </div>
              <div className="mb-4 text-gray-700 dark:text-gray-200">Modal นี้สามารถปิดด้วยปุ่ม Esc หรือคลิกปุ่มปิด</div>
              <motion.button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Close modal"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
              >
                ปิด Modal
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DataFetchingDemo() {
  const [state, setState] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [data, setData] = React.useState<string[]>([]);

  const fetchData = () => {
    setState('loading');
    setTimeout(() => {
      // mock: 20% error
      if (Math.random() < 0.2) {
        setState('error');
        setData([]);
      } else {
        setData(['ผู้ป่วย A', 'ผู้ป่วย B', 'ผู้ป่วย C']);
        setState('success');
      }
    }, 1500);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <motion.div
      className="border rounded-lg p-6 min-h-[120px] bg-gray-50 dark:bg-gray-800 transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {state === 'loading' && (
        <motion.div
          className="flex items-center space-x-2 text-blue-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.svg
            className="animate-spin"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.2"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4"/>
          </motion.svg>
          <span>กำลังโหลดข้อมูล...</span>
        </motion.div>
      )}
      {state === 'error' && (
        <motion.div
          className="flex flex-col items-center text-red-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: [0, -8, 8, -8, 8, 0] }}
          transition={{ type: 'tween' as const, duration: 0.5 }}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2"/></svg>
          <div className="mt-2 text-sm">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>
          <motion.button
            onClick={fetchData}
            whileHover={{ scale: 1.08, backgroundColor: '#fecaca' }}
            whileTap={{ scale: 0.96 }}
            className="mt-2 px-3 py-1 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 text-xs font-medium"
          >ลองใหม่</motion.button>
        </motion.div>
      )}
      {state === 'success' && (
        <motion.ul
          className="space-y-2"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {data.map((item, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-2 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
              whileHover={{ scale: 1.04, backgroundColor: '#e0e7ff' }}
            >{item}</motion.li>
          ))}
        </motion.ul>
      )}
      {state === 'idle' && (
        <motion.button
          onClick={fetchData}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >โหลดข้อมูล</motion.button>
      )}
    </motion.div>
  );
}

export default function ShowcasePage() {
  // States for interactive components
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [accordionOpen, setAccordionOpen] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [selectValue, setSelectValue] = useState('')
  const [checkboxes, setCheckboxes] = useState({ option1: false, option2: true })
  const [radio, setRadio] = useState('option1')
  const [switchOn, setSwitchOn] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showPopover, setShowPopover] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [progress, setProgress] = useState(65)
  const [showToast, setShowToast] = useState(false)
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  // --- เพิ่ม state สำหรับ toast copy class name ---
  const [copyToast, setCopyToast] = useState<{ show: boolean; text: string }>({ show: false, text: '' });

  // --- ฟังก์ชัน copy class name ---
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyToast({ show: true, text });
    setTimeout(() => setCopyToast({ show: false, text: '' }), 1800);
  };

  // Component showcase sections
  const showcaseSections = [
    {
      id: 'layout',
      title: '1. Layout & Navigation',
      icon: <Menu className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'forms',
      title: '2. Input & Form',
      icon: <Edit className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'display',
      title: '3. Display',
      icon: <Eye className="w-5 h-5" />,
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'actions',
      title: '4. Action & Feedback',
      icon: <Activity className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'visualization',
      title: '5. Visualization',
      icon: <Calendar className="w-5 h-5" />,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'auth',
      title: '6. Authentication',
      icon: <User className="w-5 h-5" />,
      color: 'from-indigo-500 to-blue-500'
    }
  ]

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }, 2000)
  }

  if (!mounted) {
    return <div suppressHydrationWarning />;
  }

  return (
    <div suppressHydrationWarning className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white shadow-sm border-b sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">HIS Showcase</h1>
              </motion.div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <Bell className="w-5 h-5" />
              </motion.button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center cursor-pointer"
              >
                <User className="w-4 h-4 text-white" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Theme Switcher Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto mt-8 mb-12 p-6 rounded-xl shadow-lg bg-white dark:bg-gray-900 transition-colors"
      >
        {!mounted ? (
          <div className="h-32 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg" />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                Theme Switcher
                <span className="ml-2 text-base font-normal text-gray-500 dark:text-gray-400">(Light / Dark Mode)</span>
              </h2>
              <div className="flex items-center space-x-2">
                {['light', 'dark', 'system'].map((t) => (
                  <motion.button
                    key={t}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTheme(t)}
                    className={`px-3 py-1 rounded-lg font-medium border transition-colors ${theme === t ? 'bg-blue-500 text-white border-blue-500' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700'}`}
                    aria-label={`Switch to ${t} mode`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <motion.div
                whileHover={{ scale: 1.04, boxShadow: '0 4px 24px 0 rgba(59,130,246,0.12)' }}
                className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow cursor-pointer"
              >
                <div className="font-semibold mb-2">Card Example</div>
                <div className="text-sm">This card changes color based on the theme.</div>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.08, rotate: 2 }}
                whileTap={{ scale: 0.96 }}
                className="p-4 rounded-lg bg-blue-500 text-white dark:bg-blue-400 dark:text-gray-900 font-semibold shadow transition-colors"
              >
                Button Example
              </motion.button>
              <motion.div
                whileHover={{ scale: 1.04, boxShadow: '0 4px 24px 0 rgba(59,130,246,0.10)' }}
                className="p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 shadow cursor-pointer"
              >
                <span className="font-mono">Text Example</span>
                <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">(Try switching theme!)</div>
              </motion.div>
            </div>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Components above will adapt their color scheme according to the selected theme.<br />
              <span className="italic">(ใช้ next-themes + Tailwind dark mode class)</span>
            </div>
          </>
        )}
      </motion.section>

      {/* Typography Showcase Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto mb-12 p-6 rounded-xl shadow-lg bg-white dark:bg-gray-900 transition-colors"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Typography Showcase</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">แสดงตัวอย่างระดับ heading, body, caption, code, quote เพื่อ set พื้นฐาน brand tone และ readability</p>
        <motion.div
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div>
            <motion.h1 whileHover={{ scale: 1.06, color: '#3b82f6' }} className="mb-2 text-gray-900 dark:text-white font-bold text-6xl">Heading 1 (h1)</motion.h1>
            <motion.h2 whileHover={{ scale: 1.06, color: '#3b82f6' }} className="mb-2 text-gray-900 dark:text-white font-bold text-5xl">Heading 2 (h2)</motion.h2>
            <motion.h3 whileHover={{ scale: 1.06, color: '#3b82f6' }} className="mb-2 text-gray-900 dark:text-white font-bold text-4xl">Heading 3 (h3)</motion.h3>
            <motion.h4 whileHover={{ scale: 1.06, color: '#3b82f6' }} className="mb-2 text-gray-900 dark:text-white font-bold text-3xl">Heading 4 (h4)</motion.h4>
            <motion.h5 whileHover={{ scale: 1.06, color: '#3b82f6' }} className="mb-2 text-gray-900 dark:text-white font-bold text-2xl">Heading 5 (h5)</motion.h5>
            <motion.h6 whileHover={{ scale: 1.06, color: '#3b82f6' }} className="mb-2 text-gray-900 dark:text-white font-bold text-xl">Heading 6 (h6)</motion.h6>
          </motion.div>
          <motion.div>
            <motion.p whileHover={{ scale: 1.03, color: '#0ea5e9' }} className="text-base text-gray-800 dark:text-gray-200 mb-1">Body text: ข้อความปกติสำหรับเนื้อหาในระบบ</motion.p>
            <motion.p whileHover={{ scale: 1.03, color: '#64748b' }} className="text-sm text-gray-500 dark:text-gray-400 mb-1">Muted text: ใช้สำหรับข้อความรองหรืออธิบายเพิ่มเติม</motion.p>
            <motion.p whileHover={{ scale: 1.03, color: '#a3a3a3' }} className="text-xs text-gray-400 dark:text-gray-500 mb-1">Caption: ใช้สำหรับคำอธิบายสั้น ๆ หรือ label</motion.p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.06, boxShadow: '0 2px 12px 0 #3b82f6' }} className="inline-block">
            <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm text-blue-600 dark:text-blue-400">code block: const x = 42;</span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04, backgroundColor: '#e0e7ff' }}>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-950/30 py-2 rounded">
              "Design is not just what it looks like and feels like. Design is how it works."<br />
              <span className="block text-xs text-gray-400 mt-1">— Steve Jobs</span>
            </blockquote>
          </motion.div>
        </motion.div>
        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          <ul className="list-disc ml-6 space-y-1">
            <li>ใช้ Tailwind class เช่น <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">text-base</code>, <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">text-muted-foreground</code>, <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">font-mono</code>, <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">italic</code></li>
            <li>ควรใช้ heading ตามลำดับความสำคัญของเนื้อหา</li>
            <li>body, caption, muted text ช่วยสร้าง hierarchy และ readability</li>
          </ul>
        </div>
      </motion.section>

      {/* Spacing & Grid System Guide Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto mb-12 p-6 rounded-xl shadow-lg bg-white dark:bg-gray-900 transition-colors"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Spacing & Grid System Guide</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">เทียบ gap-x, gap-y, p, m ที่ใช้ใน Layout และ baseline spacing ที่ควรใช้ เพื่อความสม่ำเสมอ</p>
        <div className="space-y-8">
          {/* Baseline Spacing */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Baseline Spacing</h3>
            <div className="flex flex-wrap gap-4 items-end">
              {[2, 4, 6, 8, 12].map((n) => (
                <motion.div
                  key={n}
                  whileHover={{ scale: 1.08, backgroundColor: '#bae6fd' }}
                  className={`bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded flex flex-col items-center justify-end cursor-pointer`}
                >
                  <div className={`w-12`} style={{ height: `${n * 4}px` }} />
                  <span className="text-xs mt-1">p-{n} ({n*4}px)</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">ควรใช้ p-4, p-6, p-8 เป็น baseline spacing สำหรับกล่อง/section</div>
          </div>
          {/* Grid & Gap Example */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Grid & Gap Example</h3>
            <motion.div className="grid grid-cols-3 gap-4 mb-2">
              {[1,2,3].map((i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.08, backgroundColor: '#bbf7d0' }}
                  className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded p-4 text-center cursor-pointer"
                >Box {i}</motion.div>
              ))}
            </motion.div>
            <motion.div className="grid grid-cols-3 gap-8 mb-2">
              {[1,2,3].map((i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.08, backgroundColor: '#bbf7d0' }}
                  className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded p-4 text-center cursor-pointer"
                >Box {i}</motion.div>
              ))}
            </motion.div>
            <div className="flex space-x-4 mb-2">
              {[1,2].map((i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.08, backgroundColor: '#f3e8ff' }}
                  className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded p-4 cursor-pointer"
                >gap-x-4</motion.div>
              ))}
            </div>
            <div className="flex flex-col space-y-4">
              {[1,2].map((i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.08, backgroundColor: '#fef9c3' }}
                  className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded p-4 cursor-pointer"
                >gap-y-4</motion.div>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">ใช้ <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">gap-4</code>, <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">gap-8</code> เพื่อความสม่ำเสมอใน layout</div>
          </div>
          {/* Margin Example */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Margin Example</h3>
            <div className="flex items-end space-x-6">
              {[2, 4, 8].map((n) => (
                <motion.div
                  key={n}
                  whileHover={{ y: -8, backgroundColor: '#fbcfe8' }}
                  className={`bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 rounded p-4 mb-${n} cursor-pointer`}
                >mb-{n}</motion.div>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">margin (m, mb, mt, mx, my) ใช้สำหรับเว้นระยะระหว่างกล่อง/section</div>
          </div>
        </div>
        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          <ul className="list-disc ml-6 space-y-1">
            <li>ใช้ spacing ที่เป็นเลขคู่ (2, 4, 6, 8, 12) เพื่อความสม่ำเสมอ</li>
            <li>gap, p, m ของ Tailwind = 4px ต่อ 1 หน่วย</li>
            <li>ควรใช้ gap-4, p-6, mb-8 เป็น baseline ใน layout</li>
          </ul>
        </div>
      </motion.section>

      {/* Color Palette Preview Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto mb-12 p-6 rounded-xl shadow-lg bg-white dark:bg-gray-900 transition-colors"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Color Palette Preview</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">สีหลัก (primary, accent, muted, foreground) และสีสถานะ (success, error, warning, info) สำหรับการเลือกใช้ class ให้ถูกต้องตาม brand</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {/* Main Colors */}
          {[
            { color: 'bg-blue-500', border: 'border-blue-200', label: 'Primary' },
            { color: 'bg-purple-500', border: 'border-purple-200', label: 'Accent' },
            { color: 'bg-gray-200 dark:bg-gray-700', border: 'border-gray-300 dark:border-gray-600', label: 'Muted' },
            { color: 'bg-white dark:bg-gray-900', border: 'border-gray-200 dark:border-gray-700', label: 'Foreground' },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              whileHover={{ scale: 1.13, boxShadow: '0 0 0 4px #3b82f6' }}
              onClick={() => handleCopy(c.color)}
              className={`flex flex-col items-center cursor-pointer group`}
              title="Click to copy class name"
            >
              <div className={`w-12 h-12 rounded-full ${c.color} mb-2 border-4 ${c.border} group-hover:ring-2 group-hover:ring-blue-400 transition-all`} />
              <span className="text-xs text-gray-700 dark:text-gray-200">{c.label}</span>
              <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded mt-1">{c.color}</code>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {/* Status Colors */}
          {[
            { color: 'bg-green-500', border: 'border-green-200', label: 'Success' },
            { color: 'bg-red-500', border: 'border-red-200', label: 'Error' },
            { color: 'bg-yellow-400', border: 'border-yellow-200', label: 'Warning' },
            { color: 'bg-blue-400', border: 'border-blue-200', label: 'Info' },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              whileHover={{ scale: 1.13, boxShadow: '0 0 0 4px #3b82f6' }}
              onClick={() => handleCopy(c.color)}
              className={`flex flex-col items-center cursor-pointer group`}
              title="Click to copy class name"
            >
              <div className={`w-12 h-12 rounded-full ${c.color} mb-2 border-4 ${c.border} group-hover:ring-2 group-hover:ring-blue-400 transition-all`} />
              <span className="text-xs text-gray-700 dark:text-gray-200">{c.label}</span>
              <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded mt-1">{c.color}</code>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {/* Text Colors */}
          {[
            { color: 'text-blue-500', label: 'text-blue-500' },
            { color: 'text-green-500', label: 'text-green-500' },
            { color: 'text-red-500', label: 'text-red-500' },
            { color: 'text-gray-500', label: 'text-gray-500' },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              whileHover={{ scale: 1.13, backgroundColor: '#f1f5f9' }}
              onClick={() => handleCopy(c.color)}
              className="flex flex-col items-center cursor-pointer group"
              title="Click to copy class name"
            >
              <span className={`${c.color} font-semibold`}>{c.label}</span>
              <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded mt-1">{c.color}</code>
            </motion.div>
          ))}
        </div>
        <AnimatePresence>
          {copyToast.show && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-fade-in"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2"/></svg>
              <span>Copied: <span className="font-mono">{copyToast.text}</span></span>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          <ul className="list-disc ml-6 space-y-1">
            <li>ใช้ class <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">bg-*</code>, <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">text-*</code>, <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">border-*</code> ให้ตรงกับ brand</li>
            <li>สีหลัก: blue, purple, gray, white</li>
            <li>สีสถานะ: green (success), red (error), yellow (warning), blue (info)</li>
            <li>ควรใช้สีอย่างสม่ำเสมอในทั้งระบบ</li>
          </ul>
        </div>
      </motion.section>

      {/* Stateful UI Pattern Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto mb-12 p-6 rounded-xl shadow-lg bg-white dark:bg-gray-900 transition-colors"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Stateful UI Pattern</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">ตัวอย่าง UX pattern สำหรับ Empty, Loading, Error, Success State (เช่น table ที่ไม่มีข้อมูล, skeleton, error, toast)</p>
        <StatefulUIPatternDemo />
        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          <ul className="list-disc ml-6 space-y-1">
            <li>ควรออกแบบ state เหล่านี้ให้ครบในทุก data-driven UI</li>
            <li>Empty: แสดงข้อความ/ไอคอนเมื่อไม่มีข้อมูล</li>
            <li>Loading: ใช้ Skeleton หรือ Spinner</li>
            <li>Error: แจ้งปัญหาและวิธี retry</li>
            <li>Success: แจ้งผลลัพธ์สำเร็จ (toast, banner)</li>
          </ul>
        </div>
      </motion.section>

      {/* Role-based UI Showcase Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto mb-12 p-6 rounded-xl shadow-lg bg-white dark:bg-gray-900 transition-colors"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Role-based UI Showcase</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">ตัวอย่างการเปลี่ยน UI ตาม role เช่น Admin, Doctor, Nurse, Clerk (sidebar, dashboard metric)</p>
        <RoleBasedUIDemo />
        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          <ul className="list-disc ml-6 space-y-1">
            <li>UI ควรเปลี่ยนตาม role ที่ได้รับจากระบบ auth</li>
            <li>ตัวอย่าง: sidebar, dashboard, metric, ปุ่ม action</li>
            <li>ควรแยก logic role-check ใน component หรือ hook</li>
          </ul>
        </div>
      </motion.section>

      {/* Form Validation Pattern Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto mb-12 p-6 rounded-xl shadow-lg bg-white dark:bg-gray-900 transition-colors"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Form Validation Pattern</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">ตัวอย่างฟอร์มที่ validate ด้วย react-hook-form + zod (required, pattern, error message)</p>
        <FormValidationDemo />
        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          <ul className="list-disc ml-6 space-y-1">
            <li>ควรใช้ schema validation (zod, yup) ร่วมกับ react-hook-form</li>
            <li>แสดง error message ใต้ field</li>
            <li>required, pattern mismatch, success state</li>
          </ul>
        </div>
      </motion.section>

      {/* Keyboard / Accessibility Interaction Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto mb-12 p-6 rounded-xl shadow-lg bg-white dark:bg-gray-900 transition-colors"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Keyboard / Accessibility Interaction</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">ตัวอย่างการรองรับ accessibility: Tab/Enter เปลี่ยน focus, Modal ปิดด้วย Esc, ปุ่มมี aria-label</p>
        <AccessibilityDemo />
        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          <ul className="list-disc ml-6 space-y-1">
            <li>ควรใส่ aria-label ให้ปุ่มที่ไม่มีข้อความ</li>
            <li>Modal ควรปิดด้วย Esc และโฟกัสควรอยู่ใน modal</li>
            <li>Tab/Enter ควรเปลี่ยน focus ได้ถูกต้อง</li>
            <li>ควรมี focus ring ที่ชัดเจน</li>
          </ul>
        </div>
      </motion.section>

      {/* Data Fetching Pattern Showcase Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto mb-12 p-6 rounded-xl shadow-lg bg-white dark:bg-gray-900 transition-colors"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Data Fetching Pattern Showcase</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">ตัวอย่าง component ที่ fetch ข้อมูลจาก API (mock) พร้อม state: loading, success, error</p>
        <DataFetchingDemo />
        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          <ul className="list-disc ml-6 space-y-1">
            <li>ควรแยก state: loading, error, success</li>
            <li>แสดง skeleton/spinner ระหว่างโหลด</li>
            <li>error สามารถ retry ได้</li>
            <li>success แสดงข้อมูลที่ได้</li>
          </ul>
        </div>
      </motion.section>

      {/* Main Content */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
      </motion.main>
      
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:shadow-xl"
      >
        <ChevronRight className="w-6 h-6 -rotate-90" />
      </motion.button>
      
      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-400/10 to-cyan-400/10 rounded-full"
        />
      </div>
    </div>
  )
}