import Head from 'next/head';
import { useRouter } from 'next/dist/client/router';
import { Box, Flex, IconButton, Image, Stack, Text, useBreakpointValue } from '@chakra-ui/react';
import { RiAccountCircleFill } from 'react-icons/ri';
import MButton from '../components/Button';

export default function Home() {
  const router = useRouter();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  })

  return (
    <>
       <Head>
        <title> MEIUP</title>
      </Head>
      
      <Stack>
        <Flex as="header" p="2">
            <Box>
                <Image src="/logo_header.png" alt="Logo MEIUP" />
            </Box>

            { isWideVersion && (
              <Box ml="auto" alignSelf="center">
                <MButton handleClick={(event) => {
                      event.preventDefault();
                      router.push('/login')
                }}>Entrar</MButton>
             </Box>  
            )}

          { !isWideVersion && (
              <Box ml="auto" alignSelf="center">
                <IconButton  
                  variant="outline" 
                  colorScheme="blackAlpha" 
                  aria-label="Login" 
                  icon={<RiAccountCircleFill />} 
                  onClick={() => router.push('/login')}
                />
             </Box>  
            )}
                
        </Flex> 
            <Stack bg="gray.900" align="center" height="20rem" justify="center">
                <Text align="center" fontSize="36px" color="white"> Gerencie seu negócio</Text>
             
                <Text fontSize="30px" color="yellow.900">com facilidade</Text>

            </Stack>

        
      </Stack>   
   </>
  )
}
