'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Todo {
  id: number
  text: string
  completed: boolean
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('lessonbank_todos')
    if (saved) setTodos(JSON.parse(saved))
  }, [])

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('lessonbank_todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      completed: false
    }
    setTodos([newTodo, ...todos])
    setInput('')
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(t => t.id !== id))
  }

  return (
    <div className="todo-list card glass" style={{ padding: '30px' }}>
      <h2 style={{ marginBottom: '20px' }}>✅ قائمة المهام اليومية</h2>
      
      <form onSubmit={addTodo} style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <input 
          type="text" 
          className="input-field" 
          placeholder="ماذا ستنجز اليوم؟"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit" className="btn-glow" style={{ padding: '10px 24px' }}>إضافة</button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <AnimatePresence initial={false}>
          {todos.map(todo => (
            <motion.div 
              key={todo.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="glass"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 18px',
                borderRadius: 'var(--radius-md)',
                background: todo.completed ? 'rgba(0, 212, 170, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border)',
              }}
            >
              <input 
                type="checkbox" 
                checked={todo.completed} 
                onChange={() => toggleTodo(todo.id)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ 
                marginRight: '15px', 
                flex: 1, 
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                fontSize: '1rem'
              }}>
                {todo.text}
              </span>
              <button 
                onClick={() => deleteTodo(todo.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', opacity: 0.6 }}
              >
                🗑️
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {todos.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
            لا توجد مهام حالياً. ابدأ بإضافة مهمة جديدة! ✨
          </div>
        )}
      </div>
    </div>
  )
}
