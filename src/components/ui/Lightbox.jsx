import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { MdChevronLeft, MdChevronRight, MdClose } from 'react-icons/md'

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const Lightbox = ({ images, index, onClose, onIndexChange, labels }) => {
  const titleId = useId()
  const dialogRef = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const onIndexChangeRef = useRef(onIndexChange)
  onIndexChangeRef.current = onIndexChange

  const total = images.length
  const current = images[index]
  const canPrev = total > 1
  const canNext = total > 1

  useEffect(() => {
    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.querySelector(FOCUSABLE)?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onCloseRef.current?.()
        return
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        onIndexChangeRef.current?.((index - 1 + total) % total)
        return
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        onIndexChangeRef.current?.((index + 1) % total)
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = [...dialogRef.current.querySelectorAll(FOCUSABLE)]
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus?.()
    }
  }, [index, total])

  if (!current) return null

  const dialog = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-space-sm">
      <div className="absolute inset-0 bg-inverse-surface/80" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-5xl flex flex-col items-center gap-space-sm"
      >
        <p id={titleId} className="sr-only">
          {current.alt || `${labels.image} ${index + 1} / ${total}`}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-0 z-10 min-h-10 min-w-10 rounded-full bg-surface-container-lowest text-on-surface shadow-level-2"
          aria-label={labels.close}
        >
          <MdClose className="mx-auto text-title-md" aria-hidden="true" />
        </button>
        <div className="relative w-full flex items-center justify-center">
          {canPrev && (
            <button
              type="button"
              onClick={() => onIndexChange((index - 1 + total) % total)}
              className="absolute left-0 z-10 min-h-10 min-w-10 rounded-full bg-surface-container-lowest text-on-surface shadow-level-2"
              aria-label={labels.previous}
            >
              <MdChevronLeft className="mx-auto text-title-lg" aria-hidden="true" />
            </button>
          )}
          <img
            src={current.url}
            alt={current.alt || ''}
            className="max-h-[80vh] max-w-full object-contain rounded-base shadow-level-3"
          />
          {canNext && (
            <button
              type="button"
              onClick={() => onIndexChange((index + 1) % total)}
              className="absolute right-0 z-10 min-h-10 min-w-10 rounded-full bg-surface-container-lowest text-on-surface shadow-level-2"
              aria-label={labels.next}
            >
              <MdChevronRight className="mx-auto text-title-lg" aria-hidden="true" />
            </button>
          )}
        </div>
        <p className="text-label-md text-on-primary" aria-live="polite">
          {index + 1} / {total}
        </p>
      </div>
    </div>
  )

  return createPortal(dialog, document.body)
}

Lightbox.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      alt: PropTypes.string,
    })
  ).isRequired,
  index: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onIndexChange: PropTypes.func.isRequired,
  labels: PropTypes.shape({
    close: PropTypes.string.isRequired,
    previous: PropTypes.string.isRequired,
    next: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
}

export default Lightbox
