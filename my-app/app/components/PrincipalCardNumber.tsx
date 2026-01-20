import React from 'react'

interface props
{
    phrase : string,
    value : number,
    color: string
}

export const PrincipalCardNumber = ({phrase, value, color}: props) => {
  return (
    <div className='border-[#DEDEDE] dark:border-[#4A4A4A] border p-6 w-100 rounded-4xl transition-all duration-300'>
        <div className='flex items-center gap-2 '>
            <div className={`w-3 h-3 rounded-4xl ${color}`}></div>
            <p className='text-[#919191] dark:text-white'>{phrase}</p>
        </div>
        <span className='text-6xl dark:text-[#86A1FB] mt-4'>{value}</span>

    </div>
    
  )
}
