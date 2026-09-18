import { useThemeStore } from '../../store/themeStore'
import { themePresets } from '../../data/themes'

export function ThemePanel() {
  const preset = useThemeStore((state) => state.preset)
  const setPreset = useThemeStore((state) => state.setPreset)

  return (
    <section className="rounded-[1.8rem] border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.62rem] uppercase tracking-[0.28em] text-neutral-500">Theme system</p>
          <h3 className="mt-3 text-2xl font-medium text-neutral-900">Visual presets</h3>
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
              className={[
                'rounded-[1.4rem] border p-3 text-left transition',
                isActive ? 'border-neutral-900 bg-neutral-950 text-white' : 'border-neutral-200 bg-neutral-50 text-neutral-900',
              ].join(' ')}
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
              <p className={['mt-4 text-xs leading-6', isActive ? 'text-neutral-300' : 'text-neutral-600'].join(' ')}>
                {theme.description}
              </p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
