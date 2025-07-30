// components/ShowcaseNavigation.tsx
'use client'

import { motion } from 'motion/react'
import { Button } from "@/components/ui/button"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

interface ShowcaseSection {
  id: string
  title: string
  icon: React.ReactNode
  color: string
}

interface ShowcaseNavigationProps {
  sections: ShowcaseSection[]
}

export function ShowcaseNavigation({ sections }: ShowcaseNavigationProps) {
  return (
    <motion.nav variants={itemVariants} className="mb-12">
      <div className="flex flex-wrap justify-center gap-4">
        {sections.map((section) => (
          <Button
            key={section.id}
            asChild
            className={`bg-gradient-to-r ${section.color} text-white hover:shadow-lg transition-all`}
          >
            <a href={`#${section.id}`} className="flex items-center space-x-2">
              {section.icon}
              <span className="font-medium">{section.title}</span>
            </a>
          </Button>
        ))}
      </div>
    </motion.nav>
  )
}