import { useState, useRef, useEffect } from "react";
import { Table, Group, Text, Loader, Container, Title, Box, Image } from "@mantine/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchCryptoData, SortOrderType } from "../../../api/coingecko";
import { TABLE_CONFIG, PRICE_COLORS, PRICE_ARROWS } from "../../../constants";
import { formatCurrency } from "../../../utils/utilityfunctions/currency";
import { Crypto, CryptoDataQueryKey, ColumnSortOptions } from "../../../types/cryptotypes"; 
import { useNavigate } from "react-router-dom";
import { Sparklines, SparklinesLine } from "react-sparklines";

const API_SORTABLE_COLUMNS = ["market_cap", "total_volume", "id"];
const columnToSortOptions: ColumnSortOptions = {
  market_cap: {
    asc: "market_cap_asc",
    desc: "market_cap_desc",
  },
  total_volume: {
    asc: "volume_asc",
    desc: "volume_desc",
  },
  id: {
    asc: "id_asc",
    desc: "id_desc",
  },
};

const CryptoTable = () => {
  const navigate = useNavigate();
  const [apiSortOrder, setApiSortOrder] =
    useState<SortOrderType>("market_cap_desc");
  const [activeColumn, setActiveColumn] = useState<string>("market_cap");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["cryptoData", apiSortOrder] as CryptoDataQueryKey,
    queryFn: async ({ pageParam = 1 }) => {
      return fetchCryptoData(pageParam as number, TABLE_CONFIG.ITEMS_PER_PAGE, apiSortOrder);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < TABLE_CONFIG.ITEMS_PER_PAGE) return undefined;
      return allPages.length + 1;
    },
    refetchInterval: TABLE_CONFIG.REFETCH_INTERVAL,
  });
  const observerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);
  
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
  const handleSortRequest = (columnKey: string) => {
    if (API_SORTABLE_COLUMNS.includes(columnKey)) {
      const newDirection =
        activeColumn === columnKey && sortDirection === "asc" ? "desc" : "asc";
      setActiveColumn(columnKey);
      setSortDirection(newDirection);
      const apiSortParam = columnToSortOptions[columnKey][newDirection];
      setApiSortOrder(apiSortParam);
    }
  };
  const getSortIndicator = (columnKey: string) => {
    if (
      API_SORTABLE_COLUMNS.includes(columnKey) &&
      activeColumn === columnKey
    ) {
      return sortDirection === "asc" ? "▲" : "▼";
    }
    return " ";
  };
  const isColumnSortable = (columnKey: string) => {
    return API_SORTABLE_COLUMNS.includes(columnKey);
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
        <Text c="red">Error loading data: {(error as Error).message}</Text>
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
              <Table.Th
                onClick={() => handleSortRequest("id")}
                className={isColumnSortable("id") ? "cursor-pointer" : ""}
              >
                <Group gap="xs">
                  <span>Coin</span>
                  {getSortIndicator("id")}
                </Group>
              </Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>1h</Table.Th>
              <Table.Th>24h</Table.Th>
              <Table.Th>7d</Table.Th>
              <Table.Th
                onClick={() => handleSortRequest("total_volume")}
                className={
                  isColumnSortable("total_volume") ? "cursor-pointer" : ""
                }
              >
                <Group gap="xs">
                  <span>24h Volume</span>
                  {getSortIndicator("total_volume")}
                </Group>
              </Table.Th>
              <Table.Th
                onClick={() => handleSortRequest("market_cap")}
                className={
                  isColumnSortable("market_cap") ? "cursor-pointer" : ""
                }
              >
                <Group gap="xs">
                  <span>Market Cap</span>
                  {getSortIndicator("market_cap")}
                </Group>
              </Table.Th>
              <Table.Th>Last 7 Days</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody className="font-mono">
            {data?.pages.flatMap((page, pageIndex) =>
              page.map((crypto: Crypto) => (
                <Table.Tr
                  key={`${pageIndex}-${crypto.id}`}
                  onClick={() => navigate(`/coin/${crypto.id}`)}
                  className="cursor-pointer hover:bg-gray-100 transition"
                >
                  <Table.Td>{crypto.market_cap_rank}</Table.Td>
                  <Table.Td className="w-2xs">
                    <Group gap="sm" py="sm">
                      <div className="flex items-center gap-2">
                        <Image
                          src={crypto.image}
                          alt={crypto.name}
                          className="w-8 h-8"
                        />
                        <Text fw={550} size="md">
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
                  <Table.Td className="w-[120px] px-2">
                    {crypto.sparkline_in_7d?.price?.length ? (
                      <Sparklines
                        data={crypto.sparkline_in_7d.price}
                        width={100}
                        height={30}
                      >
                        <SparklinesLine
                          color={
                            crypto.sparkline_in_7d.price.at(-1)! >
                            crypto.sparkline_in_7d.price[0]
                              ? "#16a34a"
                              : "#dc2626"
                          }
                        />
                      </Sparklines>
                    ) : (
                      <Text c="dimmed" size="sm">
                        Data unavailable
                      </Text>
                    )}
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Box>
      <div ref={observerRef} className="flex justify-center p-4">
        {isFetchingNextPage && <Loader />}
      </div>
    </>
  );
};

export default CryptoTable;