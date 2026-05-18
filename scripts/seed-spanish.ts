import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

type Q = { q: string; opts: string[]; ans: number }
type Seed = {
  cat: { name: string; emoji: string; color: string }
  note: { title: string; rules: string; examples: string; quiz: Q[] }
}

const data: Seed[] = [
  // ── 1. Greetings ──────────────────────────────────────────────
  {
    cat: { name: 'Greetings', emoji: '👋', color: '#2d6a4f' },
    note: {
      title: 'Saludos – Greetings',
      rules: `• Hola – Hello
• Buenos días – Good morning (used until noon)
• Buenas tardes – Good afternoon (noon to ~8 pm)
• Buenas noches – Good evening / Good night
• ¿Cómo estás? – How are you? (informal, tú)
• ¿Cómo está usted? – How are you? (formal, usted)
• ¿Cómo te va? – How's it going? (informal)
• Bien, gracias – Fine, thank you
• Muy bien – Very well
• Más o menos – So-so
• ¿Y tú? / ¿Y usted? – And you?
• Mucho gusto – Nice to meet you
• Encantado/a – Delighted to meet you
• ¿Cómo te llamas? – What's your name? (informal)
• Me llamo … – My name is …
• ¿De dónde eres? – Where are you from?
• Soy de … – I am from …
• Hasta luego – See you later
• Hasta mañana – See you tomorrow
• Adiós – Goodbye
• Chao – Bye (informal)`,
      examples: `– ¡Hola! ¿Cómo estás? – Bien, gracias. ¿Y tú?
– Buenos días, señora García.
– Mucho gusto, me llamo Carlos.
– ¿De dónde eres? – Soy de México.
– Hasta luego, nos vemos mañana.`,
      quiz: [
        { q: 'How do you say "Good morning" in Spanish?', opts: ['Buenas noches', 'Buenas tardes', 'Buenos días', 'Hola'], ans: 2 },
        { q: 'What does "Mucho gusto" mean?', opts: ['Very good', 'Nice to meet you', 'Thank you very much', 'See you later'], ans: 1 },
        { q: 'Which phrase means "See you tomorrow"?', opts: ['Hasta luego', 'Adiós', 'Hasta mañana', 'Chao'], ans: 2 },
        { q: '¿Cómo te llamas? means:', opts: ['Where are you from?', 'How are you?', 'What is your name?', 'How old are you?'], ans: 2 },
        { q: '"Buenas tardes" is used:', opts: ['In the morning', 'At midnight', 'From noon to ~8 pm', 'Only on weekdays'], ans: 2 },
        { q: 'How do you say "I am from Spain"?', opts: ['Estoy de España', 'Soy de España', 'Vengo España', 'Me llamo España'], ans: 1 },
      ],
    },
  },

  // ── 2. Manners ────────────────────────────────────────────────
  {
    cat: { name: 'Manners', emoji: '🙏', color: '#40916c' },
    note: {
      title: 'Modales – Manners & Politeness',
      rules: `• Por favor – Please
• Gracias – Thank you
• Muchas gracias – Thank you very much
• De nada – You're welcome
• Con mucho gusto – With pleasure
• Perdón / Perdone – Pardon / Excuse me (formal)
• Disculpe – Excuse me (formal, to get attention)
• Lo siento – I'm sorry
• No hay de qué – Don't mention it
• ¿Me puede ayudar? – Can you help me? (formal)
• ¿Puede repetir? – Can you repeat? (formal)
• Más despacio, por favor – Slower, please
• No entiendo – I don't understand
• No sé – I don't know
• Claro que sí – Of course
• Por supuesto – Of course / Certainly`,
      examples: `– Por favor, ¿me puede ayudar?
– Muchas gracias. – De nada, con mucho gusto.
– Lo siento, no entiendo. ¿Puede repetir más despacio?
– Disculpe, ¿dónde está el baño?
– Claro que sí, no hay problema.`,
      quiz: [
        { q: 'How do you say "Please" in Spanish?', opts: ['Gracias', 'Por favor', 'De nada', 'Perdón'], ans: 1 },
        { q: 'What is the response to "Gracias"?', opts: ['Lo siento', 'Por favor', 'De nada', 'Claro'], ans: 2 },
        { q: '"Lo siento" means:', opts: ['I love it', 'I know', "I'm sorry", 'I want it'], ans: 2 },
        { q: 'How do you ask someone to repeat slower?', opts: ['Más rápido, por favor', 'Más despacio, por favor', 'Repita ahora', 'Habla más'], ans: 1 },
        { q: '"Por supuesto" means:', opts: ['Perhaps', 'Never', 'Of course', 'Please'], ans: 2 },
        { q: 'Which phrase means "Excuse me" to get attention?', opts: ['Lo siento', 'Perdón', 'Disculpe', 'De nada'], ans: 2 },
      ],
    },
  },

  // ── 3. Numbers ────────────────────────────────────────────────
  {
    cat: { name: 'Numbers', emoji: '🔢', color: '#52b788' },
    note: {
      title: 'Los Números – Numbers',
      rules: `0–10: cero, uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez
11–19: once, doce, trece, catorce, quince, dieciséis, diecisiete, dieciocho, diecinueve
20–29: veinte, veintiuno, veintidós, veintitrés…
30, 40, 50, 60, 70, 80, 90: treinta, cuarenta, cincuenta, sesenta, setenta, ochenta, noventa
100: cien / ciento (before another number: ciento diez)
200–900: doscientos, trescientos, cuatrocientos, quinientos, seiscientos, setecientos, ochocientos, novecientos
1 000: mil
1 000 000: un millón
• Compound: 31 = treinta y uno; 55 = cincuenta y cinco
• "uno" becomes "un" before masculine nouns: veintiún libros`,
      examples: `– Tengo veintidós años. (I am 22 years old.)
– El número de teléfono es cinco-cinco-tres-cuatro-dos-uno.
– Cuesta ciento cincuenta euros. (It costs €150.)
– Hay quinientas personas aquí.`,
      quiz: [
        { q: 'What is "15" in Spanish?', opts: ['Catorce', 'Quince', 'Dieciséis', 'Trece'], ans: 1 },
        { q: 'How do you say "32"?', opts: ['Treinta y dos', 'Veintidós', 'Cuarenta y dos', 'Trece y dos'], ans: 0 },
        { q: '"Cincuenta" means:', opts: ['15', '40', '50', '60'], ans: 2 },
        { q: 'What is "100" in Spanish?', opts: ['Mil', 'Ciento', 'Cien', 'Noventa'], ans: 2 },
        { q: '"Doscientos" means:', opts: ['120', '200', '20', '2000'], ans: 1 },
        { q: 'How do you say "1000"?', opts: ['Un millón', 'Cien', 'Mil', 'Ciento'], ans: 2 },
      ],
    },
  },

  // ── 4. Colors ─────────────────────────────────────────────────
  {
    cat: { name: 'Colors', emoji: '🎨', color: '#95d5b2' },
    note: {
      title: 'Los Colores – Colors',
      rules: `• rojo/a – red
• azul – blue (invariable)
• verde – green (invariable)
• amarillo/a – yellow
• naranja – orange (invariable)
• morado/a / violeta – purple
• rosa / rosado/a – pink
• negro/a – black
• blanco/a – white
• gris – gray (invariable)
• marrón / café – brown
• Color agreement: adjectives agree with the noun in gender and number
  – un coche rojo / una casa roja / coches rojos / casas rojas
• Invariable colors (azul, verde, naranja, gris, rosa, violeta) do NOT change for gender
  – un coche azul / una casa azul`,
      examples: `– El cielo es azul. (The sky is blue.)
– Ella lleva una falda roja y zapatos negros.
– Me gustan las flores amarillas.
– Los árboles tienen hojas verdes.
– Tengo un gato gris y blanco.`,
      quiz: [
        { q: 'What color is "rojo"?', opts: ['Blue', 'Green', 'Red', 'Yellow'], ans: 2 },
        { q: '"Amarillo" means:', opts: ['Orange', 'Yellow', 'Brown', 'Pink'], ans: 1 },
        { q: 'Which color is invariable (same for masc. & fem.)?', opts: ['Rojo', 'Blanco', 'Azul', 'Negro'], ans: 2 },
        { q: 'How do you say "a red house"?', opts: ['Una casa rojo', 'Una casa roja', 'Un casa roja', 'Una roja casa'], ans: 1 },
        { q: '"Marrón" means:', opts: ['Purple', 'Pink', 'Brown', 'Gray'], ans: 2 },
        { q: 'What is "white" in Spanish?', opts: ['Negro', 'Gris', 'Blanco', 'Verde'], ans: 2 },
      ],
    },
  },

  // ── 5. Food ───────────────────────────────────────────────────
  {
    cat: { name: 'Food', emoji: '🍽️', color: '#1b4332' },
    note: {
      title: 'La Comida – Food',
      rules: `Meals: el desayuno (breakfast), el almuerzo/la comida (lunch), la cena (dinner)
Common food vocab:
• el pan – bread • la leche – milk • el huevo – egg
• la carne – meat • el pollo – chicken • el pescado – fish
• el arroz – rice • la pasta – pasta • la ensalada – salad
• las verduras – vegetables • las frutas – fruit
• la manzana – apple • el plátano/la banana – banana • la naranja – orange
• el queso – cheese • la mantequilla – butter • el aceite – oil
• el azúcar – sugar • la sal – salt • la pimienta – pepper
• el agua (f.) – water • el jugo/zumo – juice • el café – coffee
Useful phrases:
• Tengo hambre – I'm hungry
• Tengo sed – I'm thirsty
• ¿Qué hay de comer? – What is there to eat?
• Me gusta(n)… – I like…
• No como carne – I don't eat meat`,
      examples: `– Para el desayuno como pan con mantequilla y tomo café.
– ¿Tienes hambre? – Sí, ¿qué hay de comer?
– Me gustan mucho las frutas frescas.
– El arroz con pollo es mi plato favorito.`,
      quiz: [
        { q: '"El desayuno" means:', opts: ['Lunch', 'Dinner', 'Breakfast', 'Snack'], ans: 2 },
        { q: 'How do you say "I am hungry"?', opts: ['Tengo sed', 'Tengo frío', 'Tengo hambre', 'Tengo calor'], ans: 2 },
        { q: '"El pescado" means:', opts: ['Chicken', 'Meat', 'Fish', 'Egg'], ans: 2 },
        { q: 'What is "vegetables" in Spanish?', opts: ['Las frutas', 'Las verduras', 'Los granos', 'Las carnes'], ans: 1 },
        { q: '"Me gustan las manzanas" means:', opts: ['I eat apples', 'I like apples', 'I have apples', 'I buy apples'], ans: 1 },
        { q: 'Which is the Spanish word for "sugar"?', opts: ['La sal', 'El aceite', 'La pimienta', 'El azúcar'], ans: 3 },
      ],
    },
  },

  // ── 6. The Alphabet ───────────────────────────────────────────
  {
    cat: { name: 'The Alphabet', emoji: '🔤', color: '#2d6a4f' },
    note: {
      title: 'El Alfabeto – The Alphabet',
      rules: `The Spanish alphabet has 27 letters (includes ñ):
A(a) B(be) C(ce) D(de) E(e) F(efe) G(ge) H(hache) I(i) J(jota) K(ka) L(ele) M(eme) N(ene) Ñ(eñe) O(o) P(pe) Q(cu) R(erre) S(ese) T(te) U(u) V(uve) W(doble uve) X(equis) Y(ye/i griega) Z(zeta)
Key pronunciation rules:
• H is always silent: hotel = "otel"
• J sounds like English H: jamón = "hamón"
• LL sounds like Y: llamar = "yamar"
• Ñ sounds like "ny": España = "espanya"
• RR is a strong trill
• C before e/i = S sound (Spain: th): ciudad
• G before e/i = H sound: gente
• QU before e/i = K sound: queso
• V and B sound the same in Spanish`,
      examples: `– Mi nombre se escribe: J-U-A-N.
– La letra "ñ" es única del español.
– "Hotel" se pronuncia "otel" porque la H es muda.
– ¿Cómo se escribe tu apellido?`,
      quiz: [
        { q: 'How many letters are in the Spanish alphabet?', opts: ['26', '27', '28', '25'], ans: 1 },
        { q: 'The letter H in Spanish is:', opts: ['Pronounced like English H', 'Always silent', 'Pronounced like J', 'Trilled'], ans: 1 },
        { q: 'Which letter is unique to the Spanish alphabet?', opts: ['Ü', 'Ñ', 'Ç', 'Ø'], ans: 1 },
        { q: 'How is "J" pronounced in Spanish?', opts: ['Like English J', 'Like English Y', 'Like English H', 'Like English G'], ans: 2 },
        { q: '"C" before "e" or "i" sounds like:', opts: ['K', 'G', 'S (or th in Spain)', 'Ch'], ans: 2 },
        { q: 'The name for the letter "W" in Spanish is:', opts: ['Ve doble', 'Doble uve', 'Uve doble', 'Doble ve'], ans: 1 },
      ],
    },
  },

  // ── 7. Animals ────────────────────────────────────────────────
  {
    cat: { name: 'Animals', emoji: '🐾', color: '#40916c' },
    note: {
      title: 'Los Animales – Animals',
      rules: `Pets & domestic: el perro (dog), el gato (cat), el pájaro (bird), el pez (fish), el conejo (rabbit), el caballo (horse), la vaca (cow), el cerdo (pig), la oveja (sheep), el pollo (chicken)
Wild animals: el león (lion), el tigre (tiger), el elefante (elephant), el oso (bear), el lobo (wolf), la serpiente (snake), el cocodrilo (crocodile), el mono (monkey), la jirafa (giraffe), el delfín (dolphin)
Useful phrases:
• El perro ladra – The dog barks
• El gato maúlla – The cat meows
• El pájaro canta – The bird sings
• Tengo un perro que se llama Rex.
• Gender: most animal nouns have fixed gender; some change: el gato / la gata`,
      examples: `– Tengo dos gatos y un perro en casa.
– El elefante es el animal más grande de la tierra.
– En el zoológico hay leones, tigres y monos.
– Me gustan los delfines porque son muy inteligentes.`,
      quiz: [
        { q: 'What is "dog" in Spanish?', opts: ['El gato', 'El pájaro', 'El perro', 'El pez'], ans: 2 },
        { q: '"El caballo" means:', opts: ['Cat', 'Horse', 'Rabbit', 'Cow'], ans: 1 },
        { q: 'Which animal is "el delfín"?', opts: ['Dolphin', 'Whale', 'Shark', 'Seal'], ans: 0 },
        { q: '"La serpiente" means:', opts: ['Lizard', 'Crocodile', 'Snake', 'Spider'], ans: 2 },
        { q: 'How do you say "The cat meows"?', opts: ['El gato ladra', 'El gato maúlla', 'El gato canta', 'El gato corre'], ans: 1 },
        { q: '"La oveja" means:', opts: ['Pig', 'Goat', 'Sheep', 'Hen'], ans: 2 },
      ],
    },
  },

  // ── 8. Exercise ───────────────────────────────────────────────
  {
    cat: { name: 'Exercise', emoji: '💪', color: '#52b788' },
    note: {
      title: 'El Ejercicio – Exercise & Sport Vocabulary',
      rules: `• hacer ejercicio – to exercise
• ir al gimnasio – to go to the gym
• correr – to run
• caminar – to walk
• nadar – to swim
• levantar pesas – to lift weights
• hacer yoga – to do yoga
• montar en bicicleta – to ride a bike
• hacer flexiones – to do push-ups
• hacer abdominales – to do sit-ups
• estirar(se) – to stretch
• calentarse – to warm up
• el entrenamiento – workout/training
• el deportista – athlete
• cansado/a – tired
• en forma – in shape
• sano/a – healthy
• Frequency: todos los días (every day), tres veces a la semana (3x a week)`,
      examples: `– Voy al gimnasio tres veces a la semana.
– Me gusta correr en el parque por la mañana.
– Necesito calentarme antes de levantar pesas.
– Hago yoga para relajarme y mantenerme en forma.`,
      quiz: [
        { q: '"Levantar pesas" means:', opts: ['To run', 'To swim', 'To lift weights', 'To stretch'], ans: 2 },
        { q: 'How do you say "to go to the gym"?', opts: ['Hacer ejercicio', 'Ir al gimnasio', 'Montar bicicleta', 'Nadar'], ans: 1 },
        { q: '"Calentarse" means:', opts: ['To cool down', 'To warm up', 'To sweat', 'To rest'], ans: 1 },
        { q: '"En forma" means:', opts: ['On time', 'In shape', 'At the gym', 'Healthy food'], ans: 1 },
        { q: 'How do you say "every day"?', opts: ['A veces', 'Tres veces', 'Todos los días', 'Nunca'], ans: 2 },
        { q: '"Hacer flexiones" means:', opts: ['To do sit-ups', 'To do push-ups', 'To do yoga', 'To stretch'], ans: 1 },
      ],
    },
  },

  // ── 9. Important Verbs Part 1 ─────────────────────────────────
  {
    cat: { name: 'Important Verbs Part 1', emoji: '📝', color: '#1b4332' },
    note: {
      title: 'Verbos Importantes – Part 1',
      rules: `Present tense of key -AR verbs (yo/tú/él/nosotros/vosotros/ellos):
• hablar (to speak): hablo/hablas/habla/hablamos/habláis/hablan
• caminar (to walk): camino/caminas/camina/caminamos/camináis/caminan
• trabajar (to work): trabajo/trabajas/trabaja/trabajamos/trabajáis/trabajan
• estudiar (to study): estudio/estudias/estudia/estudiamos/estudiáis/estudian
• escuchar (to listen): escucho/escuchas/escucha/escuchamos/escucháis/escuchan
• necesitar (to need): necesito/necesitas/necesita/necesitamos/necesitáis/necesitan
• buscar (to look for): busco/buscas/busca/buscamos/buscáis/buscan
• comprar (to buy): compro/compras/compra/compramos/compráis/compran
• llegar (to arrive): llego/llegas/llega/llegamos/llegáis/llegan
• usar (to use): uso/usas/usa/usamos/usáis/usan`,
      examples: `– Yo hablo español todos los días.
– Ella trabaja en una oficina.
– ¿Estudias mucho para los exámenes?
– Nosotros llegamos a las ocho de la mañana.
– Busco mis llaves, ¿las viste?`,
      quiz: [
        { q: 'What is "yo" form of "hablar"?', opts: ['Hablas', 'Hablo', 'Habla', 'Hablamos'], ans: 1 },
        { q: '"Trabajar" means:', opts: ['To study', 'To walk', 'To work', 'To listen'], ans: 2 },
        { q: 'Correct form: "Ellos ___ mucho." (estudiar)', opts: ['Estudiamos', 'Estudia', 'Estudian', 'Estudias'], ans: 2 },
        { q: '"Buscar" means:', opts: ['To buy', 'To find', 'To look for', 'To use'], ans: 2 },
        { q: 'Correct: "Nosotros ___ a las 8." (llegar)', opts: ['Llegáis', 'Llegan', 'Llego', 'Llegamos'], ans: 3 },
        { q: '"Necesito agua" means:', opts: ['I drink water', 'I want water', 'I need water', 'I have water'], ans: 2 },
      ],
    },
  },

  // ── 10. Important Verbs Part 2 ────────────────────────────────
  {
    cat: { name: 'Important Verbs Part 2', emoji: '📝', color: '#2d6a4f' },
    note: {
      title: 'Verbos Importantes – Part 2',
      rules: `Key -ER and -IR verbs:
• comer (to eat): como/comes/come/comemos/coméis/comen
• beber (to drink): bebo/bebes/bebe/bebemos/bebéis/beben
• leer (to read): leo/lees/lee/leemos/leéis/leen
• correr (to run): corro/corres/corre/corremos/corréis/corren
• vivir (to live): vivo/vives/vive/vivimos/vivís/viven
• escribir (to write): escribo/escribes/escribe/escribimos/escribís/escriben
• abrir (to open): abro/abres/abre/abrimos/abrís/abren
• subir (to go up): subo/subes/sube/subimos/subís/suben
Irregular verbs (very common):
• tener (to have): tengo/tienes/tiene/tenemos/tenéis/tienen
• ir (to go): voy/vas/va/vamos/vais/van
• venir (to come): vengo/vienes/viene/venimos/venís/vienen
• hacer (to do/make): hago/haces/hace/hacemos/hacéis/hacen
• querer (to want/love): quiero/quieres/quiere/queremos/queréis/quieren`,
      examples: `– ¿Qué comes para el almuerzo?
– Vivimos en un apartamento pequeño.
– Tengo dos hermanos y una hermana.
– ¿A dónde vas esta tarde?
– Quiero aprender español bien.`,
      quiz: [
        { q: 'What is "yo" form of "tener"?', opts: ['Tienes', 'Tiene', 'Tengo', 'Tenemos'], ans: 2 },
        { q: '"Vivir" means:', opts: ['To visit', 'To live', 'To leave', 'To win'], ans: 1 },
        { q: 'Correct form: "Ellos ___ a la fiesta." (ir)', opts: ['Va', 'Vamos', 'Vais', 'Van'], ans: 3 },
        { q: '"Quiero" is the yo-form of:', opts: ['Querer', 'Poder', 'Hacer', 'Saber'], ans: 0 },
        { q: '"Hago" is yo-form of which verb?', opts: ['Ir', 'Hablar', 'Hacer', 'Tener'], ans: 2 },
        { q: 'Correct: "Nosotros ___ café." (beber)', opts: ['Beben', 'Bebemos', 'Bebes', 'Bebo'], ans: 1 },
      ],
    },
  },

  // ── 11. Practice and Build Part 1 ─────────────────────────────
  {
    cat: { name: 'Practice and Build Part 1', emoji: '🔨', color: '#40916c' },
    note: {
      title: 'Práctica y Construcción – Part 1',
      rules: `Build sentences using: Subject + Verb + Object/Complement
• Articles: el/la (the, singular), los/las (the, plural), un/una (a/an)
• Negation: place "no" before the verb → No tengo dinero.
• Questions: invert or use ¿…? → ¿Tienes dinero?
• Common question words: qué (what), quién (who), dónde (where), cuándo (when), cómo (how), cuánto/a (how much/many), por qué (why)
• Sentence pattern practice:
  – Yo + verbo + objeto: Yo como arroz.
  – Tú + verbo + adjetivo: Tú eres inteligente.
  – Él/Ella + verbo + lugar: Ella vive en Madrid.`,
      examples: `– ¿Dónde vives? – Vivo en París.
– No tengo hambre, gracias.
– ¿Cuántos años tienes? – Tengo veinticinco años.
– Ella no habla inglés pero habla francés.
– ¿Por qué estudias español? – Porque me gusta mucho.`,
      quiz: [
        { q: 'Where does "no" go in a negative sentence?', opts: ['At the end', 'After the object', 'Before the verb', 'At the start always'], ans: 2 },
        { q: '"¿Dónde?" means:', opts: ['When?', 'Why?', 'Where?', 'How?'], ans: 2 },
        { q: 'Correct sentence?', opts: ['Yo arroz como.', 'Como yo arroz.', 'Yo como arroz.', 'Arroz yo como.'], ans: 2 },
        { q: '"¿Por qué?" means:', opts: ['How much?', 'Why?', 'Who?', 'What?'], ans: 1 },
        { q: 'How do you say "I don\'t have money"?', opts: ['Tengo no dinero', 'No tengo dinero', 'Dinero no tengo', 'No dinero tengo'], ans: 1 },
        { q: '"¿Cuántos años tienes?" asks about:', opts: ['Your name', 'Your job', 'Your age', 'Your city'], ans: 2 },
      ],
    },
  },

  // ── 12. Practice and Build Part 2 ─────────────────────────────
  {
    cat: { name: 'Practice and Build Part 2', emoji: '🔨', color: '#52b788' },
    note: {
      title: 'Práctica y Construcción – Part 2',
      rules: `Adjective agreement and placement:
• Descriptive adjectives usually follow the noun: un libro interesante
• Agreement: masculine singular → masc. plural → fem. singular → fem. plural
  – alto / altos / alta / altas
• Exceptions (before noun): bueno→buen, malo→mal, grande→gran, primero→primer
Ser + adjective for permanent traits:
• Soy alto. / Ella es inteligente. / Somos felices.
Common adjectives:
grande (big), pequeño (small), nuevo (new), viejo (old), bueno (good), malo (bad), bonito (pretty), feo (ugly), rápido (fast), lento (slow), fácil (easy), difícil (difficult)`,
      examples: `– Tengo un coche nuevo y rápido.
– Es una idea muy buena.
– El libro es difícil pero interesante.
– Vivimos en una casa grande y bonita.
– Mi hermana es alta y muy simpática.`,
      quiz: [
        { q: 'Where do descriptive adjectives usually go?', opts: ['Before the noun', 'After the noun', 'At the end of the sentence', 'Before the verb'], ans: 1 },
        { q: 'Correct agreement: "a pretty (fem.) girl"', opts: ['Una chica bonito', 'Un chica bonita', 'Una chica bonita', 'Una chica bonitos'], ans: 2 },
        { q: '"Difícil" means:', opts: ['Easy', 'Fast', 'Difficult', 'Old'], ans: 2 },
        { q: '"Bueno" before a masc. singular noun becomes:', opts: ['Buena', 'Buen', 'Buenos', 'Bien'], ans: 1 },
        { q: 'Correct plural: "tall men" (alto)', opts: ['Alto hombres', 'Altos hombres', 'Hombres alto', 'Hombres altos'], ans: 3 },
        { q: '"Grande" before a noun (shortening) becomes:', opts: ['Grand', 'Grandes', 'Gran', 'Grando'], ans: 2 },
      ],
    },
  },

  // ── 13. Practice and Build Part 3 ─────────────────────────────
  {
    cat: { name: 'Practice and Build Part 3', emoji: '🔨', color: '#1b4332' },
    note: {
      title: 'Práctica y Construcción – Part 3',
      rules: `Possessive adjectives (before noun):
• mi/mis (my), tu/tus (your-inf.), su/sus (his/her/your-formal/their)
• nuestro/a/os/as (our), vuestro/a/os/as (your-pl. Spain)
Demonstratives:
• este/esta/estos/estas – this/these (near)
• ese/esa/esos/esas – that/those (medium)
• aquel/aquella/aquellos/aquellas – that/those (far)
Prepositions of location:
• en (in/at), cerca de (near), lejos de (far from), delante de (in front of), detrás de (behind), al lado de (next to), entre (between), encima de (on top of), debajo de (under)`,
      examples: `– Mi libro está encima de la mesa.
– Este restaurante es muy bueno.
– ¿Es esa tu mochila? – No, mi mochila es azul.
– La farmacia está al lado del banco.
– Nuestro apartamento está cerca del metro.`,
      quiz: [
        { q: '"Mi" means:', opts: ['Me', 'My', 'Mine', 'More'], ans: 1 },
        { q: '"Este" refers to something:', opts: ['Far away', 'Medium distance', 'Close to speaker', 'Behind you'], ans: 2 },
        { q: '"Encima de" means:', opts: ['Under', 'Next to', 'On top of', 'Behind'], ans: 2 },
        { q: 'Possessive for "our" (masc. plural)?', opts: ['Sus', 'Nuestros', 'Vuestros', 'Mis'], ans: 1 },
        { q: '"Al lado de" means:', opts: ['Far from', 'In front of', 'Next to', 'Between'], ans: 2 },
        { q: 'Correct: "_____ chica es mi amiga." (that, medium)', opts: ['Esta', 'Aquella', 'Esa', 'Ese'], ans: 2 },
      ],
    },
  },

  // ── 14. Practice and Build Part 4 ─────────────────────────────
  {
    cat: { name: 'Practice and Build Part 4', emoji: '🔨', color: '#2d6a4f' },
    note: {
      title: 'Práctica y Construcción – Part 4',
      rules: `Direct object pronouns (DOPs):
• me (me), te (you-inf.), lo/la (him/her/it), nos (us), os (you-pl.), los/las (them)
• DOPs go before conjugated verb: Lo veo. (I see it/him.)
• Or attached to infinitive: Quiero verlo.
Indirect object pronouns (IOPs):
• me, te, le, nos, os, les
• IOPs also go before conjugated verb: Le doy el libro. (I give him the book.)
• When both: IOP before DOP, and le/les → se before lo/la/los/las
  – Se lo doy. (I give it to him.)
Verbs like gustar:
• me gusta (I like it singular) / me gustan (I like them plural)
• te/le/nos/os/les gusta(n)`,
      examples: `– ¿Ves el coche? – Sí, lo veo.
– Te llamo esta noche. (I'll call you tonight.)
– Me gustan los libros de aventura.
– ¿El regalo? – Se lo di a María ayer.`,
      quiz: [
        { q: 'DOP for "him/it" (masc.) is:', opts: ['Le', 'Lo', 'La', 'Se'], ans: 1 },
        { q: '"Lo veo" means:', opts: ['I see her', 'I see them', 'I see him/it', 'He sees me'], ans: 2 },
        { q: '"Me gustan los tacos" means:', opts: ['I eat tacos', 'I make tacos', 'I like tacos', 'I want tacos'], ans: 2 },
        { q: 'Where do object pronouns go?', opts: ['After the verb', 'Before conjugated verb (or attached to infinitive)', 'At the sentence end', 'Before subject'], ans: 1 },
        { q: '"Le" before "lo" becomes:', opts: ['Lo', 'Le', 'Se', 'Les'], ans: 2 },
        { q: '"Te llamo" means:', opts: ['You call me', 'I call you', 'He calls you', 'We call'], ans: 1 },
      ],
    },
  },

  // ── 15. Practice and Build Part 5 ─────────────────────────────
  {
    cat: { name: 'Practice and Build Part 5', emoji: '🔨', color: '#40916c' },
    note: {
      title: 'Práctica y Construcción – Part 5',
      rules: `Ser vs Estar (quick review):
• SER: identity, origin, profession, permanent characteristics, time/date
• ESTAR: location, temporary states, feelings, progressive tenses
Present progressive: estar + gerund (-ando/-iendo)
• Estoy hablando – I am speaking
• Estás comiendo – You are eating
• Está corriendo – He/She is running
Ir a + infinitive (near future):
• Voy a comer. – I'm going to eat.
• Vamos a salir esta noche. – We're going to go out tonight.
Modal verbs:
• poder + inf. – can/to be able: puedo hablar
• querer + inf. – to want: quiero comer
• deber + inf. – should/must: debes estudiar
• tener que + inf. – to have to: tengo que ir`,
      examples: `– Estoy estudiando español ahora mismo.
– Voy a visitar a mis abuelos el domingo.
– ¿Puedes ayudarme con esto?
– Debes beber más agua cada día.
– Tengo que trabajar mañana por la mañana.`,
      quiz: [
        { q: '"Estoy comiendo" means:', opts: ['I ate', 'I will eat', 'I am eating', 'I eat'], ans: 2 },
        { q: '"Voy a estudiar" means:', opts: ['I studied', 'I am studying', 'I want to study', 'I am going to study'], ans: 3 },
        { q: '"Deber" expresses:', opts: ['Ability', 'Desire', 'Obligation/should', 'Future'], ans: 2 },
        { q: 'How to form present progressive?', opts: ['Ser + infinitive', 'Estar + gerund', 'Ir + infinitive', 'Haber + participle'], ans: 1 },
        { q: '"Tengo que ir" means:', opts: ['I want to go', 'I can go', 'I have to go', 'I went'], ans: 2 },
        { q: 'Gerund of "comer" is:', opts: ['Comido', 'Comiendo', 'Comer', 'Come'], ans: 1 },
      ],
    },
  },

  // ── 16. Practice and Build Part 6 ─────────────────────────────
  {
    cat: { name: 'Practice and Build Part 6', emoji: '🔨', color: '#52b788' },
    note: {
      title: 'Práctica y Construcción – Part 6',
      rules: `Preterite tense (simple past) – completed actions:
-AR verbs: -é/-aste/-ó/-amos/-asteis/-aron (e.g., hablé, hablaste, habló…)
-ER/-IR verbs: -í/-iste/-ió/-imos/-isteis/-ieron (e.g., comí, comiste, comió…)
Common irregular preterites:
• ser/ir → fui, fuiste, fue, fuimos, fuisteis, fueron
• tener → tuve, tuviste, tuvo…
• hacer → hice, hiciste, hizo…
• estar → estuve, estuviste, estuvo…
• decir → dije, dijiste, dijo…
• venir → vine, viniste, vino…
Time markers for preterite: ayer (yesterday), anoche (last night), la semana pasada (last week), el año pasado (last year), hace dos días (2 days ago)`,
      examples: `– Ayer comí una pizza deliciosa.
– ¿Fuiste al cine el fin de semana?
– Tuve un examen muy difícil la semana pasada.
– Ella hizo la tarea por la noche.
– Vine a España hace tres años.`,
      quiz: [
        { q: 'Preterite of "hablar" (yo) is:', opts: ['Hablé', 'Hablaba', 'Hablo', 'Hablaré'], ans: 0 },
        { q: '"Fue" is the preterite of:', opts: ['Estar and hacer', 'Ser and ir', 'Tener and venir', 'Decir and ver'], ans: 1 },
        { q: '"Ayer" means:', opts: ['Tomorrow', 'Last week', 'Yesterday', 'Last year'], ans: 2 },
        { q: 'Preterite of "hacer" (yo) is:', opts: ['Hacé', 'Hice', 'Hací', 'Hizo'], ans: 1 },
        { q: '"Comí" is the preterite of "comer" for:', opts: ['Tú', 'Él', 'Nosotros', 'Yo'], ans: 3 },
        { q: '"Hace dos días" means:', opts: ['In two days', 'For two days', '2 days ago', 'Two days later'], ans: 2 },
      ],
    },
  },

  // ── 17. Practice and Build Part 7 ─────────────────────────────
  {
    cat: { name: 'Practice and Build Part 7', emoji: '🔨', color: '#1b4332' },
    note: {
      title: 'Práctica y Construcción – Part 7',
      rules: `Imperfect tense – ongoing/habitual past actions:
-AR: -aba/-abas/-aba/-ábamos/-abais/-aban (hablaba, hablabas…)
-ER/-IR: -ía/-ías/-ía/-íamos/-íais/-ían (comía, comías…)
Irregular imperfects (only 3!):
• ser: era, eras, era, éramos, erais, eran
• ir: iba, ibas, iba, íbamos, ibais, iban
• ver: veía, veías, veía, veíamos, veíais, veían
Contrast: Preterite vs Imperfect
• Preterite: specific completed event – Ayer comí pizza.
• Imperfect: habitual/description – De niño comía pizza todos los viernes.
Uses of imperfect: descriptions in the past, habitual past actions (used to), ongoing background action`,
      examples: `– De niño, vivía en una ciudad pequeña.
– Cuando era joven, iba al parque todos los días.
– Ella estudiaba mientras él veía la televisión.
– Siempre comíamos juntos los domingos.`,
      quiz: [
        { q: 'Imperfect of "hablar" (yo) is:', opts: ['Hablé', 'Hablaba', 'Hablo', 'Hablaré'], ans: 1 },
        { q: 'Imperfect of "ser" (yo) is:', opts: ['Fui', 'Soy', 'Era', 'Seré'], ans: 2 },
        { q: 'Which tense for habitual past actions?', opts: ['Preterite', 'Imperfect', 'Present', 'Future'], ans: 1 },
        { q: 'How many irregular verbs does the imperfect have?', opts: ['5', '10', '3', '7'], ans: 2 },
        { q: '"Iba" is imperfect of:', opts: ['Ir', 'Ser', 'Ver', 'Estar'], ans: 0 },
        { q: '"De niño comía pizza" describes:', opts: ['A one-time event', 'A habitual past action', 'A future plan', 'A command'], ans: 1 },
      ],
    },
  },

  // ── 18. Spanish for Beginners Quiz 1–17 ──────────────────────
  {
    cat: { name: 'Spanish for Beginners Quiz 1–17', emoji: '🧩', color: '#2d6a4f' },
    note: {
      title: 'Repaso – Quiz Topics 1 to 17',
      rules: `Review of all topics covered so far:
• Greetings & farewells (Hola, Buenos días, Hasta luego)
• Manners (Por favor, Gracias, Lo siento)
• Numbers 0–1,000,000
• Colors and adjective agreement
• Food vocabulary and meals
• Alphabet and pronunciation rules
• Animals (pets and wild)
• Exercise vocabulary
• -AR verb conjugation (present)
• -ER/-IR verb conjugation + irregular verbs
• Sentence structure, negation, questions
• Adjectives: agreement, placement
• Possessives and demonstratives
• Object pronouns (direct and indirect)
• Present progressive and near future (ir a)
• Preterite tense
• Imperfect tense`,
      examples: `– ¿A qué hora llegaste ayer? – Llegué a las ocho.
– Cuando era niño, tenía un perro negro que se llamaba Max.
– ¿Puedes decirme dónde está la farmacia, por favor?
– Voy a visitar a mis amigos esta noche.`,
      quiz: [
        { q: 'Which is the correct preterite of "ir" (yo)?', opts: ['Iba', 'Iré', 'Fui', 'Voy'], ans: 2 },
        { q: '"Me gustan las flores" – why "gustan"?', opts: ['Because "me" is plural', 'Because flowers (plural) are the subject', 'Random choice', 'Because it\'s past tense'], ans: 1 },
        { q: 'Imperfect vs preterite: habitual past uses:', opts: ['Preterite', 'Imperfect', 'Present', 'Future'], ans: 1 },
        { q: 'Possessive for "your" (informal, plural noun)?', opts: ['Mi', 'Tu', 'Sus', 'Tus'], ans: 3 },
        { q: 'What does "Hace dos días" mean?', opts: ['In 2 days', '2 days ago', 'For 2 days', 'Every 2 days'], ans: 1 },
        { q: '"Estábamos comiendo" is an example of:', opts: ['Present progressive', 'Imperfect progressive', 'Preterite', 'Near future'], ans: 1 },
      ],
    },
  },

  // ── 19. Dates ─────────────────────────────────────────────────
  {
    cat: { name: 'Dates', emoji: '📅', color: '#40916c' },
    note: {
      title: 'Las Fechas – Dates',
      rules: `Days of the week (lowercase in Spanish):
lunes, martes, miércoles, jueves, viernes, sábado, domingo
Months (lowercase):
enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre
Seasons: la primavera (spring), el verano (summer), el otoño (autumn), el invierno (winter)
Date format: day + de + month + de + year → el 5 de mayo de 2024
• ¿Cuál es la fecha de hoy? – What is today's date?
• Hoy es lunes, el tres de abril. – Today is Monday, April 3rd.
• ¿Qué día es hoy? – What day is today?
• el primero de enero (1st uses "primero", rest use cardinal numbers)`,
      examples: `– Hoy es martes, el quince de marzo de 2024.
– Mi cumpleaños es el veintidós de julio.
– Las clases empiezan el primer lunes de septiembre.
– Nos vemos el próximo viernes.`,
      quiz: [
        { q: 'What day comes after "martes"?', opts: ['Lunes', 'Jueves', 'Miércoles', 'Viernes'], ans: 2 },
        { q: '"Agosto" is which month?', opts: ['June', 'July', 'August', 'September'], ans: 2 },
        { q: 'How do you say "today is the 1st"?', opts: ['Hoy es el uno', 'Hoy es el primero', 'Hoy es el primer', 'Hoy es el uno de'], ans: 1 },
        { q: 'Date format in Spanish is:', opts: ['Month/Day/Year', 'Year/Month/Day', 'Day/Month/Year', 'Month/Year/Day'], ans: 2 },
        { q: '"La primavera" is:', opts: ['Winter', 'Summer', 'Autumn', 'Spring'], ans: 3 },
        { q: '"¿Cuál es la fecha de hoy?" asks:', opts: ["What's the weather?", "What's today's date?", 'What time is it?', "What's the holiday?"], ans: 1 },
      ],
    },
  },

  // ── 20. Telling Time ──────────────────────────────────────────
  {
    cat: { name: 'Telling Time', emoji: '🕐', color: '#52b788' },
    note: {
      title: 'La Hora – Telling Time',
      rules: `• ¿Qué hora es? – What time is it?
• Es la una. – It's 1 o'clock. (singular "es")
• Son las dos/tres/etc. – It's 2/3 o'clock. (plural "son")
• y cuarto – quarter past (y quince)
• y media – half past (y treinta)
• menos cuarto – quarter to (menos quince)
• de la mañana – a.m. / de la tarde – p.m. (afternoon) / de la noche – p.m. (evening)
• a mediodía – at noon / a medianoche – at midnight
• ¿A qué hora…? – At what time…?
• a las tres y media – at 3:30
Examples:
• 1:00 → Es la una.
• 3:15 → Son las tres y cuarto.
• 7:30 → Son las siete y media.
• 9:45 → Son las diez menos cuarto.`,
      examples: `– ¿Qué hora es? – Son las cuatro y media.
– La película empieza a las ocho de la noche.
– Me despierto a las seis y cuarto de la mañana.
– ¿A qué hora llega el tren? – A las dos menos diez.`,
      quiz: [
        { q: 'How do you say "It\'s 1:00"?', opts: ['Son las unas', 'Es la una', 'Son la una', 'Es las una'], ans: 1 },
        { q: '"Son las tres y media" means:', opts: ['3:15', '3:45', '3:30', '2:30'], ans: 2 },
        { q: '"Menos cuarto" means:', opts: ['Quarter past', 'Quarter to', 'Half past', 'Five to'], ans: 1 },
        { q: '"¿A qué hora?" asks:', opts: ['What time is it?', 'At what time?', 'How long?', 'When?'], ans: 1 },
        { q: 'How to say "It\'s 2 o\'clock"?', opts: ['Es las dos', 'Son la dos', 'Son las dos', 'Es dos'], ans: 2 },
        { q: '"De la mañana" indicates:', opts: ['Afternoon hours', 'Morning/a.m.', 'Evening', 'Midnight'], ans: 1 },
      ],
    },
  },

  // ── 21. Ser vs Estar (1) ──────────────────────────────────────
  {
    cat: { name: 'Ser vs Estar (1)', emoji: '⚖️', color: '#1b4332' },
    note: {
      title: 'Ser vs Estar – Part 1',
      rules: `Both mean "to be" but are used differently.
SER – conjugation: soy/eres/es/somos/sois/son
Use SER for:
• Identity & relationships: Soy estudiante. Es mi madre.
• Origin & nationality: Soy de Marruecos. Es francés.
• Professions: Es médico.
• Permanent characteristics: El hielo es frío. Ella es alta.
• Time, dates, days: Son las tres. Hoy es lunes. Es el 5 de mayo.
• Material: La mesa es de madera.
• Possession: El libro es de Ana.
• Passive voice (with past participle): La novela fue escrita por Cervantes.`,
      examples: `– Soy de Casablanca. (origin)
– Mi padre es abogado. (profession)
– El cielo es azul. (permanent characteristic)
– Son las cinco de la tarde. (time)
– Esta silla es de plástico. (material)`,
      quiz: [
        { q: 'Use SER or ESTAR for professions?', opts: ['Estar', 'Ser', 'Both', 'Neither'], ans: 1 },
        { q: '"Soy de México" uses SER because it expresses:', opts: ['Location', 'Feeling', 'Origin', 'Temporary state'], ans: 2 },
        { q: '"Son las tres" – why SER?', opts: ['Location', 'Time/clock', 'Emotion', 'Health'], ans: 1 },
        { q: 'Conjugation of SER for "nosotros"?', opts: ['Son', 'Sois', 'Somos', 'Eres'], ans: 2 },
        { q: '"El libro es de Ana" expresses:', opts: ['Location', 'Possession', 'Material', 'Feeling'], ans: 1 },
        { q: '"Es médico" uses SER for:', opts: ['Temporary job', 'Profession/identity', 'Current activity', 'Mood'], ans: 1 },
      ],
    },
  },

  // ── 22. Ser vs Estar (2) ──────────────────────────────────────
  {
    cat: { name: 'Ser vs Estar (2)', emoji: '⚖️', color: '#2d6a4f' },
    note: {
      title: 'Ser vs Estar – Part 2',
      rules: `ESTAR – conjugation: estoy/estás/está/estamos/estáis/están
Use ESTAR for:
• Location: El banco está en la calle Mayor.
• Temporary states / conditions: Estoy cansado. Está enfermo.
• Emotions & feelings: Estoy feliz. Está triste.
• Progressive tenses: Estás hablando.
• Results of actions: La ventana está abierta. (result of opening)
Meaning changes with SER vs ESTAR:
• ser aburrido = to be boring (personality) / estar aburrido = to be bored (feeling)
• ser listo = to be clever / estar listo = to be ready
• ser malo = to be bad/evil / estar malo = to be sick
• ser seguro = to be safe (place) / estar seguro = to be sure`,
      examples: `– El museo está cerca de aquí. (location)
– Estoy muy cansada después del trabajo. (temporary state)
– La puerta está cerrada. (result)
– ¿Estás listo? – Sí, estoy listo. (ready)
– Hoy está nublado. (weather condition)`,
      quiz: [
        { q: 'Use SER or ESTAR for location?', opts: ['Ser', 'Estar', 'Both', 'Neither'], ans: 1 },
        { q: '"Estoy enfermo" means:', opts: ['I am boring', 'I am smart', 'I am sick', 'I am ready'], ans: 2 },
        { q: '"Ser aburrido" means (personality):', opts: ['To be bored', 'To be boring', 'To be tired', 'To be ready'], ans: 1 },
        { q: 'ESTAR conjugation for "ellos"?', opts: ['Están', 'Estáis', 'Estamos', 'Está'], ans: 0 },
        { q: '"La ventana está abierta" — why ESTAR?', opts: ['Location', 'Nationality', 'Result of an action', 'Material'], ans: 2 },
        { q: '"Estar listo" means:', opts: ['To be clever', 'To be ready', 'To be safe', 'To be sick'], ans: 1 },
      ],
    },
  },

  // ── 23. Family ────────────────────────────────────────────────
  {
    cat: { name: 'Family', emoji: '👨‍👩‍👧‍👦', color: '#40916c' },
    note: {
      title: 'La Familia – Family',
      rules: `Immediate family:
• el padre / la madre – father/mother
• los padres – parents
• el hermano / la hermana – brother/sister
• el hijo / la hija – son/daughter
• los hijos – children
Extended family:
• el abuelo / la abuela – grandfather/grandmother
• el tío / la tía – uncle/aunt
• el primo / la prima – cousin
• el sobrino / la sobrina – nephew/niece
• el nieto / la nieta – grandson/granddaughter
Relationships:
• el esposo/marido / la esposa/mujer – husband/wife
• el novio / la novia – boyfriend/girlfriend
• el suegro / la suegra – father-in-law/mother-in-law
• el cuñado / la cuñada – brother/sister-in-law`,
      examples: `– Tengo dos hermanos y una hermana.
– Mis abuelos viven en el campo.
– Mi prima se llama Sofía y tiene veinte años.
– Los hijos de mi hermano son mis sobrinos.
– Me llevo muy bien con mi suegra.`,
      quiz: [
        { q: '"El abuelo" means:', opts: ['Uncle', 'Father', 'Grandfather', 'Brother'], ans: 2 },
        { q: '"Los hijos" means:', opts: ['Parents', 'Siblings', 'Children', 'Grandchildren'], ans: 2 },
        { q: '"La cuñada" means:', opts: ['Mother-in-law', 'Sister-in-law', 'Aunt', 'Niece'], ans: 1 },
        { q: '"El sobrino" means:', opts: ['Grandson', 'Nephew', 'Cousin', 'Son'], ans: 1 },
        { q: '"El novio" means:', opts: ['Husband', 'Father', 'Boyfriend', 'Brother'], ans: 2 },
        { q: '"Los padres" means:', opts: ['Children', 'Fathers', 'Parents', 'Grandparents'], ans: 2 },
      ],
    },
  },

  // ── 24. Emotions ──────────────────────────────────────────────
  {
    cat: { name: 'Emotions', emoji: '😊', color: '#52b788' },
    note: {
      title: 'Las Emociones – Emotions',
      rules: `Common emotions (use ESTAR for temporary feelings):
• feliz / contento/a – happy
• triste – sad
• enojado/a / enfadado/a – angry
• cansado/a – tired
• aburrido/a – bored
• asustado/a – scared
• sorprendido/a – surprised
• nervioso/a – nervous
• emocionado/a – excited
• preocupado/a – worried
• avergonzado/a – embarrassed
• orgulloso/a – proud
• celoso/a – jealous
• solo/a – lonely
Expressing emotions:
• Estoy muy feliz hoy. / Me siento triste.
• Tengo miedo. (I'm scared.) / Tengo vergüenza. (I'm embarrassed.)`,
      examples: `– Estoy muy emocionada con el viaje a España.
– ¿Por qué estás triste? – Porque me siento solo.
– Mi madre está preocupada por mis notas.
– Tengo miedo de los exámenes.
– Me siento orgulloso de mis logros.`,
      quiz: [
        { q: '"Feliz" means:', opts: ['Sad', 'Tired', 'Happy', 'Angry'], ans: 2 },
        { q: '"Estoy nervioso" uses ESTAR because:', opts: ['It\'s permanent', 'It\'s origin', 'It\'s a temporary feeling', 'It\'s profession'], ans: 2 },
        { q: '"Tengo miedo" means:', opts: ["I'm cold", "I'm hungry", "I'm scared", "I'm tired"], ans: 2 },
        { q: '"Avergonzado" means:', opts: ['Proud', 'Jealous', 'Surprised', 'Embarrassed'], ans: 3 },
        { q: '"Orgulloso" means:', opts: ['Lonely', 'Proud', 'Bored', 'Worried'], ans: 1 },
        { q: 'To say "I feel sad", use:', opts: ['Soy triste', 'Estoy triste / Me siento triste', 'Tengo triste', 'Hay triste'], ans: 1 },
      ],
    },
  },

  // ── 25. Body Parts ────────────────────────────────────────────
  {
    cat: { name: 'Body Parts', emoji: '🫀', color: '#1b4332' },
    note: {
      title: 'El Cuerpo – Body Parts',
      rules: `Head: la cabeza (head), el pelo/cabello (hair), la cara (face), los ojos (eyes), la nariz (nose), la boca (mouth), los dientes (teeth), las orejas (ears), el cuello (neck)
Torso: los hombros (shoulders), el pecho (chest), la espalda (back), el estómago (stomach), la cintura (waist)
Arms/Hands: el brazo (arm), el codo (elbow), la muñeca (wrist), la mano (hand), los dedos (fingers)
Legs/Feet: la pierna (leg), la rodilla (knee), el tobillo (ankle), el pie (foot), los dedos del pie (toes)
Health expressions:
• Me duele la cabeza. – My head hurts.
• Me duelen los pies. – My feet hurt.
• Tengo dolor de espalda. – I have back pain.`,
      examples: `– Me duele mucho la rodilla después de correr.
– Tienes los ojos muy bonitos.
– Me rompí el tobillo jugando al fútbol.
– ¿Dónde te duele? – Me duele el estómago.`,
      quiz: [
        { q: '"La rodilla" means:', opts: ['Shoulder', 'Elbow', 'Knee', 'Ankle'], ans: 2 },
        { q: 'How do you say "My head hurts"?', opts: ['Tengo la cabeza', 'Me duele la cabeza', 'La cabeza es mala', 'Tengo dolor de ojos'], ans: 1 },
        { q: '"Los hombros" means:', opts: ['Hands', 'Shoulders', 'Arms', 'Hips'], ans: 1 },
        { q: '"El tobillo" means:', opts: ['Wrist', 'Ankle', 'Elbow', 'Knee'], ans: 1 },
        { q: '"Me duelen los pies" — why "duelen"?', opts: ['Because it\'s past tense', 'Because feet (plural) are the subject', 'Random', 'Because yo is subject'], ans: 1 },
        { q: '"La muñeca" means:', opts: ['Hand', 'Elbow', 'Wrist', 'Finger'], ans: 2 },
      ],
    },
  },

  // ── 26. Physical Descriptions ─────────────────────────────────
  {
    cat: { name: 'Physical Descriptions', emoji: '🪞', color: '#2d6a4f' },
    note: {
      title: 'Descripción Física – Physical Descriptions',
      rules: `Height: alto/a (tall), bajo/a (short), de estatura mediana (average height)
Build: delgado/a (thin), gordito/a/gordo/a (chubby/fat), musculoso/a (muscular), en forma (fit)
Hair: el pelo (hair) — largo (long), corto (short), liso (straight), rizado/ondulado (curly/wavy), rubio (blonde), castaño (brown), negro (black), pelirrojo (red), canoso (gray)
Eyes: los ojos — azules (blue), verdes (green), marrones/café (brown), negros (dark)
Other: joven (young), mayor/viejo (old), guapo/a (handsome/pretty), feo/a (ugly)
Use SER for physical descriptions: Es alta y delgada. Tiene el pelo rizado.
• "Tener" is used for specific features: Tiene los ojos verdes.`,
      examples: `– Mi hermano es alto, moreno y tiene el pelo corto.
– Ella es rubia, delgada y tiene los ojos azules.
– Mi abuelo es mayor, tiene el pelo canoso y usa gafas.
– ¿Cómo es tu amigo? – Es de estatura mediana y muy guapo.`,
      quiz: [
        { q: '"Alto" means:', opts: ['Short', 'Fat', 'Tall', 'Young'], ans: 2 },
        { q: 'How do you say "She has blue eyes"?', opts: ['Es los ojos azules', 'Tiene los ojos azules', 'Son sus ojos azules', 'Sus ojos son azules tiene'], ans: 1 },
        { q: '"Rizado" means (hair):', opts: ['Straight', 'Short', 'Curly', 'Blonde'], ans: 2 },
        { q: '"Canoso" means:', opts: ['Red hair', 'Bald', 'Gray-haired', 'Dark-haired'], ans: 2 },
        { q: 'For physical descriptions you mainly use:', opts: ['Tener only', 'Estar', 'Ser (+ tener for specific features)', 'Haber'], ans: 2 },
        { q: '"Delgado" means:', opts: ['Muscular', 'Short', 'Thin', 'Ugly'], ans: 2 },
      ],
    },
  },

  // ── 27. Personality ───────────────────────────────────────────
  {
    cat: { name: 'Personality', emoji: '🧠', color: '#40916c' },
    note: {
      title: 'La Personalidad – Personality Traits',
      rules: `Positive traits: simpático/a (nice/friendly), amable (kind), generoso/a (generous), honesto/a (honest), trabajador/a (hardworking), inteligente (intelligent), divertido/a (fun), creativo/a (creative), valiente (brave), paciente (patient)
Negative traits: antipático/a (unfriendly), egoísta (selfish), perezoso/a (lazy), mentiroso/a (liar), impaciente (impatient), terco/a (stubborn), envidioso/a (envious), maleducado/a (rude)
Neutral: tímido/a (shy), serio/a (serious), callado/a (quiet), sociable (sociable), sensible (sensitive), curioso/a (curious)
Use SER for personality (permanent traits):
• Mi amigo es muy simpático y generoso.
• Ella es inteligente pero un poco tímida.`,
      examples: `– Mi mejor amigo es muy divertido y generoso.
– No me gusta trabajar con personas perezosas.
– Eres una persona muy valiente y honesta.
– Mi jefe es serio pero muy justo.`,
      quiz: [
        { q: '"Trabajador" means:', opts: ['Lazy', 'Hardworking', 'Kind', 'Brave'], ans: 1 },
        { q: '"Perezoso" means:', opts: ['Patient', 'Curious', 'Lazy', 'Rude'], ans: 2 },
        { q: 'For personality traits, you use:', opts: ['Estar', 'Ser', 'Tener', 'Haber'], ans: 1 },
        { q: '"Simpático" means:', opts: ['Selfish', 'Nice/Friendly', 'Serious', 'Shy'], ans: 1 },
        { q: '"Valiente" means:', opts: ['Smart', 'Funny', 'Brave', 'Creative'], ans: 2 },
        { q: '"Tímido" means:', opts: ['Loud', 'Shy', 'Rude', 'Generous'], ans: 1 },
      ],
    },
  },

  // ── 28. Practice and Build (extra) ───────────────────────────
  {
    cat: { name: 'Practice and Build (Advanced)', emoji: '🔨', color: '#52b788' },
    note: {
      title: 'Práctica Avanzada – Mixed Practice',
      rules: `Reflexive verbs (actions done to oneself):
• levantarse (to get up), acostarse (to go to bed), despertarse (to wake up), ducharse (to shower), vestirse (to get dressed), llamarse (to be named), sentirse (to feel)
• Reflexive pronouns: me/te/se/nos/os/se placed before verb
• Stem-changing reflexives: acostarse (o→ue): me acuesto, te acuestas…
Daily routine vocabulary:
• madrugar – to get up early
• desayunar – to have breakfast
• almorzar – to have lunch
• cenar – to have dinner
• acostarse tarde – to go to bed late
Connectors: primero (first), luego/después (then/after), finalmente (finally), antes de + inf., después de + inf.`,
      examples: `– Me despierto a las siete y me ducho enseguida.
– Primero desayuno, luego voy al trabajo.
– ¿A qué hora te acuestas normalmente?
– Después de cenar, me siento en el sofá y veo la tele.`,
      quiz: [
        { q: '"Levantarse" means:', opts: ['To shower', 'To get dressed', 'To get up', 'To go to bed'], ans: 2 },
        { q: 'Reflexive pronoun for "yo"?', opts: ['Se', 'Nos', 'Te', 'Me'], ans: 3 },
        { q: '"Me acuesto" is from which verb?', opts: ['Levantarse', 'Despertarse', 'Acostarse', 'Ducharse'], ans: 2 },
        { q: '"Después de" + what?', opts: ['Conjugated verb', 'Infinitive', 'Gerund', 'Past participle'], ans: 1 },
        { q: '"Primero" means:', opts: ['Then', 'Finally', 'First', 'Before'], ans: 2 },
        { q: '"Me llamo" is reflexive for:', opts: ['I call him', 'I am named / my name is', 'I call myself repeatedly', 'You call me'], ans: 1 },
      ],
    },
  },

  // ── 29. Directions ────────────────────────────────────────────
  {
    cat: { name: 'Directions', emoji: '🗺️', color: '#1b4332' },
    note: {
      title: 'Las Direcciones – Giving & Getting Directions',
      rules: `Direction vocab:
• a la derecha – to the right
• a la izquierda – to the left
• recto / todo recto / derecho – straight ahead
• girar / doblar – to turn
• cruzar – to cross
• la calle – street • la avenida – avenue • la esquina – corner • el semáforo – traffic light • el cruce – intersection
• cerca de – near • lejos de – far from
• al final de – at the end of • frente a – across from
Useful phrases:
• ¿Cómo llego a…? – How do I get to…?
• ¿Dónde está…? – Where is…?
• Está a dos cuadras. – It's two blocks away.
• Tome/Toma la primera a la derecha. – Take the first right.`,
      examples: `– Perdone, ¿cómo llego al museo?
– Gire a la izquierda en el semáforo y siga todo recto.
– El hotel está frente al parque, a dos cuadras de aquí.
– Doble a la derecha al final de esta calle.`,
      quiz: [
        { q: '"A la izquierda" means:', opts: ['Straight ahead', 'To the right', 'To the left', 'Behind'], ans: 2 },
        { q: '"Todo recto" means:', opts: ['Turn right', 'Straight ahead', 'To the left', 'Go back'], ans: 1 },
        { q: '"El semáforo" means:', opts: ['Crossroad', 'Traffic light', 'Corner', 'Avenue'], ans: 1 },
        { q: 'How do you ask "Where is the bank?"', opts: ['¿Cómo está el banco?', '¿Dónde está el banco?', '¿Hay el banco?', '¿Cómo llego banco?'], ans: 1 },
        { q: '"Frente a" means:', opts: ['Next to', 'Behind', 'Across from', 'Far from'], ans: 2 },
        { q: '"Doblar" in directions means:', opts: ['To stop', 'To cross', 'To go straight', 'To turn'], ans: 3 },
      ],
    },
  },

  // ── 30. Supermarket ───────────────────────────────────────────
  {
    cat: { name: 'Supermarket', emoji: '🛒', color: '#2d6a4f' },
    note: {
      title: 'El Supermercado – At the Supermarket',
      rules: `Sections: la panadería (bakery), la carnicería (meat section), la pescadería (fish counter), la frutería (produce), la lácteos (dairy), los congelados (frozen foods), la caja (checkout)
Containers/quantities:
• una botella de – a bottle of
• un litro de – a liter of
• un kilo de – a kilo of
• una lata de – a can of
• una bolsa de – a bag of
• un paquete de – a package of
Shopping phrases:
• ¿Cuánto cuesta? / ¿Cuánto vale? – How much does it cost?
• ¿Tiene…? – Do you have…?
• Quisiera… / Me da… – I would like…
• ¿Hay oferta en…? – Is there a sale on…?
• La cuenta, por favor – The bill/receipt, please`,
      examples: `– Quisiera un kilo de manzanas y dos botellas de agua.
– ¿Cuánto cuesta esta lata de atún?
– ¿Tiene pan integral? – Sí, en la panadería al fondo.
– ¿Hay oferta en la leche esta semana?`,
      quiz: [
        { q: '"La carnicería" is the section for:', opts: ['Fish', 'Bread', 'Meat', 'Dairy'], ans: 2 },
        { q: 'How to ask "How much does it cost?"', opts: ['¿Qué es esto?', '¿Cuánto cuesta?', '¿Dónde está?', '¿Tiene esto?'], ans: 1 },
        { q: '"Un kilo de" means:', opts: ['A bottle of', 'A bag of', 'A kilo of', 'A liter of'], ans: 2 },
        { q: '"Quisiera" is a polite way to say:', opts: ['I have', 'I need to', 'I would like', 'I must'], ans: 2 },
        { q: '"La caja" at the supermarket is:', opts: ['The bakery', 'The checkout', 'The freezer', 'The cart'], ans: 1 },
        { q: '"Una lata de" means:', opts: ['A package of', 'A bag of', 'A bottle of', 'A can of'], ans: 3 },
      ],
    },
  },

  // ── 31. Spanish for Beginners Quiz 18–29 ─────────────────────
  {
    cat: { name: 'Spanish for Beginners Quiz 18–29', emoji: '🧩', color: '#40916c' },
    note: {
      title: 'Repaso – Quiz Topics 18 to 29',
      rules: `Review of topics 18–29:
• Dates: days, months, seasons, date format
• Telling time: es la una / son las…, y cuarto, y media, menos cuarto
• Ser vs Estar: uses, conjugations, and meaning changes
• Family vocabulary
• Emotions (using ESTAR and sentirse/tener)
• Body parts and health expressions (me duele/n)
• Physical descriptions (ser + adjectives, tener for features)
• Personality traits (ser for permanent)
• Reflexive verbs and daily routines
• Directions vocabulary and phrases
• Supermarket vocabulary and shopping phrases`,
      examples: `– Son las dos y cuarto de la tarde.
– Mi hermana es alta y tiene el pelo rizado.
– Me duele la rodilla desde ayer.
– Gire a la izquierda en el semáforo y siga recto.
– Quisiera un litro de leche, por favor.`,
      quiz: [
        { q: '"Son las ocho menos cuarto" means:', opts: ['8:15', '7:45', '8:00', '7:15'], ans: 1 },
        { q: '"Me duelen los ojos" – why "duelen"?', opts: ['Eyes (plural) are subject', 'It\'s past tense', 'Yo is plural', 'Random agreement'], ans: 0 },
        { q: '"Estar listo" means:', opts: ['To be clever', 'To be ready', 'To be healthy', 'To be good'], ans: 1 },
        { q: '"La pescadería" is the section for:', opts: ['Bread', 'Meat', 'Fish', 'Dairy'], ans: 2 },
        { q: 'Reflexive pronoun for "nosotros"?', opts: ['Se', 'Me', 'Nos', 'Os'], ans: 2 },
        { q: '"Todo recto" means:', opts: ['Turn right', 'To the left', 'Straight ahead', 'At the corner'], ans: 2 },
      ],
    },
  },

  // ── 32. The House ─────────────────────────────────────────────
  {
    cat: { name: 'The House', emoji: '🏠', color: '#52b788' },
    note: {
      title: 'La Casa – The House',
      rules: `Rooms: el salón/la sala (living room), el comedor (dining room), la cocina (kitchen), el dormitorio/la habitación (bedroom), el baño (bathroom), el estudio (study), el pasillo (hallway), el garaje (garage), el jardín (garden), la terraza (terrace)
Furniture & items:
• el sofá (sofa), la mesa (table), la silla (chair), la cama (bed), el armario (wardrobe), la estantería (bookshelf), la lámpara (lamp), las cortinas (curtains), la alfombra (rug/carpet)
Verbs for the house:
• vivir en – to live in
• mudarse – to move (house)
• limpiar – to clean
• ordenar – to tidy up
• alquilar – to rent
• comprar – to buy`,
      examples: `– Vivo en un piso de tres habitaciones.
– El salón es grande y tiene mucha luz.
– Necesito limpiar la cocina y ordenar mi habitación.
– Nos mudamos a una casa nueva el próximo mes.`,
      quiz: [
        { q: '"El comedor" means:', opts: ['Kitchen', 'Bathroom', 'Dining room', 'Bedroom'], ans: 2 },
        { q: '"El armario" is:', opts: ['Sofa', 'Wardrobe/closet', 'Shelf', 'Lamp'], ans: 1 },
        { q: '"Mudarse" means:', opts: ['To clean', 'To rent', 'To move house', 'To buy'], ans: 2 },
        { q: '"La estantería" is:', opts: ['Curtains', 'Rug', 'Bookshelf', 'Chair'], ans: 2 },
        { q: '"Alquilar" means:', opts: ['To sell', 'To rent', 'To clean', 'To build'], ans: 1 },
        { q: '"El pasillo" means:', opts: ['Garden', 'Terrace', 'Hallway', 'Garage'], ans: 2 },
      ],
    },
  },

  // ── 33. The Bathroom ──────────────────────────────────────────
  {
    cat: { name: 'The Bathroom', emoji: '🚿', color: '#1b4332' },
    note: {
      title: 'El Baño – The Bathroom',
      rules: `Items in the bathroom:
• la ducha – shower
• la bañera – bathtub
• el lavabo/lavamanos – sink
• el espejo – mirror
• el inodoro/váter – toilet
• la toalla – towel
• el jabón – soap
• el champú – shampoo
• el acondicionador – conditioner
• la pasta de dientes – toothpaste
• el cepillo de dientes – toothbrush
• la maquinilla de afeitar – razor
• el papel higiénico – toilet paper
• la crema hidratante – moisturizer
Bathroom routines:
• ducharse (to shower), bañarse (to take a bath), lavarse los dientes (to brush teeth), afeitarse (to shave), maquillarse (to put on makeup)`,
      examples: `– Me ducho cada mañana con agua caliente.
– ¿Dónde está el papel higiénico?
– Necesito comprar champú y pasta de dientes.
– Me lavo los dientes tres veces al día.`,
      quiz: [
        { q: '"La bañera" means:', opts: ['Shower', 'Sink', 'Bathtub', 'Mirror'], ans: 2 },
        { q: '"El champú" is:', opts: ['Soap', 'Shampoo', 'Conditioner', 'Toothpaste'], ans: 1 },
        { q: '"Lavarse los dientes" means:', opts: ['To wash your face', 'To brush your teeth', 'To shave', 'To shower'], ans: 1 },
        { q: '"El espejo" means:', opts: ['Towel', 'Mirror', 'Razor', 'Toilet'], ans: 1 },
        { q: '"La pasta de dientes" is:', opts: ['Toothbrush', 'Shampoo', 'Toothpaste', 'Soap'], ans: 2 },
        { q: '"Afeitarse" means:', opts: ['To put on makeup', 'To shower', 'To shave', 'To brush teeth'], ans: 2 },
      ],
    },
  },

  // ── 34. The Kitchen ───────────────────────────────────────────
  {
    cat: { name: 'The Kitchen', emoji: '🍳', color: '#2d6a4f' },
    note: {
      title: 'La Cocina – The Kitchen',
      rules: `Appliances: el frigorífico/nevera (fridge), el congelador (freezer), el horno (oven), el microondas (microwave), la lavadora (washing machine), el lavavajillas (dishwasher), la batidora (blender), la cafetera (coffee maker), el tostador (toaster)
Utensils & items:
• el cuchillo (knife), el tenedor (fork), la cuchara (spoon), el plato (plate), el vaso (glass), la taza (cup/mug), la olla (pot), la sartén (frying pan), el cuenco (bowl)
Cooking verbs:
• cocinar (to cook), freír (to fry), hervir (to boil), hornear (to bake), mezclar (to mix), cortar (to cut), picar (to chop), añadir (to add)`,
      examples: `– Voy a cocinar una paella esta noche.
– Pon la leche en el frigorífico.
– Corta las verduras en trozos pequeños.
– El agua hierve a cien grados.
– ¿Tienes una sartén grande? Necesito freír el pollo.`,
      quiz: [
        { q: '"La nevera" means:', opts: ['Oven', 'Freezer', 'Fridge', 'Dishwasher'], ans: 2 },
        { q: '"Hervir" means:', opts: ['To fry', 'To bake', 'To boil', 'To chop'], ans: 2 },
        { q: '"La sartén" is:', opts: ['Pot', 'Bowl', 'Frying pan', 'Plate'], ans: 2 },
        { q: '"Picar" in cooking means:', opts: ['To mix', 'To boil', 'To chop', 'To bake'], ans: 2 },
        { q: '"El tenedor" is:', opts: ['Knife', 'Spoon', 'Fork', 'Cup'], ans: 2 },
        { q: '"Hornear" means:', opts: ['To fry', 'To bake', 'To boil', 'To blend'], ans: 1 },
      ],
    },
  },

  // ── 35. Practice and Build (House) ───────────────────────────
  {
    cat: { name: 'Practice and Build (House)', emoji: '🔨', color: '#40916c' },
    note: {
      title: 'Práctica – Casa y Hogar',
      rules: `Hay (there is/there are): hay + noun
• Hay una cama en mi habitación.
• ¿Hay un supermercado cerca? – Is there a supermarket nearby?
Tener vs Hay:
• Hay = existence (neutral) → Hay un baño.
• Tener = possession → El piso tiene dos baños.
Describing your home:
• Mi piso tiene … habitaciones.
• Está en el tercer piso.
• Tiene mucha luz / Es muy luminoso.
• El barrio es tranquilo/ruidoso.
Prepositions review in context:
• The sofa is in front of the TV → El sofá está delante de la televisión.
• The keys are on the table → Las llaves están encima de la mesa.`,
      examples: `– Mi apartamento tiene dos habitaciones y un salón grande.
– ¿Hay ascensor en tu edificio? – No, pero estamos en el primer piso.
– Las llaves están encima del frigorífico.
– El piso es luminoso y está en un barrio tranquilo.`,
      quiz: [
        { q: '"Hay una cama" means:', opts: ['I have a bed', 'There is a bed', 'The bed is here', 'A bed exists for me'], ans: 1 },
        { q: 'Difference: "Hay" vs "Tener"?', opts: ['Hay = possession, Tener = existence', 'Hay = existence (neutral), Tener = possession', 'Same meaning', 'Hay is past, Tener is present'], ans: 1 },
        { q: '"El barrio es ruidoso" means:', opts: ['The apartment is big', 'The neighborhood is noisy', 'The city is beautiful', 'The street is far'], ans: 1 },
        { q: '"Está en el tercer piso" means:', opts: ["It's on the ground floor", "It's on the third floor", "It's in the third room", "It's the third building"], ans: 1 },
        { q: '"Encima de" means:', opts: ['Under', 'Next to', 'On top of', 'In front of'], ans: 2 },
        { q: '"El piso tiene mucha luz" means:', opts: ['The floor is slippery', 'The apartment has a lot of light', 'The room is large', 'The building is tall'], ans: 1 },
      ],
    },
  },

  // ── 36. How to use "it" ───────────────────────────────────────
  {
    cat: { name: 'How to use "it"', emoji: '💡', color: '#52b788' },
    note: {
      title: 'Cómo usar "it" en español',
      rules: `Spanish doesn't use a standalone "it" as subject — the verb ending implies it:
• "It is raining" → Llueve / Está lloviendo (no pronoun)
• "It is cold" → Hace frío / Está frío (weather/temp)
• "It is true" → Es verdad / Es cierto
As a direct object pronoun, "it" = lo (masc.) or la (fem.):
• "I see it (the book/libro)" → Lo veo.
• "I see it (the door/puerta)" → La veo.
Impersonal expressions (no subject needed):
• Es importante… / Es necesario… / Es difícil…
• Hay que + inf. – One must / It is necessary to
• Se puede + inf. – One can / It is possible to
• Se dice – It is said / People say`,
      examples: `– Llueve mucho en octubre. (It rains a lot in October.)
– Lo encontré debajo de la cama. (I found it under the bed.)
– Es importante estudiar todos los días.
– Hay que llegar a tiempo.
– Se dice que este restaurante es muy bueno.`,
      quiz: [
        { q: 'How do you say "It is raining" in Spanish?', opts: ['Ello llueve', 'Es lloviendo', 'Llueve / Está lloviendo', 'Lo llueve'], ans: 2 },
        { q: '"Lo veo" – what does "lo" refer to?', opts: ['A feminine noun', 'A masculine noun/object', 'A person', 'A place'], ans: 1 },
        { q: '"Hay que estudiar" means:', opts: ['I want to study', 'It is necessary to study', 'I am studying', 'Let\'s study'], ans: 1 },
        { q: 'Which pronoun replaces "la puerta" (door)?', opts: ['Lo', 'Le', 'La', 'Se'], ans: 2 },
        { q: '"Se dice" means:', opts: ['It is done', 'It is said / People say', 'One does', 'It is given'], ans: 1 },
        { q: '"Es importante" is an example of:', opts: ['Reflexive verb', 'Impersonal expression', 'Direct object', 'Indirect object'], ans: 1 },
      ],
    },
  },

  // ── 37. Translation Practice ──────────────────────────────────
  {
    cat: { name: 'Translation Practice', emoji: '🔄', color: '#1b4332' },
    note: {
      title: 'Práctica de Traducción',
      rules: `Key tips for translating English→Spanish:
• Don't translate word-for-word — look for equivalent expressions
• Articles are required more in Spanish (el/la before nouns)
• Adjectives agree in gender and number
• False friends to watch: embarazada (pregnant, NOT embarrassed), realizar (to accomplish, NOT to realize), librería (bookstore, NOT library = biblioteca)
• "To be" = ser or estar (choose correctly!)
• "To know": saber (facts/how) vs conocer (people/places)
• "To leave": dejar (leave something behind) vs salir (to go out/leave a place)
• "To ask": preguntar (to ask a question) vs pedir (to ask for/request)`,
      examples: `– I know her. → La conozco. (NOT sé)
– Do you know how to swim? → ¿Sabes nadar?
– She is embarrassed. → Está avergonzada. (NOT embarazada)
– Ask the waiter for the bill. → Pídele la cuenta al camarero.
– I left my keys at home. → Dejé mis llaves en casa.`,
      quiz: [
        { q: '"I know Madrid well." – which verb?', opts: ['Saber', 'Conocer', 'Either works', 'Ver'], ans: 1 },
        { q: '"Embarazada" means:', opts: ['Embarrassed', 'Pregnant', 'Angry', 'Tired'], ans: 1 },
        { q: '"To ask for something" uses:', opts: ['Preguntar', 'Saber', 'Pedir', 'Decir'], ans: 2 },
        { q: '"Librería" means:', opts: ['Library', 'Bookstore', 'Reading room', 'Archive'], ans: 1 },
        { q: '"Do you know how to cook?" uses:', opts: ['Conocer', 'Saber', 'Poder', 'Querer'], ans: 1 },
        { q: '"I left my bag at the café" → "Dejé mi bolsa" uses:', opts: ['Salir', 'Conocer', 'Dejar', 'Pedir'], ans: 2 },
      ],
    },
  },

  // ── 38. Clothes ───────────────────────────────────────────────
  {
    cat: { name: 'Clothes', emoji: '👕', color: '#2d6a4f' },
    note: {
      title: 'La Ropa – Clothes',
      rules: `Clothing items:
• la camiseta (t-shirt), la camisa (shirt), los pantalones (trousers), los vaqueros/jeans (jeans), el vestido (dress), la falda (skirt), el abrigo (coat), la chaqueta (jacket), el jersey/suéter (sweater), las zapatillas (sneakers), los zapatos (shoes), las botas (boots), el cinturón (belt), el sombrero (hat), los calcetines (socks), la ropa interior (underwear)
Verbs:
• llevar / ponerse / vestir(se) – to wear/put on
• quitarse – to take off
• probarse – to try on
Shopping: ¿Me lo puedo probar? – Can I try it on? ¿Qué talla usa? – What size do you wear? La talla S/M/L/XL
Colors + clothing: una camisa azul, unos vaqueros negros`,
      examples: `– Hoy llevo una camiseta blanca y vaqueros azules.
– Necesito comprar un abrigo porque hace frío.
– ¿Puedo probarme esta falda? – Sí, el probador está al fondo.
– Ese vestido te queda muy bien. (That dress suits you very well.)`,
      quiz: [
        { q: '"Los vaqueros" means:', opts: ['Boots', 'Jeans', 'Socks', 'Shorts'], ans: 1 },
        { q: '"Ponerse" means:', opts: ['To take off', 'To try on', 'To put on (clothing)', 'To wear all day'], ans: 2 },
        { q: '"¿Qué talla usa?" asks about:', opts: ['Color preference', 'Price', 'Clothing size', 'Style'], ans: 2 },
        { q: '"El abrigo" is:', opts: ['Jacket', 'Sweater', 'Coat', 'T-shirt'], ans: 2 },
        { q: '"Probarse" means:', opts: ['To wear', 'To buy', 'To try on', 'To sew'], ans: 2 },
        { q: '"Te queda bien" means:', opts: ['You look tired', 'It fits/suits you well', 'You\'re welcome', 'It\'s your style'], ans: 1 },
      ],
    },
  },

  // ── 39. Weather ───────────────────────────────────────────────
  {
    cat: { name: 'Weather', emoji: '⛅', color: '#40916c' },
    note: {
      title: 'El Tiempo – Weather',
      rules: `Weather expressions with HACER:
• Hace calor – It's hot
• Hace frío – It's cold
• Hace sol – It's sunny
• Hace viento – It's windy
• Hace buen/mal tiempo – The weather is good/bad
Weather with ESTAR:
• Está nublado – It's cloudy
• Está despejado – It's clear
Weather with HABER:
• Hay niebla – There's fog
• Hay tormenta – There's a storm
• Hay nieve / Nieva – It's snowing
• Llueve / Está lloviendo – It's raining
Temperatures: ¿Cuántos grados hace? – How many degrees is it?
• Hace 30 grados. / Estamos a 15 grados bajo cero.`,
      examples: `– Hoy hace mucho calor, más de 35 grados.
– ¿Qué tiempo hace en Madrid en invierno? – Hace frío y a veces nieva.
– Está nublado pero no creo que llueva.
– Hay mucha niebla esta mañana, conduce con cuidado.`,
      quiz: [
        { q: '"Hace frío" means:', opts: ["It's windy", "It's hot", "It's cold", "It's raining"], ans: 2 },
        { q: '"Está nublado" means:', opts: ["It's sunny", "It's cloudy", "It's foggy", "It's stormy"], ans: 1 },
        { q: '"Hay niebla" means:', opts: ["There's snow", "There's a storm", "There's fog", "There's wind"], ans: 2 },
        { q: 'How do you say "It is raining"?', opts: ['Hace lluvia', 'Hay lluvia', 'Llueve / Está lloviendo', 'Está llovida'], ans: 2 },
        { q: '"Hace buen tiempo" means:', opts: ['Hot weather', 'Good weather', 'Bad weather', 'Cold weather'], ans: 1 },
        { q: '"¿Cuántos grados hace?" asks about:', opts: ['Wind speed', 'Rainfall', 'Temperature', 'Humidity'], ans: 2 },
      ],
    },
  },

  // ── 40. Sports ────────────────────────────────────────────────
  {
    cat: { name: 'Sports', emoji: '⚽', color: '#52b788' },
    note: {
      title: 'Los Deportes – Sports',
      rules: `Sports vocabulary:
• el fútbol (soccer/football), el baloncesto (basketball), el tenis (tennis), la natación (swimming), el ciclismo (cycling), el atletismo (athletics), el béisbol (baseball), el voleibol (volleyball), la gimnasia (gymnastics), el boxeo (boxing), el golf (golf), el esquí (skiing)
Verbs:
• jugar a + sport: juego al fútbol, juegas al tenis
• practicar + sport: practico natación
• ganar (to win), perder (to lose), empatar (to draw/tie), marcar un gol (to score a goal), entrenar (to train)
Roles: el jugador/la jugadora (player), el entrenador/a (coach), el árbitro (referee), el equipo (team), el partido (match/game)`,
      examples: `– Juego al fútbol los sábados con mis amigos.
– Mi deporte favorito es la natación porque es muy completo.
– El equipo de España ganó el partido por tres a uno.
– Practico tenis dos veces a la semana.`,
      quiz: [
        { q: '"El baloncesto" means:', opts: ['Soccer', 'Baseball', 'Basketball', 'Volleyball'], ans: 2 },
        { q: 'Correct: "I play tennis" in Spanish?', opts: ['Practico al tenis', 'Juego tenis', 'Juego al tenis', 'Juego en tenis'], ans: 2 },
        { q: '"Empatar" means:', opts: ['To win', 'To lose', 'To score', 'To draw/tie'], ans: 3 },
        { q: '"El entrenador" means:', opts: ['Referee', 'Player', 'Coach', 'Team'], ans: 2 },
        { q: '"El partido" means:', opts: ['Team', 'Stadium', 'Match/Game', 'Trophy'], ans: 2 },
        { q: '"Marcar un gol" means:', opts: ['To miss a shot', 'To train hard', 'To score a goal', 'To play defense'], ans: 2 },
      ],
    },
  },

  // ── 41. Practice and Build (Sports & Leisure) ────────────────
  {
    cat: { name: 'Practice and Build (Sports & Leisure)', emoji: '🔨', color: '#1b4332' },
    note: {
      title: 'Práctica – Deportes y Tiempo Libre',
      rules: `Leisure activities:
• leer (to read), ver la televisión (to watch TV), escuchar música (to listen to music), salir con amigos (to go out with friends), ir al cine (to go to the movies), viajar (to travel), cocinar (to cook), pintar (to paint), tocar la guitarra (to play guitar)
Expressing frequency:
• siempre (always), casi siempre (almost always), normalmente/generalmente (usually), a veces (sometimes), de vez en cuando (from time to time), casi nunca (almost never), nunca (never)
Expressing preferences:
• Me encanta(n) – I love
• Me gusta(n) mucho – I really like
• Me gusta(n) – I like
• No me gusta(n) – I don't like
• No me gusta(n) nada / Odio – I hate`,
      examples: `– Normalmente veo la televisión después de cenar.
– Me encanta leer novelas históricas.
– Nunca voy al gimnasio los domingos.
– A veces voy al cine con mi hermana los viernes.
– Odio levantarme temprano pero me encanta el desayuno.`,
      quiz: [
        { q: '"Siempre" means:', opts: ['Never', 'Sometimes', 'Always', 'Usually'], ans: 2 },
        { q: '"Me encanta" expresses:', opts: ['I like a little', 'I don\'t like', 'I love', 'I prefer'], ans: 2 },
        { q: '"De vez en cuando" means:', opts: ['Always', 'From time to time', 'Never', 'Every day'], ans: 1 },
        { q: '"Tocar la guitarra" means:', opts: ['To listen to guitar', 'To play guitar', 'To buy a guitar', 'To break a guitar'], ans: 1 },
        { q: '"No me gusta nada" expresses:', opts: ['I somewhat like it', 'I am neutral', 'I hate / don\'t like it at all', 'I love it'], ans: 2 },
        { q: '"Casi nunca" means:', opts: ['Sometimes', 'Almost never', 'Always', 'Usually'], ans: 1 },
      ],
    },
  },

  // ── 42. Put it all together ───────────────────────────────────
  {
    cat: { name: 'Put it all together', emoji: '🧩', color: '#2d6a4f' },
    note: {
      title: 'Todo Junto – Put It All Together',
      rules: `Useful connectors for fluent speech:
• también (also/too), tampoco (neither/not either), pero (but), sino (but rather), aunque (although/even though), sin embargo (however), por eso (therefore/that's why), además (furthermore/also), es decir (that is/in other words), en cambio (on the other hand)
Discourse markers:
• primero…luego…finalmente
• por un lado…por otro lado (on one hand…on the other)
Expressing opinions:
• Creo que / Pienso que / Opino que – I think/believe that
• En mi opinión – In my opinion
• Estoy de acuerdo / No estoy de acuerdo – I agree / I disagree
• Tiene razón / No tiene razón – He/She is right / wrong`,
      examples: `– Me gusta el café pero no me gusta el té.
– Creo que el español es difícil aunque muy interesante.
– Estudié mucho; por eso saqué buena nota.
– En mi opinión, viajar es la mejor forma de aprender idiomas.
– Estoy de acuerdo contigo, aunque prefiero el verano.`,
      quiz: [
        { q: '"Por eso" means:', opts: ['However', 'Although', 'Therefore/that\'s why', 'Furthermore'], ans: 2 },
        { q: '"Aunque" means:', opts: ['But', 'Because', 'Although/even though', 'Therefore'], ans: 2 },
        { q: '"Estoy de acuerdo" means:', opts: ['I disagree', 'I agree', 'I understand', 'I am sure'], ans: 1 },
        { q: '"Sin embargo" means:', opts: ['Furthermore', 'Therefore', 'However', 'In other words'], ans: 2 },
        { q: '"Tiene razón" means:', opts: ['He/She is wrong', 'He/She is right', 'He/She agrees', 'He/She thinks'], ans: 1 },
        { q: '"Sino" is used when:', opts: ['Adding information', 'Contradicting after a negative', 'Explaining cause', 'Listing items'], ans: 1 },
      ],
    },
  },

  // ── 43. Spanish for Beginners Quiz 30–40 ─────────────────────
  {
    cat: { name: 'Spanish for Beginners Quiz 30–40', emoji: '🧩', color: '#40916c' },
    note: {
      title: 'Repaso Final – Quiz Topics 30 to 40',
      rules: `Review of topics 30–40:
• Supermarket vocabulary and shopping
• House rooms and furniture
• Bathroom items and routines
• Kitchen appliances, utensils, cooking verbs
• House practice (hay vs tener, prepositions)
• "It" in Spanish (lo/la, impersonal expressions)
• Translation pitfalls (falsos amigos, saber vs conocer, pedir vs preguntar)
• Clothing vocabulary and shopping phrases
• Weather expressions (hacer, estar, haber)
• Sports vocabulary (jugar a, practicar, ganar/perder)
• Leisure activities and frequency expressions
• Connectors and expressing opinions`,
      examples: `– ¿Sabe usted dónde está la biblioteca? – Sí, está al lado del ayuntamiento.
– Hace mucho frío hoy, ponte el abrigo.
– Jugamos al fútbol pero perdimos el partido.
– Me encanta cocinar, especialmente los domingos.`,
      quiz: [
        { q: '"Embarazada" in Spanish means:', opts: ['Embarrassed', 'Pregnant', 'Surprised', 'Sad'], ans: 1 },
        { q: 'Weather: "It\'s windy" is:', opts: ['Hay viento', 'Está viento', 'Hace viento', 'Es viento'], ans: 2 },
        { q: '"Jugar al tenis" – what is "al"?', opts: ['a + el (contracted)', 'A separate article', 'Preposition only', 'Part of "jugar"'], ans: 0 },
        { q: '"Hay que + infinitive" means:', opts: ['I want to', 'It is necessary to / one must', 'I am going to', 'I can'], ans: 1 },
        { q: '"Te queda bien" means:', opts: ['You\'re welcome', 'It suits you well', 'You look tired', 'That\'s for you'], ans: 1 },
        { q: '"Sin embargo" means:', opts: ['Therefore', 'Although', 'However', 'Also'], ans: 2 },
      ],
    },
  },

  // ── 44. Practicing in a Local Market Setting ─────────────────
  {
    cat: { name: 'Practicing Spanish in a Market', emoji: '🏪', color: '#52b788' },
    note: {
      title: 'En el Mercado – Real-World Market Practice',
      rules: `Complete conversation toolkit for a local market:
Greetings & getting started:
• Buenos días, ¿en qué le puedo ayudar? – Good morning, how can I help you?
• Estoy buscando… – I'm looking for…
• ¿Tiene…? – Do you have…?
Asking about products:
• ¿Cuánto cuesta / vale? – How much does it cost?
• ¿Está fresco/a? – Is it fresh?
• ¿De dónde es? – Where is it from?
• ¿Qué me recomienda? – What do you recommend?
Quantities & ordering:
• Deme un kilo de… / Póngame… – Give me a kilo of… / Put me some…
• ¿Me puede poner un poco más? – Can you give me a little more?
• Con eso está bien. – That's enough.
Paying:
• ¿Cuánto es todo? / ¿Cuánto le debo? – How much is everything / do I owe you?
• ¿Tiene cambio de 50 euros? – Do you have change for €50?
• Quédese con el cambio. – Keep the change.`,
      examples: `– Buenos días. Estoy buscando tomates frescos, ¿tiene?
– Sí, acaban de llegar esta mañana. ¿Cuántos quiere?
– Deme dos kilos, por favor. ¿Y cuánto vale el kilo de naranjas?
– A dos euros el kilo. ¿Le pongo un kilo?
– Sí, y póngame también medio kilo de queso manchego.
– ¿Algo más? – No, con eso está bien. ¿Cuánto es todo?
– Son ocho euros con cincuenta. – Aquí tiene diez. – Su cambio, un euro cincuenta.`,
      quiz: [
        { q: '"Estoy buscando" means:', opts: ['I found', 'I am looking for', 'I want to buy', 'I need help with'], ans: 1 },
        { q: '"¿Está fresco?" asks if something is:', opts: ['Expensive', 'On sale', 'Fresh', 'Local'], ans: 2 },
        { q: '"Con eso está bien" means:', opts: ['Give me more', 'That\'s too much', 'That\'s enough', 'What else?'], ans: 2 },
        { q: '"¿Cuánto le debo?" means:', opts: ['What do you recommend?', 'How much do I owe you?', 'Do you have change?', 'Is it fresh?'], ans: 1 },
        { q: '"Póngame un kilo" means:', opts: ['I have a kilo', 'Give me / put me a kilo', 'Weigh a kilo', 'One kilo costs'], ans: 1 },
        { q: '"Quédese con el cambio" means:', opts: ['Give me the change', 'Keep the change', 'I need change', 'No change needed'], ans: 1 },
      ],
    },
  },
]

async function main() {
  console.log(`Seeding ${data.length} Spanish categories…`)
  for (const { cat, note } of data) {
    const created = await db.noteCategory.create({ data: cat })
    await db.note.create({
      data: {
        categoryId: created.id,
        title: note.title,
        rules: note.rules,
        examples: note.examples,
        quiz: JSON.stringify(note.quiz),
      },
    })
    console.log(`  ✓ ${cat.name}`)
  }
  console.log('Done!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
