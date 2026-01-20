import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PostContent from './PostContent'

describe('PostContent', () => {
  it('renderiza título y contenido', () => {
    const post = { title: 'Mi viaje', content: 'Texto\n\nMás texto', forumId: 1 }
    render(
      <MemoryRouter>
        <PostContent post={post} />
      </MemoryRouter>
    )
    expect(screen.getByText('Mi viaje')).toBeInTheDocument()
    expect(screen.getByText('Texto')).toBeInTheDocument()
    expect(screen.getByText('Más texto')).toBeInTheDocument()
  })

  it('muestra información de vistas', () => {
    const post = { title: 'Test', content: 'Contenido', forumId: 1, viewCount: 100 }
    render(
      <MemoryRouter>
        <PostContent post={post} />
      </MemoryRouter>
    )
    expect(screen.getByText(/100 visitas/)).toBeInTheDocument()
  })

  it('tiene link para volver al foro', () => {
    const post = { title: 'Test', content: 'Contenido', forumId: 5 }
    render(
      <MemoryRouter>
        <PostContent post={post} />
      </MemoryRouter>
    )
    const link = screen.getByRole('link', { name: /volver al foro/i })
    expect(link).toHaveAttribute('href', '/forums/5')
  })

  it('muestra fecha desconocida cuando no hay fecha', () => {
    const post = { title: 'Test', content: 'Contenido', forumId: 1 }
    render(
      <MemoryRouter>
        <PostContent post={post} />
      </MemoryRouter>
    )
    expect(screen.getByText(/Fecha desconocida/i)).toBeInTheDocument()
  })

  it('muestra tags cuando existen', () => {
    const post = { 
      title: 'Test', 
      content: 'Contenido', 
      forumId: 1,
      tags: ['Europa', 'Aventura']
    }
    render(
      <MemoryRouter>
        <PostContent post={post} />
      </MemoryRouter>
    )
    expect(screen.getByText('Europa')).toBeInTheDocument()
    expect(screen.getByText('Aventura')).toBeInTheDocument()
  })
})
