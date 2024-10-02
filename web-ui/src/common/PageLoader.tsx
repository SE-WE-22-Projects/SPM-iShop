import React from 'react'
import { DNA } from 'react-loader-spinner'

const PageLoader = () => {
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',backgroundColor: 'rgba(255, 255, 255, 0.3)'}}>
        <DNA 
            visible={true}
            height="600"
            width="600"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
        />
    </div>
  )
}

export default PageLoader