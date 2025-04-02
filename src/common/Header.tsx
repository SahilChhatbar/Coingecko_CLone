import { Group, Title } from '@mantine/core';
import { GiGecko } from "react-icons/gi";

const Header = () => {
  return (
    <div className="flex flex-row items-center justify-center">
    <Group gap="md" align="center" p="md">
      <GiGecko size={27} color='green'/>
      <Title order={3} fw={600} c="dark">CoinGecko</Title>
    </Group>
    </div>
  );
};

export default Header;