// French translations for exercise cards
// Keyed by exercise ID

export type ExFr = {
  description: string
  steps: [string, string, string]
  levels: { novice: string; beginner: string; intermediate: string; advanced: string; elite: string }
}

export const MUSCLE_FR: Record<string, string> = {
  'Back & Biceps': 'Dos & Biceps',
  'Biceps & Back': 'Biceps & Dos',
  'Lats': 'Grand dorsal',
  'Mid Back': 'Dos moyen',
  'Full Posterior Chain': 'Chaîne postérieure complète',
  'Hamstrings & Glutes': 'Ischio-jambiers & Fessiers',
  'Biceps': 'Biceps',
  'Brachialis & Biceps': 'Brachial & Biceps',
  'Long Head Biceps': 'Chef long biceps',
  'Brachialis & Forearms': 'Brachial & Avant-bras',
  'Rear Delts': 'Deltoïdes postérieurs',
  'Lats & Rhomboids': 'Grand dorsal & Rhomboïdes',
  'Mid & Lower Back': 'Dos moyen & Lombaires',
  'Rear Delts & Traps': 'Deltoïdes post. & Trapèzes',
  'Chest': 'Pectoraux',
  'Upper Chest': 'Pectoraux supérieurs',
  'Chest (stretch)': 'Pectoraux (étirement)',
  'Chest & Triceps': 'Pectoraux & Triceps',
  'Triceps': 'Triceps',
  'Shoulders': 'Épaules',
  'Full Deltoid': 'Deltoïdes complets',
  'Medial Deltoid': 'Deltoïde médial',
  'Anterior Deltoid': 'Deltoïde antérieur',
  'Triceps & Chest': 'Triceps & Pectoraux',
  'Long Head Triceps': 'Chef long triceps',
  'Lower Chest': 'Pectoraux inférieurs',
  'Chest (inner)': 'Pectoraux (interne)',
  'Quads & Glutes': 'Quadriceps & Fessiers',
  'Quads': 'Quadriceps',
  'Glutes': 'Fessiers',
  'Hamstrings': 'Ischio-jambiers',
  'Calves': 'Mollets',
  'Core': 'Gainage',
  'Upper Abs': 'Abdos supérieurs',
  'Obliques': 'Obliques',
  'Lower Abs & Hip Flexors': 'Abdos inf. & Fléchisseurs hanche',
  'Core & Cardio': 'Gainage & Cardio',
  'Full Core': 'Gainage complet',
  'Obliques & Core': 'Obliques & Gainage',
  'Deep Core': 'Gainage profond',
  'Full Body': 'Corps entier',
  'Legs & Explosiveness': 'Jambes & Explosivité',
  'Core & Hip Flexors': 'Gainage & Fléchisseurs hanche',
  'Upper Body & Core': 'Haut du corps & Gainage',
  'Glutes & Cardio': 'Fessiers & Cardio',
  'Legs & Cardio': 'Jambes & Cardio',
  'Full Body Core': 'Gainage corps entier',
  'Full Body & Cardio': 'Corps entier & Cardio',
  'Legs & Core': 'Jambes & Gainage',
  'Biceps Peak': 'Pic du biceps',
  'Chest & Explosiveness': 'Pectoraux & Explosivité',
  'Full Body & Coordination': 'Corps entier & Coordination',
  'Glutes & Adductors': 'Fessiers & Adducteurs',
  'Obliques & Abs': 'Obliques & Abdos',
  'Quads & Core': 'Quadriceps & Core',
  'Shoulders & Chest': 'Épaules & Pectoraux',
  'Lats & Mid Back': 'Grand dorsal & Dos moyen',
  'Mid Back & Traps': 'Dos moyen & Trapèzes',
  'Mid Back & Rhomboids': 'Dos moyen & Rhomboïdes',
  'Biceps & Forearms': 'Biceps & Avant-bras',
}

export const EQUIP_FR: Record<string, string> = {
  'Bar': 'Barre fixe',
  'Barbell': 'Barre',
  'Cable Machine': 'Poulie',
  'Dumbbell': 'Haltères',
  'Bodyweight': 'Poids du corps',
  'Machine': 'Machine',
  'Machine/Bodyweight': 'Machine / Poids du corps',
  'Ab Wheel': 'Roue abdominale',
  'Ropes': 'Cordes',
  'Box': 'Box',
  'Jump Rope': 'Corde à sauter',
  'Bike': 'Vélo',
  'Stairs': 'Escaliers',
  'Rowing Machine': 'Rameur',
  'None': 'Aucun',
  'Kettlebell': 'Kettlebell',
  'Bars': 'Barres',
}

export const EXERCISE_FR: Record<number, ExFr> = {
  // ── PULL ──────────────────────────────────────────────────────────────────
  1: {
    description: 'Le roi des exercices de dos. Développe la largeur et l\'épaisseur des lats avec le seul poids du corps.',
    steps: ['Suspendez-vous à la barre, mains légèrement plus larges que les épaules, paumes vers l\'avant.', 'Engagez le core, ramenez les coudes vers le bas et l\'arrière jusqu\'à ce que la poitrine touche la barre.', 'Descendez lentement en extension complète — ne raccourcissez pas l\'amplitude.'],
    levels: { novice: '2×3 reps avec bande élastique — amplitude complète uniquement', beginner: '3×5 reps — 2 min repos, descente contrôlée 3s', intermediate: '4×8 reps — ajouter 2s de pause en haut', advanced: '4×12 reps — +5 kg ceinture lestée, 60s repos', elite: '5×15 reps — +10 kg ceinture lestée, 30s repos' },
  },
  2: {
    description: 'Traction prise supine qui sollicite davantage les biceps que la traction classique.',
    steps: ['Suspendez-vous, paumes vers vous, mains à largeur d\'épaules.', 'Tirez-vous vers le haut en ramenant les coudes vers les hanches.', 'Descendez avec contrôle total jusqu\'à l\'extension complète.'],
    levels: { novice: '2×3 reps, bande élastique si nécessaire', beginner: '3×6 reps — 90s repos', intermediate: '4×10 reps — descente lente 3s', advanced: '4×12 reps — +5 kg', elite: '5×15 reps — position L-sit tout au long' },
  },
  3: {
    description: 'Alternative machine aux tractions qui isole efficacement le grand dorsal.',
    steps: ['Assis, cuisses sous les appuis. Saisir la barre plus large que les épaules.', 'Tirer la barre vers le haut de la poitrine, coudes dirigés vers le bas.', 'Résister au poids en remontant — retour en 3 sec.'],
    levels: { novice: '3×10 reps à 50% max — apprendre le trajet', beginner: '3×12 reps à 60% max', intermediate: '4×10 reps à 75% max, retour contrôlé', advanced: '4×10 reps à 85% max, négatif 3s', elite: '5×8 reps à 90%+ max, série dégressive en fin' },
  },
  4: {
    description: 'Exercice polyarticulaire de dos qui épaissit tout le haut du dos et les trapèzes.',
    steps: ['Penchez le buste, dos parallèle au sol, prise légèrement plus large que les épaules.', 'Tirer la barre vers le bas de la poitrine / nombril, coudes en tête.', 'Descendre la barre avec contrôle, maintenir le dos plat tout au long.'],
    levels: { novice: '3×8 reps poids léger — priorité au dos plat', beginner: '3×10 reps à 60% max', intermediate: '4×8 reps à 75% max', advanced: '4×6 reps à 85% max, pause en haut', elite: '5×5 reps à 90% max, tirage explosif' },
  },
  5: {
    description: 'Rowing unilatéral qui corrige les déséquilibres gauche/droit et développe la profondeur du grand dorsal.',
    steps: ['Poser un genou et une main sur le banc, dos plat. Tenir l\'haltère dans la main libre.', 'Ramer l\'haltère vers la hanche, coude proche du corps.', 'Descendre lentement, permettre l\'étirement complet de l\'épaule en bas.'],
    levels: { novice: '3×8 par côté — poids léger', beginner: '3×10 par côté', intermediate: '4×12 par côté — pronation en haut', advanced: '4×10 par côté — lourd, maintien 2s en haut', elite: '5×12 par côté — poids max, 1 min repos' },
  },
  6: {
    description: 'Rowing à tension constante qui maintient les muscles du dos sous charge tout au long du mouvement.',
    steps: ['Assis droit, pieds sur la plateforme, légère flexion des genoux. Saisir la poignée V ou barre large.', 'Tirer la poignée vers le nombril, garder le buste vertical, pincer les omoplates.', 'Étendre les bras complètement, ressentir l\'étirement avant la prochaine rep.'],
    levels: { novice: '3×12 charge légère — buste vertical uniquement', beginner: '3×12 charge modérée', intermediate: '4×10 à 75% max', advanced: '4×8 à 85% max, pause 2s à la contraction', elite: '5×8 à 90%+, super-série avec tirage vertical' },
  },
  7: {
    description: 'Exercice correctif et hypertrophique pour les deltoïdes postérieurs — prévient les déséquilibres musculaires.',
    steps: ['Régler la poulie à hauteur du visage. Saisir la corde à deux mains, paumes vers l\'intérieur.', 'Tirer la corde vers le visage en séparant les mains à la fin.', 'Revenir lentement avec contrôle total.'],
    levels: { novice: '3×15 très léger — sentir l\'activation du deltoïde postérieur', beginner: '3×15 léger — séparation complète', intermediate: '4×15 modéré — rotation externe en fin de mouvement', advanced: '4×20 modéré — sans élan', elite: '5×20 lourd — super-série avec le travail de pression' },
  },
  8: {
    description: 'Rowing chargé en flexion avant permettant des charges plus lourdes et développant l\'épaisseur du dos interne.',
    steps: ['Chevaucher une barre chargée dans un coin. Se pencher avec le dos plat.', 'Saisir les poignées ou enrouler une serviette autour de la barre. Ramer vers la poitrine.', 'Descendre avec contrôle — ne pas arrondir le bas du dos.'],
    levels: { novice: '3×8 poids du corps d\'abord pour apprendre la posture', beginner: '3×8 disque léger', intermediate: '4×8 deux disques', advanced: '4×6 trois disques', elite: '5×5 charge max — ceinture recommandée' },
  },
  9: {
    description: 'Le mouvement polyarticulaire le plus efficace pour la force globale — dos, fessiers, ischio-jambiers et core.',
    steps: ['Barre au-dessus du milieu du pied, écart hanche. Prise juste à l\'extérieur des jambes.', 'Gainage du core fort. Pousser le sol, garder la barre proche du corps.', 'Verrouiller les hanches en haut. Descendre la barre en hingeant aux hanches.'],
    levels: { novice: '3×5 reps barre vide ou charge légère — la forme d\'abord', beginner: '3×5 au poids du corps sur barre', intermediate: '4×4 à 1,5× poids du corps', advanced: '4×3 à 2× poids du corps', elite: '5×2 à 2,5× poids du corps — forme compétition' },
  },
  10: {
    description: 'Mouvement de charnière ciblant les ischio-jambiers et les fessiers avec un fort étirement en bas.',
    steps: ['Debout tenant la barre à hauteur des hanches, légère flexion des genoux.', 'Pousser les hanches vers l\'arrière, la barre glisse le long des cuisses jusqu\'à l\'étirement des ischio-jambiers.', 'Conduire les hanches vers l\'avant pour revenir — serrer les fessiers en haut.'],
    levels: { novice: '3×10 léger — apprendre le pattern de la charnière', beginner: '3×10 modéré', intermediate: '4×10 à 60% max soulevé de terre', advanced: '4×8 à 75% max, descente 3s', elite: '5×6 à 85%+ max soulevé de terre' },
  },
  11: {
    description: 'Curl classique de masse. L\'amplitude complète produit un étirement et une contraction maximum du biceps.',
    steps: ['Debout, prise à largeur d\'épaules, coudes fixés sur les côtés.', 'Curler la barre jusqu\'au menton, supination complète des poignets en haut.', 'Descendre lentement — ne pas laisser les coudes dériver vers l\'avant.'],
    levels: { novice: '3×10 barre vide — focus supination', beginner: '3×12 léger', intermediate: '4×10 modéré, maintien 2s en haut', advanced: '4×8 lourd, descente 3s', elite: '5×6 max + 1 série dégressive chacune' },
  },
  12: {
    description: 'Curl prise neutre qui développe le brachial, ajoutant de l\'épaisseur au bras supérieur.',
    steps: ['Tenir les haltères sur les côtés, prise neutre (pouces vers l\'avant).', 'Curler les deux (ou en alternance) sans faire pivoter le poignet.', 'Serrer en haut, descendre avec contrôle.'],
    levels: { novice: '3×12 léger par côté', beginner: '3×12 modéré', intermediate: '4×10 lourd — en alternance', advanced: '4×8 très lourd — pause en haut', elite: '5×8 max — variation inclinée assis' },
  },
  13: {
    description: 'Effectué sur banc incliné, plaçant le biceps dans un étirement profond pour une hypertrophie maximale.',
    steps: ['Régler le banc à 45–60°. S\'asseoir en arrière, bras pendants droit vers le bas.', 'Curler les haltères, en gardant les bras supérieurs immobiles.', 'Descendre complètement — l\'étirement complet est la clé.'],
    levels: { novice: '3×10 léger — privilégier l\'étirement', beginner: '3×12 modéré', intermediate: '4×10 modéré-lourd', advanced: '4×8 lourd — descente 4s', elite: '5×8 poids max — maintien contraction maximale' },
  },
  14: {
    description: 'Curl prise pronée qui développe la masse avant-bras et le brachial souvent négligé.',
    steps: ['Tenir la barre en prise pronée, largeur d\'épaules.', 'Curler la barre en gardant les poignets neutres.', 'Descendre complètement — poignets droits tout au long.'],
    levels: { novice: '3×12 très léger — focus position des poignets', beginner: '3×15 léger', intermediate: '4×12 modéré', advanced: '4×10 modéré-lourd', elite: '5×10 lourd — variation EZ-bar' },
  },
  15: {
    description: 'Exercice d\'isolation pour les deltoïdes postérieurs — essentiel pour l\'équilibre des épaules et la posture.',
    steps: ['Se pencher à 90°, tenant de légers haltères, paumes vers l\'intérieur.', 'Lever les bras sur les côtés, mener avec les coudes, serrer les deltoïdes postérieurs.', 'Descendre avec contrôle jusqu\'à la position de départ.'],
    levels: { novice: '3×15 très léger — sentir uniquement le deltoïde postérieur', beginner: '3×15 léger', intermediate: '4×15 modéré', advanced: '4×12 modéré-lourd — sans élan', elite: '5×15 — variation câble ou élastique pour contraction max' },
  },

  // ── PUSH ──────────────────────────────────────────────────────────────────
  16: {
    description: 'Le mouvement de poitrine fondamental. Développe la masse pectorale et la force de poussée.',
    steps: ['Allongé sur le banc, yeux sous la barre. Prise à 1,5× largeur d\'épaules.', 'Descendre la barre à la ligne des mamelons, coudes à 75°, descente contrôlée.', 'Pousser la barre vers le haut et légèrement en arrière, extension complète.'],
    levels: { novice: '3×8 barre vide — apprendre le trajet et le cambré', beginner: '3×10 poids léger', intermediate: '4×8 à 70% max', advanced: '4×6 à 80%+, pause compétition sur la poitrine', elite: '5×3 à 90%+ — programme de pic périodisé' },
  },
  17: {
    description: 'Variation inclinée ciblant le chef claviculaire du pectoral pour un haut de poitrine plus complet.',
    steps: ['Régler le banc à 30–45°. Prise légèrement plus étroite que le développé plat.', 'Descendre la barre vers le haut de la poitrine, coudes légèrement vers l\'avant.', 'Pousser vers le haut et légèrement en arrière — serrer à l\'extension.'],
    levels: { novice: '3×10 léger — signal d\'activation du haut de la poitrine', beginner: '3×10 modéré', intermediate: '4×8 à 70% max développé plat', advanced: '4×6 à 80%+', elite: '5×5 à 85%+ — finisher série dégressive' },
  },
  18: {
    description: 'Mouvement d\'isolation créant un étirement profond de la poitrine pour l\'hypertrophie et le recrutement des fibres.',
    steps: ['Allongé plat, haltères au-dessus de la poitrine, légère flexion des coudes.', 'Descendre les bras en large arc jusqu\'à l\'étirement profond de la poitrine.', 'Ramener les haltères dans le même arc — serrer la poitrine en haut.'],
    levels: { novice: '3×12 très léger — sentir uniquement l\'étirement', beginner: '3×12 léger', intermediate: '4×12 modéré — maintien 2s en étirement', advanced: '4×10 lourd — variation câble', elite: '5×10 lourd — écarté câble incliné, contraction maximale' },
  },
  19: {
    description: 'L\'exercice de poitrine le plus accessible — réalisable partout et adaptable à l\'infini.',
    steps: ['Mains légèrement plus larges que les épaules, corps droit de la tête aux talons.', 'Descendre la poitrine à 1 cm du sol, coudes à 45°.', 'Pousser explosif jusqu\'à l\'extension complète — serrer la poitrine en haut.'],
    levels: { novice: '3×5 sur les genoux — forme parfaite avant de progresser', beginner: '3×10 pompe complète', intermediate: '4×15 — ajouter 2s de pause en bas', advanced: '4×20 — gilet lesté ou pieds surélevés', elite: '5×20+ lesté — finisher pompes avec clap' },
  },
  20: {
    description: 'Variation de pompe prise étroite qui isole les triceps plus que tout autre mouvement de pression.',
    steps: ['Former un diamant avec les pouces et index, placé sur le sternum.', 'Descendre la poitrine vers les mains, en gardant les coudes serrés.', 'Pousser en se concentrant entièrement sur les triceps.'],
    levels: { novice: '3×5 sur les genoux — construire la base triceps', beginner: '3×8 complet', intermediate: '4×12', advanced: '4×15 — pieds surélevés', elite: '5×15 — gilet lesté + tempo lent' },
  },
  21: {
    description: 'Le principal exercice de masse pour les épaules. Développe le deltoïde médial et antérieur.',
    steps: ['Barre en position de rack avant ou depuis le sol. Prise légèrement à l\'extérieur des épaules.', 'Pousser la barre droit vers le haut, coudes vers l\'avant en bas.', 'Verrouiller en hauteur, barre légèrement derrière l\'oreille en haut.'],
    levels: { novice: '3×8 barre vide — forme stricte, sans impulsion des jambes', beginner: '3×10 léger', intermediate: '4×8 modéré', advanced: '4×6 lourd — descente contrôlée', elite: '5×5 charge max — push press dernière série' },
  },
  22: {
    description: 'Développé rotatif inventé par Arnold. Sollicite les 3 chefs du deltoïde en un seul mouvement.',
    steps: ['Tenir les haltères à hauteur des épaules, paumes vers le visage.', 'Pousser vers le haut en faisant pivoter les paumes vers l\'extérieur à l\'extension.', 'Inverser la rotation en descendant — amplitude complète.'],
    levels: { novice: '3×10 léger — maîtriser la rotation', beginner: '3×12 léger-modéré', intermediate: '4×10 modéré', advanced: '4×8 lourd — rotation lente', elite: '5×8 lourd — descente 3s' },
  },
  23: {
    description: 'Exercice d\'isolation qui développe la largeur des épaules en ciblant le deltoïde latéral.',
    steps: ['Tenir les haltères sur les côtés, légère inclinaison vers l\'avant.', 'Lever les bras sur les côtés à hauteur des épaules — mener avec les coudes.', 'Descendre lentement, ne pas les laisser tomber.'],
    levels: { novice: '3×15 très léger — sentir uniquement le deltoïde latéral, sans élan', beginner: '3×15 léger', intermediate: '4×15 modéré — variation câble', advanced: '4×20 modéré — méthode 1,5 rep', elite: '5×20 — assis lourd + série dégressive' },
  },
  24: {
    description: 'Cible l\'avant des épaules — ne pas en abuser si vous pressez régulièrement.',
    steps: ['Tenir les haltères sur les cuisses, légère flexion des coudes.', 'Lever un ou deux bras à hauteur des épaules devant soi.', 'Descendre lentement.'],
    levels: { novice: '3×12 léger', beginner: '3×12 modéré', intermediate: '4×12 — variation avec disque', advanced: '4×10 lourd en alternance', elite: '5×10 — version câble pour tension constante' },
  },
  25: {
    description: 'Mouvement polyarticulaire pour les triceps et le bas de la poitrine. Peut être fortement chargé avec ceinture.',
    steps: ['Se tenir aux barres parallèles, bras tendus, légère inclinaison vers l\'avant pour la poitrine.', 'Descendre jusqu\'à ce que les bras supérieurs soient parallèles au sol — ressentir l\'étirement.', 'Remonter jusqu\'à l\'extension complète.'],
    levels: { novice: '3×5 avec pieds assistés sur banc', beginner: '3×10 poids du corps', intermediate: '4×12 poids du corps', advanced: '4×8 + 10 kg ceinture', elite: '5×8 + 20 kg — négatifs lents' },
  },
  26: {
    description: 'Extension couchée des triceps avec étirement maximal du chef long.',
    steps: ['Allongé sur le banc, tenir la barre EZ ou droite au-dessus de la poitrine.', 'Descendre la barre vers le front en pliant uniquement les coudes.', 'Étendre les bras au départ — verrouiller.'],
    levels: { novice: '3×12 très léger — focus stabilité des coudes', beginner: '3×12 léger', intermediate: '4×10 modéré', advanced: '4×8 lourd — descente 3s', elite: '5×8 — super-série avec développé prise étroite' },
  },
  27: {
    description: 'Meilleur exercice d\'isolation pour les triceps — tension constante du câble tout au long du mouvement.',
    steps: ['Se placer à la poulie haute avec corde ou barre droite. Saisir les poignées.', 'Pousser vers le bas jusqu\'à extension complète des bras, coudes verrouillés sur les côtés.', 'Permettre le retour contrôlé — ressentir l\'étirement.'],
    levels: { novice: '3×15 léger — apprendre la position des coudes', beginner: '3×15 modéré', intermediate: '4×12 lourd — variation corde pour contraction maximale', advanced: '4×10 lourd — méthode 1,5 rep', elite: '5×12 lourd — variation super-série' },
  },
  28: {
    description: 'L\'extension en hauteur étire au maximum le chef long — la partie la plus importante pour le volume du bras.',
    steps: ['Tenir un lourd haltère à deux mains au-dessus de la tête.', 'Le descendre derrière la tête en pliant uniquement les coudes.', 'Remonter jusqu\'à l\'extension complète.'],
    levels: { novice: '3×12 léger', beginner: '3×12 modéré', intermediate: '4×10 modéré-lourd', advanced: '4×8 lourd — version câble en hauteur', elite: '5×8 max — assis + engagement deltoïde postérieur' },
  },
  29: {
    description: 'L\'angle décliné déplace l\'accent vers le bas du pectoral pour un développement complet de la poitrine.',
    steps: ['Bloquer les chevilles sous les appuis, allongé à 15–30° de déclin.', 'Descendre la barre vers le bas de la poitrine, coudes à 75°.', 'Pousser jusqu\'à l\'extension complète.'],
    levels: { novice: '3×10 léger', beginner: '3×10 modéré', intermediate: '4×8 à 75% max développé plat', advanced: '4×6 à 85%+', elite: '5×5 max — pause sur la poitrine' },
  },
  30: {
    description: 'Exercice de poitrine basé sur l\'adduction créant une contraction maximale impossible avec les haltères libres.',
    steps: ['Régler les câbles à hauteur des épaules ou au-dessus. Se placer au milieu.', 'Tirer les deux poignées l\'une vers l\'autre en mouvement en arc.', 'Croiser les mains à la fin — serrer fort la poitrine interne.'],
    levels: { novice: '3×15 léger — ressentir l\'adduction de la poitrine', beginner: '3×15 modéré', intermediate: '4×12 lourd', advanced: '4×10 lourd — angles différents par série', elite: '5×12 — tri-set avec écarté et développé' },
  },

  // ── ABS & LEGS ────────────────────────────────────────────────────────────
  31: {
    description: 'Le roi des exercices de jambes. Développe la force et la masse totale du bas du corps.',
    steps: ['Barre sur le haut des trapèzes, pieds à largeur d\'épaules, orteils légèrement ouverts.', 'S\'asseoir en arrière et vers le bas jusqu\'à ce que les cuisses soient parallèles — genoux suivent les orteils.', 'Pousser à travers les talons pour se lever, extension complète en haut.'],
    levels: { novice: '3×10 poids du corps — profondeur en priorité', beginner: '3×10 barre légère', intermediate: '4×8 à 70% max', advanced: '4×5 à 85% max', elite: '5×3 à 90%+ — ceinture, programme périodisé' },
  },
  32: {
    description: 'Meilleur exercice unijambiste pour l\'hypertrophie des quadriceps et fessiers — attendez-vous à de sérieuses courbatures.',
    steps: ['Pied arrière sur le banc, pied avant à 2 pas devant.', 'Descendre le genou arrière vers le sol — tibia avant reste vertical.', 'Pousser à travers le talon avant pour se lever.'],
    levels: { novice: '3×8 par côté poids du corps — focus équilibre', beginner: '3×10 par côté haltères légers', intermediate: '4×10 par côté haltères modérés', advanced: '4×8 haltères lourds — descente lente', elite: '5×8 version barre — ceinture' },
  },
  33: {
    description: 'Alternative machine au squat permettant des charges plus lourdes sans compression vertébrale.',
    steps: ['S\'asseoir dans la machine, pieds hauts et larges pour les fessiers, ou bas/étroits pour les quadriceps.', 'Descendre la plateforme à 90° de flexion des genoux — ne jamais bloquer les genoux sous charge.', 'Pousser jusqu\'à presque l\'extension.'],
    levels: { novice: '3×12 léger — amplitude complète', beginner: '3×15 modéré', intermediate: '4×12 lourd', advanced: '4×10 très lourd — descente lente 4s', elite: '5×10 max — méthode 1,5 rep' },
  },
  34: {
    description: 'Mouvement fonctionnel unilatéral pour les jambes. Améliore l\'équilibre et corrige les asymétries.',
    steps: ['Faire un pas en avant d\'environ 60 cm. Le genou arrière descend vers le sol.', 'Cuisse avant parallèle au sol, tibia avant vertical.', 'Pousser sur le pied avant pour revenir, ou enchaîner en fente marchée.'],
    levels: { novice: '3×10 par jambe poids du corps', beginner: '3×10 par jambe haltères légers', intermediate: '4×12 par jambe modéré', advanced: '4×10 par jambe lourd — fente inverse', elite: '5×12 par jambe — barre ou gilet lesté' },
  },
  35: {
    description: 'Exercice à activation maximale des fessiers — rien ne développe la chaîne postérieure comme les hip thrusts.',
    steps: ['Omoplates sur le bord du banc, barre sur les hanches avec coussin.', 'Descendre les hanches au sol, pieds à plat, largeur d\'épaules.', 'Pousser les hanches fort vers le haut, serrer les fessiers en haut — corps forme une table.'],
    levels: { novice: '3×15 poids du corps au sol — variation pont', beginner: '3×15 barre légère sur banc', intermediate: '4×12 deux disques', advanced: '4×10 trois disques — pause 1s en haut', elite: '5×8 charge max — variation unilatérale' },
  },
  36: {
    description: 'Exercice d\'isolation pour les ischio-jambiers — essentiel pour la santé du genou et l\'équilibre des jambes.',
    steps: ['Allongé face au sol (ou assis). Positionner l\'appui de cheville juste au-dessus du talon.', 'Fléchir les jambes vers les fessiers sur toute l\'amplitude.', 'Descendre lentement — retour en 3s.'],
    levels: { novice: '3×12 léger — amplitude complète', beginner: '3×15 modéré', intermediate: '4×12 lourd', advanced: '4×10 lourd — négatif 3s', elite: '5×10 — variation unilatérale' },
  },
  37: {
    description: 'Développement spécifique des mollets. Hautes reps et amplitude complète sont la clé.',
    steps: ['Debout avec la plante des pieds sur le bord d\'une marche ou plateforme.', 'Descendre les talons aussi bas que possible — étirement complet.', 'Monter sur la pointe des pieds aussi haut que possible — contraction complète.'],
    levels: { novice: '3×15 poids du corps — ressentir l\'étirement complet', beginner: '3×20 poids du corps', intermediate: '4×20 avec charge — assis ou debout', advanced: '4×25 lourd — maintien 2s en haut', elite: '5×20+ — unilatéral, chargé, tempo lent' },
  },
  38: {
    description: 'L\'exercice de gainage le plus fonctionnel. Entraîne l\'anti-extension et la tension de tout le corps.',
    steps: ['Avant-bras au sol, coudes sous les épaules, corps droit de la tête aux talons.', 'Serrer simultanément les fessiers, les quadriceps et le core.', 'Respirer lentement — ne pas laisser les hanches s\'affaisser ou monter.'],
    levels: { novice: '3×20s — construire quotidiennement', beginner: '3×40s', intermediate: '4×60s', advanced: '4×90s — ajouter un disque sur le dos', elite: '5×2 min — variation RKC plank (tension maximale)' },
  },
  39: {
    description: 'Exercice classique d\'isolation abdominale ciblant le rectus abdominis supérieur.',
    steps: ['Allongé sur le dos, genoux fléchis, mains derrière la tête légèrement.', 'Soulever les omoplates du sol — ne pas tirer la nuque.', 'Serrer les abdos en haut, descendre lentement.'],
    levels: { novice: '3×15 — lent et contrôlé uniquement', beginner: '3×20', intermediate: '4×25 — ajouter de la résistance', advanced: '4×20 avec disque sur la poitrine', elite: '5×15 crunch câble — lourd' },
  },
  40: {
    description: 'Exercice abdominal de rotation ciblant les obliques et améliorant la force de rotation.',
    steps: ['Assis à 45°, genoux fléchis, pieds légèrement décollés du sol.', 'Joindre les mains ou tenir un poids — faire pivoter le buste de gauche à droite.', 'Toucher le sol avec les mains de chaque côté pour une rep complète.'],
    levels: { novice: '3×10 par côté, pieds au sol', beginner: '3×15 par côté, pieds surélevés', intermediate: '4×15 par côté + disque 4 kg', advanced: '4×20 par côté + 8 kg', elite: '5×15 par côté + 15 kg — variation lancé' },
  },
  41: {
    description: 'Meilleur exercice pour les abdos inférieurs et les fléchisseurs de hanche. Nécessite une force abdominale significative.',
    steps: ['Suspendez-vous à la barre de traction en dead hang.', 'Lever les deux jambes à 90° ou plus — contrôler le balancement.', 'Descendre lentement — ne pas lâcher.'],
    levels: { novice: '3×5 — version avec genoux fléchis', beginner: '3×10 genoux fléchis', intermediate: '4×10 jambes tendues', advanced: '4×12 tendu — orteils à la barre', elite: '5×15 — maintien L-sit + élévations' },
  },
  42: {
    description: 'Exercice de gainage dynamique combinant le plank avec du cardio pour une condition physique fonctionnelle.',
    steps: ['Partir en planche haute, mains sous les épaules.', 'Conduire un genou vers la poitrine pendant que l\'autre jambe reste tendue.', 'Alterner les jambes rapidement — garder les hanches au niveau.'],
    levels: { novice: '3×20s lent', beginner: '3×30s modéré', intermediate: '4×40s rapide', advanced: '4×60s — variation croisée', elite: '5×60s vitesse max — gilet lesté' },
  },
  43: {
    description: 'L\'un des exercices de gainage les plus difficiles. Entraîne l\'ensemble du core antérieur sous forte charge.',
    steps: ['À genoux, roue sous les épaules.', 'Rouler lentement vers l\'avant, core gainé et dos plat.', 'Revenir en contractant les abdos — ne pas utiliser les fléchisseurs de hanche.'],
    levels: { novice: '3×5 déroulés partiels — ne pas aller en amplitude complète encore', beginner: '3×8 avec arrêt contre le mur', intermediate: '4×10 amplitude complète depuis les genoux', advanced: '4×8 déroulé debout depuis des disques', elite: '5×10 déroulé debout amplitude complète' },
  },
  44: {
    description: 'Exercice anti-flexion latérale essentiel pour la stabilité de la colonne et la force des obliques.',
    steps: ['Allongé sur le côté, avant-bras au sol, coude sous l\'épaule.', 'Lever les hanches jusqu\'à ce que le corps forme une ligne droite.', 'Maintenir la position en respirant continuellement.'],
    levels: { novice: '3×20s par côté', beginner: '3×30s par côté', intermediate: '4×45s par côté', advanced: '4×60s par côté — avec rotation de hanche', elite: '5×60s par côté — pieds surélevés + rotation sous le corps' },
  },
  45: {
    description: 'Exercice anti-extension du core qui enseigne la coordination globale et le gainage de la colonne.',
    steps: ['Allongé sur le dos, bras tendus vers le haut, genoux à 90°.', 'Descendre le bras et la jambe opposés vers le sol en appuyant le bas du dos au sol.', 'Revenir au départ avant de changer de côté.'],
    levels: { novice: '3×5 par côté — le bas du dos doit rester collé au sol', beginner: '3×8 par côté', intermediate: '4×10 par côté — ajouter 2s de maintien', advanced: '4×10 par côté — variation jambes tendues', elite: '5×10 par côté — version avec résistance câble' },
  },

  // ── CARDIO ────────────────────────────────────────────────────────────────
  46: {
    description: 'Entraînement par intervalles à haute intensité qui brûle les graisses, développe la vitesse et améliore le VO2 max rapidement.',
    steps: ['S\'échauffer 5 min à allure légère.', 'Sprinter à 90–100% d\'effort pendant 20–30s.', 'Marcher ou courir lentement 60–90s de récupération — répéter.'],
    levels: { novice: '4 séries × 20s sprint — récupération marche complète', beginner: '6 séries × 20s — 60s marche', intermediate: '8 séries × 30s — 45s marche', advanced: '10 séries × 30s — 30s marche', elite: '12 séries × 30s — 20s marche — sprints en côte' },
  },
  47: {
    description: 'L\'un des meilleurs outils cardio — brûle 800+ kcal/h et améliore la coordination et le rythme.',
    steps: ['Tenir les poignées à hauteur des hanches, corde derrière les talons.', 'Faire tourner la corde avec les poignets uniquement — mouvement des bras minimal.', 'Sauter juste assez haut pour passer la corde — atterrir doucement sur la plante des pieds.'],
    levels: { novice: '3×30s sauts basiques — repos 1 min', beginner: '3×60s — repos 60s', intermediate: '5×60s — 30s repos, ajouter pieds alternés', advanced: '5×2 min — doubles tours', elite: '10 min continu — triples tours ou corde rapide' },
  },
  48: {
    description: 'L\'exercice de conditionnement complet le plus efficace. Combine pompe, saut et planche.',
    steps: ['Debout, sauter les pieds en arrière en planche — effectuer une pompe.', 'Sauter les pieds vers les mains, se lever et sauter — mains au-dessus de la tête.', 'Atterrir doucement et recommencer immédiatement.'],
    levels: { novice: '3×5 — reculer/avancer les pieds en marchant plutôt qu\'en sautant', beginner: '3×8 — mouvement complet', intermediate: '4×10 — 30s repos', advanced: '5×15 — 20s repos', elite: '5×20 — moins de 30s par série' },
  },
  49: {
    description: 'Saut pliométrique qui développe la puissance explosive du bas du corps et les fibres musculaires rapides.',
    steps: ['Se placer à 30 cm de la boîte. Balancer les bras en arrière.', 'Exploser vers le haut, en conduisant les bras et les genoux vers le haut.', 'Atterrir doucement sur la boîte avec les deux pieds. Descendre à pas — ne pas sauter en bas.'],
    levels: { novice: '3×5 sur boîte basse 30 cm', beginner: '3×8 sur boîte 40 cm', intermediate: '4×6 sur boîte 60 cm', advanced: '4×6 sur boîte 70–80 cm', elite: '5×5 sur boîte 90+ cm — variation saut en profondeur' },
  },
  50: {
    description: 'Course sur place avec genoux maximum — améliore la mécanique de course et brûle des calories rapidement.',
    steps: ['Debout droit, core serré.', 'Conduire les genoux en alternance à hauteur des hanches ou plus haut.', 'Pomper les bras en opposition — rythme rapide et régulier.'],
    levels: { novice: '3×20s — allure modérée', beginner: '3×30s — plus rapide', intermediate: '4×40s', advanced: '5×45s — bras levés au-dessus de la tête', elite: '5×60s allure max — bandes élastiques aux chevilles' },
  },
  51: {
    description: 'Exercice pliométrique du bas du corps combinant la force du squat avec la puissance explosive.',
    steps: ['S\'accroupir parallèle, bras en arrière.', 'Exploser vers le haut en tendant les bras au-dessus de la tête.', 'Atterrir doucement, s\'enfoncer immédiatement dans le prochain squat.'],
    levels: { novice: '3×8 — squat partiel, petit saut', beginner: '3×10 — profondeur complète', intermediate: '4×12 — rythme continu', advanced: '4×15 — gilet +5 kg', elite: '5×15 — gilet +10 kg ou barre' },
  },
  52: {
    description: 'Cardio classique incontournable. Bon échauffement et mouvement de récupération active.',
    steps: ['Debout, bras le long du corps.', 'Sauter les pieds écartés, lever les bras au-dessus de la tête simultanément.', 'Revenir au départ — garder un rythme régulier.'],
    levels: { novice: '3×20', beginner: '3×40', intermediate: '4×60', advanced: '4×80 — gilet lesté', elite: '5×100 — aussi vite que possible' },
  },
  53: {
    description: 'Cardio explosif du haut du corps qui développe l\'endurance des bras et la stabilité du core simultanément.',
    steps: ['Tenir une extrémité de corde dans chaque main, légère flexion des genoux.', 'Créer des vagues en alternant les bras rapidement vers le haut et le bas.', 'Garder des vagues larges et régulières — rester en position de squat.'],
    levels: { novice: '3×15s — vagues alternées', beginner: '3×20s', intermediate: '4×30s — vagues doubles', advanced: '5×40s — lancers + vagues', elite: '5×60s — effort max, multi-patterns' },
  },
  54: {
    description: 'Cardio step-by-step qui double comme entraînement des fessiers et quadriceps. Faible impact articulaire.',
    steps: ['Trouver des escaliers ou un stepper. Commencer lentement pour s\'échauffer.', 'Monter une marche à la fois, pousser à travers tout le pied.', 'Sauter des marches pour davantage d\'activation des fessiers.'],
    levels: { novice: '10 min allure régulière', beginner: '15 min modéré', intermediate: '20 min — allure rapide ou toutes les deux marches', advanced: '30 min — gilet lesté', elite: '45 min — doubles marches, gilet lesté, sans mains courantes' },
  },
  55: {
    description: 'Cardio faible impact qui développe la base aérobie sans stress articulaire. Idéal pour les jours de récupération.',
    steps: ['Régler la hauteur du vélo — la jambe doit être presque tendue au bas de la pédale.', 'Commencer à faible résistance, construire jusqu\'à zone 2 de fréquence cardiaque.', 'Maintenir une cadence régulière 75–90 RPM.'],
    levels: { novice: '15 min à allure légère — zone 2 FC', beginner: '20 min modéré', intermediate: '30 min avec intervalles durs 5 min', advanced: '45 min — sprints en côte toutes les 5 min', elite: '60 min — programme d\'intervalles structuré' },
  },
  56: {
    description: 'Schéma de mouvement primitif entraînant la coordination, le core et la stabilité des épaules.',
    steps: ['À quatre pattes, genoux à 5 cm du sol.', 'Avancer : main droite + pied gauche simultanément.', 'Garder le dos plat, ne pas faire pivoter les hanches — lent est plus difficile.'],
    levels: { novice: '3×10m — lent et contrôlé', beginner: '3×15m', intermediate: '4×20m — variation en arrière', advanced: '4×20m — avec pompe à chaque bout', elite: '5×30m — gilet lesté + variation latérale' },
  },
  57: {
    description: 'Machine cardio full body — 60% jambes, 20% core, 20% bras. Zéro impact articulaire.',
    steps: ['Position de prise : tibias verticaux, bras tendus, légèrement penché vers l\'avant.', 'Pousser les jambes en premier, puis balancer le corps en arrière, puis tirer la poignée vers le sternum.', 'Revenir dans l\'ordre inverse : bras, corps, jambes.'],
    levels: { novice: '10 min allure légère — apprendre la séquence', beginner: '15 min modéré', intermediate: '5×3 min fort / 1 min léger', advanced: '4×5 min à 85% effort max', elite: 'Trial 2000m — puis programmer en conséquence' },
  },
  58: {
    description: 'Sauts pliométriques latéraux qui développent la force des abducteurs de hanche et l\'agilité.',
    steps: ['Debout sur un pied, légère flexion.', 'Sauter latéralement sur le pied opposé, atterrir doucement.', 'Sauter immédiatement en retour — minimiser le temps de contact au sol.'],
    levels: { novice: '3×10 par côté — lent avec pause', beginner: '3×15 par côté continu', intermediate: '4×20 par côté — focus vitesse', advanced: '5×25 par côté — focus distance', elite: '5×30 par côté — gilet lesté' },
  },
  59: {
    description: 'Circuit rotatif en stations à intensité maximale. Meilleure séance brûle-graisses en termes de temps.',
    steps: ['Choisir 4–6 exercices. Régler le minuteur : 40s travail / 20s repos.', 'Tout donner sur chaque exercice — c\'est censé être difficile.', 'Se reposer 2 min après chaque tour complet.'],
    levels: { novice: '2 tours × 4 exercices × 20s travail', beginner: '3 tours × 4 exercices × 30s travail', intermediate: '4 tours × 5 exercices × 40s travail', advanced: '5 tours × 6 exercices × 45s travail', elite: '6 tours × 6 exercices × 50s travail / 10s repos' },
  },
  60: {
    description: 'Construction de la base aérobie. La course en zone 2 est le fondement de toute l\'endurance et du métabolisme des graisses.',
    steps: ['Commencer avec 5 min de marche/footing léger en échauffement.', 'Courir à une allure où l\'on peut tenir une conversation — zone 2.', 'Terminer par 5 min de récupération légère et d\'étirements.'],
    levels: { novice: '15 min intervalles course/marche — 1 min course, 2 min marche', beginner: '20 min course continue légère', intermediate: '30 min à fréquence cardiaque zone 2', advanced: '45 min — inclure 3×2 min de surges tempo', elite: '60 min+ — construction de base structurée ou course tempo' },
  },

  // ── PULL extra ───────────────────────────────────────────────────────────────
  61: {
    description: 'Rowing unilatéral sur landmine permettant des charges lourdes avec un excellent étirement du grand dorsal en bas.',
    steps: ['Placer une extrémité de barre dans un coin. Se placer de côté, saisir l\'embout de la main extérieure.', 'Ramer la barre vers la hanche, le coude s\'écarte largement.', 'Descendre avec contrôle, laisser l\'omoplate se protracter.'],
    levels: { novice: '3×8 par côté — léger, ressentir l\'étirement du grand dorsal', beginner: '3×10 par côté modéré', intermediate: '4×10 par côté — lourd, maintien 2s en haut', advanced: '4×8 par côté — charge maximale', elite: '5×8 par côté — sangles autorisées, série dégressive finale' },
  },
  62: {
    description: 'Rowing barre depuis le sol à arrêt complet — développe la puissance explosive du dos et enseigne le gainage.',
    steps: ['Barre au sol, buste horizontal. Prise légèrement plus large que les épaules.', 'Tirer la barre explositement vers le bas de la poitrine en un mouvement puissant.', 'Reposer la barre au sol — arrêt complet — avant chaque rep.'],
    levels: { novice: '3×5 léger — buste horizontal et arrêt complet obligatoires', beginner: '3×6 modéré', intermediate: '4×5 lourd — focus sur le tirage explosif', advanced: '4×4 à 80%+ max', elite: '5×3 à 90%+ — focus force pure' },
  },
  63: {
    description: 'Isole le grand dorsal sur grande amplitude sans impliquer les biceps.',
    steps: ['Debout à la poulie haute, saisir la barre ou la corde avec les bras tendus.', 'En gardant les bras tendus, descendre la barre vers les cuisses en arc.', 'Remonter lentement — les lats restent engagés tout au long.'],
    levels: { novice: '3×15 très léger — bras tendus obligatoires', beginner: '3×15 léger', intermediate: '4×12 modéré — pause en bas', advanced: '4×12 lourd — variation corde pour contraction maximale', elite: '5×12 lourd — super-série avec tractions' },
  },
  64: {
    description: 'Rowing sur banc incliné éliminant le travail du bas du dos et forçant une contraction stricte du dos.',
    steps: ['Régler le banc à 30–45°. S\'allonger face vers le bas, haltères pendant droit.', 'Ramer les haltères vers les hanches, pincer les omoplates en haut.', 'Descendre complètement — aucun balancement autorisé.'],
    levels: { novice: '3×12 léger par côté', beginner: '3×12 modéré', intermediate: '4×10 lourd', advanced: '4×8 très lourd — pause 2s en haut', elite: '5×10 — version avec disques ou barre' },
  },
  65: {
    description: 'Rowing câble unilatéral qui améliore l\'équilibre gauche/droit et permet une plus grande amplitude de mouvement.',
    steps: ['Régler la poulie en position basse. Assis ou debout, saisir la poignée simple.', 'Ramer la poignée vers la hanche, faire pivoter légèrement le buste pour plus d\'amplitude.', 'Revenir avec contrôle — étendre complètement le bras et laisser l\'épaule s\'étirer.'],
    levels: { novice: '3×12 par côté léger', beginner: '3×12 par côté modéré', intermediate: '4×10 par côté lourd', advanced: '4×8 par côté — négatif 3s', elite: '5×10 par côté — charge max, reps partielles à l\'échec' },
  },
  66: {
    description: 'Curl verrouillé sur pupitre qui supprime la triche et maximise l\'étirement du biceps en bas.',
    steps: ['Assis au pupitre, bras supérieurs à plat sur l\'appui. Saisir la barre EZ.', 'Curler complètement — les coudes restent sur le pupitre tout au long.', 'Descendre lentement jusqu\'à extension complète — ressentir l\'étirement en bas.'],
    levels: { novice: '3×10 très léger — amplitude complète uniquement', beginner: '3×12 léger', intermediate: '4×10 modéré — descente 3s', advanced: '4×8 lourd — strip set en fin', elite: '5×8 lourd + reps partielles en bas pour étirement supplémentaire' },
  },
  67: {
    description: 'Curl à tension constante qui maintient les biceps chargés même en haut — contrairement aux haltères libres.',
    steps: ['Debout à la poulie basse, fixer la barre droite ou EZ.', 'Curler la barre jusqu\'au menton avec supination complète.', 'Descendre lentement — le câble maintient la tension en extension complète.'],
    levels: { novice: '3×15 léger — ressentir la tension constante', beginner: '3×15 modéré', intermediate: '4×12 lourd', advanced: '4×10 — variation corde pour contraction maximale', elite: '5×10 lourd — super-série avec curl marteau' },
  },
  68: {
    description: 'Curl allongé sur banc incliné qui verrouille le bras vers l\'avant, isolant complètement le pic du biceps.',
    steps: ['S\'allonger face vers le bas sur banc incliné (45°), bras pendant droit.', 'Curler les haltères — les bras supérieurs restent perpendiculaires au sol.', 'Descendre complètement pour un étirement maximum.'],
    levels: { novice: '3×10 léger — forme stricte uniquement', beginner: '3×12 modéré', intermediate: '4×10 lourd — maintien 2s au pic', advanced: '4×8 très lourd — variation barre', elite: '5×8 — variation câble pour tension constante' },
  },
  69: {
    description: 'Combine la phase montante en supination pour le pic biceps avec la phase descendante en pronation pour le brachial et les avant-bras.',
    steps: ['Curler les haltères vers le haut avec paumes vers le haut — curl biceps standard.', 'En haut, faire pivoter les poignets pour que les paumes soient vers le bas.', 'Descendre lentement en prise pronée — amplitude complète.'],
    levels: { novice: '3×10 léger — maîtriser la rotation d\'abord', beginner: '3×10 modéré', intermediate: '4×10 modéré-lourd', advanced: '4×8 lourd — descente 3s', elite: '5×8 lourd — variation inclinée assis' },
  },
  70: {
    description: 'Le favori d\'Arnold pour le pic du biceps — isolation stricte avec le coude calé contre la cuisse intérieure.',
    steps: ['Assis, coude calé contre la cuisse intérieure, haltère pendant.', 'Curler complètement, supiner en haut pour une contraction maximale.', 'Descendre lentement — le coude reste contre la jambe tout au long.'],
    levels: { novice: '3×12 léger par bras', beginner: '3×12 modéré', intermediate: '4×10 lourd — serrer fort en haut', advanced: '4×8 très lourd — maintien 3s au pic', elite: '5×8 — poids max + 3 reps forcées avec la main libre' },
  },

  // ── PUSH extra ───────────────────────────────────────────────────────────────
  71: {
    description: 'Amplitude plus grande que le développé barre — chaque bras travaille indépendamment, corrigeant les déséquilibres.',
    steps: ['Allongé sur banc plat, haltères à hauteur de la poitrine, paumes vers l\'avant.', 'Pousser jusqu\'à extension presque complète — laisser les haltères se rapprocher légèrement.', 'Descendre en-deçà de la profondeur de barre pour un étirement pectoral supplémentaire.'],
    levels: { novice: '3×10 léger — apprendre le mouvement indépendant', beginner: '3×10 modéré', intermediate: '4×8 lourd', advanced: '4×8 très lourd — descente 3s', elite: '5×6 max — rotation des poignets en haut pour contraction extra' },
  },
  72: {
    description: 'Développé barre depuis le sol — limite l\'amplitude et surcharge le verrouillage des triceps.',
    steps: ['Allongé au sol, genoux fléchis, pieds à plat. Mettre en place avec un rack ou un aide.', 'Descendre la barre jusqu\'à ce que les triceps touchent le sol — pause 1 sec.', 'Pousser explosif jusqu\'au verrouillage complet.'],
    levels: { novice: '3×8 léger — ressentir la pause', beginner: '3×10 modéré', intermediate: '4×8 à 75% max développé', advanced: '4×5 à 85%+', elite: '5×3 à 90%+ — constructeur de force triceps maximale' },
  },
  73: {
    description: 'Développé landmine à angle favorable aux épaules — idéal pour les athlètes et les mobilité limitée overhead.',
    steps: ['Fixer une extrémité de barre dans un support landmine ou un coin. Saisir l\'autre extrémité à l\'épaule.', 'Pousser la barre vers le haut et l\'avant en arc, en étendant complètement le bras.', 'Revenir à l\'épaule — garder le core serré tout au long.'],
    levels: { novice: '3×10 par côté très léger', beginner: '3×10 modéré', intermediate: '4×10 lourd', advanced: '4×8 — en alternance', elite: '5×8 — genoux à terre + alternance pour défi de gainage' },
  },
  74: {
    description: 'Développé couché prise étroite qui déplace massivement l\'accent vers les triceps.',
    steps: ['Saisir la barre à largeur d\'épaules (pas trop étroit — poignets neutres obligatoires).', 'Descendre la barre vers le bas de la poitrine, coudes serrés contre le corps.', 'Pousser jusqu\'au verrouillage complet — serrer fort les triceps en haut.'],
    levels: { novice: '3×10 léger — protéger les poignets', beginner: '3×10 modéré', intermediate: '4×8 à 70% max développé', advanced: '4×6 à 80%+', elite: '5×4 à 85%+ — super-série avec skull crushers' },
  },
  75: {
    description: 'Version câble de l\'élévation latérale — tension constante qui empêche la triche habituelle en bas.',
    steps: ['Se placer de côté à la poulie basse, saisir la poignée simple avec la main éloignée.', 'Lever le bras sur le côté à hauteur des épaules.', 'Descendre lentement — le câble reste tendu tout au long.'],
    levels: { novice: '3×15 par côté léger', beginner: '3×15 par côté modéré', intermediate: '4×15 par côté — méthode 1,5 rep', advanced: '4×20 par côté lourd', elite: '5×20 par côté — câble croisé pour contraction maximale' },
  },
  76: {
    description: 'Développé épaules assis ou debout avec haltères — plus grande amplitude et défi d\'équilibre vs barre.',
    steps: ['Tenir les haltères à hauteur des épaules, paumes vers l\'avant.', 'Pousser les deux haltères vers le haut jusqu\'à extension complète au-dessus de la tête.', 'Descendre avec contrôle jusqu\'au départ.'],
    levels: { novice: '3×10 léger assis', beginner: '3×12 modéré', intermediate: '4×10 lourd', advanced: '4×8 très lourd — descente 3s', elite: '5×8 — debout, charge max, défi de stabilisation du core' },
  },
  77: {
    description: 'Substitut de développé overhead au poids du corps — base de la progression vers le poirier.',
    steps: ['Former un V inversé : mains au sol, hanches hautes, jambes tendues.', 'Descendre le sommet du crâne vers le sol en fléchissant les coudes.', 'Remonter au départ — garder les hanches élevées tout au long.'],
    levels: { novice: '3×5 — petite amplitude pour apprendre le mouvement', beginner: '3×8 amplitude complète', intermediate: '4×10 — pieds surélevés sur banc', advanced: '4×12 surélevé — tempo lent', elite: '5×8 — pompe en poirier contre le mur' },
  },
  78: {
    description: 'Mouvement d\'isolation des triceps en contraction maximale — à effectuer léger avec forme stricte.',
    steps: ['Se pencher vers l\'avant, bras supérieur parallèle au sol, coude à 90°.', 'Étendre le bras droit vers l\'arrière jusqu\'au verrouillage complet.', 'Tenir 1 sec en haut, descendre lentement.'],
    levels: { novice: '3×15 léger par bras — position du coude stricte', beginner: '3×15 modéré', intermediate: '4×12 lourd — maintien 2s', advanced: '4×10 très lourd — variation câble', elite: '5×12 — version câble bilatérale pour TUT maximum' },
  },
  79: {
    description: 'Machine de développé couché — idéale pour débutants, échauffements ou entraînement à l\'échec en sécurité.',
    steps: ['Régler le siège pour que les poignées soient à hauteur de poitrine.', 'Pousser les poignées vers l\'avant jusqu\'à extension complète des bras.', 'Revenir lentement — ne pas laisser la pile toucher entre les reps.'],
    levels: { novice: '3×12 léger — amplitude complète', beginner: '3×15 modéré', intermediate: '4×12 lourd — négatif lent 4s', advanced: '4×10 très lourd — série dégressive', elite: '5×10 max — reps partielles à l\'échec + série dégressive' },
  },
  80: {
    description: 'Pompe avec mains surélevées sur blocs ou disques — amplitude plus profonde pour un meilleur étirement pectoral.',
    steps: ['Placer les mains sur deux surfaces surélevées (disques, livres) — légèrement plus large que les épaules.', 'Descendre la poitrine en-deçà du niveau des mains — étirement profond complet.', 'Pousser explosif jusqu\'au verrouillage complet.'],
    levels: { novice: '3×5 petit déficit (2 cm)', beginner: '3×8 déficit modéré (5 cm)', intermediate: '4×12 déficit complet (10 cm)', advanced: '4×15 — ajouter descente lente 3s', elite: '5×15 — anneaux ou sangles TRX pour déficit instable' },
  },

  // ── ABS & LEGS extra ─────────────────────────────────────────────────────────
  81: {
    description: 'Squat sur une boîte qui enseigne le bon recul des hanches et élimine la dérive du genou — excellent pour la force brute.',
    steps: ['Régler la boîte légèrement en-dessous du parallèle. Barre sur le haut des trapèzes.', 'S\'asseoir en arrière sur la boîte — les hanches poussent d\'abord en arrière, pas les genoux vers l\'avant.', 'Pause sur la boîte, puis monter explosif.'],
    levels: { novice: '3×8 poids du corps sur boîte — apprendre le recul', beginner: '3×8 barre légère', intermediate: '4×6 à 70% max squat', advanced: '4×5 à 80%+', elite: '5×3 à 90%+ — forme squat compétition avec boîte' },
  },
  82: {
    description: 'Squat à dominante quadriceps avec barre en rack avant — exige le buste vertical et un core solide.',
    steps: ['Poser la barre sur les deltoïdes antérieurs en rack avant. Prise croisée ou prise de saisie.', 'Garder le buste vertical, squatter jusqu\'aux cuisses parallèles.', 'Monter en poussant à travers les talons — les coudes restent hauts tout au long.'],
    levels: { novice: '3×8 goblet squat d\'abord pour apprendre le buste vertical', beginner: '3×8 barre légère', intermediate: '4×6 à 60% max squat arrière', advanced: '4×4 à 75%', elite: '5×3 à 85%+ — style haltérophilie olympique' },
  },
  83: {
    description: 'Presse unijambiste qui améliore l\'activation des fessiers et la stabilité sur une jambe.',
    steps: ['Tenir les haltères sur les côtés. Placer un pied sur une boîte (hauteur du genou).', 'Pousser à travers le talon surélevé — pousser le corps vers le haut jusqu\'à être debout sur la boîte.', 'Descendre lentement avec contrôle.'],
    levels: { novice: '3×10 par jambe poids du corps — boîte à 30 cm', beginner: '3×10 par jambe haltères légers', intermediate: '4×10 par jambe modéré — boîte à hauteur du genou', advanced: '4×8 par jambe lourd — boîte au-dessus du genou', elite: '5×10 par jambe barre — descente 3s' },
  },
  84: {
    description: 'L\'exercice ischio-jambiers le plus difficile au poids du corps — la charge excentrique produit des gains de force massifs.',
    steps: ['À genoux, chevilles fixées sous un banc ou une barre. Bras croisés sur la poitrine.', 'Descendre le buste vers le sol aussi lentement que possible — les ischio-jambiers résistent.', 'Se pousser du sol avec les mains pour aider la remontée.'],
    levels: { novice: '3×3 — utiliser beaucoup les bras, juste apprendre le mouvement', beginner: '3×5 — aide minimale des bras', intermediate: '4×6 — petite aide des bras', advanced: '4×8 — sans aide des bras', elite: '5×8 — gilet lesté, sans bras' },
  },
  85: {
    description: 'Kick-back câble qui isole le grand fessier avec tension constante — essentiel pour la sculpture des fessiers.',
    steps: ['Fixer la chevillère à la poulie basse. Face à la machine, légère inclinaison vers l\'avant.', 'Botter la jambe de travail vers l\'arrière et en haut — serrer fort le fessier en haut.', 'Revenir lentement — ne pas balancer.'],
    levels: { novice: '3×15 par côté léger — serrer en haut', beginner: '3×15 par côté modéré', intermediate: '4×15 par côté lourd', advanced: '4×20 par côté — maintien 2s en haut', elite: '5×20 par côté — charge max + reps partielles' },
  },
  86: {
    description: 'Squat écart large qui accentue les fessiers et l\'adducteur — buste plus vertical que le squat normal.',
    steps: ['Se placer large (1,5× épaules), orteils à 45°. Tenir un lourd haltère.', 'Squatter droit vers le bas — genoux suivent les orteils, buste vertical.', 'Monter en poussant les genoux vers l\'extérieur — serrer les fessiers en haut.'],
    levels: { novice: '3×12 poids du corps — focus stance et genoux', beginner: '3×12 haltère léger', intermediate: '4×12 haltère modéré', advanced: '4×10 haltère lourd — descente 3s', elite: '5×10 sumo barre ou haltère lourd — pause en bas' },
  },
  87: {
    description: 'L\'exercice abdominal le mieux noté à l\'EMG — combine la rotation avec le travail des jambes.',
    steps: ['Allongé sur le dos, mains derrière la tête, pieds décollés du sol.', 'Amener le genou droit et le coude gauche l\'un vers l\'autre — rotation, pas seulement flexion.', 'Étendre la jambe droite, changer de côté en mouvement de pédalage.'],
    levels: { novice: '3×10 par côté — lent, rotation complète', beginner: '3×15 par côté modéré', intermediate: '4×20 par côté', advanced: '4×25 par côté — plus lent pour plus de TUT', elite: '5×30 par côté — chevillères ou résistance' },
  },
  88: {
    description: 'L\'exercice signature de Bruce Lee — l\'un des mouvements de gainage les plus exigeants qui soit.',
    steps: ['Allongé sur le banc, saisir le bord derrière la tête.', 'Lever le corps à la verticale en ne s\'appuyant que sur les omoplates.', 'Descendre l\'ensemble du corps tendu aussi lentement que possible.'],
    levels: { novice: '3×3 — version "tuck" (genoux fléchis)', beginner: '3×5 — variation une jambe tendue', intermediate: '4×5 — flag complet, descente lente', advanced: '4×6 — pause à mi-descente', elite: '5×8 — amplitude complète, sans pause, cheville lestée' },
  },
  89: {
    description: 'Maintien statique de compression qui développe toute la chaîne antérieure et prépare à la gymnastique.',
    steps: ['Se soutenir sur des barres parallèles ou une station de dips.', 'Lever les jambes tendues devant soi — le corps forme un L.', 'Maintenir la position en respirant normalement.'],
    levels: { novice: '3×5s — L-sit rentré avec genoux fléchis', beginner: '3×10s rentré', intermediate: '4×15s — une jambe tendue', advanced: '4×20s — L-sit complet', elite: '5×30s — L-sit complet, progression vers le V-sit' },
  },
  90: {
    description: 'Squat old-school d\'isolation quadriceps avec étirement profond et contraction maximale impossibles en squat normal.',
    steps: ['Tenir un support légèrement pour l\'équilibre. Pieds joints, talons levés.', 'Se pencher en arrière et descendre en fléchissant les genoux — buste et cuisses restent alignés.', 'Remonter en poussant à travers les quadriceps — pas les hanches.'],
    levels: { novice: '3×8 amplitude partielle — tenir le support fermement', beginner: '3×10 demi-amplitude', intermediate: '4×12 amplitude complète', advanced: '4×15 — ajouter disque léger sur la poitrine', elite: '5×15 — disque + excentrique lent 4s' },
  },

  // ── CARDIO extra ─────────────────────────────────────────────────────────────
  91: {
    description: 'Exercice de boxe à vide qui développe la condition cardiovasculaire, la coordination et la concentration mentale.',
    steps: ['Se placer en garde, mains à hauteur du menton.', 'Lancer des combinaisons : jab-croix-crochet-uppercut, en se déplaçant constamment.', 'Rester léger sur les pieds — ne jamais s\'arrêter de bouger.'],
    levels: { novice: '3×1 min — jab-croix uniquement, marcher entre les rounds', beginner: '3×2 min rounds, 60s repos', intermediate: '5×2 min — combinaisons complètes + jeu de jambes', advanced: '5×3 min — schémas esquive-contre', elite: '8×3 min — 1 min repos, rythme compétition' },
  },
  92: {
    description: 'Mouvement de puissance avec charnière qui développe les fessiers explosifs et élève rapidement le rythme cardiaque.',
    steps: ['Balancer le kettlebell entre les jambes — charnière, pas un squat.', 'Claquer explositement les hanches vers l\'avant — la cloche monte à hauteur des épaules.', 'Laisser revenir, recharger la charnière — rythme continu.'],
    levels: { novice: '3×10 — mécanique de charnière d\'abord, sans élan', beginner: '3×15 KB léger', intermediate: '4×20 KB modéré', advanced: '4×25 KB lourd — variation unilatérale', elite: '5×30 lourd — alternance une main, non-stop' },
  },
  93: {
    description: 'Vélo à résistance air — plus fort tu pousses, plus c\'est difficile. Défi cardiovasculaire maximum.',
    steps: ['Saisir les poignées et pédaler simultanément — pousser et tirer les bras.', 'Maintenir un rythme de respiration régulier.', 'Pour les intervalles : sprinter puis récupération active, ne jamais s\'arrêter complètement.'],
    levels: { novice: '10 min allure régulière — effort modéré', beginner: '5×1 min effort / 2 min léger', intermediate: '8×30s à fond / 90s léger', advanced: '10×20s effort max / 40s repos', elite: 'Tabata : 8×20s/10s — rendement maximum chaque round' },
  },
  94: {
    description: 'Marche sur tapis incliné brûlant autant de calories que la course sans impact articulaire.',
    steps: ['Régler le tapis à 10–15% de pente.', 'Marcher à 4–6 km/h — ne pas tenir les mains courantes.', 'Se pencher légèrement vers l\'avant depuis les chevilles, pas depuis la taille.'],
    levels: { novice: '15 min à 8% pente, 4 km/h', beginner: '20 min à 10%, 4,5 km/h', intermediate: '30 min à 12%, 5 km/h', advanced: '45 min à 15%, 5,5 km/h', elite: '60 min à 15% — gilet lesté, sans mains courantes' },
  },
  95: {
    description: 'Sprint avec traîneau chargé qui développe la puissance des jambes, la condition physique et la résistance mentale simultanément.',
    steps: ['Charger le traîneau au poids approprié. Saisir les poignées à hauteur des hanches.', 'S\'incliner à 45° vers le traîneau — pousser avec des enjambées alternées et puissantes.', 'Maintenir une pression constante — ne pas laisser le traîneau ralentir.'],
    levels: { novice: '4×10m traîneau vide — apprendre l\'inclinaison', beginner: '4×20m charge légère', intermediate: '5×20m charge modérée', advanced: '6×30m charge lourde — 60s repos', elite: '8×40m charge max — 90s repos — chronométré' },
  },
  96: {
    description: 'Exercice d\'agilité latérale qui améliore la force des abducteurs de hanche, la coordination et la vitesse de changement de direction.',
    steps: ['Position athlétique : légère flexion, core serré, poids sur la plante des pieds.', 'Pousser et glisser latéralement — ne pas croiser les pieds.', 'Toucher une ligne ou un cône, changer de direction explosif.'],
    levels: { novice: '3×20s — shuffles lents et contrôlés', beginner: '3×30s — allure modérée', intermediate: '4×40s — rapide avec cônes à 5m', advanced: '5×45s — bandes élastiques aux chevilles', elite: '5×60s — bandes + changement de direction sur signal' },
  },
  97: {
    description: 'Saut horizontal maximal qui développe la puissance explosive et enseigne la mécanique d\'atterrissage.',
    steps: ['Debout pieds à largeur d\'épaules, fléchir les genoux et balancer les bras en arrière.', 'Exploser vers l\'avant — distance horizontale maximale.', 'Atterrir doucement sur les deux pieds, absorber la force avec les genoux fléchis.'],
    levels: { novice: '3×4 reps — focus atterrissage souple', beginner: '3×5 reps — ajouter le balancement des bras', intermediate: '4×5 reps — distance maximale chaque saut', advanced: '4×6 reps — sauts larges continus', elite: '5×6 reps — gilet lesté ou sprint immédiat après atterrissage' },
  },
  98: {
    description: 'Fente pliométrique qui développe la puissance explosive sur une jambe et brûle beaucoup de calories.',
    steps: ['Partir en position de fente, genou arrière près du sol.', 'Sauter explosif et changer de jambes en l\'air.', 'Atterrir en fente opposée — absorber doucement.'],
    levels: { novice: '3×5 par jambe — marcher plutôt que sauter d\'abord', beginner: '3×8 par jambe — petit saut', intermediate: '4×10 par jambe continu', advanced: '4×12 par jambe — temps de contact au sol minimal', elite: '5×15 par jambe — gilet lesté, hauteur maximale' },
  },
  99: {
    description: 'Exercice de vitesse des pieds et de coordination qui améliore les performances athlétiques et brûle des calories.',
    steps: ['Poser l\'échelle au sol. Se placer à une extrémité, pieds prêts.', 'Traverser l\'échelle avec le schéma choisi (1-pied, 2-pieds, ickey shuffle, etc.).', 'Rester sur la plante des pieds — les bras pompent pour la vitesse.'],
    levels: { novice: '3×1 longueur — lent, schéma 1-pied uniquement', beginner: '3×2 longueurs — 2 schémas', intermediate: '4×3 longueurs — 4 schémas, repos minimal', advanced: '5×4 longueurs — vitesse max chaque passage', elite: '6×4 longueurs — tous schémas, changement de direction, signaux réactifs' },
  },
  100: {
    description: 'Variante explosive de la pompe qui développe la puissance du haut du corps et l\'activation des fibres musculaires rapides.',
    steps: ['Partir en position de pompe standard.', 'Descendre à fond, puis exploser vers le haut pour que les mains quittent le sol.', 'Atterrir avec les coudes fléchis — absorber et enchaîner immédiatement.'],
    levels: { novice: '3×3 — juste une poussée rapide sans airtime encore', beginner: '3×5 — les mains décollent légèrement', intermediate: '4×8 — clap entre les reps', advanced: '4×10 — clap poitrine ou double clap', elite: '5×10 — triple clap ou gilet lesté, 30s repos uniquement' },
  },
}
