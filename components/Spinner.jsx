import React from 'react'
import { RingLoader } from 'react-spinners'

const Spinner = ({fullWidth}) => {
  if (fullWidth){
    return (
        <div className='w-full flex justify-center'>
          <RingLoader color={'#78350f'} speedMultiplier={2}/>
        </div>
    )
  }
  return (
    <RingLoader color={'#78350f'} speedMultiplier={2}/>
  )
}

export default Spinner