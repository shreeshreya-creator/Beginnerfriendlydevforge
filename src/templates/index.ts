import type { PortfolioData, TemplateId } from '../types'
import { ProfessionalTemplate } from './professional/ProfessionalTemplate'
import { MonolithTemplate } from './monolith/MonolithTemplate'
import { TerminalTemplate } from './terminal/TerminalTemplate'
import { CreativeTemplate } from './creative/CreativeTemplate'

export interface TemplateProps {
  data: PortfolioData
}

export interface TemplateConfig {
  id: TemplateId
  name: string
  tag: string
  description: string
  preview: string
  colors: {
    background: string
    foreground: string
    accent: string
  }
}

export const templates: TemplateConfig[] = [
  {
    id: 'professional',
    name: 'Professional / Enterprise',
    tag: 'Executive',
    description: 'High-signal technical architecture with performance metrics, leadership milestones, and endorsements.',
    preview: '/templates/professional.png',
    colors: {
      background: '#090b10',
      foreground: '#FFFFFF',
      accent: '#00d2ff',
    },
  },
  {
    id: 'monolith',
    name: 'Minimalist Monolith',
    tag: 'Swiss Editorial',
    description: 'Clean typographic hierarchy, whitespace discipline, and distraction-free case study showcase.',
    preview: '/templates/monolith.png',
    colors: {
      background: '#030303',
      foreground: '#FFFFFF',
      accent: '#FFFFFF',
    },
  },
  {
    id: 'terminal',
    name: 'Terminal / Hacker',
    tag: 'CLI & Systems',
    description: 'Authentic command-line interface with interactive bash commands and diagnostics.',
    preview: '/templates/terminal.png',
    colors: {
      background: '#000000',
      foreground: '#00FF00',
      accent: '#FFBF00',
    },
  },
  {
    id: 'creative',
    name: 'Creative Studio',
    tag: 'Agency / Visual',
    description: 'Vibrant modern aesthetic with bento box galleries, dynamic gradients, and fluid showcases.',
    preview: '/templates/creative.png',
    colors: {
      background: '#07070a',
      foreground: '#FFFFFF',
      accent: '#ec4899',
    },
  },
]

export const templateComponents: Record<TemplateId, React.ComponentType<{ data: PortfolioData }>> = {
  professional: ProfessionalTemplate,
  monolith: MonolithTemplate,
  terminal: TerminalTemplate,
  creative: CreativeTemplate,
  dark: MonolithTemplate,
  light: ProfessionalTemplate,
  sun: CreativeTemplate,
  'c-mode': TerminalTemplate,
}

export function getTemplate(id: string): TemplateConfig | undefined {
  return templates.find((t) => t.id === id)
}
