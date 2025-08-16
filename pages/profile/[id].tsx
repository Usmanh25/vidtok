import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { GoVerified } from 'react-icons/go';
import VideoCard from '../../components/VideoCard';
import NoResults from '../../components/NoResults';
import { IUser, Video } from '../../types';
import { BASE_URL } from '../../utils';
import useAuthStore from '../../store/authStore';
import { useRouter } from 'next/router';

import imageUrlBuilder from '@sanity/image-url';
import { client } from '../../utils/client';
import { FaCamera } from 'react-icons/fa';

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  if (!source || typeof source === 'string') {
    return source || '/default-image.jpg';
  }
  return builder.image(source).url();
}

interface Props {
  data: {
    user: IUser;
    userVideos: Video[];
    userLikedVideos: Video[];
  } | null;
}

const Profile = ({ data }: Props) => {
  const router = useRouter();

  // If no data is passed, show a fallback message
  if (!data) {
    return (
      <div className="w-full flex items-center justify-center py-20 text-lg font-semibold">
        User not found
      </div>
    );
  }

  const { user, userVideos, userLikedVideos } = data;

  const userProfile = useAuthStore((state) => state.userProfile);
  const [viewedUser, setViewedUser] = useState<IUser>(user);

  const [showUserVideos, setShowUserVideos] = useState(true);
  const [videosList, setVideosList] = useState<Video[]>([]);
  const videosRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const isOwnProfile = userProfile?._id === viewedUser._id;

  const videosTabClass = showUserVideos ? 'border-b-2 border-black' : 'text-gray-400';
  const likedTabClass = !showUserVideos ? 'border-b-2 border-black' : 'text-gray-400';

  useEffect(() => {
    setVideosList(showUserVideos ? userVideos : userLikedVideos);
  }, [showUserVideos, userVideos, userLikedVideos]);

  const fetchUserById = async (id: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/profile/${id}`);
      if (res.data.user) {
        setViewedUser(res.data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  useEffect(() => {
    if (router.query.id && typeof router.query.id === 'string') {
      fetchUserById(router.query.id);
    }
  }, [router.query.id]);

  useEffect(() => {
    if (viewedUser?.image) {
      setSelectedImage(urlFor(viewedUser.image));
    } else {
      setSelectedImage(null);
    }
  }, [viewedUser?.image]);

  const handleImageClick = () => {
    if (isOwnProfile) {
      fileInputRef.current?.click();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOwnProfile) return;
    const file = e.target.files?.[0];
    if (!file || !userProfile?._id) return;

    const previewURL = URL.createObjectURL(file);
    setSelectedImage(previewURL);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('userId', userProfile._id);

    try {
      await axios.post(`${BASE_URL}/api/profile/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      await fetchUserById(userProfile._id);
    } catch (error) {
      console.error('Image upload failed', error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-6 md:gap-10 mb-4 bg-white w-full items-center">
        <div
          className={`w-16 h-16 md:w-32 md:h-32 relative rounded-full overflow-hidden ${isOwnProfile ? 'cursor-pointer group' : ''}`}
          onClick={handleImageClick}
        >
          <Image
            src={selectedImage || '/default-image.jpg'}
            alt="user-profile"
            fill
            className="object-cover rounded-full"
            sizes="(max-width: 768px) 64px, 128px"
            priority
          />
          {isOwnProfile && (
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none group-hover:pointer-events-auto">
              <FaCamera className="text-white text-xl" />
            </div>
          )}
          {isOwnProfile && (
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          )}
        </div>

        <div className="flex flex-col justify-center">
          <p className="md:text-2xl tracking-wider flex gap-1 items-center justify-center text-md font-bold text-primary lowercase">
            @{viewedUser.username}
            <GoVerified className="text-blue-400" />
          </p>
          <p className="capitalize md:text-xl text-gray-400">{viewedUser.username}</p>
        </div>
      </div>

      <div>
        <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
          <p
            className={`text-xl font-semibold cursor-pointer mt-2 ${videosTabClass}`}
            onClick={() => setShowUserVideos(true)}
          >
            Videos
          </p>
          <p
            className={`text-xl font-semibold cursor-pointer mt-2 ${likedTabClass}`}
            onClick={() => setShowUserVideos(false)}
          >
            Liked
          </p>
        </div>

        <div className="flex gap-6 flex-wrap md:justify-start" ref={videosRef}>
          {videosList.length > 0 ? (
            videosList.map((post: Video, idx: number) => <VideoCard post={post} key={idx} />)
          ) : (
            <NoResults text={`No ${showUserVideos ? '' : 'Liked'} Videos Yet`} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

export async function getServerSideProps({ params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${BASE_URL}/api/profile/${params.id}`);
    const data = await res.json();

    if (!data || !data.user) {
      return { props: { data: null } };
    }

    return { props: { data } };
  } catch (error) {
    console.error('Profile fetch failed:', error);
    return { props: { data: null } };
  }
}
