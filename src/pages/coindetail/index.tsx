import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchCoinDetails } from "../../api/coingecko";
import { Loader } from "@mantine/core";
import CoinDetails from "./components/CoinDetails";
import CoinGraph from "./components/CoinGraph";

export default function CoinDetail() {
  const { id } = useParams();
  
  const { data: coin, isLoading, error } = useQuery({
    queryKey: ['coinDetails', id],
    queryFn: () => fetchCoinDetails(id as string),
    enabled: !!id,
    staleTime: 300000, 
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load coin data.
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-7xl justify-center ">
      <CoinDetails coin={coin} />
      <CoinGraph coin={coin} />
    </div>
  );
}