import React, { useState } from 'react'
import FollowList from './FollowList'

const FollowModal = ({ userId, isOpen, onClose, initialTab = 'followers', stats }) => {
  const [activeTab, setActiveTab] = useState(initialTab)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-beige-dark">
          <h2 className="text-lg font-bold text-forest">
            {activeTab === 'followers' ? 'Seguidores' : 'Siguiendo'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-beige rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-beige-dark">
          <button
            onClick={() => setActiveTab('followers')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'followers'
                ? 'text-teal border-b-2 border-teal'
                : 'text-forest/60 hover:text-forest'
            }`}
          >
            Seguidores
            {stats?.followersCount > 0 && (
              <span className="ml-1 text-sm">({stats.followersCount})</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'following'
                ? 'text-teal border-b-2 border-teal'
                : 'text-forest/60 hover:text-forest'
            }`}
          >
            Siguiendo
            {stats?.followingCount > 0 && (
              <span className="ml-1 text-sm">({stats.followingCount})</span>
            )}
          </button>
        </div>

        {/* Content */}
        <FollowList userId={userId} type={activeTab} onClose={onClose} />
      </div>
    </div>
  )
}

export default FollowModal
