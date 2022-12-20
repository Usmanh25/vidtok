import React from 'react';
import { BsLinkedin } from 'react-icons/bs';
import { FaAngellist, FaGithub } from 'react-icons/fa';

const ViewCreator = () => {

  return (
    <div className='xl:border-b-2 border-gray-200 pb-4'>

        <p className='text-gray-500 text-sm font-semibold m-3 mt-4 hidden xl:block'>
            View the creator
        </p>
        <div className='flex'>
            <div className='px-4'>
                <a className='gap-1 items-center hover:text-[#fe2c55]' href="https://www.linkedin.com/in/usman-hameed-5486b11b0/" target="_blank"><BsLinkedin size={26}/></a>
            </div>
            <div className='px-4'>
                <a className='gap-1 items-center hover:text-[#fe2c55]' href="https://angel.co/u/usman-hameed-2" target="_blank"><FaAngellist size={26}/></a>
            </div>
            <div className='px-4'>
                <a className='gap-1 items-center hover:text-[#fe2c55]' href="https://github.com/Usmanh25" target="_blank"><FaGithub size={26}/></a>
            </div>
        </div>

    </div>
  )
}

export default ViewCreator