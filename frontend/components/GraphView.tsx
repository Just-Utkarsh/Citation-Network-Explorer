"use client";

import { useEffect, useMemo, useRef } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import type cytoscape from "cytoscape";

import { GraphEdge, GraphNode } from "@/types";

type Props = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  isDark: boolean;
};

export function GraphView({ nodes, edges, isDark }: Props) {
  const cyRef = useRef<cytoscape.Core | null>(null);
  const layoutRef = useRef<cytoscape.Layouts | null>(null);

  const elements = useMemo(
    () => [
    ...nodes.map((node) => ({
      data: {
        id: node.id,
        label: node.label.slice(0, 42),
        citations: node.citations,
        influence: node.influence_score,
      },
    })),
    ...edges.map((edge) => ({
      data: {
        source: edge.source,
        target: edge.target,
      },
    })),
    ],
    [nodes, edges],
  );

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy || cy.destroyed()) return;

    const runLayout = () => {
      if (cy.destroyed()) return;
      const hasRenderer = typeof (cy as unknown as { renderer?: () => unknown }).renderer === "function";
      if (!hasRenderer) return;

      layoutRef.current?.stop();
      layoutRef.current = cy.layout({
        name: "cose",
        animate: true,
        animationDuration: 700,
        nodeRepulsion: 9500,
        idealEdgeLength: 110,
        edgeElasticity: 130,
        gravity: 0.2,
        randomize: false,
      });
      layoutRef.current.run();
    };

    const onMouseOver = (event: cytoscape.EventObject) => {
      const node = event.target;
      const neighborhood = node.closedNeighborhood();

      cy.elements().addClass("faded");
      neighborhood.removeClass("faded");
      node.addClass("hovered");
      neighborhood.edges().addClass("connected-edge");
    };

    const onMouseOut = () => {
      cy.elements().removeClass("faded");
      cy.nodes().removeClass("hovered");
      cy.edges().removeClass("connected-edge");
    };

    cy.on("mouseover", "node", onMouseOver);
    cy.on("mouseout", "node", onMouseOut);
    requestAnimationFrame(runLayout);

    return () => {
      layoutRef.current?.stop();
      cy.off("mouseover", "node", onMouseOver);
      cy.off("mouseout", "node", onMouseOut);
    };
  }, [nodes, edges]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-white dark:bg-[#1b1c1c]">
      <h2 className="mb-3 text-lg font-semibold">Citation Graph</h2>
      <div className="h-[460px] rounded border border-slate-100 transition-colors duration-300 dark:border-white">
        <CytoscapeComponent
          elements={elements}
          style={{ width: "100%", height: "100%" }}
          cy={(cy: cytoscape.Core) => {
            cyRef.current = cy;
          }}
          layout={{
            name: "preset",
          }}
          stylesheet={[
            {
              selector: "node",
              style: {
                label: "data(label)",
                "font-size": 9,
                "text-wrap": "wrap",
                "text-max-width": 94,
                width: "mapData(citations, 0, 5000, 18, 54)",
                height: "mapData(citations, 0, 5000, 18, 54)",
                "background-color": isDark ? "#a9abab" : "#0f172a",
                color: isDark ? "#e2e8f0" : "#0f1117",
                "text-outline-width": 0,
                "transition-property": "opacity, width, height, background-color",
                "transition-duration": "220ms",
              },
            },
            {
              selector: "edge",
              style: {
                width: 1.1,
                opacity: 0.72,
                "line-color": isDark ? "#64748b" : "#94a3b8",
                "target-arrow-color": isDark ? "#64748b" : "#94a3b8",
                "target-arrow-shape": "triangle",
                "curve-style": "bezier",
                "transition-property": "opacity, width, line-color, target-arrow-color",
                "transition-duration": "220ms",
              },
            },
            {
              selector: ".hovered",
              style: {
                width: "mapData(citations, 0, 5000, 22, 62)",
                height: "mapData(citations, 0, 5000, 22, 62)",
                "background-color": isDark ? "#cbd5e1" : "#1e293b",
              },
            },
            {
              selector: ".connected-edge",
              style: {
                width: 2.1,
                opacity: 0.96,
                "line-color": isDark ? "#cbd5e1" : "#334155",
                "target-arrow-color": isDark ? "#cbd5e1" : "#334155",
              },
            },
            {
              selector: ".faded",
              style: {
                opacity: 0.2,
              },
            },
          ]}
        />
      </div>
    </section>
  );
}
