"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import Link from "next/link";
import { locations } from "@/lib/locations";
import { whatsappUrl } from "@/lib/site";
import { MapPin, WhatsAppSolid } from "./icons";

const options = [
  { value: "", name: "Quero ajuda para escolher", detail: "Converse com a equipe", payment: "", coverageUrl: undefined as string | undefined },
  ...locations.map((item) => ({
    value: `${item.name} — ${item.neighborhood ?? item.city}`,
    name: item.name.replace(" - Ortopedia e Fisioterapia", "").replace(", Rede D'Or - Ambulatório", "").replace(" - Ambulatório", ""),
    detail: item.neighborhood ?? item.city,
    payment: item.payment === "private" ? "Somente particular" : "Convênios sob consulta",
    coverageUrl: item.coverageUrl,
  })),
];

export function AppointmentChooser() {
  const [location, setLocation] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef({ text: "", time: 0 });
  const selected = options.findIndex((option) => option.value === location);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  useEffect(() => {
    const list = listRef.current;
    const option = document.getElementById(`unit-option-${active}`);
    if (!open || !list || !option) return;
    const top = option.offsetTop - list.offsetTop;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (top + option.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = top + option.offsetHeight - list.clientHeight;
    }
  }, [active, open]);

  function choose(index: number) {
    setLocation(options[index].value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
      if (event.key === "Escape") event.preventDefault();
      return;
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
      setActive(event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : !open ? selected : Math.max(0, Math.min(options.length - 1, active + (event.key === "ArrowDown" ? 1 : -1))));
    } else if ((event.key === "Enter" || event.key === " ") && open) {
      event.preventDefault();
      choose(active);
    } else if (event.key.length === 1 && event.key !== " " && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const now = Date.now();
      const text = (now - searchRef.current.time < 700 ? searchRef.current.text : "") + event.key.toLocaleLowerCase("pt-BR");
      searchRef.current = { text, time: now };
      const match = options.findIndex((option) => option.name.toLocaleLowerCase("pt-BR").startsWith(text));
      if (match >= 0) { event.preventDefault(); setOpen(true); setActive(match); }
    }
  }
  const message = location
    ? `Olá, gostaria de agendar uma consulta com o Dr. Joaquim Lopes em ${location}. Poderiam informar os horários disponíveis e as condições de atendimento?`
    : "Olá, gostaria de agendar uma consulta com o Dr. Joaquim Lopes. Podem me ajudar a escolher a unidade e informar os horários e as condições de atendimento?";

  return (
    <div>
      <label id="appointment-location-label" htmlFor="appointment-location" className="mb-2 block font-semibold text-dark">
        Onde prefere ser atendido?
      </label>
      <div ref={containerRef} className={`relative mb-5 min-w-0 rounded-[18px] border bg-white ${open ? "border-p/40 shadow-soft" : "border-p-light"}`} onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}>
        <button ref={triggerRef} id="appointment-location" type="button" role="combobox"
          aria-labelledby="appointment-location-label" aria-haspopup="listbox" aria-expanded={open}
          aria-controls="appointment-unit-list" aria-activedescendant={open ? `unit-option-${active}` : undefined}
          onKeyDown={onKeyDown} onClick={() => { setActive(selected); setOpen(!open); }}
          className="flex min-h-[76px] w-full cursor-pointer items-center gap-3 rounded-[18px] p-3.5 text-left hover:bg-p-muted/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-p sm:p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-p text-white"><MapPin width={19} height={19} /></span>
          <span className="min-w-0 flex-1"><span className="block text-sm font-semibold leading-snug text-dark">{options[selected].name}</span><span className="mt-1 block text-xs leading-relaxed text-muted">{options[selected].detail}</span></span>
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className={`h-5 w-5 shrink-0 text-p ${open ? "rotate-180" : ""}`}><path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        {open && <div className="border-t border-line px-2 pb-2 pt-3 sm:px-3 sm:pb-3">
          <p className="mb-2 px-2 text-xs font-medium text-muted">Selecione uma unidade</p>
          <ul ref={listRef} id="appointment-unit-list" role="listbox" aria-labelledby="appointment-location-label"
          className="relative max-h-[min(340px,50dvh)] space-y-1 overflow-y-auto overscroll-contain [scrollbar-color:var(--color-p-light)_transparent] [scrollbar-width:thin]">
          {options.map((option, index) => <li key={option.value} id={`unit-option-${index}`} role="option" aria-selected={selected === index}
            onPointerDown={(event) => event.preventDefault()} onClick={() => choose(index)}
            className={`flex min-h-[72px] cursor-pointer items-center gap-2.5 rounded-xl border px-2.5 py-3 hover:bg-p-muted/70 sm:px-3 ${selected === index ? "border-p/25 bg-p-muted" : active === index ? "border-p-light bg-bg-alt" : "border-transparent bg-white"}`}>
            <span aria-hidden="true" className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8 ${selected === index ? "bg-p text-white" : "bg-bg-alt text-p"}`}>
              {index === 0 ? <span className="text-sm font-semibold">?</span> : <MapPin width={15} height={15} />}
            </span>
            <span className="min-w-0 flex-1"><span className={`block text-sm font-semibold leading-snug ${selected === index ? "text-p" : "text-dark"}`}>{option.name}</span><span className="mt-1 block text-xs leading-relaxed text-muted">{option.detail}</span>{option.payment && <span className="mt-1 block text-xs font-medium text-p">{option.payment}</span>}</span>
            <span aria-hidden="true" className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected === index ? "border-p bg-p text-white" : "border-p-light"}`}>
              {selected === index && <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </span>
          </li>)}
        </ul></div>}
      </div>
      {options[selected].payment && <div className="mb-5 rounded-xl border border-p/15 bg-p-muted px-4 py-3 text-sm text-p-dark" aria-live="polite">
        <p className="font-semibold">{options[selected].payment}</p>
        <p className="mt-1 leading-relaxed">{selected === 1 ? "Na Clínica Derplus, a consulta é particular. Consulte valores com a equipe." : "Informe à equipe a operadora e o nome exato do plano para confirmar a cobertura da consulta nesta unidade."}</p>
        {options[selected].coverageUrl && <a href={options[selected].coverageUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center font-semibold underline underline-offset-4">Consultar convênios no site da unidade</a>}
      </div>}
      <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer"
        className="flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-[#176b45] px-4 py-4 text-center text-sm font-semibold text-white hover:bg-[#105335] sm:text-base">
        <WhatsAppSolid width={22} height={22} className="shrink-0" /> Continuar no WhatsApp
      </a>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Uma mensagem será preparada com sua preferência. Você decide quando enviar.
        A consulta só fica agendada após a confirmação da equipe.
      </p>
      <p className="mt-3 text-sm text-muted">A seleção não é armazenada no site. <Link href="/politica-de-privacidade" className="underline underline-offset-4">Privacidade</Link></p>
      <noscript><p className="mt-3 text-sm">Informe sua unidade de preferência na conversa pelo WhatsApp.</p></noscript>
    </div>
  );
}
