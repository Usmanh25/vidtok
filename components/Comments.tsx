import React, { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GoVerified } from 'react-icons/go';
import useAuthStore from '../store/authStore';
import NoResults from './NoResults';
import { IUser } from '../types';
import { urlFor } from '../utils/imageUrl'; // make sure this helper exists

interface IProps {
  isPostingComment: boolean;
  comment: string;
  setComment: Dispatch<SetStateAction<string>>;
  addComment: (e: React.FormEvent) => void;
  comments: IComment[];
}

interface IComment {
  comment: string;
  length?: number;
  _key: string;
  postedBy: { _ref?: string; _id?: string };
}

const Comments = ({ comment, setComment, addComment, comments, isPostingComment }: IProps) => {
  const { userProfile, allUsers } = useAuthStore();

  return (
    <div className='border-t-2 border-gray-200 pt-4 px-10 mt-4 bg-[#F8F8F8] border-b-2 lg:pb-0 pb-[100px]'>
      <div className='overflow-scroll lg:h-[457px]'>
        {comments?.length ? (
          comments.map((item) => (
            <React.Fragment key={item._key}>
              {allUsers.map(
                (user: IUser) =>
                  user._id === (item.postedBy._id || item.postedBy._ref) && (
                    <div className='p-2 items-center' key={user._id}>
                      <Link
                        href={`/profile/${user._id}`}
                        className='flex items-start gap-3'
                      >
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            position: 'relative',
                            cursor: 'pointer'
                          }}
                        >
                          <Image
                            src={urlFor(user.image) || '/default-image.jpg'}
                            alt='user-profile'
                            fill
                            className='rounded-full object-cover'
                          />
                        </div>
                        <div className='xl:block cursor-pointer'>
                          <p className='flex gap-1 items-center text-md font-bold text-primary lowercase'>
                            {user?.username ? user.username.replaceAll(' ', '') : 'unknown'}
                            <GoVerified className='text-blue-400' />
                          </p>
                        </div>
                      </Link>
                      <div>
                        <p>{item.comment}</p>
                      </div>
                    </div>
                  )
              )}
            </React.Fragment>
          ))
        ) : (
          <NoResults text='No Comments Yet! Add One!' />
        )}
      </div>

      <div>
        {userProfile && (
          <div className='absolute bottom-0 left-0 pb-6 px-2 md:px-10'>
            <form onSubmit={addComment} className='flex gap-4'>
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className='bg-primary px-6 py-4 text-md font-medium border-2 w-[250px] md:w-[700px] lg:w-[350px] border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 flex-1 rounded-lg'
                placeholder='Add comment..'
              />
              <button type="submit" className='text-md text-gray-400'>
                {isPostingComment ? 'Commenting...' : 'Comment'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
