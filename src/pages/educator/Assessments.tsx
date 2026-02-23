import type React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { educatorApi } from '@/services/educatorApi'
import type { Assessment } from '@/types'

export default function Assessments() {
  const navigate = useNavigate()
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Assessment | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    introduction: '',
    conclusion: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const loadAssessments = useCallback(async () => {
    try {
      setLoading(true)
      const data = await educatorApi.fetchAssessments()
      setAssessments(data)
    } catch (err) {
      console.error('Failed to load assessments:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAssessments()
  }, [loadAssessments])

  const openAdd = () => {
    setEditing(null)
    setFormData({ name: '', description: '', introduction: '', conclusion: '' })
    setDialogOpen(true)
  }

  const openEdit = (assessment: Assessment) => {
    setEditing(assessment)
    setFormData({
      name: assessment.name,
      description: assessment.description,
      introduction: assessment.introduction || '',
      conclusion: assessment.conclusion || '',
    })
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editing) {
        await educatorApi.updateAssessment(editing.id, formData)
      } else {
        await educatorApi.createAssessment(formData)
      }
      setDialogOpen(false)
      await loadAssessments()
    } catch (err) {
      console.error('Failed to save assessment:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (assessment: Assessment) => {
    if (!window.confirm(`Delete assessment "${assessment.name}"?`)) return
    try {
      await educatorApi.deleteAssessment(assessment.id)
      await loadAssessments()
    } catch (err) {
      console.error('Failed to delete assessment:', err)
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <p className='text-muted-foreground'>Loading assessments...</p>
      </div>
    )
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Assessments</h1>
          <p className='text-muted-foreground mt-1'>
            Create and manage assessments for your children.
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className='size-4' />
          New Assessment
        </Button>
      </div>

      {assessments.length === 0 ? (
        <div className='text-center py-20 border rounded-lg'>
          <p className='text-muted-foreground mb-4'>
            No assessments created yet.
          </p>
          <Button onClick={openAdd}>
            <Plus className='size-4' />
            Create your first assessment
          </Button>
        </div>
      ) : (
        <div className='border rounded-lg'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Activities</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map(assessment => (
                <TableRow key={assessment.id}>
                  <TableCell className='font-medium'>
                    {assessment.name}
                  </TableCell>
                  <TableCell className='text-muted-foreground max-w-xs truncate'>
                    {assessment.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant='secondary'>
                      {assessment.activities?.length || 0}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-1'>
                      <Button
                        variant='ghost'
                        size='icon-sm'
                        onClick={() =>
                          navigate(
                            `/dashboard/assessments/${assessment.id}/activities`
                          )
                        }
                      >
                        <ChevronRight className='size-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon-sm'
                        onClick={() => openEdit(assessment)}
                      >
                        <Pencil className='size-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon-sm'
                        onClick={() => handleDelete(assessment)}
                      >
                        <Trash2 className='size-4 text-destructive' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Edit Assessment' : 'New Assessment'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='ass-name'>Name</Label>
              <Input
                id='ass-name'
                value={formData.name}
                onChange={e =>
                  setFormData(f => ({ ...f, name: e.target.value }))
                }
                placeholder='Assessment name'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='ass-desc'>Description</Label>
              <Input
                id='ass-desc'
                value={formData.description}
                onChange={e =>
                  setFormData(f => ({
                    ...f,
                    description: e.target.value,
                  }))
                }
                placeholder='Brief description'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='ass-intro'>Introduction</Label>
              <Input
                id='ass-intro'
                value={formData.introduction}
                onChange={e =>
                  setFormData(f => ({
                    ...f,
                    introduction: e.target.value,
                  }))
                }
                placeholder='Introduction text (optional)'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='ass-conc'>Conclusion</Label>
              <Input
                id='ass-conc'
                value={formData.conclusion}
                onChange={e =>
                  setFormData(f => ({
                    ...f,
                    conclusion: e.target.value,
                  }))
                }
                placeholder='Conclusion text (optional)'
              />
            </div>
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={submitting}>
                {submitting ? 'Saving...' : editing ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
