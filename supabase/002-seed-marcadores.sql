-- ============================================================
-- 002 — SEED DE MARCADORES
--
-- Popula as 3 categorias da Fase 1 e um conjunto inicial de
-- marcadores com faixas de referência GENÉRICAS de literatura
-- laboratorial padrão adulto.
--
-- IMPORTANTE: estes valores são um ponto de partida, não uma
-- referência clínica validada. Cada faixa varia por método de
-- laboratório, idade, sexo e contexto clínico — a nutricionista deve
-- revisar e ajustar `valor_ideal_min` / `valor_ideal_max` de cada
-- marcador antes de usar o app com pacientes reais.
--
-- Idempotente: pode rodar de novo (on conflict do nome da categoria
-- e, para marcador, apaga e recria pelo nome dentro da categoria).
-- ============================================================

insert into categorias_marcadores (nome, ordem) values
  ('Hemograma', 1),
  ('Perfil Glicêmico', 2),
  ('Perfil Hormonal', 3)
on conflict (nome) do nothing;

do $$
declare
  v_hemograma  uuid;
  v_glicemico  uuid;
  v_hormonal   uuid;
begin
  select id into v_hemograma from categorias_marcadores where nome = 'Hemograma';
  select id into v_glicemico from categorias_marcadores where nome = 'Perfil Glicêmico';
  select id into v_hormonal  from categorias_marcadores where nome = 'Perfil Hormonal';

  delete from marcadores where categoria_id in (v_hemograma, v_glicemico, v_hormonal);

  insert into marcadores (categoria_id, nome, valor_ideal_min, valor_ideal_max, unidade) values
    (v_hemograma, 'Hemoglobina', 12, 16, 'g/dL'),
    (v_hemograma, 'Hematócrito', 36, 46, '%'),
    (v_hemograma, 'Leucócitos', 4000, 10000, '/mm³'),
    (v_hemograma, 'Plaquetas', 150000, 450000, '/mm³'),
    (v_hemograma, 'Ferritina', 20, 200, 'ng/mL'),

    (v_glicemico, 'Glicemia de jejum', 70, 99, 'mg/dL'),
    (v_glicemico, 'Hemoglobina glicada (HbA1c)', 4, 5.6, '%'),
    (v_glicemico, 'Insulina de jejum', 2, 10, 'µUI/mL'),
    (v_glicemico, 'HOMA-IR', 0.5, 2.5, null),

    (v_hormonal, 'TSH', 0.4, 4, 'µUI/mL'),
    (v_hormonal, 'T4 livre', 0.8, 1.8, 'ng/dL'),
    (v_hormonal, 'Cortisol', 5, 23, 'µg/dL'),
    (v_hormonal, 'Vitamina D (25-OH)', 30, 100, 'ng/mL');
end $$;
