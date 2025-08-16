import React, { useState } from 'react';
import Link from 'next/link';
import { AiFillHome, AiOutlineMenu } from 'react-icons/ai';
import { ImCancelCircle } from 'react-icons/im';
import Discover from './Discover';
import SuggestedAccounts from './SuggestedAccounts';
import Footer from './Footer';
import ViewCreator from './ViewCreator';
import useAuthStore from '../store/authStore';
import Image from 'next/image';
import { BiSearch } from 'react-icons/bi';
import { useRouter } from 'next/router';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '../utils/client';
import Logo from '../utils/vidtok-logo.png';

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  if (!source || typeof source === 'string') return source || '/default-image.jpg';
  return builder.image(source).url();
}

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const { userProfile } = useAuthStore();
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (searchValue) router.push(`/search/${searchValue}`);
  };

  return (
    <div>
      <div className="block cursor-pointer xl:hidden m-2 ml-7 mt-3 text-xl" onClick={() => setShowSidebar((prev) => !prev)}>
        {showSidebar ? <ImCancelCircle /> : <AiOutlineMenu />}
      </div>
      {showSidebar && (
        <div className="flex flex-col justify-start xl:w-400 w-20 p-3 border-r-2 border-gray-100 z-0">
          <div className="w-32 h-12 relative"> {/* width 32, height 12 (adjust as needed) */}
            <Link href="/">
              <Image
                src={Logo}
                alt="logo"
                layout="fill"  // fill the parent container
                objectFit="contain"
                className="cursor-pointer"
              />
            </Link>
          </div>
          <div className="bg-blue relative hidden md:block">
            <form onSubmit={handleSearch} className="md:static bg-white flex items-center">
              <button onClick={handleSearch} className="ml-3 text-2xl text-gray-400">
                <BiSearch />
              </button>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search"
                className="bg-primary p-3 md:text-md font-medium border-2 border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 w-[150px] md:w-[175px] rounded-full"
              />
            </form>
          </div>

          <Link href="/">
            <div className='flex items-center gap-3 hover:bg-primary px-3 pb-4 justify-center xl:justify-start cursor-pointer font-semibold text-[#fe2c55] rounded'>
              <p className="font-bold text-2xl xl:text-md">
                <AiFillHome />
              </p>
              <span className="text-md hidden xl:block -ml-[3px]">For You</span>
            </div>
          </Link>

          {userProfile && (
            <Link href={`/profile/${userProfile._id}`}>
              <div className='flex items-center justify-center xl:justify-start gap-3 hover:bg-primary px-3 pb-3 cursor-pointer font-semibold rounded'>
                <div className="relative w-6 h-6 rounded-full overflow-hidden">
                  <Image 
                    src={urlFor(userProfile.image)} 
                    alt="profile" 
                    fill 
                    className="object-cover rounded-full" 
                  />
                </div>
                <span className="text-md hidden xl:block -ml-[3px]">Profile</span>
              </div>
            </Link>
          )}

          <Discover />
          <SuggestedAccounts />
          <ViewCreator />
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
