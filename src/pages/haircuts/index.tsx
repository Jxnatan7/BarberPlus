import { useState, ChangeEvent } from "react";
import Head from "next/head";
import Link from "next/link";

import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";

import { Sidebar } from "@/components/sidebar";

import { 
    Flex,
    Text,
    Button,
    Switch,
    Heading,
    Stack
} from "@chakra-ui/react";

import MediaQuerys from "@/utils/mediaQuery";

import { IoMdPricetag } from "react-icons/io";

interface HaircutsItems {
    id: string;
    name: string;
    price: number | number;
    status: boolean;
    created_at: string;
}

interface HaircutsProps {
    haircuts: HaircutsItems[];
}

export default function Haircuts({ haircuts }: HaircutsProps) {

    const isMobile = MediaQuerys();

    const [haircutList, setHaircutList] = useState<HaircutsItems[]>(haircuts || []);
    const [disabledHaircut, setDisabledHaircut] = useState("enabled");

    async function handleDisable(e: ChangeEvent<HTMLInputElement>) {

        const apiClient = setupAPIClient();


        
        if(e.target.value === "disabled") {
            setDisabledHaircut("enabled");

            const response = await apiClient.get("/haircuts", {
                params: {
                    status: true
                }
            });

            setHaircutList(response.data);
        } else {
            setDisabledHaircut("disabled");

            const response = await apiClient.get("/haircuts", {
                params: {
                    status: false
                }
            });

            setHaircutList(response.data);
        }
    }

    return (
        <>
            <Head>
                <title>Modelos de corte - Minha barbearia</title>
            </Head>
            <Sidebar>
                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">
                    <Flex direction={isMobile ? "column" : "row"} w="100%" justifyContent="flex-start" alignItems={isMobile ? "flex-start" : "center"} mb={0}>
                        <Heading fontSize={isMobile ? "2xl" : "3xl"} my={4} mr={4} color="orange.900"> Modelos de cortes </Heading>
                        <Link href="/haircuts/new">
                            <Button bg="button.dark" color="white" _hover={{ "bg": "button.black", "color": "gray" }}>
                                Cadastrar novo
                            </Button>
                        </Link>
                        <Stack ml="auto" align="center" direction="row">
                            <Text fontWeight="bold">ATIVOS</Text>
                            <Switch isChecked={disabledHaircut === "enabled" ? true : false} colorScheme="green" size="lg" value={disabledHaircut} onChange={(e: ChangeEvent<HTMLInputElement>) => handleDisable(e)}/>
                        </Stack>
                    </Flex>

                    {/* Listagem de cortes de cabelo */}
                    {haircutList.map(haircuts => (
                        <Link key={haircuts.id} href={`/haircuts/${haircuts.id}`} legacyBehavior>
                            <Flex mt={isMobile ? 10 : 0} cursor="pointer" w="100%" p={4} bg="barber.400" direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} rounded={4} mb={2} justifyContent="space-between">
                                <Flex direction="row" alignItems="center" justifyContent="center">
                                    <IoMdPricetag size={28} color="#fba931"/>
                                    <Text fontWeight="bold" color="white" ml={4} noOfLines={2}>
                                        {haircuts.name}
                                    </Text>
                                </Flex>
                                <Text fontWeight="bold" color="white">
                                    Preço: R${haircuts.price}
                                </Text>
                            </Flex>
                        </Link>
                    ))}

                </Flex>
            </Sidebar>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx) => {

    try {
        const apiClient = setupAPIClient(ctx);

        const response = await apiClient.get("/haircuts", {
            params: {
                status: true
            }
        });

        if(response.data === null) {
            return {
                redirect: {
                    destination: "/dashboard",
                    permanent: false
                }
            }
        }

        return {
            props: {
                haircuts: response.data
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