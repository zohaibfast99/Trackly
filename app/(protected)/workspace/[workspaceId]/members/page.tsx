"use client"

import React, { useEffect, useState } from 'react'
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  UserPlus, 
  Mail, 
  Copy, 
  Trash2, 
  Crown,
  Eye,
  Shield,
  MoreVertical,
  Link as LinkIcon,
  Loader2
} from "lucide-react"
import { motion } from "framer-motion"
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"
import { getWorkspaceMembers, inviteUserToWorkspace, removeWorkspaceMember, updateMemberRole } from "@/app/actions/workspace"
import { AccessLevel } from '@prisma/client'
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useConfirmation } from "@/hooks/use-delete"
import { ConfirmationDialog } from "@/components/confirmation-dialog"

interface WorkspaceMember {
  id: string
  userId: string
  accessLevel: AccessLevel
  user: {
    id: string
    name: string
    email: string
    image?: string | null
  }
  createdAt: string | Date
  updatedAt: string | Date
  workspaceId: string
}

interface WorkspaceInfo {
  id: string
  name: string
  inviteCode: string
  ownerId: string | null
}

function MembersPage() {
  const workspaceId = useWorkspaceId()
  const { user } = useKindeBrowserClient()
  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [workspaceInfo, setWorkspaceInfo] = useState<WorkspaceInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { isOpen, confirm, handleConfirm, handleCancel, confirmationOptions } = useConfirmation()

  useEffect(() => {
    const fetchMembers = async () => {
      if (!workspaceId || !user) return

      try {
        setLoading(true)
        const result = await getWorkspaceMembers(workspaceId)
        
        if (result.success && result.data) {
          setMembers(result.data.members)
          setWorkspaceInfo(result.data.workspace)
        }
      } catch (error) {
        console.error('Error fetching members:', error)
        toast.error('Failed to load team members')
      } finally {
        setLoading(false)
      }
    }

    let hasInitiallyLoaded = false

    fetchMembers()
    hasInitiallyLoaded = true

    // Refresh when user switches back to the tab (but not on initial load)
    const handleFocus = () => {
      if (workspaceId && user && hasInitiallyLoaded) {
        fetchMembers()
      }
    }

    // Add a small delay before adding the focus listener to avoid initial trigger
    const timeoutId = setTimeout(() => {
      window.addEventListener('focus', handleFocus)
    }, 1000)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('focus', handleFocus)
    }
  }, [workspaceId, user])

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address')
      return
    }

    try {
      setIsInviting(true)
      const result = await inviteUserToWorkspace(workspaceId, inviteEmail)
      
      if (result.success) {
        toast.success('Invitation sent successfully!')
        setInviteEmail("")
        setIsDialogOpen(false)

      } else {
        toast.error(result.error || 'Failed to send invitation')
      }
    } catch (error) {
      console.error('Error inviting user:', error)
      toast.error('Failed to send invitation')
    } finally {
      setIsInviting(false)
    }
  }

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    confirm({
      title: "Remove Team Member",
      message: `Are you sure you want to remove ${memberName} from this workspace?`,
      onConfirm: async () => {
        try {
          const result = await removeWorkspaceMember(workspaceId, memberId)
          if (result.success) {
            toast.success('Member removed successfully')
            setMembers(members.filter(m => m.id !== memberId))
          } else {
            toast.error(result.error || 'Failed to remove member')
          }
        } catch (error) {
          console.error('Error removing member:', error)
          toast.error('Failed to remove member')
        }
      }
    })
  }

  const handleRoleChange = async (memberId: string, newRole: AccessLevel) => {
    try {
      const result = await updateMemberRole(workspaceId, memberId, newRole)
      if (result.success) {
        toast.success('Role updated successfully')
        setMembers(members.map(m => 
          m.id === memberId ? { ...m, accessLevel: newRole } : m
        ))
      } else {
        toast.error(result.error || 'Failed to update role')
      }
    } catch (error) {
      console.error('Error updating role:', error)
      toast.error('Failed to update role')
    }
  }

  const copyInviteLink = () => {
    if (workspaceInfo) {
      const inviteLink = `${window.location.origin}/workspace-invite/${workspaceInfo.id}/join/${workspaceInfo.inviteCode}`
      navigator.clipboard.writeText(inviteLink)
      toast.success('Invite link copied to clipboard')
    }
  }

  const getRoleIcon = (role: AccessLevel) => {
    switch (role) {
      case 'OWNER':
        return <Crown className="h-4 w-4 text-yellow-600" />
      case 'MEMBER':
        return <Shield className="h-4 w-4 text-blue-600" />
      case 'VIEWER':
        return <Eye className="h-4 w-4 text-gray-600" />
      default:
        return <Shield className="h-4 w-4 text-blue-600" />
    }
  }

  const getRoleColor = (role: AccessLevel) => {
    switch (role) {
      case 'OWNER':
        return 'bg-yellow-100 text-yellow-800'
      case 'MEMBER':
        return 'bg-blue-100 text-blue-800'
      case 'VIEWER':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const isCurrentUserOwner = workspaceInfo?.ownerId === user?.id
  const currentUserMember = members.find(m => m.userId === user?.id)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading team members...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Team Members
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage who has access to your workspace
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join this workspace
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  type="email"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isInviting}
                >
                  Cancel
                </Button>
                <Button onClick={handleInvite} disabled={isInviting}>
                  {isInviting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Invite
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Invite Link Card */}
      {workspaceInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Invite Link
            </CardTitle>
            <CardDescription>
              Share this link to invite people to your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={`${window.location.origin}/workspace-invite/${workspaceInfo.id}/join/${workspaceInfo.inviteCode}`}
                readOnly
                className="flex-1"
              />
              <Button variant="outline" onClick={copyInviteLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members ({members.length})</CardTitle>
          <CardDescription>
            People who have access to this workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.user.image || ''} />
                    <AvatarFallback>
                      {member.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.user.name}</p>
                      {member.userId === user?.id && (
                        <span className="text-xs text-muted-foreground">(You)</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{member.user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(member.accessLevel)}
                    <Badge className={getRoleColor(member.accessLevel)}>
                      {member.accessLevel}
                    </Badge>
                  </div>

                  {/* Only show actions if current user is owner and it's not themselves */}
                  {isCurrentUserOwner && member.userId !== user?.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'MEMBER')}>
                          Make Member
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'VIEWER')}>
                          Make Viewer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleRemoveMember(member.id, member.user.name)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </motion.div>
            ))}

            {members.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No team members yet</p>
                <p className="text-sm text-muted-foreground">Invite people to start collaborating</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={isOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        title={confirmationOptions?.title || ""}
        message={confirmationOptions?.message || ""}
      />
    </div>
  )
}

export default MembersPage