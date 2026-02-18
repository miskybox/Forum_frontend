import { useState } from 'react'
import PropTypes from 'prop-types'
import messageService from '../../services/messageService'
import { toast } from 'react-hot-toast'

/**
 * Formulario para enviar mensajes privados a un usuario
 * @param {Object} props
 * @param {number} props.toId - ID del destinatario
 */
const SendPrivateMessageForm = ({ toId }) => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return toast.error('El mensaje no puede estar vacío')
    setLoading(true)
    try {
      await messageService.sendMessage(toId, content)
      toast.success('Mensaje enviado')
      setContent('')
    } catch (error) {
      console.error('Error al enviar mensaje:', error)
      toast.error('Error al enviar el mensaje')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        className="input w-full"
        rows={3}
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Escribe tu mensaje..."
        disabled={loading}
      />
      <button
        type="submit"
        className="btn bg-golden text-midnight px-4 py-2 rounded font-bold"
        disabled={loading}
      >
        {loading ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  )
}

SendPrivateMessageForm.propTypes = {
  toId: PropTypes.number.isRequired
}

export default SendPrivateMessageForm
