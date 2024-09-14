"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type Pokemon = {
  id: number;
  name: string;
  types: string[];
  image: string;
  height: number;
  weight: number;
  abilities: string[];
};

type PokemonDetailProps = {
  id: string;
  onClose: () => void; // 追加
};

export function PokemonDetail({ id, onClose }: PokemonDetailProps) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const details = await response.json();
      const pokemonData: Pokemon = {
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
      setPokemon(pokemonData);
    };

    fetchPokemon();
  }, [id]);

  if (!pokemon) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="bg-white">
          {" "}
          {/* 背景色を白に設定 */}
          <DialogHeader>
            <DialogTitle>{pokemon.name}</DialogTitle>
            <DialogDescription>
              ポケモン図鑑番号: {pokemon.id}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center">
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="w-48 h-48 mb-4"
            />
            <div className="flex gap-2 mb-4">
              {pokemon.types.map((type) => (
                <Badge key={type} variant="secondary" className="capitalize">
                  {type}
                </Badge>
              ))}
            </div>
            <p>身長: {pokemon.height}m</p>
            <p>体重: {pokemon.weight}kg</p>
            <p>特性: {pokemon.abilities.join(", ")}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
