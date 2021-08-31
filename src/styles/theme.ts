import { extendTheme, Theme } from '@chakra-ui/react';

export const theme = extendTheme<Theme>({
    colors: {
        gray: {            
            "900": "#2D2D2D",
        },
        yellow: {
          "900": "#F8C33B"
        }
    },
    fonts: {
      heading: 'Poppins',
      body: 'Poppins'  
    },
    styles: {
        global: {
            body: {
                bg: 'white.900',
                color: 'gray.50'
            }
        }
    }
})