import React, { useState, useEffect, useRef } from 'react';
import { NextPage } from 'next';
import { Video } from '../types';
import Image from 'next/image';
import Link from 'next/link';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import { BsFillPlayFill, BsFillPauseFill } from 'react-icons/bs';
import { GoVerified } from 'react-icons/go';
import { urlFor } from '../utils/imageUrl';

interface IProps {
  post: Video;
}

const VideoCard: NextPage<IProps> = ({ post }) => {
  const [isHover, setIsHover] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onVideoPress = () => {
    if (playing) {
      videoRef?.current?.pause();
      setPlaying(false);
    } else {
      videoRef?.current?.play();
      setPlaying(true);
    }
  };

  useEffect(() => {
    if (videoRef?.current) videoRef.current.muted = isVideoMuted;
  }, [isVideoMuted]);

  return (
    <div className="flex flex-col border-b-2 border-gray-200 pb-6 z-20">
      <div className="flex gap-3 p-2 font-semibold rounded">
        <div className="md:w-16 md:h-16 w-10 h-10">
          <Link href={`/profile/${post.postedBy._id}`}>
            <Image
              width={62}
              height={62}
              src={urlFor(post.postedBy.image)}
              className="cursor-pointer rounded-full"
              alt="profile photo"
              layout="responsive"
            />
          </Link>
        </div>
        <div>
          <Link href={`/profile/${post.postedBy._id}`}>
            <div className="flex items-center gap-2 cursor-pointer">
              <p className="flex gap-2 items-center md:text-md font-bold text-primary">
                {post.postedBy.username} <GoVerified className="text-blue-400 text-md" />
              </p>
            </div>
          </Link>
        </div>
      </div>
      <div className="lg:ml-20 flex gap-4">
        <div
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className="relative rounded-3xl bg-gray-200"
        >
          <video
            loop
            ref={videoRef}
            src={post.video.asset.url}
            className="lg:w-[300px] h-[300px] md:h-[300px] lg:h-[528px] w-[170px] rounded-2xl cursor-pointer"
            onClick={onVideoPress} // Now clicking the video toggles play/pause
          />

          {isHover && (
            <div className="absolute bottom-6 left-8 md:left-8 lg:left-0 flex gap-10 lg:justify-between w-[100px] md:w-[150px] lg:w-[300px] p-3 z-10">
              {playing ? (
                <button onClick={onVideoPress}>
                  <BsFillPauseFill className="text-black text-2xl lg:text-4xl" />
                </button>
              ) : (
                <button onClick={onVideoPress}>
                  <BsFillPlayFill className="text-black text-2xl lg:text-4xl" />
                </button>
              )}
              {isVideoMuted ? (
                <button onClick={() => setIsVideoMuted(false)}>
                  <HiVolumeOff className="text-black text-2xl lg:text-4xl" />
                </button>
              ) : (
                <button onClick={() => setIsVideoMuted(true)}>
                  <HiVolumeUp className="text-black text-2xl lg:text-4xl" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* <div className="lg:ml-20 flex gap-4">
        <div
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className="rounded-3xl bg-gray-200"
        >
          <Link href={`/detail/${post._id}`}>
            <video
              loop
              ref={videoRef}
              src={post.video.asset.url}
              className="lg:w-[300px] h-[300px] md:h-[300px] lg:h-[528px] w-[170px] rounded-2xl cursor-pointer"
            />
          </Link>

          {isHover && (
            <div className="absolute bottom-6 cursor-pointer left-8 md:left-8 lg:left-0 flex gap-10 lg:justify-between w-[100px] md:w-[150px] lg:w-[300px] p-3">
              {playing ? (
                <button onClick={onVideoPress}>
                  <BsFillPauseFill className="text-black text-2xl lg:text-4xl" />
                </button>
              ) : (
                <button onClick={onVideoPress}>
                  <BsFillPlayFill className="text-black text-2xl lg:text-4xl" />
                </button>
              )}
              {isVideoMuted ? (
                <button onClick={() => setIsVideoMuted(false)}>
                  <HiVolumeOff className="text-black text-2xl lg:text-4xl" />
                </button>
              ) : (
                <button onClick={() => setIsVideoMuted(true)}>
                  <HiVolumeUp className="text-black text-2xl lg:text-4xl" />
                </button>
              )}
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default VideoCard;
