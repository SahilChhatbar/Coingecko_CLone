import { useState } from "react";
import { Card, Title, Text, Group, Image, Divider, Badge, Progress, TextInput, Select, Stack, Anchor, Space } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "../../../utils/utilityfunctions/date";
import { calculatePriceProgressInRange } from "../../../utils/utilityfunctions/price";
import { cryptoToUsd, usdToCrypto } from "../../../utils/utilityfunctions/currency";
import { CoinDetail } from "../../../types/cryptotypes";

interface CoinDetailsProps {
  coin: CoinDetail;
}

export default function CoinDetails({ coin }: CoinDetailsProps) {
  const [cryptoAmount, setCryptoAmount] = useState<number>(1);
  const [usdAmount, setUsdAmount] = useState<number>(coin.market_data.current_price.usd);
  const [conversionDirection, setConversionDirection] = useState<'crypto-to-usd' | 'usd-to-crypto'>('crypto-to-usd');
  
  const { data: currentPrice } = useQuery({
    queryKey: ['coinPrice', coin.id],
    queryFn: () => coin.market_data.current_price.usd,
    initialData: coin.market_data.current_price.usd,
    refetchInterval: 60000, 
  });
  
  const handleCryptoChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setCryptoAmount(numValue);
    setConversionDirection('crypto-to-usd');
    setUsdAmount(cryptoToUsd(numValue, currentPrice || coin.market_data.current_price.usd));
  };
  
  const handleUsdChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setUsdAmount(numValue);
    setConversionDirection('usd-to-crypto');
    setCryptoAmount(usdToCrypto(numValue, currentPrice || coin.market_data.current_price.usd));
  };
  
  const marketData = coin.market_data;
  
  return (
    <Card
      shadow="none"
      className="w-full md:w-1/3 border-r-1 border-gray-200"
    >
      <Group justify="apart" mb="md">
        <Group>
          <Image
            src={coin.image.large}
            alt={coin.name}
            className="w-7 h-7"
            radius="xl"
          />
            <Group gap="xs">
              <Title order={3}>{coin.name}</Title>
              <Text size="sm" c="dimmed">
                {coin.symbol.toUpperCase()} Price
              </Text>
            </Group>
        </Group>
        <Badge size="sm" variant="light" c="gray" radius="sm">
          #{coin.market_cap_rank}
        </Badge>
      </Group>
      <Group justify="apart" align="center" mb="md">
        <Text size="xl" fw={700}>
          ${marketData.current_price.usd.toFixed(2)}
        </Text>
        <Text size="sm" c={marketData.price_change_percentage_24h >= 0 ? "green" : "red"}>
            {marketData.price_change_percentage_24h >= 0 ? "▲   " : "▼"}
          {marketData.price_change_percentage_24h.toFixed(1)}%
        </Text>
      </Group>
      <Stack gap="xs" mb="md">
        <Group justify="apart">
          <Text size="sm" c="gray">{marketData.current_price.btc.toFixed(5)} BTC</Text>
          <Text
            size="sm"
            c={
              (marketData.price_change_percentage_24h_in_currency?.btc ?? 0) >= 0
                ? "green"
                : "red"
            }
          >  {(marketData.price_change_percentage_24h_in_currency?.btc ?? 0) >= 0 ? "▲   " : "▼"}
            {(marketData.price_change_percentage_24h_in_currency?.btc ?? 0).toFixed(1)}%
          </Text>
        </Group>
      </Stack>
      <Stack gap="xs" mb="md">
        <Group>
          <Progress
            value={calculatePriceProgressInRange(
              marketData.current_price.usd,
              marketData.low_24h.usd,
              marketData.high_24h.usd
            )}
            size="sm"
            color={
              marketData.price_change_percentage_24h >= 0 ? "green" : "green"
            }
            className="flex-1"
          />
        </Group>
        <Group justify="space-between" gap="xs" wrap="nowrap">
          <Text size="sm" fw={500}>${marketData.low_24h.usd.toFixed(2)}</Text>
          <Text size="sm" fw={500} className="self-center">
            24h Range
          </Text>
          <Text size="sm" fw={500}>${marketData.high_24h.usd.toFixed(2)}</Text>
        </Group>
      </Stack>
      <Stack gap="md">
        <Group justify="space-between">
          <Group gap={4}>
            <Text size="sm" c="dimmed" fw={500}>
              Market Cap
            </Text>
          </Group>
          <Text>${marketData.market_cap.usd.toLocaleString()}</Text>
        </Group>
        <Divider />
        <Group justify="space-between">
          <Group gap={4}>
            <Text size="sm" c="dimmed" fw={500}>
              Fully Diluted Valuation
            </Text>
          </Group>
          <Text>
            $
            {marketData.fully_diluted_valuation?.usd?.toLocaleString() ||
              "N/A"}
          </Text>
        </Group>
        <Divider/>
        <Group justify="space-between">
          <Group gap={4}>
            <Text size="sm" c="dimmed" fw={500}>
              24 Hour Trading Vol
            </Text>
          </Group>
          <Text>${marketData.total_volume.usd.toLocaleString()}</Text>
        </Group>
        <Divider />
        <Group justify="space-between">
          <Group gap={4}>
            <Text size="sm" c="dimmed" fw={500}>
              Circulating Supply
            </Text>
          </Group>
          <Text>{marketData.circulating_supply.toLocaleString()}</Text>
        </Group>
        <Divider />
        <Group justify="space-between">
          <Group gap={4}>
            <Text size="sm" c="dimmed" fw={500}>
              Total Supply
            </Text>
          </Group>
          <Text>{marketData.total_supply?.toLocaleString() || "N/A"}</Text>
        </Group>
        <Divider />
        <Group justify="space-between">
          <Group gap={4}>
            <Text size="sm" c="dimmed" fw={500}>
              Max Supply
            </Text>
          </Group>
          <Text>{marketData.max_supply?.toLocaleString() || "N/A"}</Text>
        </Group>
        <Divider mb={30}/>
      </Stack>
      <Title order={5} mb="md">
        Info
      </Title>
      <Stack gap="xs" mb="md">
        <Group justify="space-between">
          <Text size="sm" c="dimmed" fw={500}>
            Website
          </Text>
          <Group gap={4}>
            {coin.links.homepage[0] && (
              <Anchor
                href={coin.links.homepage[0]}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge size="sm" variant="light" c="gray" radius="sm">
                  Bitcoin.org
                </Badge>
              </Anchor>
            )}
            {coin.links.whitepaper && (
              <Anchor
                href={coin.links.whitepaper}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge size="sm" variant="light" c="gray" radius="sm">
                  Whitepaper
                </Badge>
              </Anchor>
            )}
          </Group>
        </Group>
        <Divider />
        <Group justify="space-between">
          <Text size="sm" c="dimmed" fw={500}>
            Community
          </Text>
          <Group gap={4} wrap="wrap">
            {coin.links.subreddit_url && (
              <Anchor
                href={coin.links.subreddit_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge size="sm" variant="light" c="gray" radius="sm">
                  Reddit
                </Badge>
              </Anchor>
            )}
            {coin.links.twitter_screen_name && (
              <Anchor
                href={`https://twitter.com/${coin.links.twitter_screen_name}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge size="sm" variant="light" c="gray" radius="sm">
                  Twitter
                </Badge>
              </Anchor>
            )}
            {coin.links.facebook_url && (
              <Anchor
                href={coin.links.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge size="sm" variant="light" c="gray" radius="sm">
                  Facebook
                </Badge>
              </Anchor>
            )}
            <Anchor
              href="https://bitcointalk.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Badge size="sm" variant="light" c="gray" radius="sm">
                bitcointalk.org
              </Badge>
              </Anchor>
          </Group>
        </Group>
        <Divider />
        <Group justify="space-between">
          <Text size="sm" c="dimmed" fw={500}>
            Search on
          </Text>
          <Anchor
            href={`https://twitter.com/search?q=${coin.name}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Group gap={4}>
              <Badge size="sm" variant="light" c="gray" radius="sm">
                Twitter
              </Badge>
            </Group>
          </Anchor>
        </Group>
        <Divider />
        <Group justify="space-between">
          <Text size="sm" c="dimmed" fw={500}>
            Source Code
          </Text>
          {coin.links.repos_url?.github?.[0] && (
            <Anchor
              href={coin.links.repos_url.github[0]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Group gap={4}>
                <Badge size="sm" variant="light" c="gray" radius="sm">
                  Github
                </Badge>
              </Group>
            </Anchor>
          )}
        </Group>
        <Divider mb={15}/>
      </Stack>
      <Title order={5} mb="md">
        {coin.symbol.toUpperCase()} Converter
      </Title>
      <Group mb="md" grow>
        <TextInput
          value={cryptoAmount.toString()}
          onChange={(e) => handleCryptoChange(e.target.value)}
        />
        <Select
          value={coin.symbol.toUpperCase()}
          data={[
            {
              value: coin.symbol.toUpperCase(),
              label: coin.symbol.toUpperCase(),
            },
          ]}
        />
      </Group>
      <Group grow>
        <TextInput
          value={usdAmount.toString()}
          onChange={(e) => handleUsdChange(e.target.value)}
        />
        <Select value="USD" data={[{ value: "USD", label: "USD" }]} />
      </Group>
      <Space h="md" />
      <Title order={5} mb="md">
        {coin.symbol.toUpperCase()} Historical Price
      </Title>
      <Stack gap="md">
        <Group justify="space-between">
          <Text size="sm" fw={500}>24h Range</Text>
          <Text size="sm">
            ${marketData.low_24h.usd.toFixed(2)} - $
            {marketData.high_24h.usd.toFixed(2)}
          </Text>
        </Group>
        <Divider />
        <Group justify="space-between">
          <Text size="sm" fw={500}>7d Range</Text>
          <Text size="sm">
            ${(marketData.current_price.usd * 0.9).toFixed(2)} - $
            {(marketData.current_price.usd * 1.1).toFixed(2)}
          </Text>
        </Group>
        <Divider />
        <Stack gap={0}>
          <Group justify="space-between">
            <Text size="sm" fw={500}>All-Time High</Text>
            <Group gap={4}>
              <Text>${marketData.ath.usd.toFixed(2)}</Text>
              <Text c="red" size="sm">
                {marketData.ath_change_percentage.usd.toFixed(1)}%
              </Text>
            </Group>
          </Group>
          <Divider />
          <Text size="xs" c="dimmed" ta="right">
            {formatDate(marketData.ath_date.usd)}
          </Text>
        </Stack>
        <Stack gap={0}>
          <Group justify="space-between">
            <Text size="sm" fw={500}>All-Time Low</Text>
            <Group gap={4}>
              <Text>${marketData.atl.usd.toFixed(2)}</Text>
              <Text c="green" size="sm">
                +{Math.abs(marketData.atl_change_percentage.usd).toFixed(1)}%
              </Text>
            </Group>
          </Group>
          <Divider />
          <Text size="xs" c="dimmed" ta="right">
            {formatDate(marketData.atl_date.usd)}
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
}