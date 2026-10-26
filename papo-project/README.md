# PAPO project page

Static academic project page for *Advantage Aggregation with Priority for Multi-Reward Policy Optimization*.

## Hosting

Lives at `papo-project/` in `xiangchi-yuan/xiangchi-yuan.github.io`, using the existing GitHub Pages deployment from the `master` branch. No framework, package installation, build step, or Sites hosting required.

Public URL: https://xiangchi-yuan.github.io/papo-project/

Local preview from the repository root: `python3 -m http.server 8000`, then visit http://localhost:8000/papo-project/.

## Editing

- `index.html`: paper metadata, author order, abstract, figure descriptions and manuscript BibTeX.
- `static/style.css`: responsive layout and visual style.
- `static/site.js`: Tables 1/2 overall data, accessible tabs, illustrative advantage fusion and citation copy.
- `static/images/`: figures cropped directly from the supplied paper, plus favicon.

The supplied PDF has anonymous authors and an inconsistent ICLR year in its header. This page uses the author list explicitly supplied by the user and makes no acceptance claim. Institution numbering follows the RAM project page. The manuscript citation uses 2026 (current manuscript year), not a claimed proceedings year. Code/arXiv links should be added only when real URLs are available.

The fusion demo illustrates the pre-normalization rule with alpha=1. The GRPO implementation in the paper additionally normalizes fused advantages within each group; the demo does not claim sign preservation after that step or monotonic task improvement.

Design inspired by RAM / Nerfies; website design CC BY-SA 4.0. Original paper figures retain their original rights.
