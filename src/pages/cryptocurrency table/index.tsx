import { useState } from "react";
import {
  Table,
  Group,
  Text,
  Badge,
  Loader,
  Container,
  Pagination,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Cryptocurrency {
  id: string;
  market_cap_rank: number;
  image: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
  total_volume: number;
  market_cap: number;
}

const CryptoTable = () => {
  const COINGECKO_API_KEY = "CG-mShSwgjwD1gjfR27rsYDQTyY";
  const [page, setPage] = useState(1);
  const perPage = 100;
  const { data, isLoading, error } = useQuery({
    queryKey: ["cryptoData", page, perPage],
    queryFn: async () => {
      const baseUrl = "https://api.coingecko.com/api/v3";
      const endpoint = "/coins/markets";
      const params = {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: perPage,
        page: page,
        sparkline: false,
        price_change_percentage: "1h,24h,7d",
      };

      const headers =
        COINGECKO_API_KEY !== "CG-mShSwgjwD1gjfR27rsYDQTyY"
          ? {
              "x-cg-pro-api-key": COINGECKO_API_KEY,
            }
          : {};

      const response = await axios.get(`${baseUrl}${endpoint}`, {
        params,
        headers,
      });
      return response.data as Cryptocurrency[];
    },
    refetchInterval: 60000,
  });
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 4 : 2,
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 2,
    }).format(value);
  };

  const renderPriceChange = (percentage: number | null) => {
    if (percentage === null) return <Text c="dimmed">-</Text>;

    const color = percentage > 0 ? "green" : percentage < 0 ? "red" : "gray";
    const arrow = percentage > 0 ? "▲" : percentage < 0 ? "▼" : "";
    return (
      <Badge color={color} variant="light">
        {arrow} {Math.abs(percentage).toFixed(1)}%
      </Badge>
    );
  };

  if (isLoading)
    return (
      <Container
      className="flex justify-center p-8"
      >
        <Loader size="lg" />
      </Container>
    );

  if (error)
    return (
      <Container className="p-8">
        <Text>
          Error loading data. Please check your API key and connection.
        </Text>
      </Container>
    );

  return (<>
    <Title p="sm" size={26} pb="xl">Cryptocurrency Prices by Market Cap</Title>
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr className="font-sans text-sm">
            <Table.Th>#</Table.Th>
            <Table.Th>Coin</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>1h</Table.Th>
            <Table.Th>24h</Table.Th>
            <Table.Th>7d</Table.Th>
            <Table.Th>24h Volume</Table.Th>
            <Table.Th>Market Cap</Table.Th>
            <Table.Th>Last 7 Days</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody className="font-mono">
          {data?.map((crypto) => (
            <Table.Tr key={crypto.id}>
              <Table.Td>{crypto.market_cap_rank}</Table.Td>
              <Table.Td className="w-[40%]">
                <Group gap="sm"py="sm" className="flex flex-row gap-1 justify-center items-center">
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                   className="w-8 h-8"
                  />
                    <Text fw={550} size="md">{crypto.name}<span className="text-sm p-1 text-slate-400">{crypto.symbol.toUpperCase()}</span></Text>
                </Group>
              </Table.Td>
              <Table.Td className="text-[16px]">{formatCurrency(crypto.current_price)}</Table.Td>
              <Table.Td className="text-[16px]">
                {renderPriceChange(
                  crypto.price_change_percentage_1h_in_currency
                )}
              </Table.Td>
              <Table.Td className="text-[16px]">
                {renderPriceChange(
                  crypto.price_change_percentage_24h_in_currency
                )}
              </Table.Td>
              <Table.Td className="text-[16px]">
                {renderPriceChange(
                  crypto.price_change_percentage_7d_in_currency
                )}
              </Table.Td>
              <Table.Td className="text-[16px]">{formatLargeNumber(crypto.total_volume)}</Table.Td>
              <Table.Td className="text-[16px]">{formatLargeNumber(crypto.market_cap)}</Table.Td>
              <Table.Td className="text-[16px]">
                <Text c="dimmed" size="sm">
                  Data unavailable
                </Text>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Pagination total={data?.length ?? 0} value={page} onChange={setPage} className="flex justify-center"/>
      </>
  );
};

export default CryptoTable;
