import { Badge } from '@/shared/components/ui/badge';

interface SectionIntroProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}

export function SectionIntro({ eyebrow, title, description, actions }: Readonly<SectionIntroProps>) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <Badge variant="secondary">{eyebrow}</Badge>
        <div className="space-y-2">
          <h1 className="font-display text-4xl font-semibold tracking-[-0.05em] text-foreground">{title}</h1>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">{description}</p>
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}
