import {
  Box,
  Flex,
  HStack,
  Icon,
  Image,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid"
import React, { useCallback } from "react"
import { WalletSourceInfo } from "../../../model/enums"
import RadioCard from "../../Shared/RadioCard/RadioCard"
import { WalletSource } from "@vechain/dapp-kit"
import { useWallet } from "@vechain/dapp-kit-react"

interface IAccountSourceRadio {
  onChange: (source: WalletSource) => void
}

const AccountSourceRadio: React.FC<IAccountSourceRadio> = ({ onChange }) => {
  const handleSourceClick = useCallback(
    (isDisabled: boolean, source: WalletSource) => () =>
      !isDisabled && onChange(source),
    [onChange]
  )

  const { source } = useWallet()

  return (
    <VStack spacing={4} w="full">
      {Object.entries(WalletSourceInfo).map(([walletSource, sourceInfo]) => {
        const isDisabled = !sourceInfo.isAvailable
        const isSelected = source === walletSource

        return (
          <AccountSourceButton
            key={walletSource}
            source={walletSource as WalletSource}
            isSelected={isSelected}
            isDisabled={isDisabled}
            onClick={handleSourceClick(
              isDisabled,
              walletSource as WalletSource
            )}
          />
        )
      })}
    </VStack>
  )
}

interface IAccountSourceButton {
  source: WalletSource
  isSelected: boolean
  isDisabled: boolean
  onClick: () => void
}

const AccountSourceButton: React.FC<IAccountSourceButton> = ({
  source,
  isSelected,
  isDisabled,
  onClick,
}) => {
  const sourceInfo = WalletSourceInfo[source]
  return (
    <RadioCard
      selected={isSelected}
      onClick={onClick}
      position={"relative"}
      disabled={isDisabled}
    >
      <HStack spacing={2}>
        <Image
          objectFit={"cover"}
          w={35}
          h={35}
          rounded="lg"
          alt={`${sourceInfo.name}-logo`}
          src={sourceInfo.logo}
        />
        <Text color={"primary"}>{sourceInfo.name}</Text>
      </HStack>
      {isDisabled && (
        <Box position={"absolute"} right={-2} zIndex={10} top={-2}>
          <SourceNotDetectedIcon source={source} />
        </Box>
      )}
    </RadioCard>
  )
}

interface ISourceNotDetectedIcon {
  source: WalletSource
}

const SourceNotDetectedIcon: React.FC<ISourceNotDetectedIcon> = ({
  source,
}) => {
  const sourceInfo = WalletSourceInfo[source]

  return (
    <Tooltip label={`${sourceInfo.name} not detected`} placement="top">
      <Flex p={1} rounded="full" bg="orange.500" alignItems={"center"}>
        <Icon color={"white"} fontSize={"md"} as={ExclamationTriangleIcon} />
      </Flex>
    </Tooltip>
  )
}

export default AccountSourceRadio
