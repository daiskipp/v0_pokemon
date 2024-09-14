import { useRouter } from "next/router";
import { PokemonDetail } from "@/components/PokemonDetail";

export default function PokemonPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return <div>Loading...</div>;
  }

  return (
    <PokemonDetail id={id as string} onClose={() => router.push("/pokemon")} />
  );
}
