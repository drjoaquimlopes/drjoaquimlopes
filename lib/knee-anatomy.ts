export const kneeParts = [
  {
    id: "meniscos", name: "Meniscos", category: "Amortecimento", number: "01", color: "#6e9eae",
    summary: "Pequenas estruturas. Uma grande proteção.",
    what: "São duas estruturas de fibrocartilagem, os meniscos medial e lateral, localizadas entre o fêmur e a tíbia.",
    function: "Distribuem as cargas, ajudam a absorver impactos e contribuem para a estabilidade do joelho durante o movimento.",
    problems: "Lesões podem ocorrer em torções ou por alterações degenerativas. Podem causar dor, inchaço e travamento. Nem toda lesão precisa de cirurgia.",
    link: "/blog/lesao-de-menisco-quando-precisa-operar", linkLabel: "Entenda as lesões de menisco",
    meshes: ["menisco-a", "menisco-b"],
  },
  {
    id: "ligamentos", name: "Ligamentos", category: "Estabilidade", number: "02", color: "#b89b5f",
    summary: "A estabilidade por trás de cada passo.",
    what: "São faixas de tecido que conectam os ossos. Entre os principais estão os cruzados anterior (LCA) e posterior (LCP) e os colaterais.",
    function: "Ajudam a limitar deslocamentos e rotações excessivos, mantendo o joelho estável ao caminhar, girar e mudar de direção.",
    problems: "Entorses podem estirar ou romper ligamentos. Dor, inchaço e sensação de falseio podem ocorrer. O tratamento depende do ligamento e da gravidade da lesão.",
    link: "/blog/reconstrucao-do-lca-como-e-a-cirurgia", linkLabel: "Saiba mais sobre o LCA",
    meshes: ["colateral-a", "colateral-b", "interno-a", "interno-b", "interno-c", "interno-d"],
  },
  {
    id: "patela", name: "Patela", category: "Movimento", number: "03", color: "#c0ad8d",
    summary: "Um pequeno osso que potencializa o movimento.",
    what: "Também conhecida como rótula, é o osso localizado na frente do joelho, integrado ao mecanismo que estende a perna.",
    function: "Ajuda o músculo quadríceps a estender o joelho. Sua face posterior desliza sobre o fêmur durante a flexão e a extensão.",
    problems: "Dor na região da patela pode estar associada a sobrecarga, alterações do movimento ou instabilidade. Dor na frente do joelho não significa, por si só, desgaste da cartilagem.",
    link: "/blog/dor-no-joelho-quando-procurar-atendimento", linkLabel: "Entenda a dor no joelho",
    meshes: ["patela"],
  },
  {
    id: "tendoes", name: "Tendões", category: "Transmissão de força", number: "04", color: "#b7a086",
    summary: "A conexão entre o músculo e o movimento.",
    what: "O tendão do quadríceps conecta o músculo à patela. O tendão patelar conecta a patela à tíbia. No modelo, aparecem agrupados.",
    function: "Transmitem a força do quadríceps para estender a perna, participando de atividades como levantar, subir escadas e saltar.",
    problems: "Sobrecarga pode estar associada a tendinopatia. Traumas também podem provocar rupturas, com dificuldade para estender o joelho.",
    link: "/blog/musculacao-beneficios-e-como-evitar-lesoes", linkLabel: "Leia sobre carga e prevenção",
    meshes: ["aparelho-extensor"],
  },
  {
    id: "femur", name: "Fêmur", category: "Estrutura óssea", number: "05", color: "#b5aea0",
    summary: "O encontro da coxa com o joelho.",
    what: "É o osso da coxa. Sua extremidade inferior se articula com a tíbia e com a patela.",
    function: "Participa da sustentação e do movimento. Suas superfícies articulares são revestidas por cartilagem para facilitar o deslizamento.",
    problems: "Fraturas na extremidade inferior podem comprometer o joelho. Alterações da cartilagem que recobre o osso também podem afetar a articulação.",
    link: "/blog/desgaste-da-cartilagem-do-joelho-e-esporte", linkLabel: "Entenda a cartilagem articular",
    meshes: ["femur"],
  },
  {
    id: "tibia", name: "Tíbia", category: "Estrutura óssea", number: "06", color: "#b5aea0",
    summary: "Uma base para sustentar o corpo.",
    what: "É o principal osso de sustentação da perna. Sua parte superior, chamada platô tibial, se articula com o fêmur.",
    function: "Recebe e transmite cargas, em conjunto com os meniscos e a cartilagem. Também recebe a fixação de ligamentos e do tendão patelar.",
    problems: "Traumas podem causar fraturas do platô tibial e afetar a superfície articular. Dor após trauma e dificuldade de apoio precisam de avaliação.",
    link: "/blog/dor-no-joelho-quando-procurar-atendimento", linkLabel: "Saiba quando procurar atendimento",
    meshes: ["tibia"],
  },
  {
    id: "fibula", name: "Fíbula", category: "Estrutura óssea", number: "07", color: "#b5aea0",
    summary: "A estrutura na lateral da perna.",
    what: "É o osso mais fino, ao lado da tíbia. Sua extremidade superior fica na região externa do joelho.",
    function: "Serve de ponto de fixação para estruturas que participam da estabilidade lateral, incluindo o ligamento colateral lateral.",
    problems: "Traumas na região podem provocar fraturas ou lesões associadas. A avaliação verifica também ligamentos e nervos próximos.",
    link: "/blog/lesionei-preciso-me-afastar-das-quadras", linkLabel: "Leia sobre lesões no esporte",
    meshes: ["fibula"],
  },
  {
    id: "musculos", name: "Músculos", category: "Força e movimento", number: "08", color: "#b15a53",
    summary: "A força que coloca o joelho em movimento.",
    what: "Grupos musculares da coxa e da panturrilha participam do movimento do joelho. Esta camada representa esses grupos de forma simplificada e ilustrativa.",
    function: "O quadríceps, na frente da coxa, ajuda a estender o joelho. A musculatura posterior da coxa ajuda a dobrá-lo. Esses grupos atuam em conjunto durante as atividades.",
    problems: "Estiramentos e sobrecarga podem causar dor e limitação. Dor muscular não deve ser confundida automaticamente com lesão dentro da articulação; a avaliação diferencia as causas.",
    link: "/blog/musculacao-beneficios-e-como-evitar-lesoes", linkLabel: "Entenda o fortalecimento e a prevenção",
    meshes: ["musculo-quadriceps-central", "musculo-quadriceps-lateral", "musculo-quadriceps-medial", "musculo-posterior-a", "musculo-posterior-b", "musculo-panturrilha-a", "musculo-panturrilha-b"],
  },
] as const;

export type KneePart = (typeof kneeParts)[number];
export type KneePartId = KneePart["id"];
export const kneeLayers = [
  { id: "ossos", name: "Ossos", color: "#cfbb94" },
  { id: "meniscos", name: "Meniscos", color: "#89adba" },
  { id: "ligamentos", name: "Ligamentos", color: "#c3a36d" },
  { id: "tendoes", name: "Tendões", color: "#dbc4a5" },
  { id: "musculos", name: "Músculos", color: "#b15a53" },
] as const;
export type KneeLayerId = (typeof kneeLayers)[number]["id"];
export type KneeLayerState = Record<KneeLayerId, boolean>;
export const defaultKneeLayers: KneeLayerState = { ossos: true, meniscos: true, ligamentos: true, tendoes: true, musculos: true };
export function kneeLayerForPart(id: KneePartId): KneeLayerId {
  if (["femur", "tibia", "fibula", "patela"].includes(id)) return "ossos";
  return id as Exclude<KneeLayerId, "ossos">;
}
export const anatomyReferences = [
  { name: "AAOS · Músculos da coxa e lesões", href: "https://www.orthoinfo.org/diseases--conditions/muscle-strains-in-the-thigh/" },
  { name: "AAOS · Anatomia e lesões do joelho", href: "https://www.orthoinfo.org/diseases--conditions/common-knee-injuries/" },
  { name: "AAOS · Lesões de menisco", href: "https://www.orthoinfo.org/diseases--conditions/meniscus-tears/" },
  { name: "AAOS · Ligamento cruzado anterior", href: "https://www.orthoinfo.org/diseases--conditions/anterior-cruciate-ligament-acl-injuries/" },
  { name: "AAOS · Dor patelofemoral", href: "https://www.orthoinfo.org/diseases--conditions/patellofemoral-pain-syndrome/" },
];
