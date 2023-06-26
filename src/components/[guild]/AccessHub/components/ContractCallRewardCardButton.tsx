import LinkButton from "components/common/LinkButton"
import useMemberships from "components/explorer/hooks/useMemberships"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import CollectNft from "components/[guild]/Requirements/components/GuildCheckout/CollectNft"
import { GuildCheckoutProvider } from "components/[guild]/Requirements/components/GuildCheckout/components/GuildCheckoutContex"
import { GuildPlatform } from "types"

type Props = {
  reward: GuildPlatform
}

const ContractCallRewardCardButton = ({ reward }: Props) => {
  const { id, urlName, roles } = useGuild()
  const { chain, contractAddress } = reward.platformGuildData

  const rewardsRoleId = roles.find((role) =>
    role.rolePlatforms?.find((rp) => rp.guildPlatformId === reward.id)
  )?.id

  const { data: roleAccess } = useAccess(rewardsRoleId)
  const hasAccessToRole = roleAccess?.access

  const { memberships } = useMemberships()
  const isMemberOfRole = !!memberships
    ?.find((membership) => membership.guildId === id)
    ?.roleIds.find((roleId) => roleId === rewardsRoleId)

  const isEligible = hasAccessToRole || isMemberOfRole

  if (!isEligible)
    return (
      <LinkButton
        colorScheme="cyan"
        href={`/${urlName}/collect/${chain.toLowerCase()}/${contractAddress.toLowerCase()}`}
      >
        Collect NFT
      </LinkButton>
    )

  return (
    <GuildCheckoutProvider>
      <CollectNft
        chain={reward.platformGuildData.chain}
        address={reward.platformGuildData.contractAddress}
      />
    </GuildCheckoutProvider>
  )
}

export default ContractCallRewardCardButton