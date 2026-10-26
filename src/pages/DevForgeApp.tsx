import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePortfolioStore } from '@/store/portfolioStore'
import { FrontPage } from '@/components/FrontPage'
import { ModeSelectorPage } from '@/components/ModeSelectorPage'
import { EnterDetailsPage } from '@/components/EnterDetailsPage'
import { PortfolioViewerPage } from '@/components/PortfolioViewerPage'
import { AIHelperSideDrawer } from '@/components/AIHelperSideDrawer'

export const DevForgeApp: React.FC = () => {
  const { currentStep, setCurrentStep, activeMode, setActiveMode } = usePortfolioStore()
  const [searchParams, setSearchParams] = useSearchParams()

  // Handle URL step sync if query param is passed
  useEffect(() => {
    const stepParam = searchParams.get('step')
    if (stepParam && ['front', 'modes', 'details', 'portfolio'].includes(stepParam)) {
      if (stepParam !== currentStep) {
        setCurrentStep(stepParam as any)
      }
    }
    const modeParam = searchParams.get('mode')
    if (modeParam && ['dark', 'light', 'sun', 'c-mode'].includes(modeParam)) {
      if (modeParam !== activeMode) {
        setActiveMode(modeParam as any)
      }
    }
  }, [])

  // Keep URL updated with step
  useEffect(() => {
    setSearchParams({ step: currentStep, mode: activeMode }, { replace: true })
  }, [currentStep, activeMode])

  return (
    <div className="relative min-h-screen">
      {currentStep === 'front' && <FrontPage />}
      {currentStep === 'modes' && <ModeSelectorPage />}
      {currentStep === 'details' && <EnterDetailsPage />}
      {currentStep === 'portfolio' && <PortfolioViewerPage />}

      {/* Persistent AI Chat Helper on the side */}
      <AIHelperSideDrawer />
    </div>
  )
}

export default DevForgeApp
