/**
 * Heure courante. Les pages qui en dépendent appellent `connection()` avant, afin d'être
 * rendues à chaque visite ; passer par cette fonction évite l'alerte « fonction impure » du linter.
 */
export const currentTime = () => Date.now()
