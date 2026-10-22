import { inject, provide, readonly, ref, type InjectionKey, type Ref } from 'vue'

export type AppTheme = 'light' | 'dark' | 'high-contrast'

interface ThemeContext {
  theme: Readonly<Ref<AppTheme>>
  setTheme: (theme: AppTheme) => void
}

const THEME_KEY: InjectionKey<ThemeContext> = Symbol('app-theme')

export function provideAppTheme() {
  const theme = ref<AppTheme>('light')

  function setTheme(nextTheme: AppTheme) {
    theme.value = nextTheme
  }

  const context: ThemeContext = {
    theme: readonly(theme),
    setTheme,
  }

  provide(THEME_KEY, context)

  return context
}

export function useAppTheme(): ThemeContext {
  const context = inject(THEME_KEY)

  if (!context) {
    throw new Error('useAppTheme() must be called inside a component tree that provides the theme.')
  }

  return context
}
