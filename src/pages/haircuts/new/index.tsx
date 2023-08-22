import Head from "next/head";
import { useState } from "react";

import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";

import { Sidebar } from "@/components/sidebar";

import { 
    Flex,
    Text,
    Heading,
    Button,
    Input
 } from "@chakra-ui/react";

import Link from "next/link";
import Router from "next/router";

import MediaQuerys from "@/utils/mediaQuery";

import { FiChevronLeft } from "react-icons/fi";

interface NewHaircutProps {
    count: number;
    subscription: boolean;
}

export default function NewHaircut({ count, subscription }: NewHaircutProps) {

    const isMobile = MediaQuerys();

    const [haircutName, setHaircutName] = useState("");
    const [haircutPrice, setHaircutPrice] = useState("");

    async function handleRegisterHaircut() {

        if( haircutName === "" || haircutPrice === "" ) {
            return;
        }

        try {
            const apiCLient = setupAPIClient();
            await apiCLient.post("/haircut", {
                name: haircutName,
                price: Number(haircutPrice)
            })

            Router.push("/haircuts");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Head>
                <title>BarberPLUS - Novo corte de cabelo</title>
            </Head>
            <Sidebar>
                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">
                    <Flex direction={isMobile ? "column" : "row"} w="100%" alignItems={isMobile ? "flex-start" : "center"} mb={isMobile ? 4 : 0}>
                        <Link href="/haircuts" legacyBehavior>
                           <Button mr={4} p={4} display="flex" alignItems="center" justifyContent="center" bg="button.dark" color="white" _hover={{ "bg": "button.black", "color": "gray" }}>
                                <FiChevronLeft size={24}/>
                                Voltar
                            </Button> 
                        </Link>
                        <Heading color="orange.900" my={4} mr={4} fontSize={isMobile ? "2xl" : "3xl"}>
                            Modelos de corte
                        </Heading>
                    </Flex>
                    <Flex maxW="700px" bg="barber.400" w="100%" direction="column" alignItems="center" justifyContent="center" py={8}>
                        <Heading mb={4} fontSize={isMobile ? "2xl" : "3xl"} color="white">Cadastrar modelo</Heading>
                        <Input color="white" value={haircutName} onChange={(e) => setHaircutName(e.target.value)} disabled={!subscription && count >= 3} mb={4} placeholder="Nome do corte" type="text" w="85%" bg="gray.900" size="lg"/>
                        <Input color="white" value={haircutPrice} onChange={(e) => setHaircutPrice(e.target.value)} disabled={!subscription && count >= 3} mb={4} placeholder="Valor do corte ex: R$ 25,00" type="number" w="85%" bg="gray.900" size="lg"/>
                        <Button isDisabled={!subscription && count >= 3} onClick={handleRegisterHaircut} w="85%" size="lg" color="gray.900" mb={6} bg="button.cta" _hover={{ bg: "#FFB13E" }}>Cadastrar</Button>
                        {!subscription && count >= 3 && (
                            <Flex direction="row" align="center" justifyContent="center">
                                <Text>
                                    Você atingiu o seu limite de cortes.
                                </Text>
                                <Link href="/planos">
                                    <Text fontWeight="bold" color="#31DB6A" ml={1}>
                                        Seja premium
                                    </Text>
                                </Link>
                            </Flex>
                        )}
                    </Flex>
                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    try {
        const apiClient = setupAPIClient(ctx);

        const response = await apiClient.get("/subscription/check");  
        const count = await apiClient.get("/haircuts/count");

        return {
            props: {
                subscription: response.data?.subscriptions?.status === "active" ? true : false,
                count: count.data
            }
        }
        
    } catch (error) {
        console.log(error);

        return {
            redirect: {
                destination: "/dashboard",
                permanent: false
            }
        }
    }
});