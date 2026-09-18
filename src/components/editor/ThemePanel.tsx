import { useThemeStore } from '../../store/themeStore'
import { themePresets } from '../../data/themes'

export function ThemePanel() {
  const preset = useThemeStore((state) => state.preset)
  const setPreset = useThemeStore((state) => state.setPreset)

  return (
    <section className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">Theme system</p>
          <h3 className="mt-3 text-2xl font-medium text-[var(--foreground)]">Visual presets</h3>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {themePresets.map((theme) => {
          const isActive = theme.id === preset

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => setPreset(theme.id)}
              className="rounded-[1.4rem] border p-3 text-left transition hover:opacity-95"
              style={{
                background: isActive ? 'var(--surface-strong)' : 'var(--background-alt)',
                borderColor: isActive ? 'var(--surface-strong)' : 'var(--border)',
                color: isActive ? 'var(--on-strong)' : 'var(--foreground)',
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-10 w-10 rounded-full border"
                  style={{
                    background: theme.colors.background,
                    borderColor: theme.colors.border,
                  }}
                />
                <span className="text-sm font-medium">{theme.name}</span>
              </div>
              <p className="mt-4 text-xs leading-6 opacity-75">{theme.description}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
