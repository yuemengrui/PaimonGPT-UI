import React from 'react';
import { Tooltip } from '@chakra-ui/react';


const MyTooltip = ({ children, shouldWrapChildren = true, ...props }) => {
    return (
        <Tooltip
            fontSize={12}
            bg={'white'}
            arrowShadowColor={'rgba(0,0,0,0.02)'}
            hasArrow
            arrowSize={12}
            offset={[-15, 15]}
            color={'gray.900'}
            px={3}
            py={2}
            borderRadius={'8px'}
            whiteSpace={'pre-wrap'}
            boxShadow={'2px 2px 10px rgba(0,0,0,0.2)'}
            shouldWrapChildren={shouldWrapChildren}
            {...props}
        >
            {children}
        </Tooltip>
    )
};

export default MyTooltip;
