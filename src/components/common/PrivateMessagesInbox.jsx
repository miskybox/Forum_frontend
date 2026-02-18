import { useEffect, useState } from 'react'
import messageService from '../../services/messageService'
import { toast } from 'react-hot-toast'

const PrivateMessagesInbox = () => {
  const [inbox, setInbox] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const data = await messageService.getInbox()
        setInbox(data)
      } catch (error) {
        console.error('Error al cargar mensajes:', error)
        toast.error('Error al cargar mensajes')
      } finally {
        setLoading(false)
      }
    }
    fetchInbox()
  }, [])

  if (loading) return <div>Cargando mensajes...</div>
  if (!inbox.length) return <div>No tienes mensajes privados.</div>

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-ocean-500 mb-4">Mensajes recibidos</h2>
      {inbox.map(msg => (
        <div key={msg.id} className="p-4 border rounded bg-white/80">
          <div className="font-semibold">De: {msg.sender?.username || 'Desconocido'}</div>
          <div className="text-sm text-gray-600">{new Date(msg.timestamp || msg.createdAt).toLocaleString()}</div>
          <div className="mt-2">{msg.content}</div>
        </div>
      ))}
    </div>
  )
}

export default PrivateMessagesInbox
