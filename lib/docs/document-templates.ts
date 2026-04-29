type TemplateBlock = {
  content?:
    | string
    | Array<{ styles?: Record<string, unknown>; text: string; type: string }>;
  props?: Record<string, unknown>;
  type: string;
};

export type DocumentTemplateId =
  | "blank"
  | "decision-log"
  | "meeting-notes"
  | "product-brief";

export type DocumentTemplate = {
  description: string;
  id: DocumentTemplateId;
  subtitle: string;
  title: string;
  initialTitle: string;
  blocks: TemplateBlock[];
};

const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    blocks: [
      {
        content: "Start with a thought, draft, or outline.",
        type: "paragraph",
      },
    ],
    description: "A clean page for quick drafting and long-form writing.",
    id: "blank",
    initialTitle: "Untitled",
    subtitle: "Freeform page",
    title: "Blank page",
  },
  {
    blocks: [
      {
        content: "Meeting notes",
        props: { level: 1 },
        type: "heading",
      },
      {
        content: "Context and agenda",
        props: { checked: false },
        type: "bulletListItem",
      },
      {
        content: "Key decisions",
        props: { checked: false },
        type: "bulletListItem",
      },
      {
        content: "Action items and owners",
        props: { checked: false },
        type: "bulletListItem",
      },
      {
        content: "Follow-ups for the next session",
        type: "paragraph",
      },
    ],
    description:
      "Capture meetings with clear agenda, decisions, and next steps.",
    id: "meeting-notes",
    initialTitle: "Meeting Notes",
    subtitle: "Agenda, notes, actions",
    title: "Meeting notes",
  },
  {
    blocks: [
      {
        content: "Product brief",
        props: { level: 1 },
        type: "heading",
      },
      {
        content: "Problem statement",
        props: { level: 2 },
        type: "heading",
      },
      {
        content: "What user problem are we solving?",
        type: "paragraph",
      },
      {
        content: "Success metrics",
        props: { level: 2 },
        type: "heading",
      },
      {
        content: "Primary metric to move",
        props: { checked: false },
        type: "bulletListItem",
      },
      {
        content: "Constraints and rollout notes",
        props: { checked: false },
        type: "bulletListItem",
      },
    ],
    description:
      "Frame a feature, its impact, and the constraints around shipping it.",
    id: "product-brief",
    initialTitle: "Product Brief",
    subtitle: "Problem, audience, rollout",
    title: "Product brief",
  },
  {
    blocks: [
      {
        content: "Decision log",
        props: { level: 1 },
        type: "heading",
      },
      {
        content: "Decision",
        props: { level: 2 },
        type: "heading",
      },
      {
        content: "Summarize the call in one sentence.",
        type: "paragraph",
      },
      {
        content: "Why now",
        props: { level: 2 },
        type: "heading",
      },
      {
        content: "Signals, evidence, and tradeoffs that drove the call.",
        type: "paragraph",
      },
      {
        content: "Risks to monitor after launch",
        props: { checked: false },
        type: "bulletListItem",
      },
    ],
    description:
      "Track important product or engineering decisions with rationale and risk.",
    id: "decision-log",
    initialTitle: "Decision Log",
    subtitle: "Decision, rationale, risk",
    title: "Decision log",
  },
];

export function listDocumentTemplates() {
  return DOCUMENT_TEMPLATES;
}

export function getDocumentTemplate(
  templateId: DocumentTemplateId | string | null | undefined,
) {
  return (
    DOCUMENT_TEMPLATES.find((template) => template.id === templateId) ??
    DOCUMENT_TEMPLATES[0]
  );
}

export function serializeTemplateContent(
  templateId?: DocumentTemplateId | string | null,
) {
  return JSON.stringify(getDocumentTemplate(templateId).blocks);
}
