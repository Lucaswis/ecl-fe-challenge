import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ComponentCard } from "@/components/assets/ComponentCard"
import type { ComponentResult } from "@/lib/assets/types"

interface ComponentAccordionProps {
  results: ComponentResult[]
}

export function ComponentAccordion({ results }: ComponentAccordionProps) {
  if (results.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Este asset no tiene componentes registrados.</p>
    )
  }

  return (
    <Accordion multiple defaultValue={results.map((result) => result.id)}>
      {results.map((result) => (
        <AccordionItem key={result.id} value={result.id}>
          <AccordionTrigger>{result.data?.name ?? result.id}</AccordionTrigger>
          <AccordionContent keepMounted>
            <ComponentCard result={result} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
