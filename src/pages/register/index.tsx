import { useContext, useState } from "react"

import Head from "next/head"
import Image from "next/image"
import Link from "next/link"

import { AuthContext } from "@/context/AuthContext";

import { canSSRGuest } from "@/utils/canSSRGuest";

import Logo from "../../../public/img/logoBarberPlus.svg" 

import { Flex, Text, Center, Input, InputGroup, InputRightElement, Button} from "@chakra-ui/react"

export default function Register() {

  const { signUp } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const handleClick = () => setShowPassword(!showPassword);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    if(name === "" && email === "" && password === ""){
        return;
    }

    await signUp({
        name: name,
        email: email,
        password: password
    });
  }

  return (
    <>
    <Head>
      <title>BarberPlus - Crie sua conta no Barber PLUS</title>
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
                placeholder="Nome da barbearia"
                variant="filled"
                size="lg"
                type="text"
                mb={3}
                _hover={{
                    bg: "#27283a"
                }}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

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
                onClick={handleRegister}
            >
                Cadastrar
            </Button>

            <Center mt={2}>
                <Link href="/login">
                    <Text cursor="pointer" color="white">Já possui uma conta? <strong>Faça o login</strong></Text>
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