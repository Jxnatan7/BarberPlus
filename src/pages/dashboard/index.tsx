import { useState } from "react";

import Head from "next/head";
import Link from "next/link";

import { setupAPIClient } from "@/services/api";

import { 
    Flex,
    Heading,
    Button, 
    Text,
    Link as ChackraLink,
    useDisclosure
} from "@chakra-ui/react"; 

import { IoMdPerson } from "react-icons/io"; 

import { canSSRAuth } from "@/utils/canSSRAuth";

import { Sidebar } from "@/components/sidebar";
import { ModalInfo } from "@/components/modal";

import MediaQuerys from "@/utils/mediaQuery";

export interface ServicesItems {
    id: string;
    customer: string;
    haircut: {
        id: string;
        name: string;
        price: string | number;
        user_id: string;
    }
}

interface DashboardProps {
    services: ServicesItems[];
}

export default function Dashboard({ services }: DashboardProps) {

    const [list, setList] = useState(services);
    const [service, setService] = useState<ServicesItems>();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const isMobile = MediaQuerys();

    function handleOpenModal(item: ServicesItems) {
        setService(item);
        onOpen();
    }

    async function handleFinish(id: string) {
        try {
            const apiClient = setupAPIClient();

            await apiClient.delete("/schedule", {
                params: {
                    schedule_id: id
                }
            });

            const filterItems = list.filter(item => {
                return (item?.id !== id);
            });
            setList(filterItems);
            onClose();
        } catch (error) {
            console.log(error);
            onClose();
        }
    }

    return (
        <>
            <Head>
                <title>BarberPLUS - Minha barbearia</title>
            </Head>
            <Sidebar>
                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">
                    <Flex w="100%" direction="row" alignItems="center" justifyContent="flex-start">
                        <Heading fontSize="3xl" my={4} mr={4}>
                            Próximos clientes
                        </Heading>
                        <Link href="/new" legacyBehavior>
                            <Button bg="button.dark" color="white" _hover={{ "bg": "button.black", "color": "gray" }}>
                                Registrar
                            </Button>
                        </Link>
                    </Flex>
                    {
                        list.map(item => (
                            <ChackraLink onClick={() => handleOpenModal(item) } key={item?.id} w="100%" m={0} p={0} mt={1} bg="transparent" style={{ textDecoration: "none" }}>
                                <Flex w="100%" direction={isMobile ? "column" : "row"} p={4} rounded={4} mb={4} bg="barber.400" justifyContent="space-between" alignItems={isMobile ? "flex-start" : "center"}>
                                    <Flex direction="row" mb={isMobile ? 2 : 0} align="center" justifyContent="center">
                                        <IoMdPerson size={28} color="#fba931"/>
                                        <Text fontWeight="bold" ml={4} noOfLines={2}>{item?.customer}</Text>
                                    </Flex>
                                    <Text fontWeight="bold" mb={isMobile ? 2 : 0}>{item?.haircut?.name}</Text>
                                    <Text fontWeight="bold">R${item?.haircut?.price}</Text>
                                </Flex>
                            </ChackraLink>
                        ))
                    }
                </Flex>
            </Sidebar>
            <ModalInfo isOpen={isOpen} onOpen={onOpen} onClose={onClose} data={service} finishService={ () => handleFinish(service?.id) }/>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    try {

        const apiClient = setupAPIClient(ctx);
        
        const response = await apiClient.get("/schedule");

        return {
            props: {
                services: response.data
            }
        }
    } catch (error) {
        console.log(error);

        return {
            props: {
                services: []
            }
        }
    }
})