"use client";

import { Button } from "@/components/ui/button";

import type { CategoryWithSubs } from "../types";

interface CategoryFilterProps {
  categories: CategoryWithSubs[];
  selected?: string;
  onSelect: (categoryId?: string) => void;
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button variant={!selected ? "default" : "outline"} onClick={() => onSelect(undefined)}>
        Tous
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selected === category.id ? "default" : "outline"}
          onClick={() => onSelect(category.id)}
        >
          {category.nameFr}
        </Button>
      ))}
    </div>
  );
}
