import axios from 'axios';
import VideoCard from '../components/VideoCard';
import NoResults from '../components/NoResults';
import { Video } from '../types';
import { BASE_URL } from '../utils';
import { useEffect } from 'react';
import useAuthStore from '../store/authStore';

interface IProps {
  videos: Video[];
}

const Home = ({ videos }: IProps) => {
  const userProfile = useAuthStore((state) => state.userProfile);

  // Optional: redirect if not logged in
  // useEffect(() => {
  //   if (!userProfile) router.push('/login');
  // }, [userProfile]);

  return (
    <div className="flex flex-col gap-10 videos">
      {videos.length ? (
        videos.map((video: Video) => <VideoCard post={video} key={video._id} />)
      ) : (
        <NoResults text="No Videos" />
      )}
    </div>
  );
};

export const getServerSideProps = async ({ query: { topic } }: { query: { topic: string } }) => {
  const response = topic
    ? await axios.get(`${BASE_URL}/api/discover/${topic}`)
    : await axios.get(`${BASE_URL}/api/post`);

  return {
    props: {
      videos: response.data,
    },
  };
};

export default Home;
