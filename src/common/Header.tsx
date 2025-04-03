import { Group, Title, Image } from '@mantine/core';
import gecko from "../assets/gecko.png"

const Header = () => {
  return (
    <div className="flex flex-row items-center justify-center">
    <Group gap="md" align="center" p="md">
      <Image src={gecko} className='w-9 h-9'/>
      <Title order={3} fw={600} c="dark">CoinGecko</Title>
    </Group>
    </div>
  );
};

export default Header;