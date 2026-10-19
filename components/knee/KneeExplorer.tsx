"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { defaultKneeLayers, kneeLayerForPart, kneeLayers, kneeParts, type KneeLayerId, type KneeLayerState, type KneePartId } from "@/lib/knee-anatomy";
import type { KneeViewer, KneeView } from "./knee-scene";
import { KneeQuickSummary } from "./KneeQuickSummary";

export function KneeExplorer() {
  const host = useRef<HTMLDivElement>(null);
  const viewer = useRef<KneeViewer | null>(null);
  const [{ selected, focused, quickSummary }, setSelection] = useState({
    selected: "meniscos" as KneePartId,
    focused: false,
    quickSummary: false,
  });
  const [inside, setInside] = useState(false);
  const [detail, setDetail] = useState(true);
  const [layers, setLayers] = useState<KneeLayerState>({ ...defaultKneeLayers });
  const selectionTrigger = useRef<HTMLElement | null>(null);
  const [flexion, setFlexion] = useState(0);
  const [playing, setPlaying] = useState(false);
  const angleRef = useRef(0);
  const [view, setView] = useState<KneeView>("front");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const part = kneeParts.find(p => p.id === selected)!;
  const selectPart = useCallback((id: KneePartId, origin: "model" | "panel" = "model") => {
    selectionTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const showSummary = origin === "model" && window.matchMedia("(max-width: 680px)").matches;
    setSelection(previous => {
      const focused = previous.selected !== id || !previous.focused;
      return { selected: id, focused, quickSummary: focused && showSummary };
    });
    setLayers(previous => ({ ...previous, [kneeLayerForPart(id)]: true }));
    setPlaying(false);
  }, []);
  const closeSummary = useCallback(() => {
    setSelection(previous => ({ ...previous, quickSummary: false }));
    if (selectionTrigger.current?.isConnected) selectionTrigger.current.focus({ preventScroll: true });
  }, []);
  const toggleLayer = (id: KneeLayerId) => {
    setLayers(previous => ({ ...previous, [id]: !previous[id] }));
    if (id === kneeLayerForPart(selected) && layers[id]) {
      setSelection(previous => ({ ...previous, focused: false, quickSummary: false }));
    }
  };
  const restore = () => {
    setPlaying(false); setFlexion(0); setLayers({ ...defaultKneeLayers });
    setSelection({ selected: "meniscos", focused: false, quickSummary: false });
    setInside(false); setDetail(true); setView("front");
    viewer.current?.view("front"); viewer.current?.frame(true);
  };

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let cancelled = false;
    const observer = new IntersectionObserver(entries => {
      // Wait until the visitor can see a meaningful part of the model, including
      // short landscape viewports, before starting the WebGL setup and download.
      if (!entries.some(entry => entry.isIntersecting && entry.intersectionRect.height >= Math.min(entry.boundingClientRect.height * 0.5, window.innerHeight * 0.35))) return;
      observer.disconnect();
      import("./knee-scene").then(({ createKneeViewer }) => {
        if (cancelled) return;
        viewer.current = createKneeViewer(container, selectPart, () => setStatus("ready"), () => setStatus("error"));
      }).catch(() => { if (!cancelled) setStatus("error"); });
    }, { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 1] });
    observer.observe(container);
    return () => { cancelled = true; observer.disconnect(); viewer.current?.dispose(); viewer.current = null; };
  }, [attempt, selectPart]);

  useEffect(() => { viewer.current?.select(selected); }, [selected, status]);
  useEffect(() => { viewer.current?.inside(inside); }, [inside, status]);
  useEffect(() => { viewer.current?.view(view); }, [view, status]);
  useEffect(() => { viewer.current?.frame(detail); }, [detail, status]);
  useEffect(() => { viewer.current?.layers(layers); }, [layers, status]);
  useEffect(() => { viewer.current?.spotlight(focused); }, [focused, status]);
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 680px)");
    const onChange = () => { if (!mobile.matches) setSelection(previous => ({ ...previous, quickSummary: false })); };
    mobile.addEventListener("change", onChange);
    return () => mobile.removeEventListener("change", onChange);
  }, []);
  useEffect(() => { angleRef.current = flexion; viewer.current?.flex(flexion); }, [flexion, status]);
  useEffect(() => {
    if (!playing || status !== "ready") return;
    let frame = 0;
    const start = performance.now();
    const phase = Math.acos(1 - 2 * Math.min(angleRef.current, 100) / 100);
    const animate = (time: number) => {
      const angle = Math.round(50 - 50 * Math.cos(phase + (time - start) * Math.PI * 2 / 6500));
      setFlexion(angle);
      frame = requestAnimationFrame(animate);
    };
    const onVisibility = () => { if (document.hidden) setPlaying(false); };
    const visibility = new IntersectionObserver(entries => {
      if (entries.every(entry => !entry.isIntersecting)) setPlaying(false);
    });
    if (host.current) visibility.observe(host.current);
    frame = requestAnimationFrame(animate);
    document.addEventListener("visibilitychange", onVisibility);
    return () => { cancelAnimationFrame(frame); visibility.disconnect(); document.removeEventListener("visibilitychange", onVisibility); };
  }, [playing, status]);

  return (
    <div className="knee-explorer" id="explorar-joelho">
      <div className="knee-explorer-top">
        <span><span className="knee-live-dot" /> ATLAS INTERATIVO</span>
        <span>Gire, explore e movimente</span>
      </div>
      <div className="knee-layer-toolbar">
        <span className="knee-layer-title">CAMADAS</span>
        <div className="knee-layer-buttons" role="group" aria-label="Camadas visíveis">
          {kneeLayers.map(layer => <button key={layer.id} type="button" aria-pressed={layers[layer.id]} onClick={() => toggleLayer(layer.id)}>
            <span className="knee-layer-check" aria-hidden="true" style={{ borderColor: layer.color }}>{layers[layer.id] ? "✓" : ""}</span>{layer.name}
          </button>)}
        </div>
        <button type="button" className="knee-restore" data-analytics-action="restore" onClick={restore}><span aria-hidden="true">↺</span> Restaurar visão</button>
      </div>
      <div className="knee-selection-strip" data-focused={focused}>
        <p>{focused ? <><span>{part.number}</span> Explorando <strong>{part.name}</strong><span className="knee-selection-explanation"> · Clique novamente para ver o conjunto</span></> : "Toque em um número para destacar uma estrutura."}</p>
        <button type="button" aria-pressed={focused} onClick={() => { setSelection(previous => ({ ...previous, focused: !previous.focused, quickSummary: false })); setLayers(previous => ({ ...previous, [kneeLayerForPart(selected)]: true })); }}>{focused ? "Ver conjunto" : "Destacar seleção"}</button>
      </div>
      <div className="knee-explorer-grid">
        <div className="knee-visual">
          <div className="knee-stage-meta"><span>{focused ? `${part.number} · ${part.name.toUpperCase()}` : "ANATOMIA DO JOELHO"}</span><span>3D / 360°</span></div>
          <div className="knee-stage" ref={host} />
          <noscript><p className="knee-loading">Ative o JavaScript para explorar o modelo 3D. O guia de anatomia abaixo está disponível para leitura.</p></noscript>
          {status !== "ready" && <div className="knee-loading" role="status">
            {status === "loading" ? <><span className="knee-spinner" /> Preparando seu joelho em 3D…</> : <>
              <p>Não foi possível carregar o modelo 3D.</p>
              <p>Explore todas as estruturas pela lista ao lado ou pelo guia abaixo.</p>
              <button type="button" onClick={() => { setStatus("loading"); setAttempt(n => n + 1); }}>Tentar novamente</button>
            </>}
          </div>}
          {status === "ready" && !Object.values(layers).some(Boolean) && <div className="knee-empty-layers" role="status"><p>Nenhuma camada está visível.</p><button type="button" onClick={() => setLayers({ ...defaultKneeLayers })}>Mostrar todas as camadas</button></div>}
          <div className="knee-stage-tools">
            <button type="button" aria-pressed={inside} onClick={() => setInside(!inside)} className={inside ? "is-on" : ""}>
              <span aria-hidden="true">◉</span> Ver por dentro
            </button>
            <button type="button" onClick={() => setDetail(!detail)} disabled={status !== "ready"}>
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" style={{ display: "inline", marginRight: 5 }}><path d="M1 6V1h5M10 1h5v5M15 10v5h-5M6 15H1v-5" /></svg>
              {detail ? "Ver modelo inteiro" : "Focar articulação"}
            </button>
            <div className="knee-zoom">
              <button type="button" aria-label="Aproximar joelho" disabled={status !== "ready"} onClick={() => viewer.current?.zoom(1)}>+</button>
              <button type="button" aria-label="Afastar joelho" disabled={status !== "ready"} onClick={() => viewer.current?.zoom(-1)}>−</button>
            </div>
          </div>
          <div className="knee-view-controls" role="group" aria-label="Ângulo de visualização">
            {([{ id: "front", label: "Frente" }, { id: "side", label: "Lateral" }, { id: "back", label: "Atrás" }] as const).map(item => (
              <button key={item.id} type="button" data-analytics-action={item.id} aria-pressed={view === item.id} onClick={() => setView(item.id)}>{item.label}</button>
            ))}
          </div>
          <p className="knee-gesture"><span aria-hidden="true">↔</span> Arraste para girar · Toque nos números para conhecer</p>
          <div className="knee-motion">
            <button type="button" className="knee-play" data-analytics-action={playing ? "pause" : "play"} disabled={status !== "ready"} aria-label={playing ? "Pausar movimento do joelho" : "Reproduzir movimento do joelho"} aria-pressed={playing} onClick={() => { if (!playing) setView("side"); setPlaying(!playing); }}>
              {playing ? <svg aria-hidden="true" width="14" height="16" viewBox="0 0 14 16" fill="currentColor"><path d="M2 2h3v12H2zM9 2h3v12H9z" /></svg> : <svg aria-hidden="true" width="14" height="16" viewBox="0 0 14 16" fill="currentColor"><path d="M2 1l11 7-11 7z" /></svg>}
            </button>
            <div className="knee-motion-main">
              <div className="knee-motion-heading"><label htmlFor="knee-flexion">Dobre o joelho <span>Movimento ilustrativo</span></label><output htmlFor="knee-flexion">{flexion}°</output></div>
              <input id="knee-flexion" type="range" min="0" max="110" step="1" value={flexion} disabled={status !== "ready"} aria-valuetext={`${flexion} graus de flexão`} onChange={e => { setPlaying(false); setFlexion(Number(e.target.value)); }} />
              <div className="knee-motion-ticks"><span>0° · Estendido</span><span>Arraste para dobrar</span><span>110°</span></div>
            </div>
          </div>
        </div>
        <div className="knee-information">
          <div className="knee-parts-label">O QUE VOCÊ QUER CONHECER?</div>
          <div className="knee-parts" role="group" aria-label="Estruturas do joelho">
            {kneeParts.map(item => <button key={item.id} type="button" data-part={item.id} aria-label={`Conhecer ${item.name}`} aria-pressed={focused && selected === item.id} aria-controls="knee-detail" onClick={() => selectPart(item.id,"panel")}>
              <span className="knee-part-number" aria-hidden="true">{item.number}</span>{item.name}
            </button>)}
          </div>
          <div id="knee-detail" className="knee-detail" aria-live="polite" aria-atomic="true">
            <div className="knee-detail-eyebrow"><span>{part.category}</span><span>{part.number} / {String(kneeParts.length).padStart(2, "0")}</span></div>
            <h2>{part.name}</h2>
            <p className="knee-detail-summary">{part.summary}</p>
            <div className="knee-detail-block"><h3>O que é</h3><p>{part.what}</p></div>
            <div className="knee-detail-block"><h3>O que faz</h3><p>{part.function}</p></div>
            <div className="knee-detail-block"><h3>O que pode acontecer</h3><p>{part.problems}</p></div>
            <Link href={part.link} className="knee-read-more">{part.linkLabel}<span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </div>
      <div className="knee-explorer-bottom"><span>Uma articulação. Muitas estruturas trabalhando juntas.</span><a href="#guia-anatomia">Ler o guia de anatomia <span aria-hidden="true">↓</span></a></div>
      {quickSummary && <KneeQuickSummary key={part.id} part={part} onClose={closeSummary} />}
    </div>
  );
}
