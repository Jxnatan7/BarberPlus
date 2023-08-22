import { useState, ChangeEvent } from "react";

import Head from "next/head";
import Router from "next/router";

import { Sidebar } from "@/components/sidebar";

import { setupAPIClient } from "@/services/api";

import { canSSRAuth } from "@/utils/canSSRAuth";

import { 
    Flex,
    Text,
    Heading,
    Button,
    Input,
    Select
} from "@chakra-ui/react";
import { api } from "@/services/apiClient";

interface HaircutsProps {
    id: string;
    name: string;
    price: string | number;
    status: boolean;
    user_id: string;
}

interface NewProps {
    haircuts: HaircutsProps[];
}

export default function New({ haircuts }: NewProps) {

    const [customerName, setCustomerName] = useState("");
    const [haircutSelected, setHaircutSelected] = useState(haircuts[0]);

    function handleChangeSelect(id: string) {
        const haircutItem = haircuts.find(item => item.id === id);
        setHaircutSelected(haircutItem);
    }

    async function handleRegister() {

        if(customerName === "") {
            return;
        }

        try {
            const apiClient = setupAPIClient();

            await apiClient.post("/schedule", {
                haircut_id: haircutSelected?.id,
                customer: customerName
            });

            Router.push("/dashboard");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Head>
                <title>Novo agendamento - BarberPLUS</title>
            </Head>
            <Sidebar>
                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">
                    <Flex w="100%" direction="row" alignItems="center" justifyContent="flex-start">
                        <Heading fontSize="3xl" my={4} mr={4}>
                            Novo agendamento
                        </Heading>
                    </Flex>

                    <Flex maxW="700px" py={8} w="100%" direction="column" alignItems="center" justifyContent="center" bg="barber.400">
                        <Input color="white" value={customerName} onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value) } placeholder="Nome do cliente" w="85%" mb={3} size="lg" type="text" bg="barber.900"/>
                        <Select w="85%" mb={3} size="lg" bg="barber.900" onChange={(e) => handleChangeSelect(e.target.value)}>
                            {
                                haircuts?.map((item) => (
                                    <option style={{ backgroundColor: "#1b1c29"}} key={item?.id} value={item?.id}>{item?.name}</option>
                                ))
                            }
                        </Select>
                        <Button onClick={handleRegister} w="85%" size="lg" color="gray.900" mb={6} bg="button.cta" _hover={{ bg: "#FFB13E" }}>
                            Agendar
                        </Button>
                    </Flex>
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