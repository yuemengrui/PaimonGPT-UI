import React from 'react';

const ChatButton = ({children, ...props}) => {

    return (
        <div
            className='bg-gray-50 border rounded-lg border-gray-100 shadow-[0_0_1px_1px_rgba(0,0,0,0.1)] px-0.5 py-0.5 hover:bg-orange-50 hover:text-red-400' {...props}>
            {children}
        </div>
    );
};

export default ChatButton;
