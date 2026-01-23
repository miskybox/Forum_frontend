import React, { useState, useEffect } from 'react'
import followService from '../../services/followService'
import FollowModal from './FollowModal'

const ProfileStats = ({ userId }) => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTab, setModalTab] = useState('followers')

  useEffect(() => {
    if (userId) {
      loadStats()
    }
  }, [userId])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await followService.getFollowStats(userId)
      setStats(data)
    } catch (err) {
      console.error('Error loading stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (tab) => {
    setModalTab(tab)
    setModalOpen(true)
  }

  if (loading) {
    return (
      <div className="flex gap-6 animate-pulse">
        <div className="text-center">
          <div className="h-6 w-12 bg-beige-dark rounded mb-1 mx-auto"></div>
          <div className="h-4 w-16 bg-beige-dark rounded"></div>
        </div>
        <div className="text-center">
          <div className="h-6 w-12 bg-beige-dark rounded mb-1 mx-auto"></div>
          <div className="h-4 w-16 bg-beige-dark rounded"></div>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <>
      <div className="flex gap-6">
        <button
          onClick={() => openModal('followers')}
          className="text-center hover:opacity-80 transition-opacity"
        >
          <span className="block text-xl font-bold text-forest">
            {stats.followersCount || 0}
          </span>
          <span className="text-sm text-forest/70">Seguidores</span>
        </button>
        <button
          onClick={() => openModal('following')}
          className="text-center hover:opacity-80 transition-opacity"
        >
          <span className="block text-xl font-bold text-forest">
            {stats.followingCount || 0}
          </span>
          <span className="text-sm text-forest/70">Siguiendo</span>
        </button>
      </div>

      {stats.isFollowingMe && (
        <span className="inline-block mt-2 px-2 py-0.5 bg-aqua text-teal text-xs rounded-full">
          Te sigue
        </span>
      )}

      <FollowModal
        userId={userId}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialTab={modalTab}
        stats={stats}
      />
    </>
  )
}

export default ProfileStats
