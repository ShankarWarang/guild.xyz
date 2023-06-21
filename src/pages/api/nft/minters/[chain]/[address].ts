import { kv } from "@vercel/kv"
import { Chain } from "connectors"
import { NextApiHandler } from "next"
import fetcher from "utils/fetcher"
import { ADDRESS_REGEX } from "utils/guildCheckout/constants"

type Owner = {
  ownerAddress: string
  tokenBalances: { tokenId: string; balance: string }[]
}

export type TopMintersResponse =
  | {
      uniqueMinters: number
      topMinters: string[]
      error?: never
    }
  | { uniqueMinters?: never; topMinters?: never; error: string }

const alchemyApiUrl: Partial<Record<Chain, string>> = {
  POLYGON: `https://polygon-mainnet.g.alchemy.com/nft/v3/${process.env.POLYGON_ALCHEMY_KEY}/getOwnersForContract`,
}

const validateChain = (value: string | string[]): Chain => {
  const valueAsString = value?.toString()?.toUpperCase()
  if (!value || !Object.keys(alchemyApiUrl).includes(valueAsString)) return null
  return valueAsString as Chain
}
const validateAddress = (value: string | string[]): string => {
  const valueAsString = value?.toString()
  if (!ADDRESS_REGEX.test(valueAsString)) return null
  return valueAsString
}

const handler: NextApiHandler<TopMintersResponse> = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET")
    return res.status(405).json({ error: `Method ${req.method} is not allowed` })
  }

  const { chain: chainFromQuery, address: addressFromQuery } = req.query

  const chain = validateChain(chainFromQuery)
  const address = validateAddress(addressFromQuery)

  if (!chain || !address)
    return res.status(400).json({ error: "Invalid chain or address" })

  const kvKey = `nftMinters:${chain}:${address.toLowerCase()}`
  const cachedResponse: TopMintersResponse = await kv.get(kvKey)

  if (cachedResponse) {
    // Cache the response for 5 minutes, so if the user refreshes the page, we don't need to fetch it from KV again, just send back the latest response
    res.setHeader("Cache-Control", "s-maxage=300")
    return res.json(cachedResponse)
  }

  let pageKey: string
  const owners: Owner[] = []
  const searchParamsObject = {
    contractAddress: address,
    withTokenBalances: "true",
    pageKey: "",
  }
  const searchParams = new URLSearchParams(searchParamsObject)

  do {
    try {
      const newOwners: { owners?: Owner[]; pageKey?: string } = await fetcher(
        `${alchemyApiUrl[chain]}?${searchParams.toString()}`
      )

      if (newOwners.owners?.length) owners.push(...newOwners.owners)

      pageKey = newOwners.pageKey
      if (pageKey) searchParams.set("pageKey", pageKey)
    } catch (alchemyApiError) {
      return res.status(500).json({ error: "Couldn't fetch NFT owners" })
    }
  } while (pageKey)

  const ownersWithBalances: { ownerAddress: string; tokenBalance: number }[] =
    owners.map(({ ownerAddress, tokenBalances }) => {
      let tokenBalance = 0
      for (const token of tokenBalances) {
        tokenBalance += Number(token.balance)
      }

      return {
        ownerAddress,
        tokenBalance,
      }
    })
  const sortedOwners = ownersWithBalances.sort(
    (ownerA, ownerB) => ownerB.tokenBalance - ownerA.tokenBalance
  )

  const response: TopMintersResponse = {
    topMinters: sortedOwners.slice(0, 100).map(({ ownerAddress }) => ownerAddress),
    uniqueMinters: owners.length,
  }

  // Store in cache for 30 minutes
  await kv.set(kvKey, response, { ex: 60 * 30 })

  res.setHeader("Cache-Control", "s-maxage=300")
  res.json(response)
}

export default handler
