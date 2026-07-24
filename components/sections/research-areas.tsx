interface ResearchArea {
  label: string
  description: string
}

interface ResearchAreasProps {
  areas: ResearchArea[]
}

export function ResearchAreas({ areas }: ResearchAreasProps) {
  return (
    <section className="mx-auto max-w-[1120px] px-6 py-16">
      <h2 className="mb-8 font-display text-[clamp(24px,4vw,36px)] font-semibold text-ink">
        Research areas
      </h2>

      <div className="border-t border-hairline">
        {areas.map((area) => (
          <div key={area.label} className="border-b border-hairline py-6 last:border-b-0">
            <div className="flex flex-col md:flex-row md:items-start md:gap-8">
              <h3 className="mb-2 font-display text-[clamp(18px,2.5vw,22px)] font-semibold text-ink md:mb-0 md:w-72 md:shrink-0">
                {area.label}
              </h3>
              <p className="font-serif text-base text-ink-muted md:flex-1">{area.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
