import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IoMdAdd } from 'react-icons/io';
import Logo from '../utils/vidtok-logo.png';
import useAuthStore from '../store/authStore';
import dynamic from 'next/dynamic';

const LoginModal = dynamic(() => import('./LoginModal'), { ssr: false });
const SignupModal = dynamic(() => import('./SignupModal'), { ssr: false });

const Navbar = () => {
  const { userProfile } = useAuthStore();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="w-full flex justify-between items-center py-2 px-4 sticky top-0 z-10 bg-transparent">
      {/* <div className="w-[150px] md:w-[180px] flex justify-start">
        <Link href="/">
          <Image src={Logo} alt="logo" layout="responsive" className="cursor-pointer" />
        </Link>
      </div> */}

      <div className="flex-1"></div>

      <div className="flex gap-5 md:gap-8 items-center">
        {userProfile ? (
          <>
            <Link href="/upload">
              <button className="border-2 px-2 md:px-4 text-md font-semibold flex items-center gap-2">
                <IoMdAdd className="text-xl" /> <span className="hidden md:block">Upload</span>
              </button>
            </Link>

            {/* {userProfile.image && (
              <Link href="/">
                <Image
                  width={40}
                  height={40}
                  src={userProfile.image}
                  alt="profile photo"
                  className="rounded-full cursor-pointer"
                />
              </Link>
            )} */}
          </>
        ) : (
          <button
            className="bg-[#FE2C55] text-white w-[75px] h-[40px] flex items-center justify-center rounded-full hover:bg-[#e0264b] transition"
            onClick={() => setShowLogin(true)}
          >
            Log in
          </button>
        )}
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true); }} />}
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }} />}
    </div>
  );
};

export default Navbar;
