import { TestParameter } from "../lib/catalog-types";

interface ParameterListProps {
  parameters: TestParameter[];
}

export function ParameterList({ parameters }: ParameterListProps) {
  if (!parameters || parameters.length === 0) {
    return <p className="text-xs text-muted-foreground italic">No nested parameters configured.</p>;
  }

  return (
    <div className="bg-muted/30 rounded-lg p-3 border border-dashed">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        Configured Parameters & Ranges
      </h4>
      <div className="grid gap-2 sm:grid-cols-2">
        {parameters
          .sort((a, b) => a.display_order - b.display_order)
          .map((param) => (
            <div key={param.id} className="flex justify-between items-center text-xs bg-background p-2 rounded border">
              <span className="font-medium text-foreground">{param.name}</span>
              <span className="font-mono text-muted-foreground">
                {param.reference_range} <span className="text-[10px]">{param.unit}</span>
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}