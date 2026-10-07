---
title: Controllable Text Simplification using Large Language Models for CEFR-based Readability Adaptation
summary: Designed and ran an LLM evaluation study measuring how far prompt design alone can steer text simplification towards a target reading level.
kind: case-study
area: research
order: 1
label: MSc research
period: "2026"
system: LLM evaluation study
role: Researcher (MSc dissertation)
indexFacts:
  - 2 LLMs
  - 3 prompt strategies
  - 1,128 documents
stack:
  - Python
  - Gemini API
  - OpenAI API
  - Prompt engineering
  - Sentence-BERT
  - BERTScore
  - Readability formulas
  - Paired statistical testing
details:
  - label: Programme
    value: MSc Advanced Computer Science
  - label: Institution
    value: University of Exeter
  - label: Submitted
    value: August 2026
  - label: Models
    value: Gemini 3.6 Flash · GPT-5 Mini
facts:
  - label: LLMs compared
    value: "2"
  - label: Prompt strategies
    value: "3"
  - label: Source articles
    value: "188"
  - label: Adapted documents
    value: "1,128"
  - label: Design
    value: Paired
disclosure: 3
anonymised: false
# TODO(publication): the report, code and any corpus-derived material stay unpublished
# until university policy and the corpus licence have been confirmed. Add `links`
# (report / code) and approved `images` (figures) only after that decision.
---

## At a glance

<dl class="glance">
  <div>
    <dt>Problem</dt>
    <dd>Large language models can simplify a text from an instruction alone, but it is rarely tested how much control a prompt actually gives.</dd>
  </div>
  <div>
    <dt>Research question</dt>
    <dd>Can prompt engineering control text simplification towards a target CEFR level without fine-tuning the model?</dd>
  </div>
  <div>
    <dt>My role</dt>
    <dd>Designed and ran the study: research questions, corpus preparation, prompt strategies, generation, evaluation, statistics and write-up.</dd>
  </div>
  <div>
    <dt>Study design</dt>
    <dd>Three prompt strategies × two LLMs, applied to 188 articles: 1,128 adapted documents in a paired design.</dd>
  </div>
  <div>
    <dt>Evaluation</dt>
    <dd>Readability formulas, similarity to the source, and paired non-parametric statistics with effect sizes.</dd>
  </div>
  <div>
    <dt>Key finding</dt>
    <dd>Prompt specificity changed the output substantially, but its direction was set by the model: the same added specification made one model simplify more and the other less.</dd>
  </div>
  <div>
    <dt>Main limitation</dt>
    <dd>Outputs were not compared with professionally written texts at the target level, so the study shows responsiveness to instruction, not level-targeted control.</dd>
  </div>
</dl>

## The question

Large language models can be asked to simplify a text with an instruction rather than by fine-tuning. Surveys present prompting as an efficient substitute for fine-tuning, but it is rarely tested how much control a prompt actually gives. This study asked:

- **RQ1.** Can prompt engineering control text simplification towards a target CEFR level without fine-tuning the model?
- **RQ2.** Which prompting strategy gives the best balance between readability improvement and preservation of the source content?
- **RQ3.** How far does the choice of model, rather than the choice of prompt, determine the readability and source fidelity of the output?
- **RQ4.** Do surface readability formulas and embedding-based similarity measures capture independent properties of adapted text?

## What I did

I designed and ran an LLM evaluation study:

- framed the research questions and the evaluation design;
- prepared the OneStopEnglish corpus, whose Advanced, Intermediate and Elementary versions of each article are publisher reading levels;
- defined three prompt strategies of increasing specificity;
- generated adaptations with two models through their APIs, in a single Advanced → Intermediate direction;
- evaluated every output for readability and similarity to its source;
- analysed the results with paired statistics and wrote up the findings and their limits.

## Study design

Three prompting strategies were compared:

- **Baseline**: a minimally specified simplification instruction.
- **CEFR**: the same instruction with explicit CEFR level descriptors.
- **Structured CEFR**: the CEFR prompt plus a persona, a task header and output-format constraints.

Every strategy was applied to the same 188 articles with both models, so each article was adapted under all six conditions:

<div class="conditions">
  <table>
    <caption>Study conditions: three prompt strategies × two models, each applied to the same 188 articles (1,128 adapted documents in total).</caption>
    <thead>
      <tr>
        <th scope="col">Prompt strategy</th>
        <th scope="col">Gemini 3.6 Flash</th>
        <th scope="col">GPT-5 Mini</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Baseline</th>
        <td>188 articles</td>
        <td>188 articles</td>
      </tr>
      <tr>
        <th scope="row">CEFR</th>
        <td>188 articles</td>
        <td>188 articles</td>
      </tr>
      <tr>
        <th scope="row">Structured CEFR</th>
        <td>188 articles</td>
        <td>188 articles</td>
      </tr>
    </tbody>
  </table>
</div>

Because every article was adapted under every condition, the observations are paired, and the analysis keeps that pairing rather than discarding it.

## Evaluation

Each adapted document was measured in two ways and compared with paired statistics:

<div class="eval-grid">
  <section aria-label="Readability">
    <h3>Readability</h3>
    <ul>
      <li>Flesch Reading Ease (FRE)</li>
      <li>Flesch–Kincaid Grade Level (FKGL)</li>
      <li>Simple Measure of Gobbledygook (SMOG)</li>
    </ul>
  </section>
  <section aria-label="Similarity to the source">
    <h3>Similarity to the source</h3>
    <ul>
      <li>Sentence-BERT cosine similarity</li>
      <li>BERTScore</li>
    </ul>
  </section>
  <section aria-label="Statistics">
    <h3>Statistics</h3>
    <ul>
      <li>Wilcoxon signed-rank tests (models)</li>
      <li>Friedman tests (prompts)</li>
      <li>Holm-corrected post-hoc tests</li>
      <li>Effect sizes: rank-biserial correlation, Kendall's W</li>
    </ul>
  </section>
</div>

## Findings

<ol class="findings">
  <li>
    <strong>Prompting is a strong lever, but not a controlling one.</strong>
    Adding specification changed the output substantially, with large effect sizes for GPT-5 Mini and medium ones for Gemini 3.6 Flash. But the direction was set by the model, not the instruction: the same added specification made Gemini simplify more and GPT-5 Mini simplify less, on all three readability measures.
  </li>
  <li>
    <strong>Model choice matters as much as prompt choice.</strong>
    Model differences were large under the baseline prompt. Under the structured prompt they were not statistically detectable on readability, which shows that a difference was not detected, not that the models became equivalent.
  </li>
  <li>
    <strong>The metrics overlap.</strong>
    The three readability formulas were near-redundant (|r| ≥ 0.94), while the similarity measures correlated only weakly with readability and with each other.
  </li>
  <li>
    <strong>Responsiveness is not control.</strong>
    Because readability was measured on the output rather than against a target, the study evidences responsiveness to instruction rather than level-targeted control.
  </li>
</ol>

## Limitations

- Only one adaptation direction (Advanced → Intermediate) was run, so level sensitivity was not tested.
- Outputs were not compared with the professionally written Intermediate version of each article, so the study shows that readability changed, not that it moved towards the intended level.
- The publisher's reading levels are not validated CEFR annotations, so no claim of level attainment is made.
- Similarity was measured against the source, so high scores indicate conservative rewriting rather than agreement with professional practice.
- The prompts differ in several ways at once, so conclusions apply to each prompt as a whole.
- Some longer texts were truncated by the similarity models' input limits.
- Decoding parameters could not be matched across providers, so model comparisons are limited to default settings.
- A single corpus and domain was used, and evaluation relied on automatic metrics without human judgement.

## Further work

The most valuable extension is the measurement this design lacked: the readability distance between each generated document and the professionally written Intermediate version of the same article, compared with that of the unmodified source. Running the remaining adaptation directions would test level sensitivity directly.
