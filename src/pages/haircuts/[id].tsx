import { useState, ChangeEvent } from "react";

import Head from "next/head";
import Router from "next/router";
import Link from "next/link";

import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";

import { 
    Flex,
    Text,
    Heading,
    Button,
    Input,
    Stack,
    Switch
} from "@chakra-ui/react";

import MediaQuerys from "@/utils/mediaQuery";

import { Sidebar } from "@/components/sidebar";

import { FiChevronLeft } from "react-icons/fi";

interface HaircutProps {
    id: string;
    name: string;
    price: string | number;
    status: boolean;
    user_id: string;
    created_at: string;
}

interface SubscriptionsProp {
    id: string;
    status: string;
}

interface EditHaircutProps {
    haircut: HaircutProps;
    subscription: SubscriptionsProp | null;
}

export default function EditHaircut({ haircut, subscription }: EditHaircutProps) {

    const isMobile = MediaQuerys();

    const [haircutName, setHaircutName] = useState(haircut?.name);
    const [haircutPrice, setHaircutPrice] = useState(haircut?.price);
    const [status, setStatus] = useState(haircut?.status);

    const [disableHaircut, setDisableHaircut] = useState(haircut?.status ? "disabled" : "enabled");

    function handleChangeStatus(e: ChangeEvent<HTMLInputElement>) {
        if(e.target.value === "disabled") {
            setDisableHaircut("enabled");
            setStatus(false);
        } else {
            setDisableHaircut("disabled");
            setStatus(true);
        }
    }

    async function handleUpdateHaircut() {

        if( haircutName === "" || haircutPrice === "" ) {
            return;
        }

        try {
            const apiCLient = setupAPIClient();
            await apiCLient.put("/haircut", {
                haircut_id: haircut?.id,
                name: haircutName,
                price: Number(haircutPrice),
                status: status
            })

            Router.push("/haircuts");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Head>
                <title>Editando modelo de corte - BarberPLUS</title>
            </Head>
            <Sidebar>
                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">
                    <Flex direction={isMobile ? "column" : "row"} w="100%" justifyContent="flex-start" alignItems={isMobile ? "flex-start" : "center"} mb={isMobile ? 4: 0}>
                        <Link href="/haircuts" legacyBehavior>
                           <Button mr={4} p={4} display="flex" alignItems="center" justifyContent="center" bg="button.dark" color="white" _hover={{ "bg": "button.black", "color": "gray" }}>
                                <FiChevronLeft size={24}/>
                                Voltar
                            </Button> 
                        </Link>
                        <Heading color="white" fontSize={isMobile ? "2xl" : "3xl"}>
                            Editar corte
                        </Heading>
                    </Flex>

                    <Flex mt={4} maxW="700px" pt={8} pb={8} w="100%" bg="barber.400" direction="column" align="center" justify="center">
                        <Heading mb={4} fontSize={isMobile ? "2xl" : "3xl"}>
                            Editar corte
                        </Heading>
                        <Flex w="85%" direction="column">
                            <Input color="white" mb={4} placeholder="Nome do corte" type="text" w="100%" bg="gray.900" size="lg" value={haircutName} onChange={e => setHaircutName(e.target.value) }/>
                            <Input color="white" mb={4} placeholder="Valor do corte ex: R$ 25,00" type="number" w="100%" bg="gray.900" size="lg" value={haircutPrice} onChange={e => setHaircutPrice(e.target.value) }/>
                            <Stack mb={6} align="center" direction="row">
                                <Text fontWeight="bold">
                                    Desativar corte
                                </Text>
                                <Switch colorScheme="red" size="lg" value={disableHaircut} isChecked={disableHaircut === "disabled" ? false : true} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeStatus(e)}/>
                            </Stack>
                            <Button onClick={handleUpdateHaircut} isDisabled={ subscription?.status !== "active" } w="100%" size="lg" color="gray.900" mb={6} bg="button.cta" _hover={{ bg: "#FFB13E" }}>Salvar</Button>
                            {
                                subscription?.status !== "active" && (
                                    <Link href="/planos">
                                        <Flex alignItems="center" justifyContent="center">
                                            <Text cursor="pointer" fontWeight="bold" mr={1} color="#31fb6a">
                                                Seja premium
                                            </Text>
                                            <Text>
                                                e tenha todos os acessos liberados.
                                            </Text>
                                        </Flex>
                                    </Link>
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

    const { id } = ctx.params;

    try {
        const apiClient = setupAPIClient(ctx);

        const check = await apiClient.get("subscription/check");

        const response = await apiClient.get("/haircuts/detail", {
            params: {
                haircut_id: id
            }
        });

        return {
            props: {
                haircut: response.data,
                subscription: check.data?.subscriptions
            }
        }
        
    } catch (error) {
        console.log(error);

        return {
            redirect: {
                destination: "/haircuts",
                permanent: false
            }
        }
    }
});