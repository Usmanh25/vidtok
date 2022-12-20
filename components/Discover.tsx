import React from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {topics} from '../utils/constants'

const Discover = () => {
  const router = useRouter()
  const {topic} = router.query
  const activeTopicStyle = "xl:border-2 hover:bg-primary xl:border-[#fe2c55] px-3 py-1 rounded flex items-center xl:font-semibold gap-2 xl:border-none justify-center cursor-pointer xl:justify-start text-[#fe2c55]"
  const topicStyle = "xl:border-2 hover:bg-primary xl:border-none px-3 py-1 flex items-center xl:font-semibold gap-2 justify-center cursor-pointer text-black xl:justify-start"
  return (
    <div className='xl:border-b-2 xl:border-gray-200 pb-6'>
      <p className='text-gray-500 text-sm font-semibold m-3 mt-4 hidden xl:block'>
        Popular Topics
      </p>
      <div className='flex-col flex gap-3 flex-wrap'>
        {topics.map((item) => (
          <Link href={`/?topic=${item.name}`} key={item.name}>
            <div className={topic === item.name ? activeTopicStyle : topicStyle}>
              <span className='font-bold text-2xl xl:text-md'>
                {item.icon}
              </span>
              <span className='font-mdeium text-md hidden xl:block capitalize'>
                {item.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Discover