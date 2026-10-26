import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { createClient } from '@/lib/supabase'
import { AlertCircle, Loader2 } from 'lucide-react'
import { templateComponents } from '../templates'
import type { PortfolioData, TemplateId } from '../types'
import { usePortfolioStore } from '@/store/portfolioStore'

const supabase = createClient()

export default function PublicPortfolio() {
  const { username } = useParams()
  const { profile, socialLinks, experience, projects, skills, education } = usePortfolioStore()
  const [data, setData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        if (profile && (username === profile.username || username === 'alexrivera' || username === 'me')) {
          setData({
            profile,
            social_links: socialLinks,
            experience,
            projects,
            skills,
            education,
          })
          setLoading(false)
          return
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single()

        if (profileError || !profileData) {
          if (profile) {
            setData({
              profile: { ...profile, username: username || profile.username },
              social_links: socialLinks,
              experience,
              projects,
              skills,
              education,
            })
            setLoading(false)
            return
          }
          throw new Error('User not found')
        }

        const userId = profileData.id
        const [
          socialLinksRes,
          experienceRes,
          projectsRes,
          skillsRes,
          educationRes,
        ] = await Promise.all([
          supabase.from('social_links').select('*').eq('user_id', userId).single(),
          supabase.from('experience').select('*').eq('user_id', userId).order('display_order'),
          supabase.from('projects').select('*').eq('user_id', userId).order('display_order'),
          supabase.from('skills').select('*').eq('user_id', userId).order('display_order'),
          supabase.from('education').select('*').eq('user_id', userId).order('display_order'),
        ])

        setData({
          profile: profileData,
          social_links: socialLinksRes.data,
          experience: experienceRes.data || [],
          projects: projectsRes.data || [],
          skills: skillsRes.data || [],
          education: educationRes.data || [],
        })
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchPortfolio()
    }
  }, [username, profile, socialLinks, experience, projects, skills, education])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin h-8 w-8 text-cyan-400" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0d13] px-8 text-center text-slate-100">
        <AlertCircle className="w-12 h-12 text-slate-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Portfolio not found</h1>
        <p className="text-slate-400 text-sm mb-6 max-w-xs">
          The user "@{username}" hasn't initialized their portfolio yet.
        </p>
        <Link
          to="/"
          className="bg-cyan-500 text-slate-950 font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider hover:bg-cyan-400 transition-all"
        >
          Open DevForge Studio
        </Link>
      </div>
    )
  }

  const templateId = (data.profile.template_id as TemplateId) || 'professional'
  const Component = templateComponents[templateId] || templateComponents.professional

  return <Component data={data} />
}
