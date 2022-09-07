--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Debian 14.5-1.pgdg110+1)
-- Dumped by pg_dump version 14.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: BlockSync; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."BlockSync" (
    id text NOT NULL,
    "blockSynced" integer NOT NULL
);


ALTER TABLE public."BlockSync" OWNER TO admin;

--
-- Name: Bundle; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Bundle" (
    id text NOT NULL,
    "ethPrice" numeric(65,30) DEFAULT 0 NOT NULL
);


ALTER TABLE public."Bundle" OWNER TO admin;

--
-- Name: Burn; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Burn" (
    id text NOT NULL,
    "transactionId" text NOT NULL,
    "timestamp" bigint NOT NULL,
    "pairId" text NOT NULL,
    liquidity numeric(65,30) NOT NULL,
    sender text,
    amount0 numeric(65,30),
    amount1 numeric(65,30),
    "to" text,
    "logIndex" bigint,
    "amountUSD" numeric(65,30),
    "needsComplete" boolean NOT NULL,
    "feeTo" text,
    "feeLiquidity" numeric(65,30)
);


ALTER TABLE public."Burn" OWNER TO admin;

--
-- Name: LiquidityPosition; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."LiquidityPosition" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "pairId" text NOT NULL,
    "liquidityTokenBalance" numeric(65,30) NOT NULL
);


ALTER TABLE public."LiquidityPosition" OWNER TO admin;

--
-- Name: LiquidityPositionSnapshot; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."LiquidityPositionSnapshot" (
    id text NOT NULL,
    "timestamp" integer NOT NULL,
    block integer NOT NULL,
    "userId" text NOT NULL,
    "pairId" text NOT NULL,
    "token0PriceUSD" numeric(65,30) NOT NULL,
    "token1PriceUSD" numeric(65,30) NOT NULL,
    reserve0 numeric(65,30) NOT NULL,
    reserve1 numeric(65,30) NOT NULL,
    "reserveUSD" numeric(65,30) NOT NULL,
    "liquidityTokenTotalSupply" numeric(65,30) NOT NULL,
    "liquidityTokenBalance" numeric(65,30) NOT NULL,
    "liquidityPositionId" text NOT NULL
);


ALTER TABLE public."LiquidityPositionSnapshot" OWNER TO admin;

--
-- Name: Mint; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Mint" (
    id text NOT NULL,
    "transactionId" text NOT NULL,
    "timestamp" bigint NOT NULL,
    "pairId" text NOT NULL,
    "to" text NOT NULL,
    liquidity numeric(65,30) NOT NULL,
    sender text,
    amount0 numeric(65,30),
    amount1 numeric(65,30),
    "logIndex" bigint,
    "amountUSD" numeric(65,30),
    "feeTo" text,
    "feeLiquidity" numeric(65,30)
);


ALTER TABLE public."Mint" OWNER TO admin;

--
-- Name: Pair; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Pair" (
    id text NOT NULL,
    "token0Id" text NOT NULL,
    "token1Id" text NOT NULL,
    reserve0 numeric(65,30) DEFAULT 0 NOT NULL,
    reserve1 numeric(65,30) DEFAULT 0 NOT NULL,
    "totalSupply" numeric(65,30) DEFAULT 0 NOT NULL,
    "reserveETH" numeric(65,30) DEFAULT 0 NOT NULL,
    "reserveUSD" numeric(65,30) DEFAULT 0 NOT NULL,
    "trackedReserveETH" numeric(65,30) DEFAULT 0 NOT NULL,
    "token0Price" numeric(65,30) DEFAULT 0 NOT NULL,
    "token1Price" numeric(65,30) DEFAULT 0 NOT NULL,
    "volumeToken0" numeric(65,30) DEFAULT 0 NOT NULL,
    "volumeToken1" numeric(65,30) DEFAULT 0 NOT NULL,
    "volumeUSD" numeric(65,30) DEFAULT 0 NOT NULL,
    "untrackedVolumeUSD" numeric(65,30) DEFAULT 0 NOT NULL,
    "txCount" bigint DEFAULT 0 NOT NULL,
    "createdAtTimestamp" bigint NOT NULL,
    "createdAtBlockNumber" bigint NOT NULL,
    "liquidityProviderCount" bigint DEFAULT 0 NOT NULL
);


ALTER TABLE public."Pair" OWNER TO admin;

--
-- Name: PairDayData; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."PairDayData" (
    id text NOT NULL,
    date integer NOT NULL,
    "pairAddress" text NOT NULL,
    "token0Id" text NOT NULL,
    "token1Id" text NOT NULL,
    reserve0 numeric(65,30) NOT NULL,
    reserve1 numeric(65,30) NOT NULL,
    "totalSupply" numeric(65,30) NOT NULL,
    "reserveUSD" numeric(65,30) NOT NULL,
    "dailyVolumeToken0" numeric(65,30) DEFAULT 0 NOT NULL,
    "dailyVolumeToken1" numeric(65,30) DEFAULT 0 NOT NULL,
    "dailyVolumeUSD" numeric(65,30) DEFAULT 0 NOT NULL,
    "dailyTxns" bigint DEFAULT 0 NOT NULL
);


ALTER TABLE public."PairDayData" OWNER TO admin;

--
-- Name: PairHourData; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."PairHourData" (
    id text NOT NULL,
    "hourStartUnix" integer NOT NULL,
    "pairId" text NOT NULL,
    reserve0 numeric(65,30) NOT NULL,
    reserve1 numeric(65,30) NOT NULL,
    "totalSupply" numeric(65,30) NOT NULL,
    "reserveUSD" numeric(65,30) NOT NULL,
    "hourlyVolumeToken0" numeric(65,30) DEFAULT 0 NOT NULL,
    "hourlyVolumeToken1" numeric(65,30) DEFAULT 0 NOT NULL,
    "hourlyVolumeUSD" numeric(65,30) DEFAULT 0 NOT NULL,
    "hourlyTxns" bigint DEFAULT 0 NOT NULL
);


ALTER TABLE public."PairHourData" OWNER TO admin;

--
-- Name: StableswapDayData; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."StableswapDayData" (
    id text NOT NULL,
    date integer NOT NULL,
    "dailyVolumeETH" numeric(65,30) DEFAULT 0 NOT NULL,
    "dailyVolumeUSD" numeric(65,30) DEFAULT 0 NOT NULL,
    "dailyVolumeUntracked" numeric(65,30) DEFAULT 0 NOT NULL,
    "totalVolumeETH" numeric(65,30) DEFAULT 0 NOT NULL,
    "totalLiquidityETH" numeric(65,30) NOT NULL,
    "totalVolumeUSD" numeric(65,30) DEFAULT 0 NOT NULL,
    "totalLiquidityUSD" numeric(65,30) NOT NULL,
    "txCount" bigint NOT NULL
);


ALTER TABLE public."StableswapDayData" OWNER TO admin;

--
-- Name: StableswapFactory; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."StableswapFactory" (
    id text NOT NULL,
    "pairCount" integer DEFAULT 0 NOT NULL,
    "totalVolumeUSD" numeric(65,30) DEFAULT 0 NOT NULL,
    "totalVolumeETH" numeric(65,30) DEFAULT 0 NOT NULL,
    "untrackedVolumeUSD" numeric(65,30) DEFAULT 0 NOT NULL,
    "totalLiquidityUSD" numeric(65,30) DEFAULT 0 NOT NULL,
    "totalLiquidityETH" numeric(65,30) DEFAULT 0 NOT NULL,
    "txCount" bigint DEFAULT 0 NOT NULL
);


ALTER TABLE public."StableswapFactory" OWNER TO admin;

--
-- Name: Swap; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Swap" (
    id text NOT NULL,
    "transactionId" text NOT NULL,
    "timestamp" bigint NOT NULL,
    "pairId" text NOT NULL,
    sender text NOT NULL,
    "from" text NOT NULL,
    "amount0In" numeric(65,30) NOT NULL,
    "amount1In" numeric(65,30) NOT NULL,
    "amount0Out" numeric(65,30) NOT NULL,
    "amount1Out" numeric(65,30) NOT NULL,
    "to" text NOT NULL,
    "logIndex" bigint,
    "amountUSD" numeric(65,30) NOT NULL
);


ALTER TABLE public."Swap" OWNER TO admin;

--
-- Name: Token; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Token" (
    id text NOT NULL,
    symbol text NOT NULL,
    name text NOT NULL,
    decimals bigint NOT NULL,
    "totalSupply" bigint NOT NULL,
    "tradeVolume" numeric(65,30) DEFAULT 0 NOT NULL,
    "tradeVolumeUSD" numeric(65,30) DEFAULT 0 NOT NULL,
    "untrackedVolumeUSD" numeric(65,30) DEFAULT 0 NOT NULL,
    "txCount" bigint DEFAULT 0 NOT NULL,
    "totalLiquidity" numeric(65,30) DEFAULT 0 NOT NULL,
    "derivedETH" numeric(65,30) DEFAULT 0 NOT NULL
);


ALTER TABLE public."Token" OWNER TO admin;

--
-- Name: TokenDayData; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."TokenDayData" (
    id text NOT NULL,
    date integer NOT NULL,
    "tokenId" text NOT NULL,
    "dailyVolumeToken" numeric(65,30) DEFAULT 0 NOT NULL,
    "dailyVolumeETH" numeric(65,30) DEFAULT 0 NOT NULL,
    "dailyVolumeUSD" numeric(65,30) DEFAULT 0 NOT NULL,
    "dailyTxns" bigint DEFAULT 0 NOT NULL,
    "totalLiquidityToken" numeric(65,30) NOT NULL,
    "totalLiquidityETH" numeric(65,30) NOT NULL,
    "totalLiquidityUSD" numeric(65,30) DEFAULT 0 NOT NULL,
    "priceUSD" numeric(65,30) NOT NULL
);


ALTER TABLE public."TokenDayData" OWNER TO admin;

--
-- Name: Transaction; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Transaction" (
    id text NOT NULL,
    "blockNumber" bigint NOT NULL,
    "timestamp" bigint NOT NULL
);


ALTER TABLE public."Transaction" OWNER TO admin;

--
-- Name: User; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."User" (
    id text NOT NULL,
    "usdSwapped" numeric(65,30) DEFAULT 0 NOT NULL
);


ALTER TABLE public."User" OWNER TO admin;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO admin;

--
-- Data for Name: BlockSync; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."BlockSync" (id, "blockSynced") FROM stdin;
BaseV1Pair	85427
BaseV1Factory	641456
\.


--
-- Data for Name: Bundle; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Bundle" (id, "ethPrice") FROM stdin;
1	0.000000000000000000000000000000
\.


--
-- Data for Name: Burn; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Burn" (id, "transactionId", "timestamp", "pairId", liquidity, sender, amount0, amount1, "to", "logIndex", "amountUSD", "needsComplete", "feeTo", "feeLiquidity") FROM stdin;
\.


--
-- Data for Name: LiquidityPosition; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."LiquidityPosition" (id, "userId", "pairId", "liquidityTokenBalance") FROM stdin;
\.


--
-- Data for Name: LiquidityPositionSnapshot; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."LiquidityPositionSnapshot" (id, "timestamp", block, "userId", "pairId", "token0PriceUSD", "token1PriceUSD", reserve0, reserve1, "reserveUSD", "liquidityTokenTotalSupply", "liquidityTokenBalance", "liquidityPositionId") FROM stdin;
\.


--
-- Data for Name: Mint; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Mint" (id, "transactionId", "timestamp", "pairId", "to", liquidity, sender, amount0, amount1, "logIndex", "amountUSD", "feeTo", "feeLiquidity") FROM stdin;
\.


--
-- Data for Name: Pair; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Pair" (id, "token0Id", "token1Id", reserve0, reserve1, "totalSupply", "reserveETH", "reserveUSD", "trackedReserveETH", "token0Price", "token1Price", "volumeToken0", "volumeToken1", "volumeUSD", "untrackedVolumeUSD", "txCount", "createdAtTimestamp", "createdAtBlockNumber", "liquidityProviderCount") FROM stdin;
0x1D20635535307208919f0b67c3B2065965A85aA9	0x4e71A2E537B7f9D9413D3991D37958c0b5e1e503	0x826551890Dc65655a0Aceca109aB11AbDbD7a07B	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0	1660187733	224998	0
0x9571997a66D63958e1B3De9647C22bD6b9e7228c	0x4e71A2E537B7f9D9413D3991D37958c0b5e1e503	0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0	1660187739	224999	0
0x35DB1f3a6A6F07f82C76fCC415dB6cFB1a7df833	0x4e71A2E537B7f9D9413D3991D37958c0b5e1e503	0xd567B3d7B8FE3C79a1AD8dA978812cfC4Fa05e75	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0	1660187745	225000	0
0x30838619C55B787BafC3A4cD9aEa851C1cfB7b19	0x826551890Dc65655a0Aceca109aB11AbDbD7a07B	0xecEEEfCEE421D8062EF8d6b4D814efe4dc898265	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0	1660187750	225001	0
0x216400ba362d8FCE640085755e47075109718C8B	0x5FD55A1B9FC24967C4dB09C513C3BA0DFa7FF687	0x826551890Dc65655a0Aceca109aB11AbDbD7a07B	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0	1660187756	225002	0
0x6515baA1880Cb46B8f69d8818270C1d9278629DA	0x30495442a80a46f2e55049A6BD7E17f8481fF76d	0x826551890Dc65655a0Aceca109aB11AbDbD7a07B	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0	1660667289	307640	0
0xc0CA4c03634bE128b2758Dc74659755aA4e83800	0x4e71A2E537B7f9D9413D3991D37958c0b5e1e503	0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0	1660934259	353990	0
0x830Fbc440a0A61b429b9ece5B7A4aF003537FAD2	0x7264610A66EcA758A8ce95CF11Ff5741E1fd0455	0x826551890Dc65655a0Aceca109aB11AbDbD7a07B	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0	1660952401	357108	0
0x1228038fdA3A3553C54Fd59Ca7E903349d729f08	0x826551890Dc65655a0Aceca109aB11AbDbD7a07B	0xF353eA7BADA68c4C5aaD444872EF53aaae7A0d1b	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0	1661096492	382281	0
0x4eF25aAdB83795A61d97C3563DB33d107d014CF1	0x826551890Dc65655a0Aceca109aB11AbDbD7a07B	0xe350b49e52c9d865735BFD77c956f64585Be7583	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0	1661208560	401825	0
\.


--
-- Data for Name: PairDayData; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."PairDayData" (id, date, "pairAddress", "token0Id", "token1Id", reserve0, reserve1, "totalSupply", "reserveUSD", "dailyVolumeToken0", "dailyVolumeToken1", "dailyVolumeUSD", "dailyTxns") FROM stdin;
\.


--
-- Data for Name: PairHourData; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."PairHourData" (id, "hourStartUnix", "pairId", reserve0, reserve1, "totalSupply", "reserveUSD", "hourlyVolumeToken0", "hourlyVolumeToken1", "hourlyVolumeUSD", "hourlyTxns") FROM stdin;
\.


--
-- Data for Name: StableswapDayData; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."StableswapDayData" (id, date, "dailyVolumeETH", "dailyVolumeUSD", "dailyVolumeUntracked", "totalVolumeETH", "totalLiquidityETH", "totalVolumeUSD", "totalLiquidityUSD", "txCount") FROM stdin;
\.


--
-- Data for Name: StableswapFactory; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."StableswapFactory" (id, "pairCount", "totalVolumeUSD", "totalVolumeETH", "untrackedVolumeUSD", "totalLiquidityUSD", "totalLiquidityETH", "txCount") FROM stdin;
0xE387067f12561e579C5f7d4294f51867E0c1cFba	10	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0
\.


--
-- Data for Name: Swap; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Swap" (id, "transactionId", "timestamp", "pairId", sender, "from", "amount0In", "amount1In", "amount0Out", "amount1Out", "to", "logIndex", "amountUSD") FROM stdin;
\.


--
-- Data for Name: Token; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Token" (id, symbol, name, decimals, "totalSupply", "tradeVolume", "tradeVolumeUSD", "untrackedVolumeUSD", "txCount", "totalLiquidity", "derivedETH") FROM stdin;
0x4e71A2E537B7f9D9413D3991D37958c0b5e1e503	NOTE	NOTE	18	0	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0	0.000000000000000000000000000000	0.000000000000000000000000000000
0x826551890Dc65655a0Aceca109aB11AbDbD7a07B	wCANTO	wCANTO	18	0	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0	0.000000000000000000000000000000	0.000000000000000000000000000000
0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd	USDC	USDC	6	0	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0	0.000000000000000000000000000000	0.000000000000000000000000000000
0xd567B3d7B8FE3C79a1AD8dA978812cfC4Fa05e75	USDT	USDT	6	0	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0	0.000000000000000000000000000000	0.000000000000000000000000000000
0xecEEEfCEE421D8062EF8d6b4D814efe4dc898265	ATOM	ATOM	6	0	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0	0.000000000000000000000000000000	0.000000000000000000000000000000
0x5FD55A1B9FC24967C4dB09C513C3BA0DFa7FF687	ETH	ETH	18	0	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0	0.000000000000000000000000000000	0.000000000000000000000000000000
0x30495442a80a46f2e55049A6BD7E17f8481fF76d	INU	INU	18	0	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0	0.000000000000000000000000000000	0.000000000000000000000000000000
0x7264610A66EcA758A8ce95CF11Ff5741E1fd0455	cINU	cINU	18	0	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0	0.000000000000000000000000000000	0.000000000000000000000000000000
0xF353eA7BADA68c4C5aaD444872EF53aaae7A0d1b	TOPG	TOPG	18	0	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0	0.000000000000000000000000000000	0.000000000000000000000000000000
0xe350b49e52c9d865735BFD77c956f64585Be7583	TOPG	TOPG	18	0	0.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	0	0.000000000000000000000000000000	0.000000000000000000000000000000
\.


--
-- Data for Name: TokenDayData; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."TokenDayData" (id, date, "tokenId", "dailyVolumeToken", "dailyVolumeETH", "dailyVolumeUSD", "dailyTxns", "totalLiquidityToken", "totalLiquidityETH", "totalLiquidityUSD", "priceUSD") FROM stdin;
\.


--
-- Data for Name: Transaction; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Transaction" (id, "blockNumber", "timestamp") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."User" (id, "usdSwapped") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
b965c7f1-b807-43dc-9628-f906b7562cbb	9bc65219d138c4e2c7e70792e37581d0e0c08945e521ae9df0ded8de9c55a64f	2022-09-07 21:03:45.723456+00	20220907210345_init	\N	\N	2022-09-07 21:03:45.666413+00	1
\.


--
-- Name: BlockSync BlockSync_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."BlockSync"
    ADD CONSTRAINT "BlockSync_pkey" PRIMARY KEY (id);


--
-- Name: Bundle Bundle_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Bundle"
    ADD CONSTRAINT "Bundle_pkey" PRIMARY KEY (id);


--
-- Name: Burn Burn_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Burn"
    ADD CONSTRAINT "Burn_pkey" PRIMARY KEY (id);


--
-- Name: LiquidityPositionSnapshot LiquidityPositionSnapshot_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."LiquidityPositionSnapshot"
    ADD CONSTRAINT "LiquidityPositionSnapshot_pkey" PRIMARY KEY (id);


--
-- Name: LiquidityPosition LiquidityPosition_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."LiquidityPosition"
    ADD CONSTRAINT "LiquidityPosition_pkey" PRIMARY KEY (id);


--
-- Name: Mint Mint_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Mint"
    ADD CONSTRAINT "Mint_pkey" PRIMARY KEY (id);


--
-- Name: PairDayData PairDayData_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."PairDayData"
    ADD CONSTRAINT "PairDayData_pkey" PRIMARY KEY (id);


--
-- Name: PairHourData PairHourData_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."PairHourData"
    ADD CONSTRAINT "PairHourData_pkey" PRIMARY KEY (id);


--
-- Name: Pair Pair_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Pair"
    ADD CONSTRAINT "Pair_pkey" PRIMARY KEY (id);


--
-- Name: StableswapDayData StableswapDayData_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."StableswapDayData"
    ADD CONSTRAINT "StableswapDayData_pkey" PRIMARY KEY (id);


--
-- Name: StableswapFactory StableswapFactory_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."StableswapFactory"
    ADD CONSTRAINT "StableswapFactory_pkey" PRIMARY KEY (id);


--
-- Name: Swap Swap_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Swap"
    ADD CONSTRAINT "Swap_pkey" PRIMARY KEY (id);


--
-- Name: TokenDayData TokenDayData_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."TokenDayData"
    ADD CONSTRAINT "TokenDayData_pkey" PRIMARY KEY (id);


--
-- Name: Token Token_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Token"
    ADD CONSTRAINT "Token_pkey" PRIMARY KEY (id);


--
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Burn Burn_pairId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Burn"
    ADD CONSTRAINT "Burn_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES public."Pair"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Burn Burn_transactionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Burn"
    ADD CONSTRAINT "Burn_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES public."Transaction"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LiquidityPositionSnapshot LiquidityPositionSnapshot_liquidityPositionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."LiquidityPositionSnapshot"
    ADD CONSTRAINT "LiquidityPositionSnapshot_liquidityPositionId_fkey" FOREIGN KEY ("liquidityPositionId") REFERENCES public."LiquidityPosition"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LiquidityPositionSnapshot LiquidityPositionSnapshot_pairId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."LiquidityPositionSnapshot"
    ADD CONSTRAINT "LiquidityPositionSnapshot_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES public."Pair"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LiquidityPositionSnapshot LiquidityPositionSnapshot_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."LiquidityPositionSnapshot"
    ADD CONSTRAINT "LiquidityPositionSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LiquidityPosition LiquidityPosition_pairId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."LiquidityPosition"
    ADD CONSTRAINT "LiquidityPosition_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES public."Pair"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LiquidityPosition LiquidityPosition_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."LiquidityPosition"
    ADD CONSTRAINT "LiquidityPosition_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Mint Mint_pairId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Mint"
    ADD CONSTRAINT "Mint_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES public."Pair"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Mint Mint_transactionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Mint"
    ADD CONSTRAINT "Mint_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES public."Transaction"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PairDayData PairDayData_token0Id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."PairDayData"
    ADD CONSTRAINT "PairDayData_token0Id_fkey" FOREIGN KEY ("token0Id") REFERENCES public."Token"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PairDayData PairDayData_token1Id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."PairDayData"
    ADD CONSTRAINT "PairDayData_token1Id_fkey" FOREIGN KEY ("token1Id") REFERENCES public."Token"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PairHourData PairHourData_pairId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."PairHourData"
    ADD CONSTRAINT "PairHourData_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES public."Pair"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Pair Pair_token0Id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Pair"
    ADD CONSTRAINT "Pair_token0Id_fkey" FOREIGN KEY ("token0Id") REFERENCES public."Token"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Pair Pair_token1Id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Pair"
    ADD CONSTRAINT "Pair_token1Id_fkey" FOREIGN KEY ("token1Id") REFERENCES public."Token"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Swap Swap_pairId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Swap"
    ADD CONSTRAINT "Swap_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES public."Pair"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Swap Swap_transactionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Swap"
    ADD CONSTRAINT "Swap_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES public."Transaction"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TokenDayData TokenDayData_tokenId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."TokenDayData"
    ADD CONSTRAINT "TokenDayData_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES public."Token"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

