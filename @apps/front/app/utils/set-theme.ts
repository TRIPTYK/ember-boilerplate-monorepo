export default function setTheme() {
  let theme = 'business';
  if (typeof localStorage !== 'undefined') {
    theme = localStorage.getItem('tpk-theme') ?? 'business';
  }
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
