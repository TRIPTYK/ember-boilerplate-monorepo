export default function setTheme() {
  let theme = 'nord';
  if (typeof localStorage !== 'undefined') {
    theme = localStorage.getItem('tpk-theme') ?? 'nord';
  }
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
