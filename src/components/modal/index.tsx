import { 
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text, 
    Button,
    Flex
} from "@chakra-ui/react";

import { FiUser, FiScissors } from "react-icons/fi";
import { FaMoneyBillAlt } from "react-icons/fa";

import { ServicesItems } from "@/pages/dashboard";

interface ModalInfoProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    data: ServicesItems;
    finishService: () => Promise<void>;
}

export function ModalInfo({ isOpen, onOpen, onClose, data, finishService }: ModalInfoProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent bg="barber.400" color="white">
                <ModalHeader>Próximo</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Flex alignItems="center" mb={3}>
                        <FiUser size={28} color="#FFB13E"/>
                        <Text ml={3} fontSize="2xl" fontWeight="bold">{data?.customer}</Text>
                    </Flex>
                    <Flex alignItems="center" mb={3}>
                        <FiScissors size={28} color="#f2f2f2"/>
                        <Text ml={3} fontSize="large" fontWeight="bold">{data?.haircut?.name}</Text>
                    </Flex>
                    <Flex alignItems="center" mb={3}>
                        <FaMoneyBillAlt size={28} color="#43ef75"/>
                        <Text ml={3} fontSize="large" fontWeight="bold">R${data?.haircut?.price}</Text>
                    </Flex>
                </ModalBody> 
                <ModalFooter>
                    <Button bg="button.cta" _hover={{ bg: "#FFb13e" }} color="#f2f2f2" onClick={() => finishService()}>
                        Finalizar serviço
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}