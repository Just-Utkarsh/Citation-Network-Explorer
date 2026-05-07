https://citation-network-explorer-theta.vercel.app/    -----   Use with a VPN 

(Some ISPs (especially Jio) have inconsistent DNS/IPv6 routing for certain cloud-hosted domains, so using Cloudflare WARP/VPN bypasses the ISP routing issue and fixes connectivity.)

https://github.com/user-attachments/assets/1af4ab75-49fc-457d-97fc-15dd554a061e

# Citation Network Explorer

A full-stack research discovery platform that helps users explore academic papers through **citation graphs**, **influence ranking**, and **lightweight ML-powered relevance scoring**.

The application combines **information retrieval**, **graph analytics**, and **interactive visualization** to make it easier to discover influential and contextually relevant research papers from large academic datasets.

---

## Overview

Citation Network Explorer allows users to:

- Search academic papers using natural-language queries
- Visualize citation relationships as an interactive directed graph
- Discover influential papers using PageRank-based graph analytics
- Rank papers using a lightweight ML relevance engine
- Explore citation neighborhoods and connected research topics
- Analyze research influence without relying on heavy transformer models

The project is designed to demonstrate how practical ML systems can be built efficiently using classical NLP and graph-based ranking methods.

---

# Features

## Research Paper Search
Search papers using keywords, topics, or research domains powered by the OpenAlex API.

## Citation Graph Visualization
Papers and citation relationships are represented as a directed graph, allowing users to visually explore:
- citing papers
- referenced works
- influential nodes
- connected research communities

## ML-Based Relevance Ranking
The backend includes a lightweight ML ranking pipeline that scores papers based on semantic relevance and citation influence.

## Influence Scoring with PageRank
Citation relationships are analyzed using graph algorithms to identify highly influential papers within the network.

## Responsive Frontend
Built with modern React/Next.js UI patterns and optimized for desktop and mobile viewing.

---

# How ML Is Used

## Query-Aware Ranking
The backend uses a custom lightweight **TF-IDF + cosine similarity** pipeline implemented in Python to determine how relevant a paper is to a user's search query.

The relevance engine:
- vectorizes paper abstracts/titles
- computes cosine similarity against the user query
- ranks papers by semantic closeness

This avoids the overhead of large transformer-based embedding models while still producing high-quality recommendations.

---

## Hybrid Recommendation Scoring

Final paper ranking combines:

- **Semantic relevance**
  - TF-IDF cosine similarity score

- **Research impact proxy**
  - normalized citation counts

This hybrid approach improves ranking quality by balancing:
- textual relevance
- academic influence

---

## Graph-Based Analytics

Citation relationships are modeled as a directed graph using NetworkX.

The system computes:
- PageRank scores
- node connectivity
- citation influence metrics

to surface impactful research papers within the citation network.

---

# Why This Project Is Useful

Research datasets are often:
- fragmented
- difficult to explore
- overloaded with irrelevant results

Citation Network Explorer helps users:
- identify influential papers faster
- understand research relationships visually
- discover connected work across domains
- explore citation paths interactively
- retrieve contextually relevant papers efficiently

The project demonstrates how combining:
- classical NLP,
- graph theory,
- and scalable APIs

can create practical research discovery tools.
