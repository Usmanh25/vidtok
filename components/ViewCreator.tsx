import React from 'react';
import { BsLinkedin } from 'react-icons/bs';
import { FaAngellist, FaGithub } from 'react-icons/fa';

const ViewCreator = () => {
  return (
    <div className="pb-4">
      <p className="text-gray-500 text-sm font-semibold m-3 mt-4 hidden xl:block">
        View the creator
      </p>
      <div className="flex flex-col items-center xl:ml-8 xl:flex-row xl:items-start gap-4">
        <div className="flex justify-center items-center">
          <a
            className="hover:text-[#fe2c55]"
            href="https://www.linkedin.com/in/usman-hameed-5486b11b0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsLinkedin size={26} />
          </a>
        </div>
        {/* Uncomment if needed
        <div className="flex justify-center items-center">
          <a
            className="hover:text-[#fe2c55]"
            href="https://angel.co/u/usman-hameed-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaAngellist size={26} />
          </a>
        </div>
        */}
        <div className="flex justify-center items-center">
          <a
            className="hover:text-[#fe2c55]"
            href="https://github.com/Usmanh25"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub size={26} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ViewCreator;
