import { useState } from "react";
import { PokemonDetail } from "@/components/PokemonDetail";
import { PokedexComponent } from "@/components/pokedex";

export default function HomePage() {
  const [selectedPokemonId, setSelectedPokemonId] = useState<string | null>(
    null
  );

  const handlePokemonClick = (id: string) => {
    setSelectedPokemonId(id);
  };

  const handleClose = () => {
    setSelectedPokemonId(null);
  };

  return (
    <div>
      <PokedexComponent onPokemonClick={handlePokemonClick} />
      {selectedPokemonId && (
        <PokemonDetail id={selectedPokemonId} onClose={handleClose} />
      )}
    </div>
  );
}
