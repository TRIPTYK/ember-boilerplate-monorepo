/**
 * Parseur YAML léger pour patterns.yaml
 *
 * Gère la structure spécifique utilisée par les hooks de contrôle des dommages :
 * - Clés de premier niveau associées à des tableaux d'objets ou de chaînes
 * - Propriétés d'objet : pattern, reason, ask, name, rotate_url
 * - Valeurs de chaîne avec ou sans guillemets
 * - Commentaires (lignes commençant par #)
 */

export function parseYaml(text) {
  const result = {};
  let currentKey = null;
  let currentItem = null;

  const lines = text.split("\n");

  for (const line of lines) {
    const trimmed = line.trimEnd();

    // Ignorer les lignes vides et les commentaires
    if (!trimmed || /^\s*#/.test(trimmed)) continue;

    // Clé de premier niveau (pas d'indentation, se termine par deux-points)
    const topMatch = trimmed.match(/^(\w[\w\s]*\w|\w+):\s*$/);
    if (topMatch) {
      if (currentKey && currentItem) {
        result[currentKey].push(currentItem);
        currentItem = null;
      }
      currentKey = topMatch[1].trim();
      result[currentKey] = [];
      continue;
    }

    if (!currentKey) continue;

    // Élément de tableau commençant par "- " (peut être une propriété d'objet ou une chaîne simple)
    const arrayItemMatch = trimmed.match(/^\s+-\s+(.*)/);
    if (arrayItemMatch) {
      // Sauvegarder l'élément précédent s'il existe
      if (currentItem) {
        result[currentKey].push(currentItem);
        currentItem = null;
      }

      const value = arrayItemMatch[1];

      // Vérifier si c'est une paire clé: valeur (élément objet)
      const kvMatch = value.match(/^(\w+):\s*(.*)/);
      if (kvMatch) {
        currentItem = {};
        const k = kvMatch[1];
        const v = parseValue(kvMatch[2]);
        currentItem[k] = v;
      } else {
        // Élément de tableau en chaîne simple
        result[currentKey].push(parseValue(value));
        currentItem = null;
      }
      continue;
    }

    // Propriété de continuation de l'objet courant (clé: valeur indenté, sans - en tête)
    const propMatch = trimmed.match(/^\s+(\w+):\s*(.*)/);
    if (propMatch && currentItem) {
      const k = propMatch[1];
      const v = parseValue(propMatch[2]);
      currentItem[k] = v;
    }
  }

  // Ne pas oublier le dernier élément
  if (currentKey && currentItem) {
    result[currentKey].push(currentItem);
  }

  return result;
}

function parseValue(raw) {
  if (!raw) return "";
  const trimmed = raw.trim();

  // Booléen
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;

  // Nombre
  if (/^\d+$/.test(trimmed)) return parseInt(trimmed, 10);

  // Retirer les guillemets entourants (simples ou doubles)
  const unquoted = trimmed.replace(/^(['"])(.*)\1$/, "$2");
  return unquoted;
}
