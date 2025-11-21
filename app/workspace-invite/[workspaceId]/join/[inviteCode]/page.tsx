"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Building2
} from "lucide-react"
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"
import { joinWorkspaceWithInvite, getWorkspaceByInviteCode } from "@/app/actions/workspace"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface WorkspaceInviteInfo {
  id: string
  name: string
  description?: string
  memberCount: number
}

interface JoinWorkspacePageProps {
  params: Promise<{
    workspaceId: string
    inviteCode: string
  }>
}

export default function JoinWorkspacePage({ params }: JoinWorkspacePageProps) {
  const [workspaceId, setWorkspaceId] = useState<string>('')
  const [inviteCode, setInviteCode] = useState<string>('')
  const { user, isAuthenticated } = useKindeBrowserClient()
  const router = useRouter()
  const [workspaceInfo, setWorkspaceInfo] = useState<WorkspaceInviteInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [alreadyMember, setAlreadyMember] = useState(false)

  useEffect(() => {
    const initializeParams = async () => {
      try {
        const resolvedParams = await params
        setWorkspaceId(resolvedParams.workspaceId)
        setInviteCode(resolvedParams.inviteCode)
      } catch (error) {
        console.error('Error resolving params:', error)
        setError('Invalid URL parameters')
        setLoading(false)
      }
    }

    initializeParams()
  }, [params])

  useEffect(() => {
    const fetchWorkspaceInfo = async () => {
      try {
        setLoading(true)
        const result = await getWorkspaceByInviteCode(workspaceId, inviteCode)
        
        if (result.success && result.data) {
          setWorkspaceInfo({
            ...result.data.workspace,
            description: result.data.workspace.description || undefined
          })
          setAlreadyMember(result.data.alreadyMember || false)
        } else {
          setError(result.error || 'Invalid or expired invite link')
        }
      } catch (error) {
        console.error('Error fetching workspace info:', error)
        setError('Failed to load workspace information')
      } finally {
        setLoading(false)
      }
    }

    if (workspaceId && inviteCode) {
      fetchWorkspaceInfo()
    }
  }, [workspaceId, inviteCode])

  const handleJoinWorkspace = async () => {
    if (!user) {
      toast.error('Please sign in to join the workspace')
      return
    }

    try {
      setJoining(true)
      const result = await joinWorkspaceWithInvite(workspaceId, inviteCode)
      
      if (result.success) {
        toast.success('Successfully joined the workspace!')
        router.push(`/workspace/${workspaceId}`)
        // Don't set joining to false here - keep loading until redirect completes
      } else {
        toast.error(result.error || 'Failed to join workspace')
        setJoining(false)
      }
    } catch (error) {
      console.error('Error joining workspace:', error)
      toast.error('Failed to join workspace')
      setJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-muted-foreground">Loading workspace information...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <div>
                  <h2 className="text-lg font-semibold">Invalid Invite</h2>
                  <p className="text-muted-foreground mt-1">{error}</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/workspace')}
                >
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Building2 className="h-6 w-6" />
                Join Workspace
              </CardTitle>
              <CardDescription>
                You've been invited to join "{workspaceInfo?.name}"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Avatar className="h-16 w-16 mx-auto mb-3">
                  <AvatarFallback className="text-lg">
                    {workspaceInfo?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{workspaceInfo?.name}</h3>
                {workspaceInfo?.description && (
                  <p className="text-muted-foreground text-sm mt-1">
                    {workspaceInfo.description}
                  </p>
                )}
                <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{workspaceInfo?.memberCount} members</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-center text-sm text-muted-foreground">
                  Please sign in to join this workspace
                </p>
                <Button 
                  className="w-full" 
                  onClick={() => router.push('/api/auth/login')}
                >
                  Sign In to Join
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (alreadyMember) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <div>
                  <h2 className="text-lg font-semibold">Already a Member</h2>
                  <p className="text-muted-foreground mt-1">
                    You're already a member of "{workspaceInfo?.name}"
                  </p>
                </div>
                <Button 
                  onClick={() => router.push(`/workspace/${workspaceId}`)}
                >
                  Go to Workspace
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Building2 className="h-6 w-6" />
              Join Workspace
            </CardTitle>
            <CardDescription>
              You've been invited to collaborate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Avatar className="h-16 w-16 mx-auto mb-3">
                <AvatarFallback className="text-lg">
                  {workspaceInfo?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{workspaceInfo?.name}</h3>
              {workspaceInfo?.description && (
                <p className="text-muted-foreground text-sm mt-1">
                  {workspaceInfo.description}
                </p>
              )}
              <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{workspaceInfo?.memberCount} members</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-muted/50 p-3 rounded-lg text-center text-sm">
                <p className="text-muted-foreground">
                  Joining as <span className="font-medium text-foreground">{user?.email}</span>
                </p>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleJoinWorkspace}
                disabled={joining}
              >
                {joining ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-4 w-4" />
                    Join Workspace
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}