export function translate(dict: Record<string, string>, key: string, vars?: Record<string, string>): string {
  const template = dict[key] ?? key

  if (!vars) return template

  return template.replace(/\{(\w+)\}/g, (match, name) => vars[name] ?? match)
}
