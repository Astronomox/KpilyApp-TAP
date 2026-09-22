'use client'

import Link from 'next/link'
import { use, useState, useEffect } from 'react'
import { getTask, getSession, addComment, type Task, type Comment } from '@/lib/api'
import '@/styles/Dashboard.css'

interface TaskDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = use(params)
  const [task, setTask] = useState<Task | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const session = getSession()

  useEffect(() => {
    getTask(session?.token, id)
      .then(setTask)
      .catch(() => {})
  }, [id, session?.token])

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim() || !session?.token) return

    try {
      const comment = await addComment(session.token, {
        taskId: id,
        content: newComment
      })
      setComments([...comments, comment])
      setNewComment('')
    } catch (err) {
      console.error('Failed to add comment:', err)
    }
  }

  if (!task) {
    return (
      <div className="app-shell">
        <div className="app-main">
          <header className="app-topbar">
            <div className="topbar-title">
              <Link href="/tasks">← Back to Tasks</Link>
            </div>
          </header>
          <main className="dashboard-content">
            <p>Loading...</p>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <div className="app-main">
        <header className="app-topbar">
          <div className="topbar-title">
            <Link href="/tasks">← Back to Tasks</Link>
          </div>
        </header>
        <main className="dashboard-content">
          <div className="content-grid">
            <section className="surface">
              <div className="task-detail">
                <div className="task-detail-header">
                  <div>
                    <h1>{task.name}</h1>
                    <p className="task-detail-meta">
                      Assigned to: <strong>{task.assignee}</strong>
                    </p>
                  </div>
                  <span
                    className={`task-status ${task.status
                      .toLowerCase()
                      .replace(' ', '-')}`}
                  >
                    {task.status}
                  </span>
                </div>

                <div className="task-detail-body">
                  <h3>Description</h3>
                  <p>{task.description}</p>

                  <div className="task-details-grid">
                    <div>
                      <strong>Priority</strong>
                      <p>{task.priority}</p>
                    </div>
                    <div>
                      <strong>Reward</strong>
                      <p>{task.reward} XP</p>
                    </div>
                    <div>
                      <strong>Goal</strong>
                      <p>{task.goal}</p>
                    </div>
                    <div>
                      <strong>Due Date</strong>
                      <p>{task.dueDate}</p>
                    </div>
                    <div>
                      <strong>KPI</strong>
                      <p>{task.kpi}%</p>
                    </div>
                    <div>
                      <strong>Comments</strong>
                      <p>{task.comments}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="surface">
              <h3>Comments</h3>
              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <p>{comment.content}</p>
                    <span className="comment-date">{comment.createdAt}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddComment} className="comment-form">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                />
                <button type="submit" className="primary-action">
                  Add Comment
                </button>
              </form>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
