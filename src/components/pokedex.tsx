"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/router";
import { Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ポケモンのタイプを定義
const pokemonTypes = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

// ポケモンの型定義
type Pokemon = {
  id: number;
  name: string;
  types: string[];
  image: string;
  height: number;
  weight: number;
  abilities: string[];
};

type PokedexComponentProps = {
  onPokemonClick: (id: string) => void;
};

export const PokedexComponent: React.FC<PokedexComponentProps> = ({
  onPokemonClick,
}) => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPokemon = async () => {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=151"
      );
      const data = await response.json();
      const pokemonData = await Promise.all(
        data.results.map(async (pokemon: { name: string; url: string }) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();
          return {
            id: details.id,
            name: details.name,
            types: details.types.map(
              (typeInfo: { type: { name: string } }) => typeInfo.type.name
            ),
            image: details.sprites.front_default,
            height: details.height / 10,
            weight: details.weight / 10,
            abilities: details.abilities.map(
              (abilityInfo: { ability: { name: string } }) =>
                abilityInfo.ability.name
            ),
          };
        })
      );
      setPokemon(pokemonData);
      setFilteredPokemon(pokemonData);
    };

    fetchPokemon();
  }, []);

  useEffect(() => {
    let result = pokemon;
    if (searchTerm) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedType) {
      result = result.filter((p) => p.types.includes(selectedType));
    }
    setFilteredPokemon(result);
  }, [searchTerm, selectedType, pokemon]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType(null);
  };

  const handleClick = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault(); // 画面遷移を防ぐ
    onPokemonClick(id);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">ポケモン図鑑</h1>

      <div className="mb-6 flex flex-wrap gap-4">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="ポケモンを検索..."
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {pokemonTypes.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              onClick={() =>
                setSelectedType(selectedType === type ? null : type)
              }
              className="capitalize"
            >
              {type}
            </Button>
          ))}
        </div>
        <Button
          onClick={resetFilters}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw size={20} />
          フィルターをリセット
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPokemon.map((poke) => (
          <div
            key={poke.id}
            className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleClick(poke.id.toString())}
          >
            <img
              src={poke.image}
              alt={poke.name}
              className="w-32 h-32 mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold text-center mb-2">
              {poke.name}
            </h2>
            <div className="flex justify-center gap-2">
              {poke.types.map((type) => (
                <Badge key={type} variant="secondary" className="capitalize">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
