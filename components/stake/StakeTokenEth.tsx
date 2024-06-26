import { Card, Skeleton, Stack, Text } from "@chakra-ui/react";
import { useAddress, useContract, useTokenBalance } from "@thirdweb-dev/react";
import { STAKEETH_TOKEN_ADDRESSES } from "../../cost/addressesStakeNew";

export default function StakeTokenEth() {
    const address = useAddress();
    const { contract: stakeTokenContract, isLoading: loadingStakeToken } = useContract(STAKEETH_TOKEN_ADDRESSES);
    const { data: tokenBalance, isLoading: loadingTokenBalance } = useTokenBalance(stakeTokenContract, address);
    return (
        <Card p={5} className="card__stake-token">
            <Stack>
                <h3><img src="theme-assets/images/oseantokeneth.png" alt="OSEAN" width="40" height="40" className='token-icon'/>&nbsp;Available to Stake</h3><br />
                <Skeleton h={4} w={"50%"} isLoaded={!loadingStakeToken && !loadingTokenBalance}>
                    <Text fontSize={"large"} fontWeight={"bold"}>${tokenBalance?.symbol}</Text>
                </Skeleton>
                <Skeleton h={4} w={"100%"} isLoaded={!loadingStakeToken && !loadingTokenBalance}>
                    <Text>
                        <img src="theme-assets/images/oseantokeneth.png" alt="OSEAN" width="18" height="18" className='token-icon'/>
                        &nbsp;{tokenBalance?.displayValue}
                    </Text>
                </Skeleton>
            </Stack>
        </Card>
    )
}