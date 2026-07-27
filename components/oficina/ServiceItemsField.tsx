"use client";

import { useState } from "react";
import type { ServiceItem } from "@/domain/types";
import { SERVICE_ITEM_LABELS } from "@/lib/format";

/** Ordem de uso real na oficina, não alfabética. */
const ITEMS: ServiceItem[] = [
  "oil_and_filter",
  "air_filter",
  "brake_pads",
  "brake_fluid",
  "spark_plugs",
  "timing_belt",
  "coolant",
  "battery",
  "tires",
  "alignment",
  "shock_absorbers",
  "clutch",
];

/**
 * Chips em vez de checkboxes: dois toques marcam o serviço típico e o campo
 * não custa nos 30 segundos. São categorias — sem valor, sem quantidade,
 * sem nada que a Receita cruze com faturamento.
 */
export function ServiceItemsField() {
  const [selected, setSelected] = useState<ServiceItem[]>([]);

  function toggle(item: ServiceItem) {
    setSelected((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item],
    );
  }

  return (
    <fieldset>
      <legend className="mb-1 text-sm font-medium text-slate-700">
        Itens trocados ou revisados{" "}
        <span className="font-normal text-slate-400">(opcional)</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {ITEMS.map((item) => {
          const active = selected.includes(item);
          return (
            <button
              key={item}
              type="button"
              onClick={() => toggle(item)}
              aria-pressed={active}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                active
                  ? "border-emerald-600 bg-emerald-600 font-medium text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
              }`}
            >
              {SERVICE_ITEM_LABELS[item]}
            </button>
          );
        })}
      </div>
      {selected.map((item) => (
        <input key={item} type="hidden" name="items" value={item} />
      ))}
      <p className="mt-1 text-xs text-slate-500">
        Aparecem no relatório do comprador e alimentam os alertas de
        manutenção vencida.
      </p>
    </fieldset>
  );
}
