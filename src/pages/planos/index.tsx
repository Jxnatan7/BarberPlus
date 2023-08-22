import Head from "next/head";

import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";

import { 
    Flex,
    Button,
    Text,
    Heading,
    UnorderedList,
    ListItem
} from "@chakra-ui/react";

import { Sidebar } from "@/components/sidebar";

import MediaQuerys from "@/utils/mediaQuery";

interface PlanosProps {
    premium: boolean | null;
}

export default function Planos({ premium }: PlanosProps) {

    const isMobile = MediaQuerys();

    return (
        <>
            <Head>
                <title>Escolha seu plano - BarberPLUS</title>
            </Head>
            <Sidebar>
                <Flex w="100%" direction="column" alignItems="flex-start" justifyContent="flex-start">
                    <Heading fontSize="3xl" my={4} mr={4}>
                        Planos
                    </Heading>
                </Flex>
                <Flex pb={8} maxW="780px" w="100%" direction="column" alignItems="flex-start" justifyContent="flex-start">
                    <Flex w="100%" gap={4} direction={isMobile ? "column" : "row"}>
                        <Flex rounded={4} p={2} flex={1} bg="barber.400" direction="column">
                            <Heading textAlign="center" fontSize="2xl" my={2} color="gray.100">
                                Plano gratuito
                            </Heading>
                            <UnorderedList>
                                <ListItem>
                                    <Text fontWeight="medium" ml={4} mb={2}>Registrar cortes.</Text>
                                </ListItem>
                                <ListItem>
                                    <Text fontWeight="medium" ml={4} mb={2}>Criar até 3 modelos de corte.</Text>
                                </ListItem>
                                <ListItem>
                                    <Text fontWeight="medium" ml={4} mb={2}>Editar dados do perfil.</Text>
                                </ListItem>
                            </UnorderedList>
                        </Flex>
                        <Flex rounded={4} p={2} flex={1} bg="barber.400" direction="column">
                            <Heading textAlign="center" fontSize="2xl" my={2} color="#31fb6a">
                                Plano Premium
                            </Heading>
                            <UnorderedList>
                                <ListItem>
                                    <Text fontWeight="medium" ml={4} mb={2}>Registrar cortes ilimitados.</Text>
                                </ListItem>
                                <ListItem>
                                    <Text fontWeight="medium" ml={4} mb={2}>Criar modelos ilimitados de corte.</Text>
                                </ListItem>
                                <ListItem>
                                    <Text fontWeight="medium" ml={4} mb={2}>Sistema de agendamento completo.</Text>
                                </ListItem>
                                <ListItem>
                                    <Text fontWeight="medium" ml={4} mb={2}>Gerenciamento dos seus ganhos.</Text>
                                </ListItem>
                                <ListItem>
                                    <Text fontWeight="medium" ml={4} mb={2}>Editar dados do perfil.</Text>
                                </ListItem>
                            </UnorderedList>
                            
                            {
                                !premium && (
                                    <Text fontWeight="bold" fontSize="2xl" ml={4} mb={2} color="#FBA931">R$29,99</Text>
                                )
                            }
                            <Button bg={premium ? "transparent" : "button.cta"} isDisabled={premium} m={2} color="white" _hover={{ bg: "gray.100", color: "#000" }}>
                                {premium ? "VOCÊ JÁ É PREMIUM" : "QUERO ME TORNAR PREMIUM"}
                            </Button>
                            {
                                premium && (
                                    <Button bg="gray.100" m={2} color="#000">
                                       ALTERAR ASSINATURA
                                    </Button>
                                )
                            }
                        </Flex>
                    </Flex>
                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    try {

        const apiClient = setupAPIClient(ctx);

        const response = await apiClient.get("/me");

        return {
            props: {
                premium: response?.data?.subscriptions?.status === "active" ? true : false
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