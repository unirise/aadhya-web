import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { educatorApi } from '@/services/educatorApi'

interface ChildData {
  id: string
  name: string
  username: string
  yob: number
  role: string
}

export default function ChildProfile() {
  const { childId } = useParams<{ childId: string }>()
  const navigate = useNavigate()
  const [child, setChild] = useState<ChildData | null>(null)
  const [intelligences, setIntelligences] = useState<Record<
    string,
    number
  > | null>(null)
  const [responses, setResponses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!childId) return

    const load = async () => {
      try {
        const [childData, intelligenceData, responsesData] =
          await Promise.allSettled([
            educatorApi.fetchChildById(childId),
            educatorApi.fetchChildIntelligences(childId),
            educatorApi.fetchChildResponses(childId),
          ])

        if (childData.status === 'fulfilled') {
          setChild(childData.value)
        }
        if (intelligenceData.status === 'fulfilled') {
          setIntelligences(intelligenceData.value)
        }
        if (responsesData.status === 'fulfilled') {
          setResponses(
            Array.isArray(responsesData.value) ? responsesData.value : []
          )
        }
      } catch (err) {
        console.error('Failed to load child profile:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [childId])

  if (loading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <p className='text-muted-foreground'>Loading profile...</p>
      </div>
    )
  }

  if (!child) {
    return (
      <div className='text-center py-20'>
        <p className='text-muted-foreground'>Child not found.</p>
        <Button
          variant='outline'
          className='mt-4'
          onClick={() => navigate('/dashboard/children')}
        >
          Back to Children
        </Button>
      </div>
    )
  }

  const intelligenceEntries = intelligences
    ? Object.entries(intelligences).filter(
        ([key]) => key !== 'id' && key !== 'personId'
      )
    : []

  return (
    <div>
      {/* Back button + heading */}
      <div className='flex items-center gap-4 mb-6'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => navigate('/dashboard/children')}
        >
          <ArrowLeft className='size-4' />
        </Button>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>{child.name}</h1>
          <p className='text-muted-foreground'>
            @{child.username} &middot; Born {child.yob}
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Total Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>{responses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Domains Explored
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>
              {intelligenceEntries.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Age
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>
              {new Date().getFullYear() - child.yob}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Intelligence scores */}
      {intelligenceEntries.length > 0 && (
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle className='text-lg'>Intelligence Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {intelligenceEntries.map(([domain, score]) => (
                <div
                  key={domain}
                  className='flex items-center justify-between rounded-md border p-3'
                >
                  <span className='text-sm font-medium capitalize'>
                    {domain.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <Badge variant='secondary'>
                    {typeof score === 'number'
                      ? score.toFixed(1)
                      : String(score)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent responses */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Recent Responses</CardTitle>
        </CardHeader>
        <CardContent>
          {responses.length === 0 ? (
            <p className='text-sm text-muted-foreground'>
              No responses recorded yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Attribute</TableHead>
                  <TableHead>Score Change</TableHead>
                  <TableHead>New Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {responses.slice(0, 20).map((response: any) => (
                  <TableRow key={response.id}>
                    <TableCell className='capitalize'>
                      {response.domain || '-'}
                    </TableCell>
                    <TableCell className='capitalize'>
                      {response.attribute || '-'}
                    </TableCell>
                    <TableCell>
                      {response.scoreChange !== null &&
                      response.scoreChange !== undefined ? (
                        <span
                          className={
                            response.scoreChange > 0
                              ? 'text-green-600'
                              : response.scoreChange < 0
                                ? 'text-red-600'
                                : ''
                          }
                        >
                          {response.scoreChange > 0 ? '+' : ''}
                          {response.scoreChange.toFixed(2)}
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {response.newScore !== null &&
                      response.newScore !== undefined
                        ? response.newScore.toFixed(1)
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
