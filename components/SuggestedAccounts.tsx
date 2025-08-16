import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GoVerified } from 'react-icons/go';
import useAuthStore from '../store/authStore';
import { IUser } from '../types';
import { urlFor } from '../utils/imageUrl';

const SuggestedAccounts = () => {
  const { fetchAllUsers, allUsers } = useAuthStore();

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  return (
    <div className='pb-4'>
      <p className='text-gray-500 text-sm font-semibold m-3 mt-4 hidden xl:block'>
        Suggested accounts
      </p>
      <div>
        {Array.isArray(allUsers) &&
          allUsers.slice(4, 10).reverse().map((user: IUser) => (
            <Link
              href={`/profile/${user._id}`}
              key={user._id}
              className='flex gap-3 hover:bg-primary p-2 cursor-pointer font-semibold rounded'
            >
              <div style={{ width: 34, height: 34, position: 'relative' }}>
                <Image
                  src={urlFor(user.image) || '/default-image.jpg'}
                  alt='user-profile'
                  fill
                  className='rounded-full object-cover'
                />
              </div>

              <div className='hidden xl:block'>
                <p className='flex gap-1 items-center text-md font-bold text-primary lowercase'>
                  {user.username}
                  <GoVerified className='text-blue-400' />
                </p>
                <p className='text-gray-400 text-xs'>
                  @{user.username}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default SuggestedAccounts;
