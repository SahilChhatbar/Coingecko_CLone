import { useState } from "react";
import {Table, Group, Text, Loader, Container, Pagination, Title, Box, Select, Image } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { fetchCryptoData } from "../../../api/coingecko";
import { TABLE_CONFIG, CURRENCY_FORMAT, PRICE_COLORS, PRICE_ARROWS } from "../../../constants";

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_1h_in_currency: number | null;
  price_change_percentage_24h_in_currency: number | null;
  price_change_percentage_7d_in_currency: number | null;
}

const CryptoTable = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(TABLE_CONFIG.ITEMS_PER_PAGE);
  const { data, isLoading, error } = useQuery({
    queryKey: ["cryptoData", page, rowsPerPage],
    queryFn: () => fetchCryptoData(page, rowsPerPage),
    refetchInterval: TABLE_CONFIG.REFETCH_INTERVAL,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(CURRENCY_FORMAT.LOCALE, {
      style: "currency",
      currency: CURRENCY_FORMAT.CURRENCY,
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 4 : 2,
    }).format(value);
  };

  const renderPriceChange = (percentage: number | null) => {
    if (percentage === null) return <Text c="dimmed">-</Text>;
    const color =
      percentage > 0
        ? PRICE_COLORS.POSITIVE
        : percentage < 0
        ? PRICE_COLORS.NEGATIVE
        : PRICE_COLORS.NEUTRAL;
    const arrow =
      percentage > 0
        ? PRICE_ARROWS.UP
        : percentage < 0
        ? PRICE_ARROWS.DOWN
        : PRICE_ARROWS.NEUTRAL;
    return (
      <Text c={color} size="sm">
        {arrow}
        {percentage.toFixed(2)}%
      </Text>
    );
  };

  if (isLoading)
    return (
      <Container className="flex justify-center p-8">
        <Loader size="lg" />
      </Container>
    );

  if (error)
    return (
      <Container className="p-8">
        <Text c="red">Error loading data.</Text>
      </Container>
    );
  return (
    <>
      <Title p="sm" size={26} pb="xl">
        Cryptocurrency Prices by Market Cap
      </Title>
      <Box className="overflow-x-auto md:overflow-visible">
        <Table highlightOnHover className="sticky-header">
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
            {data?.map((crypto: Crypto) => (
              <Table.Tr key={crypto.id}>
                <Table.Td>{crypto.market_cap_rank}</Table.Td>
                <Table.Td className="w-[30%]">
                  <Group
                    gap="sm"
                    py="sm"
                    className="flex flex-row gap-1 items-center"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-8 h-8 flex-shrink-0"
                      />
                      <Text
                        fw={550}
                        size="md"
                        className="overflow-wrap self-center"
                      >
                        {crypto.name}
                        <span className="text-sm text-slate-400 pl-1 font-semibold">
                          {crypto.symbol.toUpperCase()}
                        </span>
                      </Text>
                    </div>
                  </Group>
                </Table.Td>
                <Table.Td className="text-sm">
                  {formatCurrency(crypto.current_price)}
                </Table.Td>
                <Table.Td>
                  {renderPriceChange(
                    crypto.price_change_percentage_1h_in_currency
                  )}
                </Table.Td>
                <Table.Td>
                  {renderPriceChange(
                    crypto.price_change_percentage_24h_in_currency
                  )}
                </Table.Td>
                <Table.Td>
                  {renderPriceChange(
                    crypto.price_change_percentage_7d_in_currency
                  )}
                </Table.Td>
                <Table.Td className="text-sm">
                  {formatCurrency(crypto.total_volume)}
                </Table.Td>
                <Table.Td className="text-sm">
                  {formatCurrency(crypto.market_cap)}
                </Table.Td>
                <Table.Td className="text-sm">
                  <Text c="dimmed" size="sm">
                    Data unavailable
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>
      <div className="flex justify-around items-center pt-4 gap-4">
        <Pagination
          total={TABLE_CONFIG.TOTAL_PAGES}
          value={page}
          onChange={setPage}
          color="green"
        />
        <div className="flex flex-row items-center gap-2">
          <Text c="gray" size="sm">
            Rows
          </Text>
          <Select
            value={String(rowsPerPage)}
            onChange={(value) => setRowsPerPage(Number(value))}
            data={["30", "40", "50", "100"]}
            className="w-18 rounded-6xl"
          />
        </div>
      </div>
    </>
  );
};

export default CryptoTable;