import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { topics } from '../utils/constants'
import useAuthStore from '../store/authStore'
import dynamic from 'next/dynamic'

const LoginModal = dynamic(() => import('./LoginModal'), { ssr: false })
const SignupModal = dynamic(() => import('./SignupModal'), { ssr: false })

const Discover = () => {
  const router = useRouter()
  const { topic } = router.query
  const { userProfile, logout } = useAuthStore()

  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  const activeTopicStyle = 'xl:border-2 hover:bg-primary xl:border-[#fe2c55] px-3 py-1 rounded flex items-center xl:font-semibold gap-2 xl:border-none justify-center cursor-pointer xl:justify-start text-[#fe2c55]'
  const topicStyle = 'xl:border-2 hover:bg-primary xl:border-none px-3 py-1 flex items-center xl:font-semibold gap-2 justify-center cursor-pointer text-black xl:justify-start'

  return (
    <div className='relative'>
      {/* <p className='text-gray-500 text-sm font-semibold m-3 mt-4 hidden xl:block'>
        Popular Topics
      </p> */}
      <div className='flex-col flex gap-3 flex-wrap mb-4'>
        {topics.map((item) => (
          <Link href={`/?topic=${item.name}`} key={item.name}>
            <div className={topic === item.name ? activeTopicStyle : topicStyle}>
              <span className='font-bold text-2xl xl:text-md'>{item.icon}</span>
              <span className='font-medium text-md hidden xl:block capitalize'>{item.name}</span>
            </div>
          </Link>
        ))}
      </div>

      {!userProfile ? (
        <button 
          className="bg-[#FE2C55] text-white w-[210px] h-[40px] rounded-lg hover:bg-[#e0264b] transition"
          onClick={() => setShowLogin(true)}
        >
          Log in
        </button>
      ) : (
        <button
          className="bg-[#FE2C55] text-white w-[210px] h-[40px] rounded-lg hover:bg-[#e0264b] transition" 
          onClick={async () => {
            await logout();      // clear userProfile
            router.push('/');    // redirect to home page
          }}
        >
          Log out
        </button>
      )}


      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToSignup={() => {
            setShowLogin(false)
            setShowSignup(true)
          }}
        />
      )}

      {showSignup && (
        <SignupModal
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => {
            setShowSignup(false)
            setShowLogin(true)
          }}
        />
      )}
      
    </div>
  )
}

export default Discover
