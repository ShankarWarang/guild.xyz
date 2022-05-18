const data = {
  isSigning: false,
  isLoading: false,
  members: [],
  id: 4314,
  name: "Vitest Gang",
  urlName: "vitest-gang",
  description: null,
  imageUrl: `https://guild-xyz.mypinata.cloud/ipfs/${process.env.VITEST_IPFS_HASH}`,
  showMembers: true,
  hideFromExplorer: false,
  createdAt: "2022-05-16T13:40:05.556+00:00",
  admins: [
    {
      id: 46,
      address: "0x82407168ca396e800e55c8667af2a7516c5140dd",
      isOwner: true,
    },
  ],
  theme: {
    mode: "DARK",
    color: "#141414",
    backgroundImage: null,
    backgroundCss: null,
  },
  platforms: [
    {
      id: 2403,
      isGuarded: false,
      platformId: "973501817566674984",
      type: "DISCORD",
      platformName: "Vitest Gang",
    },
  ],
  roles: [
    {
      id: 5150,
      name: "Member",
      description: null,
      imageUrl:
        "https://guild-xyz.mypinata.cloud/ipfs/QmYimSys3TNXJ3RRpABUou6Gc48BnsdYBqR4e5E3fmS5xy",
      logic: "AND",
      requirements: [
        {
          id: 22674,
          type: "FREE",
          address: null,
          chain: "ETHEREUM",
          roleId: 5150,
          name: "-",
          symbol: "-",
          data: null,
        },
      ],
      platforms: [
        {
          roleId: 5150,
          platformId: 2403,
          inviteChannel: "976040199303868419",
          discordRoleId: "975754518325248120",
        },
      ],
      members: null,
      memberCount: 0,
    },
  ],
}

export default data
