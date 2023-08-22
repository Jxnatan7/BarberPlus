import { useMediaQuery } from "@chakra-ui/react";

export default function MediaQuerys() {
    const [isMobile] = useMediaQuery("(max-width: 500px)");

    return isMobile;
}