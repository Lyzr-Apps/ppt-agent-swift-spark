'use client'

import { useState, useEffect, useCallback } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { RiLoader4Line, RiCloseLine, RiRefreshLine, RiCheckLine, RiSendPlaneLine, RiArrowDownSLine, RiArrowUpSLine, RiErrorWarningLine, RiAddLine, RiSubtractLine, RiSearchLine, RiDownloadLine, RiFileTextLine, RiExternalLinkLine, RiArrowRightLine, RiMenuLine, RiInformationLine } from 'react-icons/ri'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const AGENT_ID = '6989f47ed23e37d4cef3e2cd'

interface Slide {
  slide_number: string
  slide_title: string
  subtitle?: string
  bullet_points: string[]
  speaker_notes: string
  presentation_type?: string
  client_name?: string
  industry_vertical?: string
  key_pain_points?: string[]
  products_to_highlight?: string[]
  tone?: string
}

interface Presentation {
  id: string
  clientName: string
  industry: string
  contactName: string
  presentationType: string
  slideCount: number
  tone: string
  painPoints: string
  products: string[]
  slides: Slide[]
  createdAt: string
  pptxUrl?: string
  agentMessage?: string
}

interface FormData {
  clientName: string
  industry: string
  contactName: string
  presentationType: string
  slideCount: number
  painPoints: string
  productsInput: string
  tone: string
}

const SAMPLE_PRESENTATIONS: Presentation[] = [
  {
    id: 'sample-1',
    clientName: 'Acme Corp',
    industry: 'Technology',
    contactName: 'Sarah Chen',
    presentationType: 'Intro Pitch',
    slideCount: 8,
    tone: 'Professional',
    painPoints: 'Legacy systems causing downtime, High operational costs',
    products: ['CloudSync Platform', 'AI Analytics Suite'],
    slides: [
      { slide_number: 'Slide 1 of 8', slide_title: 'Acme Corp: Powering Innovation', subtitle: 'Transforming Legacy Challenges into Digital Opportunities', bullet_points: [], speaker_notes: 'Opening remarks for the Acme Corp team.', presentation_type: 'intro pitch', client_name: 'Acme Corp', industry_vertical: 'Technology', key_pain_points: ['Legacy systems causing downtime', 'High operational costs'], products_to_highlight: ['CloudSync Platform', 'AI Analytics Suite'], tone: 'Professional' },
      { slide_number: 'Slide 2 of 8', slide_title: 'Agenda: Digital Transformation Roadmap', bullet_points: ['Understanding Current Challenges', 'Our Innovative Solutions', 'Key Value Propositions', 'Real-World Success Stories', 'Path Forward'], speaker_notes: 'Review the agenda with the team.', presentation_type: 'intro pitch', client_name: 'Acme Corp', industry_vertical: 'Technology', key_pain_points: ['Legacy systems causing downtime', 'High operational costs'], products_to_highlight: ['CloudSync Platform', 'AI Analytics Suite'], tone: 'Professional' },
      { slide_number: 'Slide 3 of 8', slide_title: 'Key Pain Points in Technology', bullet_points: ['Legacy Systems: Frequent outages and limited scalability', 'High Operational Costs: Inefficient processes', 'Digital Transformation: Difficulty adapting to market changes'], speaker_notes: 'Discuss industry challenges.', presentation_type: 'intro pitch', client_name: 'Acme Corp', industry_vertical: 'Technology', key_pain_points: ['Legacy systems causing downtime', 'High operational costs'], products_to_highlight: ['CloudSync Platform', 'AI Analytics Suite'], tone: 'Professional' },
      { slide_number: 'Slide 4 of 8', slide_title: 'CloudSync Platform: Modernizing Infrastructure', bullet_points: ['Seamless cloud migration and data sync', 'Enhanced system uptime and reliability', 'Scalable infrastructure for future growth', 'Reduced IT overhead and maintenance costs'], speaker_notes: 'Present the CloudSync Platform benefits.', presentation_type: 'intro pitch', client_name: 'Acme Corp', industry_vertical: 'Technology', key_pain_points: ['Legacy systems causing downtime', 'High operational costs'], products_to_highlight: ['CloudSync Platform', 'AI Analytics Suite'], tone: 'Professional' },
      { slide_number: 'Slide 5 of 8', slide_title: 'AI Analytics Suite: Data-Driven Decisions', bullet_points: ['Advanced AI-powered data analytics', 'Real-time insights for informed decision-making', 'Improved operational efficiency', 'Predictive analytics to anticipate trends'], speaker_notes: 'Highlight AI Analytics Suite capabilities.', presentation_type: 'intro pitch', client_name: 'Acme Corp', industry_vertical: 'Technology', key_pain_points: ['Legacy systems causing downtime', 'High operational costs'], products_to_highlight: ['CloudSync Platform', 'AI Analytics Suite'], tone: 'Professional' },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'sample-2',
    clientName: 'MedVita Health',
    industry: 'Healthcare',
    contactName: 'Dr. James Wilson',
    presentationType: 'Proposal',
    slideCount: 10,
    tone: 'Professional',
    painPoints: 'Patient data management, Regulatory compliance, Interoperability',
    products: ['HealthSync EHR', 'Compliance Engine'],
    slides: [
      { slide_number: 'Slide 1 of 10', slide_title: 'MedVita Health: Next-Gen Patient Care', subtitle: 'Streamlining Healthcare Operations with AI', bullet_points: [], speaker_notes: 'Introduction to MedVita proposal.', presentation_type: 'proposal', client_name: 'MedVita Health', industry_vertical: 'Healthcare', key_pain_points: ['Patient data management', 'Regulatory compliance'], products_to_highlight: ['HealthSync EHR', 'Compliance Engine'], tone: 'Professional' },
      { slide_number: 'Slide 2 of 10', slide_title: 'Healthcare Industry Challenges', bullet_points: ['Fragmented patient records across systems', 'Evolving regulatory requirements (HIPAA, HITECH)', 'Interoperability gaps between platforms', 'Rising administrative costs'], speaker_notes: 'Discuss the major challenges in healthcare IT.', presentation_type: 'proposal', client_name: 'MedVita Health', industry_vertical: 'Healthcare', key_pain_points: ['Patient data management', 'Regulatory compliance'], products_to_highlight: ['HealthSync EHR', 'Compliance Engine'], tone: 'Professional' },
    ],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'sample-3',
    clientName: 'FinEdge Capital',
    industry: 'Finance',
    contactName: 'Michael Park',
    presentationType: 'Demo Follow-up',
    slideCount: 6,
    tone: 'Conversational',
    painPoints: 'Risk assessment bottlenecks, Manual reporting processes',
    products: ['RiskGuard AI', 'AutoReport Suite'],
    slides: [
      { slide_number: 'Slide 1 of 6', slide_title: 'FinEdge Capital: Accelerating Financial Intelligence', subtitle: 'Following up on our demo with next steps', bullet_points: [], speaker_notes: 'Follow-up from the demo session.', presentation_type: 'demo follow-up', client_name: 'FinEdge Capital', industry_vertical: 'Finance', key_pain_points: ['Risk assessment bottlenecks', 'Manual reporting processes'], products_to_highlight: ['RiskGuard AI', 'AutoReport Suite'], tone: 'Conversational' },
    ],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 'sample-4',
    clientName: 'RetailMax',
    industry: 'Retail',
    contactName: 'Lisa Torres',
    presentationType: 'Intro Pitch',
    slideCount: 7,
    tone: 'Bold',
    painPoints: 'Supply chain visibility, Customer retention, Omnichannel integration',
    products: ['SupplyChain360', 'CustomerIQ Platform'],
    slides: [],
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: 'sample-5',
    clientName: 'EduLearn Global',
    industry: 'Education',
    contactName: 'Prof. Anya Gupta',
    presentationType: 'Proposal',
    slideCount: 9,
    tone: 'Professional',
    painPoints: 'Student engagement, Content delivery scalability',
    products: ['LearnSphere LMS', 'AI Tutor Engine'],
    slides: [],
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  },
]

const INDUSTRY_OPTIONS = ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Education', 'Real Estate', 'Other']
const PRESENTATION_TYPES = ['Intro Pitch', 'Demo Follow-up', 'Proposal']
const TONE_OPTIONS = ['Professional', 'Conversational', 'Bold']

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return 'Unknown'
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return 'Unknown'
  }
}

function generateId(): string {
  return 'pres_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8)
}

function downloadPresentation(presentation: Presentation) {
  const slides = Array.isArray(presentation?.slides) ? presentation.slides : []
  let content = `==========================================================\n`
  content += `  ${presentation?.clientName ?? 'Untitled'} - Sales Presentation\n`
  content += `==========================================================\n\n`
  content += `Client: ${presentation?.clientName ?? 'N/A'}\n`
  content += `Industry: ${presentation?.industry ?? 'N/A'}\n`
  content += `Contact: ${presentation?.contactName ?? 'N/A'}\n`
  content += `Type: ${presentation?.presentationType ?? 'N/A'}\n`
  content += `Tone: ${presentation?.tone ?? 'N/A'}\n`
  content += `Slides: ${slides.length}\n`
  content += `Created: ${formatDate(presentation?.createdAt ?? '')}\n\n`
  content += `----------------------------------------------------------\n\n`

  slides.forEach((slide) => {
    content += `[${slide?.slide_number ?? ''}]\n`
    content += `Title: ${slide?.slide_title ?? ''}\n`
    if (slide?.subtitle) {
      content += `Subtitle: ${slide.subtitle}\n`
    }
    const bullets = Array.isArray(slide?.bullet_points) ? slide.bullet_points : []
    if (bullets.length > 0) {
      content += `\nKey Points:\n`
      bullets.forEach((bp) => {
        content += `  - ${bp}\n`
      })
    }
    content += `\nSpeaker Notes:\n${slide?.speaker_notes ?? 'N/A'}\n`
    content += `\n----------------------------------------------------------\n\n`
  })

  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${(presentation?.clientName ?? 'presentation').replace(/\s+/g, '_')}_presentation.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function parseSlides(rawResult: unknown): Slide[] {
  if (Array.isArray(rawResult)) {
    return rawResult
  }
  if (rawResult && typeof rawResult === 'object') {
    const obj = rawResult as Record<string, unknown>
    const possibleArray = obj?.slides || obj?.data || obj?.presentation
    if (Array.isArray(possibleArray)) {
      return possibleArray
    }
    const values = Object.values(obj)
    if (values.length > 0 && Array.isArray(values[0])) {
      return values[0] as Slide[]
    }
  }
  return []
}

// -------------------------------------------------------
// Inline SVG Icon Components
// -------------------------------------------------------

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || 'w-5 h-5'}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || 'w-5 h-5'}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function SlideshowIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || 'w-5 h-5'}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}

// -------------------------------------------------------
// SlidePreviewCard
// -------------------------------------------------------
function SlidePreviewCard({ slide, index, onRegenerate, isRegenerating }: { slide: Slide; index: number; onRegenerate?: () => void; isRegenerating?: boolean }) {
  const [showNotes, setShowNotes] = useState(false)
  const bullets = Array.isArray(slide?.bullet_points) ? slide.bullet_points : []

  return (
    <div className="glass-card rounded-xl p-5 transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}>
      <div className="flex items-start justify-between mb-3">
        <Badge variant="secondary" className="bg-primary/10 text-primary font-medium text-xs">
          {slide?.slide_number ?? `Slide ${index + 1}`}
        </Badge>
        {onRegenerate && (
          <Button variant="ghost" size="sm" onClick={onRegenerate} disabled={isRegenerating} className="h-7 px-2 text-muted-foreground hover:text-primary">
            {isRegenerating ? <RiLoader4Line className="w-3.5 h-3.5 animate-spin" /> : <RiRefreshLine className="w-3.5 h-3.5" />}
          </Button>
        )}
      </div>
      <h4 className="font-semibold text-sm leading-snug mb-1" style={{ letterSpacing: '-0.01em' }}>{slide?.slide_title ?? 'Untitled Slide'}</h4>
      {slide?.subtitle && (
        <p className="text-xs text-muted-foreground mb-2 italic">{slide.subtitle}</p>
      )}
      {bullets.length > 0 && (
        <ul className="space-y-1.5 mt-2">
          {bullets.map((bp, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground" style={{ lineHeight: '1.55' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" />
              <span>{bp}</span>
            </li>
          ))}
        </ul>
      )}
      {slide?.speaker_notes && (
        <div className="mt-3">
          <button onClick={() => setShowNotes(!showNotes)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
            {showNotes ? <RiArrowUpSLine className="w-3 h-3" /> : <RiArrowDownSLine className="w-3 h-3" />}
            Speaker Notes
          </button>
          {showNotes && (
            <p className="mt-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3" style={{ lineHeight: '1.55' }}>{slide.speaker_notes}</p>
          )}
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------
// PreviewModal
// -------------------------------------------------------
function PreviewModal({ presentation, onClose }: { presentation: Presentation; onClose: () => void }) {
  const slides = Array.isArray(presentation?.slides) ? presentation.slides : []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h3 className="font-semibold text-lg" style={{ letterSpacing: '-0.01em' }}>{presentation?.clientName ?? 'Presentation'}</h3>
            <p className="text-sm text-muted-foreground">{presentation?.presentationType ?? ''} - {slides.length} slides</p>
          </div>
          <div className="flex items-center gap-2">
            {presentation?.pptxUrl && (
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => window.open(presentation.pptxUrl!, '_blank')}>
                <RiDownloadLine className="w-4 h-4 mr-1.5" /> PPTX
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => downloadPresentation(presentation)}>
              <RiDownloadLine className="w-4 h-4 mr-1.5" /> TXT
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <RiCloseLine className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-1 p-6">
          {presentation?.agentMessage && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 mb-4">
              <p className="text-sm text-blue-800 whitespace-pre-wrap">{presentation.agentMessage}</p>
            </div>
          )}
          {slides.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <RiFileTextLine className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">{presentation?.pptxUrl ? 'This presentation was generated as a PPTX file. Use the download button above.' : 'No slide content available for this presentation.'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {slides.map((slide, i) => (
                <SlidePreviewCard key={i} slide={slide} index={i} />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}

// -------------------------------------------------------
// Main Component
// -------------------------------------------------------
export default function Home() {
  const [activeView, setActiveView] = useState<'dashboard' | 'create' | 'history'>('dashboard')
  const [sampleMode, setSampleMode] = useState(false)
  const [presentations, setPresentations] = useState<Presentation[]>([])
  const [loading, setLoading] = useState(false)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [generatedSlides, setGeneratedSlides] = useState<Slide[]>([])
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null)
  const [pptxDownloadUrl, setPptxDownloadUrl] = useState<string | null>(null)
  const [agentMessage, setAgentMessage] = useState<string | null>(null)
  const [previewPresentation, setPreviewPresentation] = useState<Presentation | null>(null)
  const [historySearch, setHistorySearch] = useState('')
  const [historyTypeFilter, setHistoryTypeFilter] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    industry: '',
    contactName: '',
    presentationType: 'Intro Pitch',
    slideCount: 8,
    painPoints: '',
    productsInput: '',
    tone: 'Professional',
  })

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('salesdeck_presentations')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setPresentations(parsed)
        }
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  // Save to localStorage
  const savePresentations = useCallback((newPresentations: Presentation[]) => {
    setPresentations(newPresentations)
    try {
      localStorage.setItem('salesdeck_presentations', JSON.stringify(newPresentations))
    } catch {
      // ignore storage errors
    }
  }, [])

  const displayPresentations = sampleMode
    ? [...SAMPLE_PRESENTATIONS, ...presentations]
    : presentations

  const buildAgentMessage = (fd: FormData): string => {
    const products = fd.productsInput.split(',').map(p => p.trim()).filter(Boolean).join(', ')
    return `Generate a professional ${fd.presentationType} presentation for ${fd.clientName}, a ${fd.industry} company. Key pain points: ${fd.painPoints}. Products to highlight: ${products}. Tone: ${fd.tone}. Number of slides: ${fd.slideCount}.`
  }

  // Extract file download URL from module_outputs, artifact_files, or sandbox links in text
  const extractFileUrl = (result: Record<string, any>): string | null => {
    // Check top-level module_outputs
    const moduleOutputs = result?.module_outputs
    if (Array.isArray(moduleOutputs)) {
      for (const output of moduleOutputs) {
        const url = output?.url || output?.file_url || output?.download_url
        if (url && typeof url === 'string') return url
      }
    }
    // Check top-level artifact_files
    const artifactFiles = result?.artifact_files
    if (Array.isArray(artifactFiles)) {
      for (const file of artifactFiles) {
        const url = file?.url || file?.file_url || file?.download_url
        if (url && typeof url === 'string') return url
      }
    }
    // Check nested response for module_outputs
    const respModuleOutputs = result?.response?.module_outputs
    if (Array.isArray(respModuleOutputs)) {
      for (const output of respModuleOutputs) {
        const url = output?.url || output?.file_url || output?.download_url
        if (url && typeof url === 'string') return url
      }
    }
    // Check nested response for artifact_files
    const respArtifactFiles = result?.response?.artifact_files
    if (Array.isArray(respArtifactFiles)) {
      for (const file of respArtifactFiles) {
        const url = file?.url || file?.file_url || file?.download_url
        if (url && typeof url === 'string') return url
      }
    }
    // Check for file URLs in raw_response text (sandbox links or direct URLs)
    const rawText = result?.raw_response || result?.response?.message || result?.response?.result?.text || ''
    if (typeof rawText === 'string') {
      // Match markdown-style file links: [filename](url)
      const mdLinkMatch = rawText.match(/\[.*?\.pptx\]\((https?:\/\/[^\s)]+)\)/i)
      if (mdLinkMatch?.[1]) return mdLinkMatch[1]
      // Match direct HTTPS URLs ending in .pptx
      const urlMatch = rawText.match(/(https?:\/\/[^\s)]+\.pptx[^\s)]*)/i)
      if (urlMatch?.[1]) return urlMatch[1]
    }
    return null
  }

  const handleGenerate = async () => {
    if (!formData.clientName.trim()) {
      setError('Please enter a client name.')
      return
    }
    if (!formData.industry) {
      setError('Please select an industry.')
      return
    }

    setLoading(true)
    setError(null)
    setSuccessMsg(null)
    setGeneratedSlides([])
    setPptxDownloadUrl(null)
    setAgentMessage(null)
    setActiveAgentId(AGENT_ID)

    try {
      const message = buildAgentMessage(formData)
      const result = await callAIAgent(message, AGENT_ID)

      if (result?.success) {
        const products = formData.productsInput.split(',').map(p => p.trim()).filter(Boolean)

        // Extract file URL from module_outputs / artifact_files / raw_response
        const fileUrl = extractFileUrl(result as Record<string, any>)

        // Extract text message from agent
        const textMsg = result?.response?.message || result?.response?.result?.text || result?.raw_response || ''
        // Clean up sandbox links from display text
        const cleanMsg = typeof textMsg === 'string' ? textMsg.replace(/\[.*?\]\(sandbox:[^\)]+\)/g, '').trim() : ''
        if (cleanMsg) setAgentMessage(cleanMsg)

        // Try to extract structured slides from the response
        const rawResult = result?.response?.result
        const slides = parseSlides(rawResult)

        if (fileUrl) {
          // File output mode: agent returned a downloadable PPTX
          setPptxDownloadUrl(fileUrl)
          const newPresentation: Presentation = {
            id: generateId(),
            clientName: formData.clientName,
            industry: formData.industry,
            contactName: formData.contactName,
            presentationType: formData.presentationType,
            slideCount: formData.slideCount,
            tone: formData.tone,
            painPoints: formData.painPoints,
            products,
            slides,
            pptxUrl: fileUrl,
            agentMessage: textMsg || undefined,
            createdAt: new Date().toISOString(),
          }
          savePresentations([newPresentation, ...presentations])
          setSuccessMsg(`Presentation generated successfully! Your PPTX file is ready for download.`)
          if (slides.length > 0) setGeneratedSlides(slides)
        } else if (slides.length > 0) {
          // Structured slide data mode (fallback)
          setGeneratedSlides(slides)
          const newPresentation: Presentation = {
            id: generateId(),
            clientName: formData.clientName,
            industry: formData.industry,
            contactName: formData.contactName,
            presentationType: formData.presentationType,
            slideCount: slides.length,
            tone: formData.tone,
            painPoints: formData.painPoints,
            products,
            slides,
            createdAt: new Date().toISOString(),
          }
          savePresentations([newPresentation, ...presentations])
          setSuccessMsg(`Presentation generated successfully with ${slides.length} slides.`)
        } else {
          const msg = result?.response?.message
          if (msg) {
            setAgentMessage(msg)
            setSuccessMsg('Agent responded. See the message below.')
          } else {
            setError('No slides or file were returned. Please try again.')
          }
        }
      } else {
        setError(result?.response?.message || result?.error || 'Failed to generate presentation. Please try again.')
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
      setActiveAgentId(null)
    }
  }

  const handleRegenerateSlide = async (slideIndex: number) => {
    const slide = generatedSlides[slideIndex]
    if (!slide) return

    setRegeneratingIndex(slideIndex)
    setActiveAgentId(AGENT_ID)

    try {
      const message = `Regenerate slide ${slideIndex + 1} for the ${formData.presentationType} presentation for ${formData.clientName}. The slide title is "${slide?.slide_title ?? ''}". Industry: ${formData.industry}. Tone: ${formData.tone}. Make the content different but equally professional.`
      const result = await callAIAgent(message, AGENT_ID)

      if (result?.success) {
        const rawResult = result?.response?.result
        const newSlides = parseSlides(rawResult)
        if (newSlides.length > 0) {
          const updated = [...generatedSlides]
          updated[slideIndex] = newSlides[0]
          setGeneratedSlides(updated)
        }
      }
    } catch {
      // ignore regeneration errors
    } finally {
      setRegeneratingIndex(null)
      setActiveAgentId(null)
    }
  }

  const handleDeletePresentation = (id: string) => {
    const updated = presentations.filter(p => p?.id !== id)
    savePresentations(updated)
  }

  const fillSampleData = useCallback(() => {
    setFormData({
      clientName: 'Acme Corp',
      industry: 'Technology',
      contactName: 'Sarah Chen',
      presentationType: 'Intro Pitch',
      slideCount: 8,
      painPoints: 'Legacy systems causing downtime, High operational costs, Need for digital transformation',
      productsInput: 'CloudSync Platform, AI Analytics Suite',
      tone: 'Professional',
    })
  }, [])

  const clearFormData = useCallback(() => {
    setFormData({
      clientName: '',
      industry: '',
      contactName: '',
      presentationType: 'Intro Pitch',
      slideCount: 8,
      painPoints: '',
      productsInput: '',
      tone: 'Professional',
    })
    setGeneratedSlides([])
    setPptxDownloadUrl(null)
    setAgentMessage(null)
    setError(null)
    setSuccessMsg(null)
  }, [])

  useEffect(() => {
    if (sampleMode && activeView === 'create') {
      fillSampleData()
    }
    if (!sampleMode && activeView === 'create') {
      clearFormData()
    }
  }, [sampleMode, activeView, fillSampleData, clearFormData])

  // Stats
  const thisMonthCount = displayPresentations.filter(p => {
    try {
      const d = new Date(p?.createdAt ?? '')
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    } catch {
      return false
    }
  }).length

  const avgSlides = displayPresentations.length > 0
    ? Math.round(displayPresentations.reduce((sum, p) => sum + (p?.slideCount ?? 0), 0) / displayPresentations.length)
    : 0

  const lastCreated = displayPresentations.length > 0
    ? formatDate(displayPresentations[0]?.createdAt ?? '')
    : 'N/A'

  // History filtering
  const filteredHistory = displayPresentations.filter(p => {
    const matchSearch = !historySearch || (p?.clientName ?? '').toLowerCase().includes(historySearch.toLowerCase()) || (p?.presentationType ?? '').toLowerCase().includes(historySearch.toLowerCase())
    const matchType = historyTypeFilter === 'all' || (p?.presentationType ?? '') === historyTypeFilter
    return matchSearch && matchType
  })

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', iconType: 'dashboard' },
    { id: 'create' as const, label: 'Create Presentation', iconType: 'create' },
    { id: 'history' as const, label: 'History', iconType: 'history' },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} transition-all duration-300 border-r bg-gradient-to-b from-[hsl(230,50%,97%)] to-[hsl(220,45%,95%)] flex flex-col shrink-0`}>
        <div className="p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md shrink-0">
            <SlideshowIcon className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-base leading-none" style={{ letterSpacing: '-0.01em' }}>SalesDeck AI</h1>
            <p className="text-[10px] text-muted-foreground mt-0.5 tracking-widest uppercase">Presentations</p>
          </div>
        </div>

        <Separator className="mb-2" />

        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id
            return (
              <button key={item.id} onClick={() => { setActiveView(item.id); setError(null); setSuccessMsg(null); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'}`}>
                {item.iconType === 'dashboard' && <DashboardIcon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />}
                {item.iconType === 'create' && <RiAddLine className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />}
                {item.iconType === 'history' && <HistoryIcon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />}
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="p-4 mx-3 mb-3 rounded-xl bg-muted/40 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <RiInformationLine className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold">Agent Status</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full shrink-0 ${activeAgentId ? 'bg-amber-400 animate-pulse' : 'bg-green-500'}`} />
            <span className="text-xs text-muted-foreground truncate">PPT Generator Agent</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 ml-4">{activeAgentId ? 'Processing request...' : 'Ready'}</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b bg-card/80 backdrop-blur-md flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="h-8 w-8 p-0">
              <RiMenuLine className="w-4 h-4" />
            </Button>
            <h2 className="font-semibold text-sm" style={{ letterSpacing: '-0.01em' }}>{activeView === 'dashboard' ? 'Dashboard' : activeView === 'create' ? 'Create Presentation' : 'Presentation History'}</h2>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="sample-toggle" className="text-xs text-muted-foreground cursor-pointer select-none">Sample Data</Label>
            <Switch id="sample-toggle" checked={sampleMode} onCheckedChange={setSampleMode} />
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-auto gradient-bg">
          <div className="p-6 max-w-7xl mx-auto">

            {/* ==================== DASHBOARD ==================== */}
            {activeView === 'dashboard' && (
              <div className="space-y-6">
                {/* Welcome */}
                <div>
                  <h2 className="text-2xl font-bold" style={{ letterSpacing: '-0.01em' }}>Welcome to SalesDeck AI</h2>
                  <p className="text-muted-foreground text-sm mt-1" style={{ lineHeight: '1.55' }}>Generate professional sales presentations in minutes using AI-powered slide generation.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="glass-card rounded-xl p-5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">This Month</p>
                    <p className="text-3xl font-bold text-primary mt-1">{thisMonthCount}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">presentations created</p>
                  </div>
                  <div className="glass-card rounded-xl p-5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Avg. Slides</p>
                    <p className="text-3xl font-bold text-primary mt-1">{avgSlides}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">slides per deck</p>
                  </div>
                  <div className="glass-card rounded-xl p-5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Last Created</p>
                    <p className="text-lg font-bold mt-2">{lastCreated}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">most recent deck</p>
                  </div>
                </div>

                {/* CTA */}
                <div className="glass-card rounded-2xl p-8 border border-primary/10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold" style={{ letterSpacing: '-0.01em' }}>Create a New Presentation</h3>
                      <p className="text-muted-foreground text-sm mt-1" style={{ lineHeight: '1.55' }}>Provide client details and let AI generate a polished sales deck with custom slides, bullet points, and speaker notes.</p>
                    </div>
                    <Button size="lg" onClick={() => setActiveView('create')} className="shrink-0 shadow-lg">
                      <RiAddLine className="w-4 h-4 mr-2" />
                      New Presentation
                    </Button>
                  </div>
                </div>

                {/* Recent Presentations */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg" style={{ letterSpacing: '-0.01em' }}>Recent Presentations</h3>
                    {displayPresentations.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={() => setActiveView('history')} className="text-primary text-xs">
                        View All <RiArrowRightLine className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    )}
                  </div>

                  {displayPresentations.length === 0 ? (
                    <div className="glass-card rounded-xl p-12 text-center">
                      <RiFileTextLine className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
                      <p className="text-sm text-muted-foreground">No presentations yet. Create your first one to get started.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {displayPresentations.slice(0, 6).map((pres) => {
                        const presSlideCount = Array.isArray(pres?.slides) ? pres.slides.length : (pres?.slideCount ?? 0)
                        return (
                          <div key={pres?.id ?? Math.random()} className="glass-card rounded-xl p-5 hover:shadow-lg transition-all duration-200 group">
                            <div className="flex items-start justify-between mb-3">
                              <Badge variant="outline" className="text-xs">{pres?.presentationType ?? 'N/A'}</Badge>
                              <span className="text-xs text-muted-foreground">{formatDate(pres?.createdAt ?? '')}</span>
                            </div>
                            <h4 className="font-semibold text-sm mb-1" style={{ letterSpacing: '-0.01em' }}>{pres?.clientName ?? 'Untitled'}</h4>
                            <p className="text-xs text-muted-foreground">{pres?.industry ?? ''} - {presSlideCount} slides</p>
                            <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="outline" size="sm" className="h-7 text-xs flex-1" onClick={() => setPreviewPresentation(pres)}>
                                <RiExternalLinkLine className="w-3 h-3 mr-1" /> View
                              </Button>
                              {pres?.pptxUrl ? (
                                <Button size="sm" className="h-7 text-xs flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => window.open(pres.pptxUrl!, '_blank')}>
                                  <RiDownloadLine className="w-3 h-3 mr-1" /> PPTX
                                </Button>
                              ) : (
                                <Button variant="outline" size="sm" className="h-7 text-xs flex-1" onClick={() => downloadPresentation(pres)}>
                                  <RiDownloadLine className="w-3 h-3 mr-1" /> Download
                                </Button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ==================== CREATE ==================== */}
            {activeView === 'create' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold" style={{ letterSpacing: '-0.01em' }}>Create Presentation</h2>
                  <p className="text-muted-foreground text-sm mt-1" style={{ lineHeight: '1.55' }}>Fill in the details below and the AI agent will generate a complete slide deck for you.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Form column */}
                  <div className="lg:w-[60%] space-y-5">
                    {/* Client Info */}
                    <Card className="glass-card border-0 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold" style={{ letterSpacing: '-0.01em' }}>Client Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="clientName" className="text-xs font-medium">Company Name *</Label>
                            <Input id="clientName" placeholder="e.g. Acme Corp" value={formData.clientName} onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))} />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="industry" className="text-xs font-medium">Industry *</Label>
                            <Select value={formData.industry} onValueChange={(val) => setFormData(prev => ({ ...prev, industry: val }))}>
                              <SelectTrigger id="industry">
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                              <SelectContent>
                                {INDUSTRY_OPTIONS.map(opt => (
                                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="contactName" className="text-xs font-medium">Contact Name</Label>
                          <Input id="contactName" placeholder="e.g. Sarah Chen" value={formData.contactName} onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))} />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Presentation Details */}
                    <Card className="glass-card border-0 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold" style={{ letterSpacing: '-0.01em' }}>Presentation Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="presType" className="text-xs font-medium">Presentation Type</Label>
                            <Select value={formData.presentationType} onValueChange={(val) => setFormData(prev => ({ ...prev, presentationType: val }))}>
                              <SelectTrigger id="presType">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {PRESENTATION_TYPES.map(opt => (
                                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-medium">Number of Slides: {formData.slideCount}</Label>
                            <div className="flex items-center gap-3 pt-1">
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0 shrink-0" onClick={() => setFormData(prev => ({ ...prev, slideCount: Math.max(5, prev.slideCount - 1) }))}>
                                <RiSubtractLine className="w-3 h-3" />
                              </Button>
                              <div className="flex-1 bg-muted rounded-full h-2 relative overflow-hidden">
                                <div className="bg-primary rounded-full h-2 transition-all duration-200" style={{ width: `${((formData.slideCount - 5) / 10) * 100}%` }} />
                              </div>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0 shrink-0" onClick={() => setFormData(prev => ({ ...prev, slideCount: Math.min(15, prev.slideCount + 1) }))}>
                                <RiAddLine className="w-3 h-3" />
                              </Button>
                              <span className="text-sm font-semibold text-primary w-6 text-center shrink-0">{formData.slideCount}</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="painPoints" className="text-xs font-medium">Key Pain Points</Label>
                          <Textarea id="painPoints" placeholder="e.g. Legacy systems causing downtime, High operational costs, Need for digital transformation..." value={formData.painPoints} onChange={(e) => setFormData(prev => ({ ...prev, painPoints: e.target.value }))} rows={3} className="resize-none" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="products" className="text-xs font-medium">Products to Highlight (comma-separated)</Label>
                          <Input id="products" placeholder="e.g. CloudSync Platform, AI Analytics Suite" value={formData.productsInput} onChange={(e) => setFormData(prev => ({ ...prev, productsInput: e.target.value }))} />
                          {formData.productsInput && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {formData.productsInput.split(',').map(p => p.trim()).filter(Boolean).map((product, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">{product}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tone Selector */}
                    <Card className="glass-card border-0 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold" style={{ letterSpacing: '-0.01em' }}>Tone</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-3">
                          {TONE_OPTIONS.map(tone => (
                            <button key={tone} onClick={() => setFormData(prev => ({ ...prev, tone }))} className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${formData.tone === tone ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-border hover:border-primary/30 text-muted-foreground'}`}>
                              {tone}
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Error / Success messages */}
                    {error && (
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                        <RiErrorWarningLine className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                        <p className="text-sm text-destructive">{error}</p>
                      </div>
                    )}
                    {successMsg && (
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
                        <RiCheckLine className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <p className="text-sm text-green-700">{successMsg}</p>
                      </div>
                    )}

                    {/* Agent Message */}
                    {agentMessage && !error && (
                      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                        <p className="text-sm text-blue-800 whitespace-pre-wrap">{agentMessage}</p>
                      </div>
                    )}

                    {/* Generate Button */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <Button size="lg" onClick={handleGenerate} disabled={loading} className="shadow-lg min-w-[220px]">
                        {loading ? (
                          <>
                            <RiLoader4Line className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <RiSendPlaneLine className="w-4 h-4 mr-2" />
                            Generate Presentation
                          </>
                        )}
                      </Button>
                      {pptxDownloadUrl && (
                        <Button size="lg" variant="default" className="shadow-lg bg-green-600 hover:bg-green-700" onClick={() => {
                          window.open(pptxDownloadUrl, '_blank')
                        }}>
                          <RiDownloadLine className="w-4 h-4 mr-2" />
                          Download PPTX
                        </Button>
                      )}
                      {generatedSlides.length > 0 && (
                        <Button variant="outline" size="lg" onClick={() => {
                          if (presentations.length > 0) {
                            downloadPresentation(presentations[0])
                          }
                        }}>
                          <RiDownloadLine className="w-4 h-4 mr-2" />
                          Download TXT
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Preview column */}
                  <div className="lg:w-[40%]">
                    <div className="lg:sticky lg:top-0">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-sm" style={{ letterSpacing: '-0.01em' }}>Slide Preview</h3>
                        {generatedSlides.length > 0 && (
                          <Badge variant="secondary" className="text-xs">{generatedSlides.length} slides</Badge>
                        )}
                      </div>

                      {loading && (
                        <div className="glass-card rounded-2xl p-12 text-center">
                          <RiLoader4Line className="w-10 h-10 mx-auto text-primary animate-spin mb-4" />
                          <p className="text-sm font-medium text-muted-foreground">Generating your presentation...</p>
                          <p className="text-xs text-muted-foreground mt-1">This may take a moment</p>
                        </div>
                      )}

                      {!loading && generatedSlides.length === 0 && !pptxDownloadUrl && (
                        <div className="glass-card rounded-2xl p-12 text-center border border-dashed border-border">
                          <SlideshowIcon className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                          <p className="text-sm text-muted-foreground font-medium">No slides yet</p>
                          <p className="text-xs text-muted-foreground mt-1">Fill in the form and click Generate to create your slide deck.</p>
                        </div>
                      )}

                      {!loading && generatedSlides.length === 0 && pptxDownloadUrl && (
                        <div className="glass-card rounded-2xl p-12 text-center border border-green-200 bg-green-50/50">
                          <RiCheckLine className="w-10 h-10 mx-auto text-green-600 mb-4" />
                          <p className="text-sm font-medium text-green-800">PPTX File Ready</p>
                          <p className="text-xs text-muted-foreground mt-1 mb-4">Your presentation has been generated as a PowerPoint file.</p>
                          <Button size="lg" className="bg-green-600 hover:bg-green-700 shadow-lg" onClick={() => window.open(pptxDownloadUrl, '_blank')}>
                            <RiDownloadLine className="w-4 h-4 mr-2" />
                            Download PPTX
                          </Button>
                        </div>
                      )}

                      {!loading && generatedSlides.length > 0 && (
                        <ScrollArea className="h-[calc(100vh-220px)]">
                          <div className="space-y-3 pr-2">
                            {generatedSlides.map((slide, i) => (
                              <SlidePreviewCard key={i} slide={slide} index={i} onRegenerate={() => handleRegenerateSlide(i)} isRegenerating={regeneratingIndex === i} />
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== HISTORY ==================== */}
            {activeView === 'history' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold" style={{ letterSpacing: '-0.01em' }}>Presentation History</h2>
                  <p className="text-muted-foreground text-sm mt-1" style={{ lineHeight: '1.55' }}>Browse and manage all your generated presentations.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <RiSearchLine className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search by client name or type..." value={historySearch} onChange={(e) => setHistorySearch(e.target.value)} className="pl-9" />
                  </div>
                  <Select value={historyTypeFilter} onValueChange={setHistoryTypeFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {PRESENTATION_TYPES.map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Grid */}
                {filteredHistory.length === 0 ? (
                  <div className="glass-card rounded-xl p-12 text-center">
                    <RiFileTextLine className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      {displayPresentations.length === 0 ? 'No presentations yet. Create your first one to get started.' : 'No presentations match your search criteria.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredHistory.map((pres) => {
                      const slideCount = Array.isArray(pres?.slides) && pres.slides.length > 0 ? pres.slides.length : (pres?.slideCount ?? 0)
                      const products = Array.isArray(pres?.products) ? pres.products : []
                      const isSample = SAMPLE_PRESENTATIONS.some(s => s?.id === pres?.id)

                      return (
                        <Card key={pres?.id ?? Math.random()} className="glass-card border-0 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <Badge variant="outline" className="text-xs">{pres?.presentationType ?? 'N/A'}</Badge>
                              <span className="text-xs text-muted-foreground">{formatDate(pres?.createdAt ?? '')}</span>
                            </div>
                            <CardTitle className="text-base font-semibold mt-2" style={{ letterSpacing: '-0.01em' }}>{pres?.clientName ?? 'Untitled'}</CardTitle>
                            <CardDescription className="text-xs">{pres?.industry ?? ''}{pres?.contactName ? ` - ${pres.contactName}` : ''}</CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <RiFileTextLine className="w-3 h-3" /> {slideCount} slides
                              </span>
                              <span>{pres?.tone ?? ''}</span>
                            </div>
                            {products.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {products.slice(0, 3).map((p, i) => (
                                  <Badge key={i} variant="secondary" className="text-[10px] py-0">{p}</Badge>
                                ))}
                                {products.length > 3 && (
                                  <Badge variant="secondary" className="text-[10px] py-0">+{products.length - 3}</Badge>
                                )}
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="pt-2 gap-2 flex-wrap">
                            <Button variant="outline" size="sm" className="h-7 text-xs flex-1" onClick={() => setPreviewPresentation(pres)}>
                              <RiExternalLinkLine className="w-3 h-3 mr-1" /> Preview
                            </Button>
                            {pres?.pptxUrl ? (
                              <Button size="sm" className="h-7 text-xs flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => window.open(pres.pptxUrl!, '_blank')}>
                                <RiDownloadLine className="w-3 h-3 mr-1" /> PPTX
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" className="h-7 text-xs flex-1" onClick={() => downloadPresentation(pres)}>
                                <RiDownloadLine className="w-3 h-3 mr-1" /> Download
                              </Button>
                            )}
                            {!isSample && (
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10" onClick={() => handleDeletePresentation(pres?.id ?? '')}>
                                <RiCloseLine className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Preview Modal */}
      {previewPresentation && (
        <PreviewModal presentation={previewPresentation} onClose={() => setPreviewPresentation(null)} />
      )}
    </div>
  )
}
