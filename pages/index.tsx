import { Container, Flex, SimpleGrid } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import React from "react";
import { OseanHeaderLinks } from "../components/oseanHeader";
import { Loading } from "./loading";
import Results from "../components/dao/results";
import Link from "next/link";
import { DAO_ADDRESS } from "../cost/addresses";

const Home: NextPage = () => {
  const address = useAddress();

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) {
    return (
    <div>
    <OseanHeaderLinks />
    <Loading />
    </div> 
    )
  }

 /* if (!address) {
    return (
      <Container maxW={"1200px"}>
        <Flex h={"50vh"} justifyContent={"center"} alignItems={"center"}>
          <div>
            <h1>Please Connect a Wallet</h1>
          </div>
        </Flex>
      </Container>
    );
  } */

  return (
    <Container maxW={"100%"}>

              <div className="sub-page">
                
                <div className="page-header">
                    <div className="img"></div>
                    <div className="head-content container-fluid">
                        <div className="container">
                            <h1 className="page-title">DAO Archive</h1>
                           
                            <div className="breadcrumb">
                                <a href="https://osean.online">Home</a> / 
                                <a className="current">Proposal</a>
                            </div>
                           
                        </div>
                    </div>
                </div>
            </div>
    
    <Container maxW={"1200px"}>



      <div className="breadcrumb" style={{marginTop:"50px"}}>
        <Link href="/">Archive &nbsp;</Link> /&nbsp; 
        <Link href="/vote">Quorum &nbsp;</Link> /&nbsp; 
        <Link href="/proposals">Submit a Proposal &nbsp;</Link> /&nbsp;
        <Link href="/decoder">Decode proposal Data</Link>
      </div>
      <div style={{marginTop:"70px", marginBottom:"50px"}}>
      
      <Results />
      <div style={{marginTop:"50px", marginBottom:"50px"}}>
      <p style={{ textAlign: 'center' }}> <br />
          DAO contract on{' '}
          <a
            target="_blank"
            rel="noopener"
            className="chakra-link chakra-button css-1c0d5xu"
            href={`https://bscscan.com/address/${DAO_ADDRESS}`}
          >
            bscscan{' '}
            <span
              style={{ display: 'inline-block' }}
              className="chakra-button__icon css-1hzyiq5"
            >
              <svg
                stroke="currentColor"
                fill="none"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round"
                focusable="false"
                className="chakra-icon css-13otjrl"
                aria-hidden="true"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </span>
          </a>
        </p>
        <p style={{ textAlign: 'center' }}>
          Get OSEAN DAO contract ABI {' '}
          <a
            target="_blank"
            rel="noopener"
            className="chakra-link chakra-button css-1c0d5xu"
            href={`https://osean.online/assets/daoABI.json`}
          >
            here{' '}
            <span
              style={{ display: 'inline-block' }}
              className="chakra-button__icon css-1hzyiq5"
            >
              <svg
                stroke="currentColor"
                fill="none"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round"
                focusable="false"
                className="chakra-icon css-13otjrl"
                aria-hidden="true"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </span>
          </a>
        </p>
      </div>
      </div>
    </Container>
    </Container>
  );
};

export default Home;
