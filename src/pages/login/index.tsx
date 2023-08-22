import { useState, useContext } from "react";

import { AuthContext } from "@/context/AuthContext";

import { canSSRGuest } from "@/utils/canSSRGuest";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import Logo from "../../../public/img/logoBarberPlus.svg";

import { Flex, Text, Center, Input, InputGroup, InputRightElement, Button} from "@chakra-ui/react";

export default function Login() {

    const { signIn } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false)
    const handleClick = () => setShowPassword(!showPassword)

    async function handleLogin() {

        if(email === "" || password === ""){
            return;
        }

        await signIn({
            email, 
            password
        });
    }

  return (
    <>
    <Head>
      <title>BarberPlus - Faça login para acessar</title>
    </Head>
      <Flex 
        background="barber.900" 
        height="100vh" 
        alignItems="center" 
        justifyContent="center"
        >
        <Flex width={640} direction="column" p={14} rounded={8}>
            <Center p={4}>
                <Image
                    alt="BarberPlus" 
                    src={Logo}
                    width={240}
                    quality={100}
                    objectFit="fill"
                    />
            </Center>

            <Input
                background="barber.400"
                color="white"
                placeholder="email@email.com"
                variant="filled"
                size="lg"
                type="email"
                mb={3}
                _hover={{
                    bg: "#27283a"
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <InputGroup mb={3}>
                <Input
                    background="barber.400"
                    color="white"
                    placeholder="************"
                    variant="filled"
                    size="lg"
                    type={showPassword ? "text" : "password"}
                    mb={3}
                    _hover={{
                        bg: "#27283a"
                    }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement 
                    width='4.5rem'
                    pr={2}
                    >
                    <Button 
                        h='1.75rem' 
                        size='sm' 
                        onClick={handleClick}
                        >
                        {showPassword ? 'Esconder' : 'Mostrar'}
                    </Button>
                </InputRightElement>
            </InputGroup>

            <Button
                backgroundColor="button.cta"
                color="gray.900"
                size="lg"
                mb={3}
                _hover={{
                    bg: "#ffb13e"
                }}
                onClick={handleLogin}
            >
                Acessar
            </Button>

            <Center mt={2}>
                <Link href="/register">
                    <Text cursor="pointer" color="white">Ainda não possui conta? <strong>Cadastre-se</strong></Text>
                </Link>
            </Center>

        </Flex>
      </Flex>
    </>
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
    return {
        props: {}
    }
})