import {
  Collapse,
  HStack,
  Icon,
  IconButton,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  useBreakpointValue,
  useClipboard,
  useDisclosure,
  Wrap,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Chain, RPC } from "connectors"
import { CaretDown, Copy } from "phosphor-react"
import shortenHex from "utils/shortenHex"
import useNftDetails from "./hooks/useNftDetails"

type Props = {
  chain: Chain
  address: string
}

const NftDetails = ({ chain, address }: Props) => {
  const { isOpen, onToggle } = useDisclosure()

  const chainName = RPC[chain].chainName
  const { data: nftDetails, isValidating, error } = useNftDetails(chain, address)
  const uniqueMintersPercentage =
    nftDetails?.totalMinters && nftDetails?.uniqueMinters
      ? (nftDetails.uniqueMinters / nftDetails.totalMinters) * 100
      : 0

  return (
    <Stack spacing={4}>
      <Button
        maxW="max-content"
        variant="unstyled"
        fontFamily="display"
        fontSize="2xl"
        fontWeight="bold"
        onClick={onToggle}
        rightIcon={
          <Icon
            as={CaretDown}
            boxSize={5}
            position="relative"
            top={0.5}
            transform={isOpen && "rotate(-180deg)"}
            transition="transform .3s"
          />
        }
      >
        NFT details
      </Button>

      <Collapse in={isOpen} animateOpacity>
        <Stack spacing={4}>
          <Wrap>
            <SimpleGrid maxW="max-content" columns={2} gap={8} pr={8}>
              <Stack spacing={0}>
                <Text
                  as="span"
                  fontSize="sm"
                  fontWeight="bold"
                  colorScheme="gray"
                  textTransform="uppercase"
                >
                  Standard
                </Text>
                {/* TODO */}
                <Text as="span" fontSize="md" colorScheme="gray">
                  ERC-721
                </Text>
              </Stack>

              <Stack spacing={0}>
                <Text
                  as="span"
                  fontSize="sm"
                  fontWeight="bold"
                  colorScheme="gray"
                  textTransform="uppercase"
                >
                  Network
                </Text>
                <Text as="span" fontSize="md" colorScheme="gray">
                  {chainName}
                </Text>
              </Stack>
            </SimpleGrid>

            <SimpleGrid maxW="max-content" columns={2} gap={8}>
              <Stack spacing={0}>
                <Text
                  as="span"
                  fontSize="sm"
                  fontWeight="bold"
                  colorScheme="gray"
                  textTransform="uppercase"
                >
                  Total minters
                </Text>
                <Skeleton isLoaded={!isValidating}>
                  <Text as="span" fontSize="md" colorScheme="gray">
                    {error
                      ? "Couldn't fetch"
                      : new Intl.NumberFormat("en", {
                          notation: "standard",
                        }).format(nftDetails?.totalMinters ?? 0)}
                  </Text>
                </Skeleton>
              </Stack>

              <Stack spacing={0}>
                <Text
                  as="span"
                  fontSize="sm"
                  fontWeight="bold"
                  colorScheme="gray"
                  textTransform="uppercase"
                >
                  Unique minters
                </Text>
                <Skeleton isLoaded={!isValidating}>
                  <Text as="span" fontSize="md" colorScheme="gray">
                    {error
                      ? "Couldn't fetch"
                      : `${new Intl.NumberFormat("en", {
                          notation: "standard",
                        }).format(
                          nftDetails?.uniqueMinters
                        )} (${uniqueMintersPercentage})%`}
                  </Text>
                </Skeleton>
              </Stack>
            </SimpleGrid>
          </Wrap>

          <CopyableNftDetailsAddress label="Contract" address={address} />

          <CopyableNftDetailsAddress
            label="Creator"
            address={nftDetails?.creator}
            isValidating={isValidating}
            error={error}
          />
        </Stack>
      </Collapse>
    </Stack>
  )
}

type CopyableNftDetailsAddressProps = {
  label: string
  address: string
  isValidating?: boolean
  error?: any
}

const CopyableNftDetailsAddress = ({
  label,
  address,
  isValidating,
  error,
}: CopyableNftDetailsAddressProps) => {
  const displayedAddress = useBreakpointValue({
    base: address ? shortenHex(address) : "",
    lg: address,
  })
  const { hasCopied, onCopy } = useClipboard(address)

  return (
    <Stack spacing={0}>
      <Text
        as="span"
        fontSize="sm"
        fontWeight="bold"
        colorScheme="gray"
        textTransform="uppercase"
      >
        {label}
      </Text>

      <Skeleton isLoaded={!isValidating} maxW="max-content" minW="80%">
        {error ? (
          <Text as="span" fontSize="md" colorScheme="gray">
            Couldn't fetch
          </Text>
        ) : (
          <HStack>
            <Text as="span" fontSize="md" colorScheme="gray">
              {displayedAddress}
            </Text>
            <Tooltip
              placement="top"
              label={hasCopied ? "Copied" : "Click to copy address"}
              closeOnClick={false}
              hasArrow
            >
              <IconButton
                aria-label="Copy contract address"
                variant="ghost"
                icon={<Copy />}
                color="gray"
                size="sm"
                rounded="full"
                onClick={onCopy}
              />
            </Tooltip>
          </HStack>
        )}
      </Skeleton>
    </Stack>
  )
}

export default NftDetails
