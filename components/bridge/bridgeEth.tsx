import { Web3Button, useContract, useContractWrite, useContractRead, useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import {
  Flex,
  Card,
  Text,
  Box,
  Input,
  FormControl,
  FormLabel,
  useToast,
  ChakraProvider,
  Image,
  Center, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import React from "react";
import Web3 from "web3";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGasPump, faArrowCircleDown } from '@fortawesome/free-solid-svg-icons'

export default function BridgeEth() {

  //@dev get current gas prices and fees required for Bridge
  const { contract: osean } = useContract("0x50d5118Fb90D572B9d42ba65E0addC4900867809");
  const { contract: socket } = useContract("0x37091ade7C4E1A914D3155449e25eE91DA08EbE4");
  const { mutateAsync: bridge, isLoading } = useContractWrite(osean, "bridge");
  const { mutateAsync: approve } = useContractWrite(osean, "approve");
  const address = useAddress();
  const toast = useToast();

  //@dev get allowance
  const allowed = useContractRead(osean, "allowance", [address, address]);

  useEffect(() => {
    if (allowed && allowed.data) {
  const allowData = allowed.data;
        const hexAllowed = allowData._hex;
        const allowBig = ethers.BigNumber.from(hexAllowed);
        const allowValue = allowBig.toString();
        console.log("your current allowance is:", allowValue)
    }
  }, [allowed])

  //@dev get current gas prices and fees required for Bridge
  const web3 = new Web3(window.ethereum);

  const fees = useContractRead(socket, "getMinFees", [56, 500000, 0]);
  const feeValue = fees.data ? web3.utils.fromWei(fees.data._hex, 'ether') : "N/A";
  
  const roundedFeeValue = fees.data ? (Math.ceil(Number(feeValue) * 100000) / 100000).toFixed(5) : "N/A";
  
  console.log("Current fees in Ether (rounded up to 5 decimal places):", roundedFeeValue);
  

  //@dev set values from form
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [destWallet, setDestWallet] = useState("");
  const [amount, setAmount] = useState(0);
  const [gas, setGas] = useState("");
  
  //@dev set values in bridge tx
  const receiver_ = destWallet;
  const siblingChainSlug_ = 56;
  const amount_ = ethers.utils.parseUnits(amount.toString(), 18); 
  const msgGasLimit_ = 500000;
  const payload_ = "0x"; 
  const options_ = "0x";
  const nativeTokenValue = gas; 

  //@dev popup for monitoring bridge process
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Trigger toast on transactionHash change
    if (transactionHash) {
        toast({
            title: `Track message here:`,
            description: `https://prod.dlapi.socket.tech/messages-from-tx?srcChainSlug=1&srcTxHash=${transactionHash}`,
            status: "success",
            duration: null,
            isClosable: true,
            position: "top",
            render: ({ onClose }) => (
                <Modal isOpen={isOpen} onClose={onClose} size="sm">
                    <ModalOverlay />
                    <ModalContent
                    style={{
                        top: "25%",
                        transform: "translate(-50%, -50%)",
                      }}>
                        <ModalHeader textAlign="center">A transaction has been generatated! Click the button below to monitor transfer process.</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                        <div style={{ padding: '10px', background: '#1F85FF', color: '#fff', cursor: 'pointer', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', textAlign: "center" }}
                            onClick={() => { window.open(`https://prod.dlapi.socket.tech/messages-from-tx?srcChainSlug=1&srcTxHash=${transactionHash}`, '_blank'); onClose(); }}
                        >
                            Click here to view details
                        </div>
                        </ModalBody>
                    </ModalContent>
                    </Modal>
            ),
          });
          onOpen();
        }
  }, [transactionHash, isOpen, onOpen, toast]);

  //@dev execute Bridge function
  const bridgeFunction = async (contract: any) => {
    try {
      const allowData = allowed.data;
        const hexAllowed = allowData._hex;
        const allowBig = ethers.BigNumber.from(hexAllowed);
        const allowValue = allowBig.toString();
        console.log("your current allowance is:", allowValue)

        // Check if the allowance is sufficient for the amountIn
        if (allowBig.gte(amount_)) {
            console.log("Allowance is sufficient. Proceeding with the swap directly.");
        } else {
      const allowance = await approve({ args: [
        address,
        amount_
    ]}); 
      console.info("Contract call success", allowance);
  }

      const data = await bridge({
        args: [receiver_, siblingChainSlug_, amount_, msgGasLimit_, payload_, options_], 
        overrides: { value: ethers.utils.parseEther(nativeTokenValue) },
      });
      
      console.info("Contract call success", data.receipt.transactionHash);
      setTransactionHash(data.receipt.transactionHash);
    } catch (error) {
        console.error("Bridge failure", error);
        throw error;
    }
  };


  return (
    

<ChakraProvider>
<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
  <Card style={{ maxWidth: "600px" }}>
    <Flex justify="space-between" alignItems="flex-start" width="100%">
      <Box flex="1" m={4}>
        <form onSubmit={(e) => e.preventDefault()}>
        <div style={{ textAlign: "center" }}>
          <h5>Bridge your OSEAN from ETH to BSC</h5>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src="/images/eth_osean.png" alt="bsc-osean" width={50} height={50} />
            <span className="ml-3 mr-3"> ETH to BSC</span>
            <Image src="/images/binance_osean.png" alt="bsc-osean" width={50} height={50} />
          </div>
        </div>
        <br />
          <FormControl>
          <FormLabel mt={3}  mb={-1}>Destination Wallet</FormLabel>
          <Text fontSize='xs' as='cite'>Enter your Wallet address at BSC</Text>
        <Input
          type="text"
          value={destWallet}
          onChange={(e) => setDestWallet(e.target.value)}
        />
          </FormControl>
          <FormControl>
            <FormLabel mt={3} mb={-1}>OSEAN amount</FormLabel>
            <Text fontSize='xs' as='cite'>Enter the amount in OSEAN that you wish to bridge to BSC</Text>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </FormControl>
          <FormControl>
          <FormLabel mt={3}  mb={-1}>CrossChain Gas fees in ETH</FormLabel>
          <Text fontSize='xs' as='cite'>Enter Gas Fees amount below. If you get error increase the amount.</Text>
        <Input
          type="text"
          value={gas}
          onChange={(e) => setGas(e.target.value)}
        />
        
        <Text fontSize='xs' as='cite'>** The fees include gas cost for all 3 necessary transactions.</Text>
          </FormControl>
          <Text fontSize='xs' as='cite'><FontAwesomeIcon icon={faGasPump} beat size="xs" /> Gas Fees: <strong>{roundedFeeValue} ETH</strong></Text>  
          
         
          <div style={{ textAlign: "center", marginTop: "10px" }}>
          <Web3Button className="btn btn-lg btn-round mt-4 btn-gradient-blue animated"
        contractAddress="0x50d5118Fb90D572B9d42ba65E0addC4900867809"
        action={(contract) => bridgeFunction(contract).then(() => {})}

        onSuccess={() =>
            toast({
              title: "Transaction Succesful",
              status: "success",
              duration: 15000,
              isClosable: true,
              position: "bottom",
            })
          }
          onError={(error) => {
            const errorLines = error.message.split('\n');
            const reasonLine = errorLines.find((line) => line.startsWith("Reason:"));
            const reason = reasonLine ? reasonLine.replace("Reason:", "").trim() : "Unknown error";
            toast({
              title: `Failed! Reason: ${reason}`,
              status: "error",
              duration: 15000,
              isClosable: true,
            });
          }}
      >
        Bridge To BSC
      </Web3Button>
          </div>
        </form>
      </Box>
    </Flex>
  </Card>
</div>
</ChakraProvider>
  );
}