import type React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
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
import { educatorApi, type Child } from '@/services/educatorApi'

export default function Children() {
  const navigate = useNavigate()
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Child | null>(null)
  const [formData, setFormData] = useState({ name: '', yob: '' })
  const [submitting, setSubmitting] = useState(false)

  const loadChildren = useCallback(async () => {
    try {
      setLoading(true)
      const data = await educatorApi.fetchMyChildren()
      setChildren(data)
    } catch (err) {
      console.error('Failed to load children:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadChildren()
  }, [loadChildren])

  const openAdd = () => {
    setEditing(null)
    setFormData({ name: '', yob: '' })
    setDialogOpen(true)
  }

  const openEdit = (child: Child) => {
    setEditing(child)
    setFormData({ name: child.name, yob: String(child.yob) })
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = { name: formData.name, yob: Number(formData.yob) }
      if (editing) {
        await educatorApi.updateChild(editing.id, payload)
      } else {
        await educatorApi.addChild(payload)
      }
      setDialogOpen(false)
      await loadChildren()
    } catch (err) {
      console.error('Failed to save child:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (child: Child) => {
    if (!window.confirm(`Remove "${child.name}" from your children?`)) return
    try {
      await educatorApi.deleteChild(child.id)
      await loadChildren()
    } catch (err) {
      console.error('Failed to delete child:', err)
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <p className='text-muted-foreground'>Loading children...</p>
      </div>
    )
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Children</h1>
          <p className='text-muted-foreground mt-1'>
            Manage children under your care.
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className='size-4' />
          Add Child
        </Button>
      </div>

      {children.length === 0 ? (
        <div className='text-center py-20 border rounded-lg'>
          <p className='text-muted-foreground mb-4'>No children added yet.</p>
          <Button onClick={openAdd}>
            <Plus className='size-4' />
            Add your first child
          </Button>
        </div>
      ) : (
        <div className='border rounded-lg'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Year of Birth</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {children.map(child => (
                <TableRow
                  key={child.id}
                  className='cursor-pointer'
                  onClick={() => navigate(`/dashboard/children/${child.id}`)}
                >
                  <TableCell className='font-medium'>{child.name}</TableCell>
                  <TableCell className='text-muted-foreground'>
                    {child.username}
                  </TableCell>
                  <TableCell>{child.yob}</TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-1'>
                      <Button
                        variant='ghost'
                        size='icon-sm'
                        onClick={e => {
                          e.stopPropagation()
                          openEdit(child)
                        }}
                      >
                        <Pencil className='size-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon-sm'
                        onClick={e => {
                          e.stopPropagation()
                          handleDelete(child)
                        }}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Child' : 'Add Child'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                value={formData.name}
                onChange={e =>
                  setFormData(f => ({ ...f, name: e.target.value }))
                }
                placeholder='Child name'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='yob'>Year of Birth</Label>
              <Input
                id='yob'
                type='number'
                value={formData.yob}
                onChange={e =>
                  setFormData(f => ({ ...f, yob: e.target.value }))
                }
                placeholder='e.g. 2015'
                min={1900}
                max={new Date().getFullYear()}
                required
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
                {submitting ? 'Saving...' : editing ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
