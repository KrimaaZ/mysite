'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Modal from '@/components/Modal'
import { useLang } from '@/lib/lang'

type Recipe = {
  id: number; title: string; description: string; ingredients: string
  instructions: string; prepTime: number; cookTime: number; servings: number; category: string
}

// ── Week schedule types ───────────────────────────────────────────────────
type SlotKey = 'breakfast' | 'snack' | 'lunch' | 'juice'
type ScheduleEntry = { id: string; name: string } | null
type WeekSchedule = { [day: string]: { [slot in SlotKey]: ScheduleEntry } }

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const SLOTS: { key: SlotKey; label: string; emoji: string; mealTypes: string[] }[] = [
  { key: 'breakfast', label: 'Breakfast', emoji: '🌅', mealTypes: ['breakfast'] },
  { key: 'snack',     label: 'Snack',     emoji: '🍎', mealTypes: ['snack'] },
  { key: 'lunch',     label: 'Lunch',     emoji: '🍽️', mealTypes: ['main'] },
  { key: 'juice',     label: 'Juice',     emoji: '🥤', mealTypes: ['smoothie'] },
]
const WEEK_KEY = 'week-schedule-v2'
function emptySchedule(): WeekSchedule {
  return Object.fromEntries(DAYS.map(d => [d, { breakfast: null, snack: null, lunch: null, juice: null }]))
}

type Meal = {
  id: number; type: string; name: string; protein: string; kcal: string
  time: string; ingredients: string; prep: string; tip: string
}

const MEALS: Meal[] = [
  // ── BREAKFAST (15) ──────────────────────────────────────────────────────────
  { id:1,  type:'breakfast', name:'Classic scrambled eggs on toast',       protein:'25g', kcal:'450 kcal', time:'8 min',  ingredients:'3 eggs + 2 slices whole grain toast + butter + salt + pepper + chives',                                    prep:'Whisk eggs. Melt butter on low heat, add eggs, stir gently until just set. Toast bread, pile eggs on top.',              tip:'Low heat is the secret — high heat makes them rubbery' },
  { id:2,  type:'breakfast', name:'Overnight oats with banana',            protein:'14g', kcal:'410 kcal', time:'5 min',  ingredients:'60g oats + 250ml milk + 1 banana + 1 tbsp honey + pinch cinnamon',                                         prep:'Mix oats and milk in a jar the night before. In the morning, top with sliced banana and honey.',                        tip:'Prep 3 jars Sunday night for a full week of ready breakfasts' },
  { id:3,  type:'breakfast', name:'Greek yogurt parfait',                  protein:'22g', kcal:'380 kcal', time:'3 min',  ingredients:'250g plain Greek yogurt + 40g granola + 1 banana + 1 tbsp honey + handful berries',                        prep:'Layer yogurt, granola, and fruit in a bowl or glass. Drizzle honey.',                                                   tip:'Use full-fat yogurt for better satiety and more protein' },
  { id:4,  type:'breakfast', name:'Banana peanut butter porridge',         protein:'18g', kcal:'480 kcal', time:'7 min',  ingredients:'60g oats + 300ml milk + 1 banana + 1 tbsp peanut butter + pinch cinnamon',                                 prep:'Cook oats in milk 3–4 min. Stir in peanut butter, top with sliced banana.',                                             tip:'Add a boiled egg on the side to push protein over 25g' },
  { id:5,  type:'breakfast', name:'3-egg veggie omelette',                 protein:'24g', kcal:'380 kcal', time:'10 min', ingredients:'3 eggs + 1 bell pepper (diced) + onion + handful spinach + olive oil + salt + herbs',                      prep:'Sauté veggies 2 min. Pour beaten eggs over, cook on medium until set, fold in half.',                                   tip:'Add feta or cottage cheese inside for extra protein and creaminess' },
  { id:6,  type:'breakfast', name:'Avocado toast with poached eggs',       protein:'22g', kcal:'490 kcal', time:'10 min', ingredients:'2 eggs + 1 avocado + 2 slices sourdough + lemon juice + chili flakes + salt',                             prep:'Toast bread. Mash avocado with lemon and salt. Poach eggs 3 min. Assemble.',                                            tip:'Swirl the water before dropping the egg for a neater poach' },
  { id:7,  type:'breakfast', name:'Banana protein pancakes',               protein:'20g', kcal:'460 kcal', time:'12 min', ingredients:'2 bananas + 3 eggs + 40g oats + pinch baking powder + pinch cinnamon',                                    prep:'Blend all ingredients. Cook small pancakes on medium heat 2 min per side.',                                             tip:'Only 3 ingredients if you skip baking powder — naturally gluten-free' },
  { id:8,  type:'breakfast', name:'Cottage cheese & fruit bowl',           protein:'24g', kcal:'320 kcal', time:'2 min',  ingredients:'250g cottage cheese + 1 banana + handful strawberries + 1 tbsp honey + pumpkin seeds',                    prep:'Spoon cottage cheese into a bowl, top with fruit, drizzle honey, sprinkle seeds.',                                      tip:'One of the highest-protein breakfasts per calorie on this list' },
  { id:9,  type:'breakfast', name:'Peanut butter honey toast',             protein:'14g', kcal:'420 kcal', time:'3 min',  ingredients:'2 slices whole grain bread + 2 tbsp peanut butter + 1 tbsp honey + 1 banana (sliced)',                    prep:'Toast bread, spread peanut butter, drizzle honey, top with banana slices.',                                             tip:'Add a glass of milk to bring total protein to 22g' },
  { id:10, type:'breakfast', name:'French toast with banana',              protein:'18g', kcal:'500 kcal', time:'8 min',  ingredients:'2 thick bread slices + 2 eggs + 100ml milk + 1 banana + cinnamon + butter',                               prep:'Whisk eggs and milk. Dip bread, fry in butter 2 min per side. Top with banana.',                                        tip:'Day-old bread absorbs the egg better without falling apart' },
  { id:11, type:'breakfast', name:'Yogurt granola crunch bowl',            protein:'20g', kcal:'450 kcal', time:'3 min',  ingredients:'200g plain yogurt + 50g granola + 5 dates (chopped) + 1 tbsp peanut butter + drizzle honey',              prep:'Layer yogurt and granola in a bowl, add dates and peanut butter, finish with honey.',                                   tip:'Dates + granola give a fast energy spike — ideal before morning training' },
  { id:12, type:'breakfast', name:'Egg & cheese breakfast wrap',           protein:'28g', kcal:'520 kcal', time:'8 min',  ingredients:'3 eggs + 1 flour tortilla + 30g grated cheese + handful spinach + salt + olive oil',                      prep:'Scramble eggs. Lay tortilla flat, add eggs, cheese, spinach. Roll tight.',                                              tip:'Wrap in foil and take it to go — stays warm 20 min' },
  { id:13, type:'breakfast', name:'Chia pudding with mango',               protein:'12g', kcal:'340 kcal', time:'5 min',  ingredients:'40g chia seeds + 300ml coconut milk + 1 mango (diced) + 1 tsp honey + pinch vanilla',                     prep:'Mix chia seeds and milk. Refrigerate overnight. Top with mango and honey in the morning.',                              tip:'The pudding keeps 4 days in the fridge — batch prep Sunday' },
  { id:14, type:'breakfast', name:'Sardine toast with lemon',              protein:'30g', kcal:'420 kcal', time:'5 min',  ingredients:'1 tin sardines + 2 slices sourdough + 1 tbsp olive oil + lemon + parsley + black pepper',                  prep:'Toast bread, flake sardines on top, drizzle oil and lemon, season well.',                                               tip:'Highest-protein breakfast in the rotation — great on training days' },
  { id:15, type:'breakfast', name:'Oatmeal & boiled egg combo',            protein:'22g', kcal:'470 kcal', time:'10 min', ingredients:'60g oats + 300ml milk + 2 boiled eggs + 1 banana + 1 tsp honey',                                          prep:'Cook oats in milk. Boil eggs 7 min, peel, serve alongside oatmeal with banana.',                                        tip:'The egg on the side doubles the protein versus plain oatmeal' },

  // ── MAIN MEAL (15) ──────────────────────────────────────────────────────────
  { id:16, type:'main', name:'Tuna & potato power bowl',           protein:'38g', kcal:'620 kcal', time:'10 min', ingredients:'2 boiled potatoes + 1 tin tuna + cherry tomatoes + olive oil + lemon',                                       prep:'Boil potatoes ahead. Drain tuna, mix everything, drizzle olive oil.',                                                    tip:'Add a hard-boiled egg for +6g protein' },
  { id:17, type:'main', name:'Egg & potato hash',                  protein:'32g', kcal:'580 kcal', time:'12 min', ingredients:'3 eggs + 2 potatoes (diced) + onion + olive oil + paprika + salt',                                           prep:'Pan-fry diced potatoes 8 min. Add eggs, scramble in. Season.',                                                           tip:'Add sardines for extra protein' },
  { id:18, type:'main', name:'Sardine & rice bowl',                protein:'40g', kcal:'650 kcal', time:'10 min', ingredients:'2 tins sardines + 200g cooked rice + tomatoes + lemon + olive oil + parsley',                               prep:'Cook rice. Flake sardines on top, add chopped tomatoes, dress with oil and lemon.',                                      tip:'Highest omega-3 in the rotation — great for joints during cardio' },
  { id:19, type:'main', name:'3-egg omelette with potatoes',       protein:'28g', kcal:'540 kcal', time:'12 min', ingredients:'3 eggs + 1 large potato (boiled & sliced) + cheese + olive oil + herbs',                                    prep:'Pan-fry potato slices 5 min. Pour beaten eggs over, add cheese, fold.',                                                  tip:'Add a tin of tuna inside for +25g protein' },
  { id:20, type:'main', name:'Tuna pasta with olive oil',          protein:'45g', kcal:'700 kcal', time:'12 min', ingredients:'200g pasta + 2 tins tuna + olive oil + garlic + cherry tomatoes + black pepper',                            prep:'Cook pasta. Toss with tuna, olive oil, garlic, tomatoes.',                                                               tip:'Highest protein single meal in the rotation' },
  { id:21, type:'main', name:'Egg fried rice with tuna',           protein:'42g', kcal:'680 kcal', time:'10 min', ingredients:'200g cooked rice + 2 eggs + 1 tin tuna + soy sauce + sesame oil + frozen peas',                            prep:'Fry rice in oil 2 min. Push to side, scramble eggs. Mix with tuna, peas, soy sauce.',                                   tip:'Use leftover cold rice — it fries better than fresh' },
  { id:22, type:'main', name:'Shakshuka (eggs in tomato)',         protein:'26g', kcal:'480 kcal', time:'15 min', ingredients:'4 eggs + 400g crushed tomatoes + 1 onion + garlic + cumin + paprika + olive oil',                          prep:'Fry onion and garlic. Add tomatoes and spices, simmer 5 min. Crack eggs in, cover until whites set.',                   tip:'Serve with bread to soak up the sauce — adds ~8g carbs' },
  { id:23, type:'main', name:'Lentil & egg power bowl',            protein:'34g', kcal:'590 kcal', time:'20 min', ingredients:'200g cooked lentils + 2 boiled eggs + spinach + olive oil + lemon + cumin + salt',                         prep:'Warm lentils in pan with oil and cumin. Plate with spinach, halved eggs, lemon dressing.',                               tip:'Lentils are the cheapest complete-protein source on this list' },
  { id:24, type:'main', name:'Chickpea & rice bowl',               protein:'28g', kcal:'620 kcal', time:'12 min', ingredients:'200g cooked rice + 1 tin chickpeas + tomatoes + garlic + olive oil + paprika + lemon',                    prep:'Sauté garlic and paprika 1 min. Add drained chickpeas and tomatoes, cook 5 min. Serve over rice.',                      tip:'Add an egg on top for +6g protein and extra richness' },
  { id:25, type:'main', name:'Tuna & avocado rice bowl',           protein:'42g', kcal:'660 kcal', time:'8 min',  ingredients:'200g cooked rice + 1 tin tuna + ½ avocado + cucumber + soy sauce + sesame seeds',                         prep:'Arrange rice in bowl. Top with tuna, sliced avocado, cucumber. Drizzle soy sauce.',                                     tip:'Avocado fat helps absorb the omega-3 from tuna' },
  { id:26, type:'main', name:'Potato & egg tortilla española',     protein:'30g', kcal:'550 kcal', time:'20 min', ingredients:'4 eggs + 2 potatoes (thinly sliced) + onion + olive oil + salt',                                          prep:'Cook potatoes and onion in oil 10 min. Add beaten eggs, cook low and slow 8 min, flip.',                                 tip:'Make a large one and eat it cold — keeps 2 days in the fridge' },
  { id:27, type:'main', name:'Bean & potato stew',                 protein:'24g', kcal:'560 kcal', time:'20 min', ingredients:'1 tin white beans + 2 potatoes + 1 tin tomatoes + garlic + olive oil + rosemary + salt',                  prep:'Fry garlic. Add diced potatoes, tomatoes, beans and rosemary. Simmer 15 min.',                                          tip:'Top with a poached egg to add 6g protein per serving' },
  { id:28, type:'main', name:'Sardine & lentil soup',              protein:'38g', kcal:'560 kcal', time:'20 min', ingredients:'2 tins sardines + 150g red lentils + 1 onion + garlic + tomatoes + cumin + olive oil',                    prep:'Fry onion and garlic. Add lentils, tomatoes, 600ml water, cumin. Simmer 15 min. Stir in sardines.',                     tip:'Red lentils dissolve into the broth — no need to pre-soak' },
  { id:29, type:'main', name:'Pasta with eggs & parmesan',         protein:'30g', kcal:'640 kcal', time:'12 min', ingredients:'200g pasta + 3 eggs + 40g parmesan + garlic + olive oil + black pepper + parsley',                        prep:'Cook pasta. Toss hot pasta with beaten eggs and parmesan off heat. Add garlic oil.',                                     tip:'Work fast — the residual pasta heat cooks the eggs without scrambling' },
  { id:30, type:'main', name:'Tuna stuffed sweet potato',          protein:'36g', kcal:'580 kcal', time:'15 min', ingredients:'1 large sweet potato + 2 tins tuna + Greek yogurt + lemon + chives + salt',                              prep:'Microwave sweet potato 8 min. Split open, mix tuna with yogurt and lemon, fill potato.',                                 tip:'Microwaving the potato instead of baking saves 50 min' },

  // ── SNACK (15) ──────────────────────────────────────────────────────────────
  { id:31, type:'snack', name:'Banana peanut butter stack',        protein:'12g', kcal:'380 kcal', time:'2 min',  ingredients:'1 large banana + 2 tbsp peanut butter + 3 rice cakes',                                                       prep:'Slice banana, spread peanut butter on rice cakes, top with banana.',                                                     tip:'Best 30–45 min before a workout' },
  { id:32, type:'snack', name:'Tuna & egg sandwich',               protein:'35g', kcal:'450 kcal', time:'5 min',  ingredients:'1 tin tuna + 1 hard-boiled egg + mustard + whole grain bread (2 slices)',                                    prep:'Mix tuna, sliced egg, mustard. Fill bread.',                                                                             tip:'Great pre-workout if eaten 1–2 hrs before' },
  { id:33, type:'snack', name:'Greek yogurt & date mix',           protein:'14g', kcal:'350 kcal', time:'2 min',  ingredients:'200g plain yogurt + 4–5 dates + 1 tbsp peanut butter',                                                      prep:'Chop dates, mix into yogurt, add peanut butter on top.',                                                                 tip:'Dates give fast carbs — perfect pre-workout snack' },
  { id:34, type:'snack', name:'Hard-boiled eggs & banana',         protein:'18g', kcal:'300 kcal', time:'10 min', ingredients:'3 hard-boiled eggs + 1 banana',                                                                             prep:'Boil eggs (batch-cook 6 at once). Peel and eat with banana.',                                                            tip:'Batch cook eggs on Sunday for the whole week' },
  { id:35, type:'snack', name:'Oat & yogurt protein pot',          protein:'20g', kcal:'390 kcal', time:'5 min',  ingredients:'200g plain yogurt + 40g oats + 1 tbsp honey + 1 banana + cinnamon',                                        prep:'Mix everything in a bowl. No cooking needed.',                                                                           tip:'Prep the night before for a ready-to-go morning snack' },
  { id:36, type:'snack', name:'Cottage cheese & cucumber',         protein:'18g', kcal:'180 kcal', time:'2 min',  ingredients:'200g cottage cheese + 1 cucumber + salt + pepper + paprika',                                              prep:'Slice cucumber, season cottage cheese with salt and paprika, dip or top.',                                               tip:'Lowest calorie high-protein snack on the list — great for cuts' },
  { id:37, type:'snack', name:'Mixed nuts & dates',                protein:'8g',  kcal:'310 kcal', time:'1 min',  ingredients:'30g mixed nuts (almonds, cashews, walnuts) + 3–4 Medjool dates',                                          prep:'Grab and eat. No prep needed.',                                                                                          tip:'Store a portion bag in your bag for emergency snacks on the go' },
  { id:38, type:'snack', name:'Boiled egg & whole grain crackers', protein:'14g', kcal:'240 kcal', time:'10 min', ingredients:'2 boiled eggs + 5 whole grain crackers + mustard or hummus',                                              prep:'Boil eggs 8 min, peel. Serve with crackers and dip.',                                                                    tip:'Keep peeled eggs in water in the fridge — stays fresh 5 days' },
  { id:39, type:'snack', name:'Yogurt with flaxseeds',             protein:'16g', kcal:'280 kcal', time:'2 min',  ingredients:'200g plain yogurt + 1 tbsp flaxseeds + 1 tbsp honey + 1 banana',                                         prep:'Mix yogurt with honey, slice banana on top, sprinkle flaxseeds.',                                                        tip:'Flaxseeds add omega-3 and fiber — good for digestive health' },
  { id:40, type:'snack', name:'Apple with almond butter',          protein:'6g',  kcal:'260 kcal', time:'1 min',  ingredients:'1 large apple + 2 tbsp almond butter',                                                                    prep:'Core and slice apple, dip in almond butter.',                                                                            tip:'The fiber from the apple slows sugar absorption — no energy crash' },
  { id:41, type:'snack', name:'Rice cake with cottage cheese',     protein:'14g', kcal:'220 kcal', time:'2 min',  ingredients:'3 rice cakes + 150g cottage cheese + chives + pepper',                                                   prep:'Spread cottage cheese on rice cakes, season with chives and pepper.',                                                    tip:'Only 220 kcal and 14g protein — best snack for calorie-controlled days' },
  { id:42, type:'snack', name:'Banana & walnuts',                  protein:'6g',  kcal:'300 kcal', time:'1 min',  ingredients:'1 banana + 30g walnuts',                                                                                 prep:'Peel banana, eat with walnuts.',                                                                                         tip:'Walnuts have the highest omega-3 content of all tree nuts' },
  { id:43, type:'snack', name:'Hummus & veggie sticks',            protein:'8g',  kcal:'200 kcal', time:'5 min',  ingredients:'4 tbsp hummus + 1 carrot + 1 cucumber + 1 bell pepper',                                                 prep:'Cut vegetables into sticks, serve with hummus for dipping.',                                                             tip:'Make a big batch of veggie sticks Sunday and keep in the fridge' },
  { id:44, type:'snack', name:'Dates with tahini',                 protein:'5g',  kcal:'290 kcal', time:'1 min',  ingredients:'5 Medjool dates + 1 tbsp tahini',                                                                        prep:'Pit dates, stuff or dip with tahini.',                                                                                   tip:'Tahini adds calcium and healthy fat — better combo than just dates alone' },
  { id:45, type:'snack', name:'Peanut butter crispbread',          protein:'10g', kcal:'320 kcal', time:'2 min',  ingredients:'3 rye crispbreads + 2 tbsp peanut butter + 1 banana + pinch cinnamon',                                  prep:'Spread peanut butter on crispbreads, top with banana slices and cinnamon.',                                              tip:'Rye crispbreads have more fiber than regular bread — keeps you fuller longer' },

  // ── SMOOTHIE (15) ───────────────────────────────────────────────────────────
  { id:46, type:'smoothie', name:'Banana oat muscle shake',         protein:'22g', kcal:'480 kcal', time:'3 min', ingredients:'2 bananas + 50g oats + 400ml whole milk + 1 tbsp peanut butter + pinch cinnamon',                          prep:'Blend everything 30 seconds. Drink immediately.',                                                                        tip:'Post-workout ideal. Add a raw egg for +6g protein' },
  { id:47, type:'smoothie', name:'Yogurt berry power blend',        protein:'20g', kcal:'400 kcal', time:'3 min', ingredients:'250g plain yogurt + 100g frozen berries + 1 banana + 30g oats + 200ml milk',                              prep:'Blend all 30 seconds. Thick texture — add water if needed.',                                                             tip:'Rich in antioxidants — great for cardio recovery' },
  { id:48, type:'smoothie', name:'Peanut butter banana mass shake', protein:'25g', kcal:'560 kcal', time:'3 min', ingredients:'2 bananas + 2 tbsp peanut butter + 400ml whole milk + 40g oats + 1 tsp honey',                           prep:'Blend until smooth. Use frozen bananas for a thicker texture.',                                                          tip:'Calorie-dense — best on high-training days' },
  { id:49, type:'smoothie', name:'Carrot orange ginger boost',      protein:'6g',  kcal:'220 kcal', time:'3 min', ingredients:'2 oranges (juiced) + 1 carrot + 1cm fresh ginger + 1 banana + water',                                    prep:'Blend all. Strain if you prefer juice texture.',                                                                         tip:'Cardio recovery drink — rich in vitamin C and electrolytes' },
  { id:50, type:'smoothie', name:'Spinach banana green power',      protein:'8g',  kcal:'280 kcal', time:'3 min', ingredients:'2 large handfuls spinach + 2 bananas + 300ml water or coconut water + 1 tsp honey',                      prep:'Blend spinach and liquid first until smooth. Add bananas, blend again.',                                                 tip:'Blend spinach with liquid first to avoid leafy lumps' },
  { id:51, type:'smoothie', name:'Mango yogurt tropical blend',     protein:'18g', kcal:'380 kcal', time:'3 min', ingredients:'200g frozen mango + 200g plain yogurt + 200ml milk + 1 tsp honey + pinch turmeric',                      prep:'Blend everything until creamy. Serve cold.',                                                                             tip:'Turmeric is anti-inflammatory — especially good for joint recovery' },
  { id:52, type:'smoothie', name:'Chocolate banana shake',          protein:'20g', kcal:'490 kcal', time:'3 min', ingredients:'2 bananas + 1 tbsp cocoa powder + 400ml whole milk + 40g oats + 1 tbsp peanut butter',                  prep:'Blend all ingredients 30 seconds.',                                                                                      tip:'Tastes like dessert but works as a post-workout meal' },
  { id:53, type:'smoothie', name:'Apple ginger detox',              protein:'4g',  kcal:'160 kcal', time:'3 min', ingredients:'2 apples + 1cm ginger + ½ lemon (juiced) + 1 carrot + 200ml cold water',                               prep:'Juice or blend all. Strain for a cleaner liquid.',                                                                       tip:'Best first thing in the morning on an empty stomach' },
  { id:54, type:'smoothie', name:'Avocado milk smoothie',           protein:'10g', kcal:'420 kcal', time:'3 min', ingredients:'1 ripe avocado + 400ml whole milk + 1 banana + 1 tbsp honey + pinch vanilla',                           prep:'Blend until completely smooth.',                                                                                         tip:'Very calorie-dense and filling — best for caloric surplus days' },
  { id:55, type:'smoothie', name:'Strawberry oat shake',            protein:'16g', kcal:'360 kcal', time:'3 min', ingredients:'150g frozen strawberries + 200g plain yogurt + 40g oats + 200ml milk + 1 tsp honey',                    prep:'Blend all ingredients. Add more milk if too thick.',                                                                     tip:'Frozen strawberries give a thicker texture than fresh' },
  { id:56, type:'smoothie', name:'Coconut banana smoothie',         protein:'8g',  kcal:'380 kcal', time:'3 min', ingredients:'2 bananas + 400ml coconut milk + 30g oats + 1 tbsp honey',                                             prep:'Blend until smooth. Chill before serving.',                                                                              tip:'MCT fats in coconut milk are rapidly used for energy — good pre-cardio' },
  { id:57, type:'smoothie', name:'Beetroot orange boost',           protein:'6g',  kcal:'210 kcal', time:'4 min', ingredients:'1 small beetroot (cooked) + 2 oranges (juiced) + 1 carrot + 1 banana + 200ml water',                   prep:'Blend beetroot and water first. Add remaining ingredients, blend 30 sec.',                                               tip:'Beetroot nitrates improve endurance — drink 2 hrs before cardio' },
  { id:58, type:'smoothie', name:'Almond date shake',               protein:'12g', kcal:'440 kcal', time:'3 min', ingredients:'5 Medjool dates (pitted) + 400ml almond milk + 2 tbsp almond butter + 1 banana + pinch cinnamon',       prep:'Soak dates in warm water 5 min. Blend everything until smooth.',                                                         tip:'Natural sweetness from dates — no sugar needed at all' },
  { id:59, type:'smoothie', name:'Watermelon mint cooler',          protein:'4g',  kcal:'150 kcal', time:'3 min', ingredients:'400g watermelon chunks + handful fresh mint + juice of 1 lime + 200ml cold water + ice',                prep:'Blend everything. Strain seeds if needed. Serve immediately over ice.',                                                   tip:'Best summer recovery drink — high in electrolytes and hydration' },
  { id:60, type:'smoothie', name:'Golden turmeric milk',            protein:'8g',  kcal:'240 kcal', time:'4 min', ingredients:'400ml whole milk + 1 tsp turmeric + ½ tsp cinnamon + 1 tsp honey + pinch black pepper + 1 banana',     prep:'Blend all cold, or warm gently on the stove. Froth and serve.',                                                          tip:'Black pepper dramatically increases turmeric absorption — do not skip it' },

  // ── BREAKFAST cont. (16–30) ─────────────────────────────────────────────────
  { id:76,  type:'breakfast', name:'Smoked salmon & cream cheese bagel',  protein:'32g', kcal:'520 kcal', time:'5 min',  ingredients:'1 bagel + 60g cream cheese + 80g smoked salmon + capers + lemon + dill',                                    prep:'Toast bagel, spread cream cheese, layer salmon, top with capers and lemon.',                                             tip:'Add sliced cucumber for crunch and extra micronutrients' },
  { id:77,  type:'breakfast', name:'Baked egg & spinach cups',            protein:'22g', kcal:'280 kcal', time:'15 min', ingredients:'4 eggs + 2 large handfuls spinach + 30g feta + olive oil + salt + pepper',                                  prep:'Oil a muffin tin, wilt spinach in each cup, crack one egg per cup, crumble feta. Bake 180°C 12 min.',                  tip:'Make 6 at once and reheat in the microwave all week' },
  { id:78,  type:'breakfast', name:'Smoothie bowl with granola',          protein:'16g', kcal:'430 kcal', time:'5 min',  ingredients:'2 frozen bananas + 150g frozen berries + 100g Greek yogurt + 50g granola + 1 tbsp honey + seeds',           prep:'Blend frozen bananas, berries, and yogurt thick. Pour into a bowl, top with granola, seeds, honey.',                   tip:'The key is using frozen fruit — fresh fruit makes it too liquid to eat with a spoon' },
  { id:79,  type:'breakfast', name:'Breakfast shakshuka',                 protein:'24g', kcal:'400 kcal', time:'15 min', ingredients:'3 eggs + 400g crushed tomatoes + onion + garlic + cumin + paprika + olive oil + bread',                      prep:'Fry onion and garlic. Add tomatoes and spices, simmer 5 min. Crack in eggs, cover until set. Serve with bread.',       tip:'Left over shakshuka reheats perfectly for day 2' },
  { id:80,  type:'breakfast', name:'Cottage cheese banana pancakes',      protein:'24g', kcal:'420 kcal', time:'12 min', ingredients:'200g cottage cheese + 2 eggs + 1 banana + 40g oats + pinch cinnamon + honey',                               prep:'Blend all ingredients. Cook small pancakes on medium heat 2 min per side. Drizzle honey.',                             tip:'Blending the oats first makes the batter smoother' },
  { id:81,  type:'breakfast', name:'Oatmeal with poached egg on top',     protein:'20g', kcal:'450 kcal', time:'12 min', ingredients:'60g oats + 300ml milk + 1 egg + salt + pepper + chives + drizzle olive oil',                                prep:'Cook oats in milk. Poach egg 3 min. Place egg on oatmeal, season with salt, pepper, chives.',                          tip:'Savory oatmeal is underrated — the egg yolk acts as a sauce' },
  { id:82,  type:'breakfast', name:'Pita with hummus & fried egg',        protein:'18g', kcal:'440 kcal', time:'8 min',  ingredients:'1 pita bread + 3 tbsp hummus + 2 eggs + olive oil + za\'atar or paprika',                                  prep:'Fry eggs in olive oil sunny side up. Spread hummus on warm pita, top with eggs and spices.',                           tip:'Warm the pita directly on the flame for 30 sec for a smoky flavour' },
  { id:83,  type:'breakfast', name:'Ricotta toast with honey & walnuts',  protein:'16g', kcal:'480 kcal', time:'5 min',  ingredients:'2 thick toast slices + 100g ricotta + 1 tbsp honey + 30g walnuts + pinch cinnamon',                         prep:'Toast bread, spread ricotta generously, drizzle honey, crush walnuts on top, dust cinnamon.',                          tip:'Ricotta has more protein per calorie than cream cheese' },
  { id:84,  type:'breakfast', name:'Boiled eggs & avocado plate',         protein:'16g', kcal:'380 kcal', time:'10 min', ingredients:'2 eggs + 1 avocado + lemon juice + chili flakes + salt + 1 slice toast',                                   prep:'Boil eggs 7 min. Halve avocado, season with lemon, salt, chili. Serve with toast.',                                   tip:'Batch boil 6 eggs and keep in the fridge for a 2-min breakfast all week' },
  { id:85,  type:'breakfast', name:'Egg & veggie breakfast burrito',      protein:'26g', kcal:'550 kcal', time:'10 min', ingredients:'3 eggs + 1 flour tortilla + 1 tin beans (drained) + cheese + salsa + spinach + olive oil',                  prep:'Scramble eggs with beans. Place on tortilla with cheese, spinach, salsa. Wrap tight, toast in pan 1 min.',             tip:'Prep 3 burritos at once and freeze — microwave 2 min from frozen' },
  { id:86,  type:'breakfast', name:'Muesli with milk & dried fruit',      protein:'14g', kcal:'420 kcal', time:'3 min',  ingredients:'60g muesli + 250ml cold milk + 5 dried apricots + 1 tbsp honey + 1 banana',                                 prep:'Pour cold milk over muesli, slice in banana, add chopped apricots and honey. Eat immediately or soak overnight.',      tip:'Soaking overnight makes it creamier and easier to digest' },
  { id:87,  type:'breakfast', name:'Egg & tomato pan scramble',           protein:'22g', kcal:'360 kcal', time:'8 min',  ingredients:'4 eggs + 2 tomatoes (diced) + onion + olive oil + salt + cumin + fresh coriander',                         prep:'Fry onion 2 min. Add tomatoes and cumin, cook 3 min. Scramble eggs in.',                                              tip:'A North African-style eggs with tomatoes — naturally high protein and very cheap' },
  { id:88,  type:'breakfast', name:'No-bake peanut butter oat balls',     protein:'10g', kcal:'390 kcal', time:'10 min', ingredients:'100g oats + 3 tbsp peanut butter + 2 tbsp honey + 2 tbsp dark chocolate chips + pinch salt',                prep:'Mix all together. Roll into 8–10 balls. Refrigerate 20 min before eating.',                                            tip:'Store in the fridge 5 days — grab 2–3 balls as a fast breakfast on the go' },
  { id:89,  type:'breakfast', name:'Banana bread overnight oats',         protein:'14g', kcal:'440 kcal', time:'5 min',  ingredients:'60g oats + 250ml milk + 1 banana (mashed) + 1 tbsp peanut butter + 1 tsp honey + pinch cinnamon',          prep:'Mash banana into oats and milk. Add peanut butter, honey, cinnamon. Refrigerate overnight.',                          tip:'Mashing the banana in makes it sweet without added sugar' },
  { id:90,  type:'breakfast', name:'Full egg & veggie power bowl',        protein:'28g', kcal:'420 kcal', time:'12 min', ingredients:'3 eggs + handful cherry tomatoes + ½ avocado + spinach + olive oil + lemon + salt',                         prep:'Pan-fry eggs to preference. Assemble bowl with spinach, tomatoes, avocado. Drizzle oil and lemon.',                   tip:'Eat this before training — protein from eggs + healthy fat from avocado = sustained energy' },

  // ── MAIN MEAL cont. (16–30) ─────────────────────────────────────────────────
  { id:91,  type:'main', name:'Tuna & white bean salad',             protein:'40g', kcal:'580 kcal', time:'5 min',  ingredients:'2 tins tuna + 1 tin white beans (drained) + red onion + olive oil + lemon + parsley + salt',                 prep:'Drain tuna and beans. Toss with sliced onion, olive oil, lemon juice, and parsley.',                                   tip:'Zero cooking needed — one of the fastest high-protein meals on the list' },
  { id:92,  type:'main', name:'Egg & vegetable stir fry with rice',  protein:'24g', kcal:'480 kcal', time:'12 min', ingredients:'3 eggs + 200g rice + 1 bell pepper + carrot + onion + soy sauce + sesame oil + garlic',                    prep:'Cook rice. Stir fry veggies 4 min. Scramble eggs in. Add rice and soy sauce, toss.',                                   tip:'Use pre-cooked microwave rice bags to cut time to 5 min' },
  { id:93,  type:'main', name:'Red lentil dal with rice',            protein:'28g', kcal:'620 kcal', time:'20 min', ingredients:'200g red lentils + 200g rice + 1 tin tomatoes + onion + garlic + cumin + turmeric + coconut milk',          prep:'Fry onion and spices 2 min. Add lentils, tomatoes, coconut milk, 400ml water. Simmer 15 min. Serve over rice.',        tip:'Make a big batch — dal gets better the next day as flavors develop' },
  { id:94,  type:'main', name:'Sardine & tomato pasta',              protein:'38g', kcal:'660 kcal', time:'12 min', ingredients:'200g pasta + 2 tins sardines + 400g crushed tomatoes + garlic + olive oil + chili + basil',                 prep:'Cook pasta. Fry garlic and chili 1 min, add tomatoes, simmer 5 min. Flake in sardines. Toss with pasta.',              tip:'Sardines break down into the sauce — skeptics won\'t even know they\'re in there' },
  { id:95,  type:'main', name:'Potato & chickpea curry',             protein:'20g', kcal:'570 kcal', time:'20 min', ingredients:'2 potatoes (diced) + 1 tin chickpeas + 1 tin tomatoes + onion + garlic + garam masala + turmeric + ginger', prep:'Fry onion, garlic, ginger 2 min. Add spices, tomatoes, potatoes. Simmer 12 min. Add chickpeas, cook 3 more min.',      tip:'Add a spoonful of yogurt on top to cool the heat and add extra protein' },
  { id:96,  type:'main', name:'Tuna stuffed bell peppers',           protein:'36g', kcal:'520 kcal', time:'15 min', ingredients:'2 bell peppers + 2 tins tuna + 100g cooked rice + corn + tomato + olive oil + herbs',                       prep:'Halve peppers, hollow out. Mix tuna, rice, corn, tomato. Fill peppers. Bake 200°C 12 min.',                            tip:'Eat cold the next day — works great as meal prep' },
  { id:97,  type:'main', name:'Black bean & egg power bowl',         protein:'30g', kcal:'590 kcal', time:'10 min', ingredients:'1 tin black beans + 2 eggs + 200g rice + salsa + avocado + lime + cumin + olive oil',                      prep:'Warm beans with cumin. Fry eggs. Assemble bowl with rice, beans, eggs, avocado, salsa.',                               tip:'Black beans are one of the most fiber-dense legumes — great for gut health' },
  { id:98,  type:'main', name:'Korean-style rice & egg bowl',        protein:'28g', kcal:'600 kcal', time:'12 min', ingredients:'200g cooked rice + 2 eggs + carrot + spinach + cucumber + soy sauce + sesame oil + sesame seeds',          prep:'Blanch spinach 1 min. Fry eggs. Arrange rice in bowl with all toppings. Drizzle soy and sesame oil.',                  tip:'The trick is having each topping separated — looks impressive, tastes great' },
  { id:99,  type:'main', name:'Tuna & corn quesadilla',              protein:'34g', kcal:'580 kcal', time:'10 min', ingredients:'2 flour tortillas + 1 tin tuna + 50g cheese + corn + tomato + jalapeño + olive oil',                       prep:'Fill one tortilla with tuna, cheese, corn. Top with second tortilla. Pan-fry 2 min per side.',                         tip:'Press down with a spatula while cooking to get a crispy, sealed quesadilla' },
  { id:100, type:'main', name:'Chickpea patties with yogurt sauce',  protein:'22g', kcal:'500 kcal', time:'15 min', ingredients:'1 tin chickpeas + 1 egg + garlic + cumin + parsley + breadcrumbs + olive oil + 100g yogurt + lemon',       prep:'Mash chickpeas, mix in egg, garlic, cumin, parsley, breadcrumbs. Form patties. Pan-fry 3 min per side. Serve with yogurt.',  tip:'Chill the patty mix 10 min before frying so they hold their shape' },
  { id:101, type:'main', name:'Egg & potato soup',                   protein:'20g', kcal:'420 kcal', time:'20 min', ingredients:'3 eggs + 3 potatoes (cubed) + 1 onion + garlic + 1L stock + olive oil + parsley + salt',                  prep:'Fry onion and garlic 2 min. Add potatoes and stock. Simmer 12 min. Crack eggs in, poach in soup 4 min.',               tip:'Season generously — potatoes need more salt than you think' },
  { id:102, type:'main', name:'Pasta aglio e olio with tuna',        protein:'40g', kcal:'680 kcal', time:'12 min', ingredients:'200g pasta + 2 tins tuna + 4 garlic cloves + olive oil + chili flakes + parsley + black pepper',          prep:'Cook pasta. Fry sliced garlic in oil until golden. Toss pasta with oil, tuna, chili, parsley.',                        tip:'Reserve a cup of pasta water — add it to loosen the sauce' },
  { id:103, type:'main', name:'Chickpea & spinach stew',             protein:'24g', kcal:'540 kcal', time:'20 min', ingredients:'2 tins chickpeas + 200g spinach + 1 tin tomatoes + onion + garlic + smoked paprika + olive oil + lemon',  prep:'Fry onion and garlic 2 min. Add paprika, tomatoes, chickpeas. Simmer 12 min. Stir in spinach until wilted.',           tip:'Squeeze lemon at the end — acid brightens the whole dish' },
  { id:104, type:'main', name:'Egg & bean taco bowl',                protein:'30g', kcal:'600 kcal', time:'12 min', ingredients:'3 eggs + 1 tin kidney beans + 200g rice + tomato + avocado + sour cream + cumin + chili powder',         prep:'Scramble eggs with cumin and chili. Warm beans. Assemble bowl with rice, beans, eggs, tomato, avocado.',               tip:'Build it like a deconstructed taco — you get all the flavors without the mess' },
  { id:105, type:'main', name:'Sardine & avocado open sandwich',     protein:'34g', kcal:'560 kcal', time:'8 min',  ingredients:'2 slices sourdough + 2 tins sardines + 1 avocado + lemon + capers + chili flakes + olive oil',            prep:'Toast bread. Mash avocado with lemon on each slice. Flake sardines on top. Add capers and chili.',                    tip:'Best served open-face so you taste every layer' },

  // ── SNACK cont. (16–30) ─────────────────────────────────────────────────────
  { id:106, type:'snack', name:'Edamame with sea salt',              protein:'12g', kcal:'180 kcal', time:'5 min',  ingredients:'200g frozen edamame + sea salt + optional: chili flakes or sesame oil',                                    prep:'Microwave edamame 3 min or boil 5 min. Drain, sprinkle salt and seasoning.',                                          tip:'Buy frozen in bulk — one of the cheapest high-protein plant snacks available' },
  { id:107, type:'snack', name:'Celery & peanut butter boats',       protein:'7g',  kcal:'200 kcal', time:'2 min',  ingredients:'4 celery sticks + 2 tbsp peanut butter + optional: raisins on top',                                      prep:'Fill celery grooves with peanut butter. Add raisins for the classic "ants on a log" version.',                        tip:'Celery is 95% water — keeps you hydrated as you snack' },
  { id:108, type:'snack', name:'Cheese & whole grain crackers',      protein:'14g', kcal:'280 kcal', time:'2 min',  ingredients:'40g aged cheddar or gouda + 6 whole grain crackers + optional: pickles or grapes',                        prep:'Slice cheese, arrange on crackers with pickles or fruit on the side.',                                                 tip:'Aged cheese has more protein per gram than fresh cheese' },
  { id:109, type:'snack', name:'Date & nut energy balls',            protein:'8g',  kcal:'310 kcal', time:'10 min', ingredients:'8 Medjool dates (pitted) + 60g mixed nuts + 1 tbsp cocoa + 1 tbsp peanut butter + pinch salt',           prep:'Blend dates and nuts. Add cocoa and PB. Roll into 8–10 balls. Refrigerate.',                                          tip:'Freeze half the batch — they taste like chocolate truffles straight from the freezer' },
  { id:110, type:'snack', name:'Cucumber & hummus bites',            protein:'6g',  kcal:'160 kcal', time:'5 min',  ingredients:'1 large cucumber + 4 tbsp hummus + paprika + olive oil',                                                 prep:'Slice cucumber into thick rounds. Top each with a dollop of hummus and a dusting of paprika.',                        tip:'The lowest-calorie snack on the list — great for evening hunger without guilt' },
  { id:111, type:'snack', name:'Popcorn with nutritional yeast',     protein:'6g',  kcal:'190 kcal', time:'5 min',  ingredients:'30g popping corn + 1 tbsp olive oil + 2 tbsp nutritional yeast + salt',                                  prep:'Pop corn in a lidded pan with oil. Toss with nutritional yeast and salt.',                                             tip:'Nutritional yeast adds a cheesy flavor plus B vitamins — unique in plant foods' },
  { id:112, type:'snack', name:'Banana & dark chocolate',            protein:'4g',  kcal:'280 kcal', time:'1 min',  ingredients:'1 banana + 3 squares dark chocolate (70%+)',                                                             prep:'Eat together. No prep at all.',                                                                                       tip:'The natural sweetness of banana balances the bitterness of dark chocolate perfectly' },
  { id:113, type:'snack', name:'Sunflower seeds & raisins',          protein:'8g',  kcal:'270 kcal', time:'1 min',  ingredients:'30g sunflower seeds + 30g raisins',                                                                      prep:'Mix and eat.',                                                                                                        tip:'Sunflower seeds are rich in vitamin E and magnesium — great for workout recovery' },
  { id:114, type:'snack', name:'Pistachios & dried apricots',        protein:'8g',  kcal:'300 kcal', time:'1 min',  ingredients:'30g pistachios + 6 dried apricots',                                                                      prep:'Grab and eat.',                                                                                                       tip:'Pistachios are the most protein-dense nut by volume — you get more per handful' },
  { id:115, type:'snack', name:'Avocado & salt rice cake',           protein:'4g',  kcal:'240 kcal', time:'3 min',  ingredients:'3 rice cakes + ½ avocado + lemon juice + sea salt + chili flakes',                                      prep:'Mash avocado with lemon. Spread on rice cakes. Season with salt and chili.',                                          tip:'Best eaten immediately — avocado oxidizes fast once mashed' },
  { id:116, type:'snack', name:'Mini baked egg cups',                protein:'18g', kcal:'200 kcal', time:'15 min', ingredients:'4 eggs + salt + pepper + dried herbs + optional: diced ham or cheese',                                  prep:'Crack eggs into oiled muffin tin. Season. Bake 180°C 12 min until just set.',                                         tip:'Batch bake 6 every Sunday — grab and eat cold, no reheating needed' },
  { id:117, type:'snack', name:'Yogurt with hemp seeds',             protein:'18g', kcal:'260 kcal', time:'2 min',  ingredients:'200g plain yogurt + 2 tbsp hemp seeds + 1 tsp honey',                                                   prep:'Mix hemp seeds into yogurt, drizzle honey.',                                                                          tip:'Hemp seeds have the perfect omega-3 to omega-6 ratio of all seeds' },
  { id:118, type:'snack', name:'Pear & almond butter',               protein:'5g',  kcal:'250 kcal', time:'2 min',  ingredients:'1 ripe pear + 2 tbsp almond butter',                                                                    prep:'Slice pear, dip in almond butter.',                                                                                   tip:'Pears are gentler on digestion than apples — better for sensitive stomachs' },
  { id:119, type:'snack', name:'Crispy roasted chickpeas',           protein:'10g', kcal:'220 kcal', time:'30 min', ingredients:'1 tin chickpeas (drained) + 1 tbsp olive oil + paprika + cumin + salt + garlic powder',                 prep:'Pat chickpeas dry. Toss with oil and spices. Roast 200°C 25 min until crunchy.',                                     tip:'They must be completely dry before roasting or they\'ll go soft instead of crispy' },
  { id:120, type:'snack', name:'Banana oat energy bites',            protein:'8g',  kcal:'320 kcal', time:'10 min', ingredients:'2 bananas + 100g oats + 2 tbsp peanut butter + 1 tbsp honey + dark chocolate chips',                   prep:'Mash bananas, mix in oats, PB, honey, chips. Roll into balls. Refrigerate 15 min.',                                  tip:'No oven needed — the oats and banana bind together naturally' },

  // ── SMOOTHIE cont. (16–30) ──────────────────────────────────────────────────
  { id:121, type:'smoothie', name:'Pineapple coconut recovery shake',  protein:'6g',  kcal:'290 kcal', time:'3 min', ingredients:'200g frozen pineapple + 300ml coconut milk + 1 banana + 1cm fresh ginger + pinch turmeric',               prep:'Blend all until smooth.',                                                                                             tip:'Pineapple bromelain reduces post-workout muscle soreness — science-backed' },
  { id:122, type:'smoothie', name:'Blueberry almond milk shake',       protein:'8g',  kcal:'280 kcal', time:'3 min', ingredients:'150g frozen blueberries + 300ml almond milk + 40g oats + 1 tbsp almond butter + 1 tsp honey',             prep:'Blend everything until smooth. Add more almond milk if too thick.',                                                   tip:'Blueberries have the highest antioxidant content of any common fruit' },
  { id:123, type:'smoothie', name:'Kale apple detox blend',            protein:'4g',  kcal:'160 kcal', time:'3 min', ingredients:'2 large kale leaves + 2 apples + ½ lemon (juiced) + 1cm ginger + 300ml cold water + ice',               prep:'Blend kale with water first until smooth. Add remaining ingredients and blend again.',                                tip:'Blend greens with liquid first to fully break them down before adding other ingredients' },
  { id:124, type:'smoothie', name:'Peach oat smoothie',                protein:'14g', kcal:'350 kcal', time:'3 min', ingredients:'200g frozen peaches + 200g plain yogurt + 40g oats + 200ml milk + 1 tsp vanilla + 1 tsp honey',          prep:'Blend all until creamy.',                                                                                             tip:'Frozen peaches give a sorbet-like texture — better than fresh for smoothies' },
  { id:125, type:'smoothie', name:'Espresso banana energy shake',      protein:'16g', kcal:'420 kcal', time:'3 min', ingredients:'2 bananas + 1 shot espresso (cooled) + 300ml milk + 40g oats + 1 tbsp peanut butter',                    prep:'Cool espresso shot. Blend everything together.',                                                                     tip:'Caffeine + complex carbs from oats = the best pre-morning-workout combo' },
  { id:126, type:'smoothie', name:'Fig & honey smoothie',              protein:'10g', kcal:'380 kcal', time:'3 min', ingredients:'4 fresh or dried figs + 200g Greek yogurt + 200ml milk + 1 tbsp honey + pinch cinnamon',                 prep:'If using dried figs, soak 10 min in warm water. Blend all ingredients.',                                              tip:'Figs are rich in calcium and iron — rare nutrients in most smoothies' },
  { id:127, type:'smoothie', name:'Papaya ginger tropical blend',      protein:'5g',  kcal:'200 kcal', time:'3 min', ingredients:'300g papaya (cubed) + 1 banana + 1cm fresh ginger + juice of 1 lime + 200ml coconut water',              prep:'Blend all until smooth.',                                                                                             tip:'Papaya enzymes aid protein digestion — ideal as a post-meal smoothie' },
  { id:128, type:'smoothie', name:'Cherry banana anti-inflammatory',   protein:'8g',  kcal:'300 kcal', time:'3 min', ingredients:'150g frozen cherries + 1 banana + 200ml milk + 1 tbsp cocoa powder + ½ tsp cinnamon',                   prep:'Blend all ingredients until smooth.',                                                                                 tip:'Tart cherry is one of the most studied foods for reducing exercise-induced inflammation' },
  { id:129, type:'smoothie', name:'Cucumber mint detox blend',         protein:'3g',  kcal:'90 kcal',  time:'3 min', ingredients:'1 cucumber + handful mint + juice of 1 lemon + 1cm ginger + 400ml cold water + ice',                    prep:'Blend all, strain for a cleaner drink, or leave chunky.',                                                             tip:'Extremely hydrating — perfect first thing in the morning before breakfast' },
  { id:130, type:'smoothie', name:'Tahini date power shake',           protein:'14g', kcal:'450 kcal', time:'3 min', ingredients:'5 Medjool dates + 2 tbsp tahini + 400ml milk + 1 banana + pinch cardamom + pinch cinnamon',              prep:'Soak dates 5 min. Blend everything until completely smooth.',                                                        tip:'Tahini is 25% protein — gives this shake a richer, nuttier taste than PB' },
  { id:131, type:'smoothie', name:'Blackberry yogurt blend',           protein:'16g', kcal:'340 kcal', time:'3 min', ingredients:'150g frozen blackberries + 200g plain yogurt + 200ml milk + 1 banana + 1 tsp honey',                     prep:'Blend all until smooth.',                                                                                             tip:'Blackberries have 3× more vitamin C than oranges by weight' },
  { id:132, type:'smoothie', name:'Orange carrot immunity boost',      protein:'5g',  kcal:'190 kcal', time:'3 min', ingredients:'3 oranges (juiced) + 2 carrots + 1 banana + 1cm turmeric + 200ml water',                               prep:'Juice or blend all ingredients. Strain for juice, leave chunky for smoothie.',                                        tip:'Vitamin C from oranges helps absorb iron from carrots — smart combo' },
  { id:133, type:'smoothie', name:'Lemon ginger zing shot',            protein:'3g',  kcal:'100 kcal', time:'3 min', ingredients:'2 lemons (juiced) + 2cm fresh ginger + 1 tsp honey + 1 tsp apple cider vinegar + 200ml water',          prep:'Blend or shake all together. Drink immediately.',                                                                    tip:'Drink this before your main breakfast — kick-starts digestion and metabolism' },
  { id:134, type:'smoothie', name:'Pumpkin spice protein shake',       protein:'12g', kcal:'380 kcal', time:'4 min', ingredients:'3 tbsp pumpkin puree + 300ml milk + 1 banana + 40g oats + 1 tsp pumpkin spice + 1 tsp honey',           prep:'Blend all until smooth and creamy.',                                                                                  tip:'Pumpkin is high in beta-carotene and potassium — great for endurance recovery' },
  { id:135, type:'smoothie', name:'Melon lime cooler',                 protein:'3g',  kcal:'130 kcal', time:'3 min', ingredients:'400g melon (honeydew or cantaloupe) + juice of 1 lime + handful mint + 200ml cold water + ice',         prep:'Blend everything. Serve immediately over ice.',                                                                      tip:'One of the most hydrating smoothies — great before or after cardio in heat' },



  // ── BREAKFAST extra 20 (151–170) ────────────────────────────────────────────
  { id:151, type:'breakfast', name:'Smashed avocado & 2 eggs on toast',   protein:'18g', kcal:'460 kcal', time:'8 min',  ingredients:'2 eggs + 1 avocado + 2 slices sourdough + lemon + chili flakes + salt',                              prep:'Toast bread. Mash avocado with lemon. Fry eggs to preference. Pile on toast.',                                         tip:'Add red chili flakes — capsaicin boosts metabolism first thing in the morning' },
  { id:152, type:'breakfast', name:'Bircher muesli',                       protein:'14g', kcal:'390 kcal', time:'5 min',  ingredients:'60g oats + 150ml apple juice + 150ml yogurt + 1 apple (grated) + 30g raisins + 20g walnuts',        prep:'Mix oats, apple juice and yogurt. Refrigerate overnight. Stir in grated apple and toppings in the morning.',           tip:'Swiss original recipe — more complex carbs than regular overnight oats' },
  { id:153, type:'breakfast', name:'Egg white omelette with herbs',        protein:'22g', kcal:'280 kcal', time:'8 min',  ingredients:'5 egg whites + fresh herbs (chives, parsley) + salt + pepper + olive oil + 30g feta',               prep:'Whisk egg whites with salt. Cook in olive oil on medium until set. Add feta and herbs, fold.',                          tip:'Egg whites have zero cholesterol — ideal if you eat eggs every single day' },
  { id:154, type:'breakfast', name:'High-protein oat pancakes',            protein:'20g', kcal:'470 kcal', time:'12 min', ingredients:'80g oats (blended to flour) + 2 eggs + 200ml milk + 1 tsp baking powder + pinch salt + honey',       prep:'Blend oats. Mix all ingredients into batter. Cook small pancakes 2 min per side.',                                     tip:'Blending oats into flour gives a fluffier texture than whole oats' },
  { id:155, type:'breakfast', name:'Soft boiled egg & toast soldiers',     protein:'14g', kcal:'340 kcal', time:'8 min',  ingredients:'2 eggs + 2 slices whole grain bread + butter + pinch salt',                                         prep:'Boil eggs exactly 6 min for runny yolk. Toast and butter bread. Cut into strips for dipping.',                         tip:'6 minutes is the sweet spot — set white, liquid gold yolk' },
  { id:156, type:'breakfast', name:'Egg & mushroom savory toast',          protein:'22g', kcal:'380 kcal', time:'10 min', ingredients:'2 eggs + 200g mushrooms + 2 slices toast + garlic + olive oil + thyme + salt',                     prep:'Sauté mushrooms and garlic in oil 5 min. Scramble eggs in. Pile on toast.',                                            tip:'Mushrooms add umami depth — makes a plain egg toast feel like a restaurant meal' },
  { id:157, type:'breakfast', name:'Banana cocoa overnight oats',          protein:'14g', kcal:'430 kcal', time:'5 min',  ingredients:'60g oats + 250ml milk + 1 banana + 1 tbsp cocoa powder + 1 tbsp honey + pinch cinnamon',           prep:'Mix all in a jar. Stir well so cocoa dissolves. Refrigerate overnight.',                                               tip:'Tastes like chocolate pudding — the easiest way to eat oats if you dislike the plain taste' },
  { id:158, type:'breakfast', name:'Egg & melted cheese sandwich',         protein:'26g', kcal:'490 kcal', time:'8 min',  ingredients:'3 eggs + 2 thick bread slices + 40g cheddar + butter + salt + pepper',                             prep:'Scramble eggs. Toast bread, melt cheese on one slice. Fill with eggs.',                                                tip:'Use day-old bread — it toasts crispier and holds more filling' },
  { id:159, type:'breakfast', name:'Apple & cinnamon porridge',            protein:'10g', kcal:'380 kcal', time:'7 min',  ingredients:'60g oats + 300ml milk + 1 apple (grated) + 1 tsp cinnamon + 1 tbsp brown sugar + 20g walnuts',    prep:'Cook oats and milk 4 min. Stir in grated apple, cinnamon, sugar. Top with walnuts.',                                  tip:'Grating the apple into hot oats makes it melt in — much better than chunks on top' },
  { id:160, type:'breakfast', name:'Walnut & date oatmeal',                protein:'12g', kcal:'420 kcal', time:'7 min',  ingredients:'60g oats + 300ml milk + 4 dates (chopped) + 25g walnuts + 1 tsp honey + pinch vanilla',            prep:'Cook oats in milk. Stir in dates. Top with walnuts and honey.',                                                        tip:'Dates dissolve into warm oats, adding natural sweetness without any added sugar' },
  { id:161, type:'breakfast', name:'Turmeric & black pepper scrambled eggs',protein:'22g',kcal:'370 kcal', time:'8 min',  ingredients:'3 eggs + ½ tsp turmeric + pinch black pepper + olive oil + salt + 2 slices toast',                  prep:'Whisk eggs with turmeric and pepper. Scramble slowly in olive oil. Serve on toast.',                                   tip:'Black pepper makes turmeric 20x more bioavailable — never use one without the other' },
  { id:162, type:'breakfast', name:'Poached egg on white bean toast',      protein:'22g', kcal:'460 kcal', time:'10 min', ingredients:'2 eggs + 2 slices toast + ½ tin white beans + garlic + olive oil + paprika + lemon',               prep:'Warm beans with garlic and paprika. Mash slightly on toast. Poach eggs 3 min, place on top.',                          tip:'White beans add 8g extra protein and serious fiber to a classic eggs on toast' },
  { id:163, type:'breakfast', name:'Egg & halloumi skillet',               protein:'26g', kcal:'520 kcal', time:'12 min', ingredients:'2 eggs + 80g halloumi (sliced) + cherry tomatoes + olive oil + oregano + black pepper',             prep:'Pan-fry halloumi 2 min per side. Push to edge of pan. Crack eggs in. Cook until set.',                                 tip:'Halloumi does not melt — it holds its shape and gets golden and squeaky' },
  { id:164, type:'breakfast', name:'Tuna & boiled egg open sandwich',      protein:'30g', kcal:'440 kcal', time:'5 min',  ingredients:'1 tin tuna + 2 boiled eggs + mustard + mayo (1 tsp) + 2 slices whole grain bread + lettuce',        prep:'Mash tuna with mustard and mayo. Slice eggs. Build open sandwich.',                                                    tip:'Highest protein breakfast sandwich on the list at 30g per serving' },
  { id:165, type:'breakfast', name:'Egg & sweet potato hash',              protein:'24g', kcal:'470 kcal', time:'15 min', ingredients:'3 eggs + 1 sweet potato (cubed) + onion + bell pepper + olive oil + paprika + salt',               prep:'Microwave sweet potato 4 min. Pan-fry with onion and pepper 5 min. Crack in eggs, cook until set.',                    tip:'Sweet potato gives slow-releasing carbs — perfect for long training sessions' },
  { id:166, type:'breakfast', name:'Berry & chia seed overnight oats',     protein:'12g', kcal:'410 kcal', time:'5 min',  ingredients:'60g oats + 250ml milk + 100g mixed berries + 2 tbsp chia seeds + 1 tbsp honey',                    prep:'Mix oats, milk and chia in a jar. Add berries, drizzle honey. Refrigerate overnight.',                                tip:'Chia seeds expand overnight and turn the oats into a thick, pudding-like texture' },
  { id:167, type:'breakfast', name:'Egg & feta scramble',                  protein:'24g', kcal:'390 kcal', time:'8 min',  ingredients:'3 eggs + 50g feta + handful cherry tomatoes + olive oil + oregano + black pepper',                  prep:'Scramble eggs with tomatoes in olive oil. Crumble feta in at the end. Season.',                                        tip:'Add feta at the end off heat — it warms without fully melting and stays creamy' },
  { id:168, type:'breakfast', name:'Sardine & tomato toast',               protein:'28g', kcal:'420 kcal', time:'5 min',  ingredients:'1 tin sardines + 2 slices sourdough + 2 ripe tomatoes + olive oil + basil + salt',                  prep:'Toast bread. Rub with tomato halves. Top with sardines, drizzle oil, add basil.',                                      tip:'Rubbing raw tomato on bread is the Spanish pan con tomate technique — better than slicing' },
  { id:169, type:'breakfast', name:'Warm rice congee with egg',            protein:'14g', kcal:'360 kcal', time:'15 min', ingredients:'80g white rice + 600ml water or stock + 2 eggs + ginger + soy sauce + sesame oil + spring onion',  prep:'Simmer rice in stock 12 min until thick. Crack eggs in, stir. Season with soy, sesame, ginger.',                      tip:'Asian comfort food — extremely easy to digest, great after a rough night\'s sleep' },

  // ── MAIN extra 20 (171–190) ─────────────────────────────────────────────────
  { id:182, type:'main', name:'Tuna niçoise bowl',                    protein:'38g', kcal:'540 kcal', time:'10 min', ingredients:'2 tins tuna + 2 boiled eggs + green beans + cherry tomatoes + olives + olive oil + lemon + mustard',   prep:'Blanch beans 3 min. Arrange all components in a bowl. Whisk oil, lemon and mustard for dressing.',                     tip:'Classic French salad — elegant but incredibly simple to put together' },
  { id:183, type:'main', name:'Egg drop soup with noodles',           protein:'18g', kcal:'380 kcal', time:'10 min', ingredients:'3 eggs + 100g noodles + 1L chicken or vegetable stock + soy sauce + sesame oil + spring onion + ginger', prep:'Bring stock to boil with ginger. Add noodles, cook 3 min. Slowly drizzle beaten eggs while stirring. Season.',         tip:'Pour the egg in a very thin stream while stirring — that creates the silky ribbons' },
  { id:184, type:'main', name:'Loaded baked potato with tuna',        protein:'36g', kcal:'600 kcal', time:'15 min', ingredients:'1 large potato + 2 tins tuna + 2 tbsp Greek yogurt + chives + lemon + salt + pepper',                 prep:'Microwave potato 8 min until soft. Split open. Mix tuna with yogurt and lemon. Fill potato.',                          tip:'Microwave instead of oven baking saves 45 minutes with identical results' },
  { id:185, type:'main', name:'Tuna melt panini',                     protein:'36g', kcal:'580 kcal', time:'8 min',  ingredients:'1 baguette or ciabatta + 2 tins tuna + 40g cheese + tomato + mustard + olive oil',                    prep:'Mix tuna with mustard. Fill bread with tuna, cheese, tomato. Press and toast in a pan until golden.',                  tip:'A heavy pan pressed on top works as a panini press if you do not have one' },
  { id:186, type:'main', name:'Sardine puttanesca pasta',             protein:'36g', kcal:'640 kcal', time:'15 min', ingredients:'200g pasta + 2 tins sardines + olives + capers + crushed tomatoes + garlic + chili + olive oil',       prep:'Fry garlic and chili. Add tomatoes, olives, capers. Simmer 8 min. Flake in sardines. Toss with pasta.',                tip:'Puttanesca sauce is bold and briny — the sardines are completely at home in it' },
  { id:187, type:'main', name:'Lentil & sweet potato soup',           protein:'22g', kcal:'480 kcal', time:'20 min', ingredients:'200g red lentils + 1 sweet potato (cubed) + 1 tin tomatoes + onion + cumin + coriander + olive oil',   prep:'Fry onion and spices. Add sweet potato, lentils, tomatoes, 600ml water. Simmer 15 min. Blend half.',                  tip:'Blend only half the soup — it gives a thick base while keeping some chunky texture' },
  { id:188, type:'main', name:'Bean burrito bowl',                    protein:'26g', kcal:'580 kcal', time:'10 min', ingredients:'200g rice + 1 tin mixed beans + corn + salsa + avocado + lime + cumin + coriander',                   prep:'Warm beans with cumin. Cook rice. Assemble bowl with all toppings. Squeeze lime over everything.',                     tip:'Add a fried egg on top to push protein to 32g' },
  { id:189, type:'main', name:'Tuna & quinoa power bowl',             protein:'40g', kcal:'580 kcal', time:'10 min', ingredients:'180g cooked quinoa + 2 tins tuna + cucumber + cherry tomatoes + lemon + olive oil + parsley',         prep:'Cook quinoa 15 min. Mix tuna with lemon and oil. Assemble bowl with all ingredients.',                                 tip:'Quinoa is a complete protein — combined with tuna this is one of the most protein-dense meals' },
  { id:190, type:'main', name:'Egg & vegetable stir fry rice',        protein:'24g', kcal:'480 kcal', time:'12 min', ingredients:'3 eggs + 200g cooked rice + bell pepper + carrot + onion + soy sauce + sesame oil + garlic',          prep:'Stir fry veggies 4 min. Push to side, scramble eggs. Add cold rice and soy sauce. Toss everything.',                  tip:'Cold leftover rice is essential — fresh warm rice turns mushy when fried' },

  // ── SNACK extra 20 (191–210) ────────────────────────────────────────────────
  { id:193, type:'snack', name:'Aged cheese & grain crackers',        protein:'14g', kcal:'280 kcal', time:'2 min',  ingredients:'40g aged cheddar or gouda + 6 whole grain crackers + optional pickles or grapes',                    prep:'Slice cheese, arrange on crackers with your choice of accompaniment.',                                                 tip:'Aged cheese has more protein per gram than young or fresh cheese varieties' },
  { id:205, type:'snack', name:'Mozzarella & tomato skewers',         protein:'10g', kcal:'180 kcal', time:'4 min',  ingredients:'100g fresh mozzarella + 10 cherry tomatoes + basil leaves + olive oil + salt + balsamic',           prep:'Thread mozzarella, tomato and basil alternately on small skewers. Drizzle oil and balsamic.',                          tip:'Mini caprese on a stick — easiest impressive snack you can serve to anyone' },
  { id:206, type:'snack', name:'Tuna on crackers',                    protein:'22g', kcal:'220 kcal', time:'3 min',  ingredients:'1 tin tuna + 6 whole grain crackers + 1 tsp mustard + lemon + pepper',                              prep:'Mix tuna with mustard and lemon. Spoon onto crackers.',                                                                tip:'22g protein for under 220 calories — one of the best protein-to-calorie ratios' },
  { id:207, type:'snack', name:'Banana & tahini drizzle',             protein:'8g',  kcal:'290 kcal', time:'2 min',  ingredients:'1 banana + 1 tbsp tahini + pinch sesame seeds',                                                    prep:'Slice banana, drizzle tahini over, sprinkle sesame seeds.',                                                            tip:'Tahini adds calcium and tryptophan — better sleep aid than plain peanut butter' },
  { id:208, type:'snack', name:'Smoked salmon roll-ups',              protein:'18g', kcal:'160 kcal', time:'3 min',  ingredients:'80g smoked salmon + 2 tbsp cream cheese + cucumber strips + lemon + dill',                         prep:'Spread cream cheese on salmon slices. Place cucumber strip at edge. Roll tight.',                                      tip:'Highest protein-to-calorie ratio snack on the list at 18g for only 160 kcal' },
  { id:209, type:'snack', name:'Cottage cheese & pineapple',          protein:'18g', kcal:'220 kcal', time:'2 min',  ingredients:'200g cottage cheese + 100g pineapple chunks + 1 tsp honey',                                        prep:'Spoon cottage cheese into bowl. Top with pineapple and honey.',                                                        tip:'Pineapple bromelain helps digest the protein from cottage cheese — clever combo' },
  { id:210, type:'snack', name:'Boiled egg & sriracha',               protein:'12g', kcal:'200 kcal', time:'10 min', ingredients:'2 boiled eggs + sriracha sauce + pinch salt + optional sesame seeds',                              prep:'Boil eggs 8 min. Halve them. Add a few drops of sriracha on each yolk.',                                               tip:'Spice increases metabolism temporarily — good pre-workout snack variation' },

  // ── SMOOTHIE extra 20 (211–230) ─────────────────────────────────────────────
  { id:214, type:'smoothie', name:'Peach & oat smoothie',              protein:'14g', kcal:'350 kcal', time:'3 min', ingredients:'200g frozen peaches + 200g plain yogurt + 40g oats + 200ml milk + 1 tsp honey + pinch vanilla',    prep:'Blend all until creamy.',                                                                                             tip:'Frozen peaches give a sorbet-like texture far better than fresh for smoothies' },
  { id:225, type:'smoothie', name:'Matcha banana latte shake',         protein:'8g',  kcal:'280 kcal', time:'3 min', ingredients:'1 tsp matcha powder + 2 bananas + 300ml milk + 1 tbsp honey + pinch vanilla',                     prep:'Dissolve matcha in a splash of hot water first. Add remaining ingredients, blend cold.',                               tip:'Matcha provides sustained caffeine without the espresso jitter spike' },
  { id:226, type:'smoothie', name:'Raspberry & oat shake',             protein:'14g', kcal:'340 kcal', time:'3 min', ingredients:'150g frozen raspberries + 200g plain yogurt + 40g oats + 200ml milk + 1 tsp honey',               prep:'Blend all until smooth.',                                                                                             tip:'Raspberries have the highest fiber content of any common berry' },
  { id:227, type:'smoothie', name:'Avocado & cocoa smoothie',          protein:'10g', kcal:'400 kcal', time:'3 min', ingredients:'1 ripe avocado + 1 tbsp cocoa powder + 400ml milk + 1 banana + 1 tsp honey',                     prep:'Blend all until completely smooth and creamy.',                                                                      tip:'Avocado fat carries the cocoa flavor beautifully — richer than any chocolate milk' },
  { id:228, type:'smoothie', name:'Chocolate peanut mass shake',       protein:'26g', kcal:'580 kcal', time:'3 min', ingredients:'2 bananas + 3 tbsp peanut butter + 1 tbsp cocoa + 400ml whole milk + 50g oats + 1 tsp honey',    prep:'Blend all until smooth. Drink immediately.',                                                                         tip:'Best calorie-surplus shake — 580 kcal and 26g protein with zero supplements' },
  { id:229, type:'smoothie', name:'Banana & spirulina power blend',    protein:'14g', kcal:'330 kcal', time:'3 min', ingredients:'2 bananas + 1 tsp spirulina + 300ml milk + 40g oats + 1 tbsp honey',                            prep:'Blend all. Spirulina turns it vivid green — normal and harmless.',                                                    tip:'Spirulina has the highest protein density of any plant food by weight' },
  { id:230, type:'smoothie', name:'Strawberry & chia smoothie',        protein:'10g', kcal:'280 kcal', time:'3 min', ingredients:'150g frozen strawberries + 200g plain yogurt + 2 tbsp chia seeds + 200ml milk + 1 tsp honey',    prep:'Blend all. Let stand 2 min so chia starts to thicken slightly.',                                                     tip:'Chia adds omega-3 and fiber — turns an ordinary smoothie into a functional meal' },

]


const MEAL_FILTERS = ['ALL', 'breakfast', 'main', 'snack', 'smoothie']
const RECIPE_CATS = ['ALL', 'breakfast', 'lunch', 'dinner', 'snack']
const catColor: Record<string, string> = { breakfast: '#d97706', lunch: '#2d6a4f', dinner: '#6b4226', snack: '#40916c' }
const empty = { title: '', description: '', ingredients: '', instructions: '', prepTime: '', cookTime: '', servings: '', category: 'lunch' }

export default function FoodPage() {
  const { t } = useLang()
  const TYPE_META: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
    breakfast: { label: t.typeBreakfast, emoji: '☀️', color: '#d97706', bg: '#fef3c7' },
    main:      { label: t.typeMain,      emoji: '🍽️', color: '#2d6a4f', bg: '#d8f3dc' },
    snack:     { label: t.typeSnack,     emoji: '🍎', color: '#6b4226', bg: '#f0e8d8' },
    smoothie:  { label: t.typeSmoothie,  emoji: '🥤', color: '#40916c', bg: '#d8f3dc' },
  }

  const [tab, setTab] = useState<'rotation' | 'recipes' | 'week' | 'videos' | 'list'>('rotation')

  // ── Week schedule state ──────────────────────────────────────────────────
  const [weekSchedule, setWeekSchedule] = useState<WeekSchedule>(emptySchedule)
  const [picker, setPicker] = useState<{ day: string; slot: SlotKey } | null>(null)
  const [pickerTab, setPickerTab] = useState<'rotation' | 'recipes' | 'custom'>('rotation')
  const [pickerSearch, setPickerSearch] = useState('')
  const [customMeal, setCustomMeal] = useState('')
  const [shoppingList, setShoppingList] = useState<string[]>([])
  const [shoppingModal, setShoppingModal] = useState(false)
  const [shoppingChecked, setShoppingChecked] = useState<Set<number>>(new Set())
  const [shoppingCopied, setShoppingCopied] = useState(false)

  // ── Buy list (persistent tab) ─────────────────────────────────────────────
  const [buyItems, setBuyItems] = useState<{ text: string; checked: boolean }[]>([])
  const [buyInput, setBuyInput] = useState('')
  const [buyAdding, setBuyAdding] = useState(false)
  const [buyConfirmIdx, setBuyConfirmIdx] = useState<number | null>(null)
  const [buyCopied, setBuyCopied] = useState(false)
  const buyInputRef = useRef<HTMLInputElement>(null)
  const [syncingCloud, setSyncingCloud] = useState(false)
  const [syncDone, setSyncDone] = useState(false)

  const forceSyncToCloud = async () => {
    setSyncingCloud(true)
    try {
      // Push week schedule
      await fetch('/api/week-schedule', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: JSON.stringify(weekSchedule) }) })
      // Push buy list
      await fetch('/api/buy-list', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: JSON.stringify(buyItems) }) })
      // Push preferences
      await fetch('/api/preferences', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'hiddenMeals', value: JSON.stringify([...hiddenMeals]) }) })
      await fetch('/api/preferences', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'favoriteMeals', value: JSON.stringify([...favoriteMeals]) }) })
      await fetch('/api/preferences', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'weekPlan', value: JSON.stringify([...weekPlan]) }) })
      await fetch('/api/preferences', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'hiddenEditBadges', value: JSON.stringify([...hiddenEditBadges]) }) })
      setSyncDone(true)
      setTimeout(() => setSyncDone(false), 3000)
    } catch {}
    setSyncingCloud(false)
  }
  const saveBuy = (items: { text: string; checked: boolean }[]) => {
    setBuyItems(items)
    fetch('/api/buy-list', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: JSON.stringify(items) }) }).catch(() => {})
  }
  const addBuyItem = () => {
    const v = buyInput.trim()
    if (!v) return
    saveBuy([...buyItems, { text: v, checked: false }])
    setBuyInput('')
    setBuyAdding(false)
  }
  const toggleBuyItem = (i: number) => {
    const next = buyItems.map((it, idx) => idx === i ? { ...it, checked: !it.checked } : it)
    saveBuy(next)
  }
  const deleteBuyItem = (i: number) => { saveBuy(buyItems.filter((_, idx) => idx !== i)); setBuyConfirmIdx(null) }
  const clearCheckedBuy = () => saveBuy(buyItems.filter(it => !it.checked))

  // ── Food videos state ────────────────────────────────────────────────────────
  type FoodVideoEntry = { id: number | string; name: string; url: string; types: string[] }
  const [foodVideos, setFoodVideos] = useState<FoodVideoEntry[]>([])
  const [addingFV, setAddingFV] = useState(false)
  const [fvForm, setFvForm] = useState({ name: '', url: '', types: [] as string[] })
  const [fvUrlStatus, setFvUrlStatus] = useState<'idle' | 'ok' | 'bad'>('idle')

  const [mealFilter, setMealFilter] = useState('ALL')
  const [mealSearch, setMealSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [mealDetail, setMealDetail] = useState<Meal | null>(null)
  const [mealEditForm, setMealEditForm] = useState<Meal | null>(null)
  const [mealOverrides, setMealOverrides] = useState<Record<number, Partial<Meal>>>({})
  const [hiddenEditBadges, setHiddenEditBadges] = useState<Set<number>>(new Set())
  const [selecting, setSelecting] = useState(false)
  const [selectedMeals, setSelectedMeals] = useState<Set<number>>(new Set())
  const [groceryModal, setGroceryModal] = useState(false)
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())
  const [hiddenMeals, setHiddenMeals] = useState<Set<number>>(new Set())
  const [favoriteMeals, setFavoriteMeals] = useState<Set<number>>(new Set())
  const [weekPlan, setWeekPlan] = useState<Set<number>>(new Set())
  const [weekGroceryModal, setWeekGroceryModal] = useState(false)
  const [weekCellDetail, setWeekCellDetail] = useState<{ id: string; name: string } | null>(null)
  const [weekChecked, setWeekChecked] = useState<Set<number>>(new Set())

  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [recipeFilter, setRecipeFilter] = useState('ALL')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState<number | null>(null)
  const [inlineForm, setInlineForm] = useState(empty)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiIngredients, setAiIngredients] = useState('')
  const [saving, setSaving] = useState(false)
  const [inlineSaving, setInlineSaving] = useState(false)

  const load = () => fetch('/api/food').then(r => r.json()).then(setRecipes)
  useEffect(() => {
    load()
    fetch('/api/meal-overrides')
      .then(r => r.json())
      .then((data: Record<string, { name?: string; type?: string; protein?: string; kcal?: string; time?: string; ingredients?: string; prep?: string; tip?: string }>) => {
        const parsed: Record<number, Partial<Meal>> = {}
        Object.entries(data).forEach(([key, val]) => { parsed[Number(key)] = val })
        setMealOverrides(parsed)
      })
      .catch(() => {})
    // ── Load prefs from DB, migrate from localStorage if DB is empty ──
    fetch('/api/preferences?keys=hiddenMeals,favoriteMeals,weekPlan,hiddenEditBadges')
      .then(r => r.json())
      .then((prefs: Record<string, string>) => {
        const migrate = (key: string, lsKey: string, setter: (s: Set<number>) => void) => {
          const dbVal = JSON.parse(prefs[key] || '[]') as number[]
          if (dbVal.length === 0) {
            // DB empty — try migrate from localStorage
            try {
              const lsRaw = localStorage.getItem(lsKey)
              if (lsRaw) {
                const lsVal = JSON.parse(lsRaw) as number[]
                if (lsVal.length > 0) {
                  setter(new Set(lsVal))
                  fetch('/api/preferences', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(lsVal) }) }).catch(() => {})
                  return
                }
              }
            } catch {}
          }
          setter(new Set(dbVal))
        }
        migrate('hiddenMeals',     'hiddenMeals',     setHiddenMeals)
        migrate('favoriteMeals',   'favoriteMeals',   setFavoriteMeals)
        migrate('weekPlan',        'weekPlan',        setWeekPlan)
        migrate('hiddenEditBadges','hiddenEditBadges', setHiddenEditBadges)
      }).catch(() => {})

    // ── Load week schedule from DB, migrate from localStorage if DB is empty ──
    fetch('/api/week-schedule').then(r => r.json()).then(({ data }) => {
      try {
        const parsed = JSON.parse(data)
        const isEmpty = !parsed || Object.keys(parsed).length === 0
        if (isEmpty) {
          const lsRaw = localStorage.getItem('week-schedule-v2')
          if (lsRaw) {
            const lsParsed = JSON.parse(lsRaw)
            setWeekSchedule(lsParsed)
            fetch('/api/week-schedule', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: lsRaw }) }).catch(() => {})
            return
          }
        }
        if (parsed && typeof parsed === 'object') setWeekSchedule(parsed)
      } catch {}
    }).catch(() => {})

    // ── Load buy list from DB, migrate from localStorage if DB is empty ──
    fetch('/api/buy-list').then(r => r.json()).then(({ items }) => {
      try {
        const parsed = JSON.parse(items)
        if (!Array.isArray(parsed) || parsed.length === 0) {
          const lsRaw = localStorage.getItem('food-buy-list')
          if (lsRaw) {
            const lsParsed = JSON.parse(lsRaw)
            if (Array.isArray(lsParsed) && lsParsed.length > 0) {
              setBuyItems(lsParsed)
              fetch('/api/buy-list', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: lsRaw }) }).catch(() => {})
              return
            }
          }
        }
        if (Array.isArray(parsed)) setBuyItems(parsed)
      } catch {}
    }).catch(() => {})
    fetch('/api/food-videos').then(r => r.json()).then(setFoodVideos).catch(() => {})
  }, [])

  const savePref = (key: string, value: unknown[]) =>
    fetch('/api/preferences', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(value) }) }).catch(() => {})

  const getMeal = (m: Meal): Meal => ({ ...m, ...mealOverrides[m.id] })

  const openMealEdit = (m: Meal) => {
    const meal = getMeal(m)
    setMealEditForm({ ...meal, ingredients: splitIngredients(meal.ingredients).join('\n') })
  }

  const saveMealEdit = async () => {
    if (!mealEditForm) return
    const { id } = mealEditForm
    await fetch('/api/meal-overrides', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mealId: id, ...mealEditForm }),
    })
    const nextOverrides = { ...mealOverrides, [id]: mealEditForm }
    setMealOverrides(nextOverrides)
    const nextBadges = new Set(hiddenEditBadges)
    nextBadges.delete(id)
    setHiddenEditBadges(nextBadges)
    savePref('hiddenEditBadges', [...nextBadges])
    setMealEditForm(null)
  }

  const visibleMeals = useMemo(() => MEALS.filter(m => !hiddenMeals.has(m.id)).map(getMeal), [hiddenMeals, mealOverrides])

  const filteredMeals = useMemo(() => {
    let base = mealFilter === 'favs' ? visibleMeals.filter(m => favoriteMeals.has(m.id))
      : mealFilter === 'ALL' ? visibleMeals
      : visibleMeals.filter(m => m.type === mealFilter)
    if (mealSearch.trim()) {
      const q = mealSearch.toLowerCase()
      base = base.filter(m => m.name.toLowerCase().includes(q) || m.ingredients.toLowerCase().includes(q))
    }
    return base
  }, [mealFilter, visibleMeals, favoriteMeals, mealSearch])
  const filteredRecipes = recipeFilter === 'ALL' ? recipes : recipes.filter(r => r.category === recipeFilter)

  const openAdd = () => { setForm(empty); setEditing(null); setModal(true) }
  const openEdit = (r: Recipe) => {
    setForm({ title: r.title, description: r.description, ingredients: JSON.parse(r.ingredients).join('\n'), instructions: r.instructions, prepTime: String(r.prepTime), cookTime: String(r.cookTime), servings: String(r.servings), category: r.category })
    setEditing(r.id); setModal(true)
  }
  const save = async () => {
    setSaving(true)
    const payload = { ...form, ingredients: form.ingredients.split('\n').filter(Boolean) }
    await fetch(editing ? `/api/food/${editing}` : '/api/food', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    await load(); setModal(false); setSaving(false)
  }
  const saveInline = async () => {
    if (!inlineForm.title.trim()) return
    setInlineSaving(true)
    const payload = { ...inlineForm, ingredients: inlineForm.ingredients.split('\n').filter(Boolean) }
    await fetch('/api/food', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    await load()
    setInlineForm(empty)
    setInlineSaving(false)
  }

  const del = async (id: number) => {
    if (!confirm(t.deleteRecipe)) return
    await fetch(`/api/food/${id}`, { method: 'DELETE' }); await load()
  }
  const generateAI = async () => {
    if (!aiIngredients.trim()) return
    setAiLoading(true)
    try {
      const r = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'recipe', data: { ingredients: aiIngredients } }) })
      const data = await r.json()
      setInlineForm({ title: data.title || '', description: data.description || '', ingredients: (data.ingredients || []).join('\n'), instructions: data.instructions || '', prepTime: String(data.prepTime || ''), cookTime: String(data.cookTime || ''), servings: String(data.servings || ''), category: data.category || 'lunch' })
    } catch { alert(t.aiFailed) }
    setAiLoading(false)
  }

  const deleteMeal = (id: number) => {
    const next = new Set(hiddenMeals); next.add(id)
    setHiddenMeals(next); savePref('hiddenMeals', [...next])
    setMealDetail(null)
  }

  const toggleFav = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const next = new Set(favoriteMeals)
    if (next.has(id)) next.delete(id); else next.add(id)
    setFavoriteMeals(next); savePref('favoriteMeals', [...next])
  }

  const mealCountByType = (type: string) => visibleMeals.filter(m => m.type === type).length

  const toggleMealSelect = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedMeals(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const splitIngredients = (str: string) =>
    str.split(/\n|\s\+\s/).map(i => i.trim()).filter(Boolean)

  const UNITS_RX = /^(ml|cl|l|g|kg|tbsp|tsp|cups?|pieces?|slices?|handful|handfuls|pinch|cloves?|cans?|sticks?|oz|lbs?|bunch|tranches?)\b\s*/i

  const parseIngredient = (raw: string) => {
    const s = raw.trim()
    // leading number: int, decimal, or fraction (e.g. 1/2)
    const numM = s.match(/^(\d+(?:[.,]\d+)?|\d+\/\d+)\s*/)
    let qty: number | null = null
    let after = s
    if (numM) {
      const n = numM[1]
      qty = n.includes('/') ? Number(n.split('/')[0]) / Number(n.split('/')[1]) : parseFloat(n.replace(',', '.'))
      after = s.slice(numM[0].length)
    }
    const unitM = after.match(UNITS_RX)
    let unit = ''
    if (unitM) { unit = unitM[1].toLowerCase().replace(/s$/, ''); after = after.slice(unitM[0].length) }
    return { qty, unit, baseName: after.toLowerCase().trim() }
  }

  const groupIngredients = (raw: string[]): { name: string; count: number }[] => {
    const map = new Map<string, { qty: number | null; unit: string; baseName: string; count: number }>()
    raw.forEach(r => {
      const { qty, unit, baseName } = parseIngredient(r)
      const key = `${baseName}__${unit}`
      const ex = map.get(key)
      if (ex) {
        if (qty !== null && ex.qty !== null) ex.qty += qty
        else ex.count++
      } else {
        map.set(key, { qty, unit, baseName, count: 1 })
      }
    })
    return Array.from(map.values())
      .sort((a, b) => a.baseName.localeCompare(b.baseName))
      .map(({ qty, unit, baseName, count }) => {
        if (qty !== null) {
          const qStr = Number.isInteger(qty) ? String(qty) : qty.toFixed(1)
          return { name: `${qStr}${unit ? ' ' + unit : ''} ${baseName}`.trim(), count: 1 }
        }
        return { name: baseName, count }
      })
  }

  const groceryItems = useMemo(() => {
    const raw: string[] = []
    MEALS.filter(m => selectedMeals.has(m.id)).forEach(m => {
      splitIngredients(getMeal(m).ingredients).forEach(i => raw.push(i))
    })
    return groupIngredients(raw)
  }, [selectedMeals, mealOverrides])

  const openGrocery = () => { setCheckedItems(new Set()); setGroceryModal(true) }
  const toggleCheck = (i: number) => setCheckedItems(prev => {
    const next = new Set(prev); if (next.has(i)) next.delete(i); else next.add(i); return next
  })
  const exitSelect = () => { setSelecting(false); setSelectedMeals(new Set()) }

  const saveToWeek = () => {
    const next = new Set([...weekPlan, ...selectedMeals])
    setWeekPlan(next)
    savePref('weekPlan', [...next])
    exitSelect()
  }
  const removeFromWeek = (id: number) => {
    const next = new Set(weekPlan); next.delete(id)
    setWeekPlan(next)
    savePref('weekPlan', [...next])
  }
  // ── Week schedule helpers ────────────────────────────────────────────────
  const saveWeekSchedule = (next: WeekSchedule) => {
    setWeekSchedule(next)
    fetch('/api/week-schedule', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: JSON.stringify(next) }) }).catch(() => {})
  }
  const setCell = (day: string, slot: SlotKey, entry: ScheduleEntry) => {
    const next = { ...weekSchedule, [day]: { ...weekSchedule[day], [slot]: entry } }
    saveWeekSchedule(next)
    setPicker(null); setPickerSearch(''); setCustomMeal('')
  }
  const clearCell = (day: string, slot: SlotKey) => setCell(day, slot, null)
  const openPicker = (day: string, slot: SlotKey) => {
    setPicker({ day, slot }); setPickerTab('rotation'); setPickerSearch(''); setCustomMeal('')
  }

  const clearWeekPlan = () => {
    setWeekPlan(new Set())
    savePref('weekPlan', [])
  }

  const weekMeals = useMemo(() => MEALS.filter(m => weekPlan.has(m.id)).map(getMeal), [weekPlan, mealOverrides])
  const weekGroceryItems = useMemo(() => {
    const raw: string[] = []
    weekMeals.forEach(m => splitIngredients(m.ingredients).forEach(i => raw.push(i)))
    return groupIngredients(raw)
  }, [weekMeals])

  return (
    <div>
      {/* ── Hero last activity ── */}
      {recipes.length > 0 && (
        <div className="rounded-2xl p-5 mb-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--t-hero-from) 0%, var(--t-hero-mid) 55%, var(--t-hero-to) 100%)' }}>
          <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }} />
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'var(--t-hero-text)' }}>
            🥗 Dernière recette
          </span>
          <p className="text-white font-bold text-lg leading-snug mb-1">{recipes[0].title}</p>
          <p className="text-sm" style={{ color: 'var(--t-hero-text)' }}>{recipes[0].category} · {recipes[0].prepTime + recipes[0].cookTime} min · {recipes[0].servings} pers.</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--t-text-main)' }}>🥗 {t.foodPlan}</h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--t-text-muted)' }}>
            {tab === 'rotation' ? t.mealsSubtitle(MEALS.length + recipes.length) : tab === 'week' ? t.weekSubtitle(weekPlan.size) : tab === 'recipes' ? 'Ajouter une recette à la rotation' : tab === 'list' ? `${buyItems.length} articles · ${buyItems.filter(i => i.checked).length} cochés` : t.recipesSubtitle(recipes.length)}
          </p>
        </div>
      </div>

      {/* Main tabs + search */}
      <div className="flex items-center gap-2 mb-5">
        {/* Scrollable tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 flex-1" style={{ scrollbarWidth: 'none' }}>
          {[{ key: 'rotation', label: t.mealRotation }, { key: 'week', label: t.weekTab }, { key: 'recipes', label: t.myRecipes }, { key: 'videos', label: '🎬 Vidéos' }, { key: 'list', label: '🛒 Liste' }].map(tb => (
            <button key={tb.key} onClick={() => setTab(tb.key as 'rotation' | 'recipes' | 'week' | 'videos' | 'list')}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all relative whitespace-nowrap"
              style={{ backgroundColor: tab === tb.key ? '#2d6a4f' : 'var(--t-item-bg)', color: tab === tb.key ? '#fff' : 'var(--t-text-muted)' }}>
              {tb.label}
              {tb.key === 'week' && weekPlan.size > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full font-bold ml-1 align-middle"
                  style={{ backgroundColor: '#c0303e', color: '#fff', fontSize: '9px' }}>{weekPlan.size}</span>
              )}
              {tb.key === 'list' && buyItems.filter(i => !i.checked).length > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full font-bold ml-1 align-middle"
                  style={{ backgroundColor: '#c0303e', color: '#fff', fontSize: '9px' }}>{buyItems.filter(i => !i.checked).length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Search bar — expands on click, only filters rotation */}
        <div className="shrink-0 flex items-center transition-all duration-200"
          style={{ width: searchOpen ? 160 : 'auto' }}>
          {searchOpen ? (
            <div className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 w-full"
              style={{ backgroundColor: 'var(--t-item-bg)', border: '1.5px solid var(--t-border-soft)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--t-text-muted)" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                ref={searchInputRef}
                value={mealSearch}
                onChange={e => setMealSearch(e.target.value)}
                placeholder="Rechercher…"
                className="flex-1 bg-transparent text-xs outline-none min-w-0"
                style={{ color: 'var(--t-text-main)' }}
                onBlur={() => { if (!mealSearch) { setSearchOpen(false) } }}
              />
              {mealSearch && (
                <button onClick={() => { setMealSearch(''); searchInputRef.current?.focus() }}
                  className="text-xs leading-none" style={{ color: 'var(--t-text-muted)' }}>✕</button>
              )}
            </div>
          ) : (
            <button
              onClick={() => { setSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 50) }}
              className="h-9 px-3 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 whitespace-nowrap text-sm font-medium"
              style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)', border: '1px solid var(--t-border-soft)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <span>Chercher</span>
            </button>
          )}
        </div>
      </div>

      {/* ── MEAL ROTATION ── */}
      {tab === 'rotation' && (
        <>
          {/* Category filter + select button */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex gap-2 overflow-x-auto pb-1 flex-1" style={{ scrollbarWidth: 'none' }}>
              {MEAL_FILTERS.map(f => {
                const meta = TYPE_META[f]
                const active = mealFilter === f
                const count = f === 'ALL' ? visibleMeals.length : mealCountByType(f)
                return (
                  <button key={f} onClick={() => setMealFilter(f)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all"
                    style={{ backgroundColor: active ? (meta?.color ?? '#1a3a1a') : 'var(--t-item-bg)', color: active ? '#fff' : 'var(--t-text-muted)' }}>
                    {meta ? `${meta.emoji} ${meta.label}` : 'ALL'}
                    <span className="text-xs opacity-75">({count})</span>
                  </button>
                )
              })}
              {/* Favorites filter */}
              <button onClick={() => setMealFilter(mealFilter === 'favs' ? 'ALL' : 'favs')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all"
                style={{ backgroundColor: mealFilter === 'favs' ? '#c0303e' : '#fde8ec', color: mealFilter === 'favs' ? '#fff' : '#c0303e' }}>
                ❤️ Favs
                <span className="text-xs opacity-75">({favoriteMeals.size})</span>
              </button>
            </div>
            {Object.keys(mealOverrides).some(id => !hiddenEditBadges.has(Number(id))) && (
              <button
                onClick={() => {
                  const allEdited = new Set(Object.keys(mealOverrides).map(Number))
                  setHiddenEditBadges(allEdited)
                  savePref('hiddenEditBadges', [...allEdited])
                }}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border"
                style={{ backgroundColor: 'var(--t-card-bg)', color: 'var(--t-text-muted)', borderColor: 'var(--t-border-soft)' }}
                title="Réinitialiser les modifications">
                🔄 Reset
              </button>
            )}
            <button
              onClick={() => selecting ? exitSelect() : setSelecting(true)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border"
              style={selecting
                ? { backgroundColor: '#2d6a4f', color: '#fff', borderColor: '#2d6a4f' }
                : { backgroundColor: 'var(--t-card-bg)', color: '#2d6a4f', borderColor: '#2d6a4f' }}>
              🛒 {selecting ? t.selectCancel : t.selectLabel}
            </button>
          </div>

          {/* Meal cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredMeals.map(m => {
              const meta = TYPE_META[m.type]
              const isSelected = selectedMeals.has(m.id)
              const isEdited = !!mealOverrides[m.id] && !hiddenEditBadges.has(m.id)
              return (
                <div key={m.id}
                  className="rounded-2xl border-2 p-4 shadow-sm cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-95 relative"
                  style={{
                    backgroundColor: isSelected ? 'var(--t-item-bg)' : 'var(--t-card-bg)',
                    borderColor: isSelected ? '#2d6a4f' : 'var(--t-border-soft)',
                    boxShadow: isSelected ? '0 0 0 1px #2d6a4f' : undefined,
                  }}
                  onClick={e => selecting ? toggleMealSelect(m.id, e) : openMealEdit(m)}>
                  <div className="absolute top-3 right-3">
                    {selecting ? (
                      <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                        style={{ backgroundColor: isSelected ? '#2d6a4f' : 'var(--t-card-bg)', borderColor: isSelected ? '#2d6a4f' : '#c4a882' }}>
                        {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                      </div>
                    ) : (
                      <button onClick={e => toggleFav(m.id, e)}
                        className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                        style={{ backgroundColor: favoriteMeals.has(m.id) ? '#fde8ec' : 'var(--t-item-bg)' }}>
                        <span style={{ fontSize: 14 }}>{favoriteMeals.has(m.id) ? '❤️' : '🤍'}</span>
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: meta.bg, color: meta.color }}>
                      {meta.emoji} {meta.label}
                    </span>
                    {isEdited && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}>
                        ✏️ edited
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base leading-snug mb-3 pr-6" style={{ color: 'var(--t-text-main)' }}>
                    {m.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: '#e8f4fd', color: '#1a56db' }}>
                      💪 {m.protein}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: '#d8f3dc', color: '#2d6a4f' }}>
                      🔥 {m.kcal}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: '#fff3cd', color: '#856404' }}>
                      ⏱ {m.time}
                    </span>
                  </div>
                </div>
              )
            })}

            {/* ── User recipes in rotation ── */}
            {(mealFilter === 'ALL'
              ? recipes
              : recipes.filter(r => {
                  if (mealFilter === 'main') return ['lunch','dinner'].includes(r.category)
                  if (mealFilter === 'favs') return false
                  return r.category === mealFilter
                })
            ).map(r => {
              const rMeta = TYPE_META[r.category] ?? TYPE_META[['lunch','dinner'].includes(r.category) ? 'main' : 'snack']
              return (
              <div key={`recipe-${r.id}`}
                className="rounded-2xl border-2 p-4 shadow-sm cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-95 relative"
                style={{ backgroundColor: 'var(--t-card-bg)', borderColor: 'var(--t-border-soft)' }}
                onClick={() => openEdit(r)}>
                <div className="absolute top-3 right-3 flex gap-1">
                  <button onClick={e => { e.stopPropagation(); del(r.id) }}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#fde8ec', fontSize: 12, color: '#c0303e' }}>✕</button>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: rMeta.bg, color: rMeta.color }}>
                    {rMeta.emoji} {rMeta.label}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>
                    👤 custom
                  </span>
                </div>
                <h3 className="font-semibold text-sm sm:text-base leading-snug mb-3 pr-8" style={{ color: 'var(--t-text-main)' }}>
                  {r.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>
                    ⏱ {r.prepTime + r.cookTime} min
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>
                    👤 {r.servings} pers
                  </span>
                </div>
                <p className="text-xs mt-2 line-clamp-2" style={{ color: 'var(--t-text-soft)' }}>{r.description}</p>
              </div>
            )})}

          </div>
        </>
      )}

      {/* ── ADD RECIPE (→ Meal Rotation) ── */}
      {tab === 'recipes' && (
        <div className="space-y-4">
          {/* Inline add form */}
          <div className="rounded-2xl border-2 p-5 space-y-3" style={{ backgroundColor: 'var(--t-card-bg)', borderColor: 'var(--t-border-soft)' }}>
            <p className="text-sm font-bold" style={{ color: 'var(--t-text-main)' }}>➕ Nouvelle recette</p>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.title} *</label>
              <input value={inlineForm.title} onChange={e => setInlineForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Ex: Poulet mariné citron..."
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.description}</label>
              <textarea value={inlineForm.description} onChange={e => setInlineForm(f => ({ ...f, description: e.target.value }))}
                rows={2} placeholder="Courte description..."
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: 'var(--t-border-soft)' }} />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.ingredientsLine}</label>
              <textarea value={inlineForm.ingredients} onChange={e => setInlineForm(f => ({ ...f, ingredients: e.target.value }))}
                rows={4} placeholder={"1 poulet\n2 citrons\nHuile d'olive\n..."}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: 'var(--t-border-soft)' }} />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.instructions}</label>
              <textarea value={inlineForm.instructions} onChange={e => setInlineForm(f => ({ ...f, instructions: e.target.value }))}
                rows={4} placeholder="Étapes de préparation..."
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: 'var(--t-border-soft)' }} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: t.prepMin,  key: 'prepTime' },
                { label: t.cookMin,  key: 'cookTime' },
                { label: t.servings, key: 'servings' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{label}</label>
                  <input type="number" value={(inlineForm as Record<string, string>)[key]}
                    onChange={e => setInlineForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.category}</label>
                <select value={inlineForm.category} onChange={e => setInlineForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }}>
                  {['breakfast', 'lunch', 'dinner', 'snack'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <button onClick={saveInline} disabled={inlineSaving || !inlineForm.title.trim()}
              className="w-full py-3 rounded-2xl text-sm font-bold disabled:opacity-50 transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg,#2d6a4f,#40916c)', color: '#fff' }}>
              {inlineSaving ? 'Ajout en cours...' : '✓ Ajouter à la rotation'}
            </button>
          </div>
        </div>
      )}

      {/* ── WEEK SCHEDULE ── */}
      {tab === 'week' && (
        <div>
          {/* Action buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => {
                // Build ingredient list from all filled cells
                const ingredients: string[] = []
                DAYS.forEach(day => {
                  SLOTS.forEach(slot => {
                    const entry = weekSchedule[day]?.[slot.key]
                    if (!entry) return
                    if (entry.id.startsWith('m')) {
                      const baseMeal = MEALS.find(m => `m${m.id}` === entry.id)
                      if (baseMeal) splitIngredients(getMeal(baseMeal).ingredients).forEach(i => ingredients.push(i))
                    } else if (entry.id.startsWith('r')) {
                      const recipe = recipes.find(r => `r${r.id}` === entry.id)
                      if (recipe) recipe.ingredients.split(',').forEach(i => ingredients.push(i.trim()))
                    } else {
                      ingredients.push(entry.name)
                    }
                  })
                })
                // Dedupe and show in existing grocery modal pattern via alert for now
                const grouped = groupIngredients(ingredients.filter(Boolean))
                setShoppingList(grouped.map(g => g.count > 1 ? `${g.name} ×${g.count}` : g.name))
                setShoppingModal(true)
              }}
              className="flex-1 py-2.5 rounded-2xl text-sm font-bold transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg,var(--t-fab-from),var(--t-fab-to))', color: '#fff' }}
            >
              🛒 Liste de courses
            </button>
            <button
              onClick={() => {
                const next = emptySchedule()
                saveWeekSchedule(next)
              }}
              className="px-4 py-2.5 rounded-2xl text-sm font-bold transition-all active:scale-95"
              style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
            >
              🗑 Vider
            </button>
            <button
              onClick={forceSyncToCloud}
              disabled={syncingCloud}
              className="px-4 py-2.5 rounded-2xl text-sm font-bold transition-all active:scale-95"
              style={{ backgroundColor: syncDone ? '#d8f3dc' : 'var(--t-item-bg)', color: syncDone ? '#2d6a4f' : 'var(--t-text-muted)' }}
            >
              {syncingCloud ? '⏳' : syncDone ? '✓ Sync !' : '☁️ Sync'}
            </button>
          </div>

          {/* Scrollable grid */}
          <div className="overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
            <div style={{ minWidth: 560 }}>
              {/* Day headers */}
              <div className="grid mb-2" style={{ gridTemplateColumns: '72px repeat(7, 1fr)', gap: '6px' }}>
                <div />
                {DAYS.map(d => (
                  <div key={d} className="text-center text-xs font-bold py-1.5 rounded-xl"
                    style={{ backgroundColor: 'var(--t-bg-soft)', color: 'var(--t-text-accent)' }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Slot rows */}
              {SLOTS.map(slot => (
                <div key={slot.key} className="grid mb-2" style={{ gridTemplateColumns: '72px repeat(7, 1fr)', gap: '6px' }}>
                  {/* Row label */}
                  <div className="flex flex-col items-center justify-center py-2 rounded-xl text-center"
                    style={{ backgroundColor: 'var(--t-item-bg)' }}>
                    <span className="text-lg leading-none">{slot.emoji}</span>
                    <span className="text-xs font-semibold mt-0.5" style={{ color: 'var(--t-text-muted)', fontSize: '9px' }}>{slot.label}</span>
                  </div>

                  {/* Day cells */}
                  {DAYS.map(day => {
                    const entry = weekSchedule[day]?.[slot.key] ?? null
                    return (
                      <div key={day} className="rounded-xl overflow-hidden"
                        style={{ minHeight: 64, backgroundColor: entry ? 'var(--t-bg-soft)' : 'var(--t-item-bg)', border: '1px solid', borderColor: entry ? 'var(--t-border)' : 'var(--t-border-soft)' }}>
                        {entry ? (
                          <div className="p-1.5 h-full flex flex-col justify-between">
                            <button
                              onClick={() => setWeekCellDetail(entry)}
                              className="text-left w-full active:opacity-70 transition-opacity">
                              <p className="text-xs font-semibold leading-tight line-clamp-3"
                                style={{ color: 'var(--t-text-accent)', fontSize: '10px' }}>
                                {entry.name}
                              </p>
                            </button>
                            <button onClick={() => clearCell(day, slot.key)}
                              className="text-center w-full text-xs mt-1 opacity-40 hover:opacity-80"
                              style={{ fontSize: '10px', color: '#dc2626' }}>✕</button>
                          </div>
                        ) : (
                          <button onClick={() => openPicker(day, slot.key)}
                            className="w-full h-full flex items-center justify-center transition-all hover:opacity-70 active:scale-95"
                            style={{ minHeight: 64 }}>
                            <span className="text-xl font-light" style={{ color: 'var(--t-border-soft)' }}>+</span>
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Shopping List Modal ── */}
      {shoppingModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShoppingModal(false)}>
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl"
            style={{ backgroundColor: 'var(--t-card-bg)', maxHeight: '85vh' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b shrink-0" style={{ borderColor: 'var(--t-border-soft)' }}>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--t-text-main)' }}>🛒 Liste de courses</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--t-text-muted)' }}>
                  {shoppingList.length} ingrédients · {shoppingChecked.size} cochés
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShoppingChecked(new Set())}
                  className="text-xs px-3 py-1.5 rounded-xl font-semibold"
                  style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>
                  Reset
                </button>
                <button
                  onClick={() => {
                    const text = '🛒 Liste de courses\n\n' + shoppingList.map((item, i) => `${shoppingChecked.has(i) ? '✓' : '○'} ${item}`).join('\n')
                    navigator.clipboard.writeText(text).then(() => {
                      setShoppingCopied(true)
                      setTimeout(() => setShoppingCopied(false), 2000)
                    })
                  }}
                  className="text-xs px-3 py-1.5 rounded-xl font-semibold transition-all"
                  style={{ backgroundColor: shoppingCopied ? '#2d6a4f' : 'var(--t-item-bg)', color: shoppingCopied ? '#fff' : 'var(--t-text-muted)' }}>
                  {shoppingCopied ? '✓ Copié' : '📋 Copier'}
                </button>
                <button onClick={() => setShoppingModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                  style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>×</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2 min-h-0">
              {shoppingList.length === 0 ? (
                <p className="text-center py-12 text-sm" style={{ color: 'var(--t-text-soft)' }}>
                  Aucun repas planifié cette semaine
                </p>
              ) : shoppingList.map((item, i) => {
                const checked = shoppingChecked.has(i)
                return (
                  <button key={i}
                    onClick={() => {
                      const next = new Set(shoppingChecked)
                      checked ? next.delete(i) : next.add(i)
                      setShoppingChecked(next)
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all"
                    style={{ backgroundColor: checked ? 'var(--t-bg-soft)' : 'var(--t-item-bg)', border: '1px solid', borderColor: checked ? 'var(--t-border)' : 'var(--t-border-soft)' }}>
                    <div className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center"
                      style={{ borderColor: checked ? 'var(--t-primary)' : 'var(--t-border-soft)', backgroundColor: checked ? 'var(--t-primary)' : 'transparent' }}>
                      {checked && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="2,6 5,9 10,3"/></svg>}
                    </div>
                    <span className="text-sm flex-1" style={{ color: checked ? 'var(--t-text-soft)' : 'var(--t-text-main)', textDecoration: checked ? 'line-through' : 'none' }}>
                      {item}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Meal Picker Modal ── */}
      {picker && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setPicker(null)}>
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl"
            style={{ backgroundColor: 'var(--t-card-bg)', maxHeight: '85vh' }}
            onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b shrink-0" style={{ borderColor: 'var(--t-border-soft)' }}>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--t-primary)' }}>
                  {SLOTS.find(s => s.key === picker.slot)?.emoji} {SLOTS.find(s => s.key === picker.slot)?.label} — {picker.day}
                </p>
                <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--t-text-main)' }}>Choisir un repas</p>
              </div>
              <button onClick={() => setPicker(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>×</button>
            </div>

            {/* Search */}
            <div className="px-4 pt-3 pb-2 shrink-0">
              <input value={pickerSearch} onChange={e => setPickerSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border"
                style={{ borderColor: 'var(--t-border-soft)', backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-main)' }} />
            </div>

            {/* Tabs */}
            <div className="flex mx-4 mb-2 rounded-xl p-1 gap-1 shrink-0" style={{ backgroundColor: 'var(--t-item-bg)' }}>
              {(['rotation', 'recipes', 'custom'] as const).map(t => (
                <button key={t} onClick={() => setPickerTab(t)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={{ backgroundColor: pickerTab === t ? 'var(--t-card-bg)' : 'transparent', color: pickerTab === t ? 'var(--t-primary)' : 'var(--t-text-soft)', boxShadow: pickerTab === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>
                  {t === 'rotation' ? '🔄 Rotation' : t === 'recipes' ? '📖 Recettes' : '✏️ Perso'}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col gap-2 min-h-0">
              {pickerTab === 'rotation' && (() => {
                const slotTypes = SLOTS.find(s => s.key === picker.slot)?.mealTypes ?? []
                const filtered = MEALS.filter(m =>
                  !hiddenMeals.has(m.id) &&
                  slotTypes.includes(m.type) &&
                  (pickerSearch === '' || m.name.toLowerCase().includes(pickerSearch.toLowerCase()))
                )
                return filtered.length === 0
                  ? <p className="text-center text-sm py-8" style={{ color: 'var(--t-text-soft)' }}>Aucun résultat</p>
                  : filtered.map(m => (
                    <button key={m.id} onClick={() => setCell(picker.day, picker.slot, { id: `m${m.id}`, name: m.name })}
                      className="w-full text-left px-4 py-3 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99]"
                      style={{ backgroundColor: 'var(--t-item-bg)', border: '1px solid var(--t-border-soft)' }}>
                      <p className="text-sm font-semibold" style={{ color: 'var(--t-text-main)' }}>{m.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--t-text-muted)' }}>💪 {m.protein} · 🔥 {m.kcal} · ⏱ {m.time}</p>
                    </button>
                  ))
              })()}

              {pickerTab === 'recipes' && (() => {
                const filtered = recipes.filter(r =>
                  pickerSearch === '' || r.title.toLowerCase().includes(pickerSearch.toLowerCase())
                )
                return filtered.length === 0
                  ? <p className="text-center text-sm py-8" style={{ color: 'var(--t-text-soft)' }}>
                      {recipes.length === 0 ? 'Aucune recette — ajoutes-en dans l\'onglet Recettes' : 'Aucun résultat'}
                    </p>
                  : filtered.map(r => (
                    <button key={r.id} onClick={() => setCell(picker.day, picker.slot, { id: `r${r.id}`, name: r.title })}
                      className="w-full text-left px-4 py-3 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99]"
                      style={{ backgroundColor: 'var(--t-item-bg)', border: '1px solid var(--t-border-soft)' }}>
                      <p className="text-sm font-semibold" style={{ color: 'var(--t-text-main)' }}>{r.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--t-text-muted)' }}>{r.category} · {r.prepTime + r.cookTime} min</p>
                    </button>
                  ))
              })()}

              {pickerTab === 'custom' && (
                <div className="flex flex-col gap-3 pt-1">
                  <input value={customMeal} onChange={e => setCustomMeal(e.target.value)}
                    placeholder="Ex: Salade niçoise maison..."
                    className="w-full px-4 py-3 rounded-2xl text-sm outline-none border"
                    style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-bg-soft)', color: 'var(--t-text-main)' }}
                    onKeyDown={e => { if (e.key === 'Enter' && customMeal.trim()) setCell(picker.day, picker.slot, { id: `c${Date.now()}`, name: customMeal.trim() }) }} />
                  <button
                    onClick={() => { if (customMeal.trim()) setCell(picker.day, picker.slot, { id: `c${Date.now()}`, name: customMeal.trim() }) }}
                    disabled={!customMeal.trim()}
                    className="w-full py-3 rounded-2xl text-sm font-bold disabled:opacity-40"
                    style={{ backgroundColor: 'var(--t-primary)', color: '#fff' }}>
                    + Ajouter ce repas
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sticky grocery bar (selection mode) */}
      {selecting && (
        <div className="fixed bottom-16 left-0 right-0 z-40 px-4 py-3 border-t shadow-2xl"
          style={{ backgroundColor: '#1a3a1a', borderColor: '#2d6a4f' }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="shrink-0">
              <p className="text-sm font-semibold" style={{ color: '#74c69d' }}>
                {selectedMeals.size === 0 ? t.tapMeals : t.mealsSelected(selectedMeals.size)}
              </p>
              {selectedMeals.size > 0 && (
                <p className="text-xs" style={{ color: '#52b788' }}>{t.ingredientsTotal(groceryItems.length)}</p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => {
                  if (!confirm(`Supprimer ${selectedMeals.size} repas ?`)) return
                  const next = new Set([...hiddenMeals, ...selectedMeals])
                  setHiddenMeals(next)
                  savePref('hiddenMeals', [...next])
                  exitSelect()
                }}
                disabled={selectedMeals.size === 0}
                className="px-3 py-2 rounded-xl text-xs font-semibold disabled:opacity-40"
                style={{ backgroundColor: '#7f1d1d', color: '#fca5a5' }}>
                🗑 {selectedMeals.size > 0 ? `Supprimer (${selectedMeals.size})` : 'Supprimer'}
              </button>
              <button
                onClick={openGrocery}
                disabled={selectedMeals.size === 0}
                className="px-3 py-2 rounded-xl text-xs font-semibold disabled:opacity-40 border"
                style={{ borderColor: '#40916c', color: '#74c69d', backgroundColor: 'transparent' }}>
                {t.viewGroceryList}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grocery List Modal */}
      {groceryModal && (
        <Modal title={t.groceryModal(selectedMeals.size)} onClose={() => setGroceryModal(false)} wide>
          <p className="text-xs mb-4" style={{ color: 'var(--t-text-soft)' }}>
            {t.groceryTip(groceryItems.length)}
          </p>
          <div className="space-y-1.5">
            {groceryItems.map((item, i) => {
              const checked = checkedItems.has(i)
              return (
                <button key={i} onClick={() => toggleCheck(i)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                  style={{ backgroundColor: checked ? 'var(--t-item-bg)' : 'var(--t-item-bg)' }}>
                  <div className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all"
                    style={{ backgroundColor: checked ? '#2d6a4f' : 'var(--t-card-bg)', borderColor: checked ? '#2d6a4f' : '#c4a882' }}>
                    {checked && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <span className="text-sm flex-1" style={{ color: checked ? 'var(--t-text-soft)' : 'var(--t-text-main)', textDecoration: checked ? 'line-through' : 'none' }}>
                    {item.name}
                  </span>
                  {item.count > 1 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{ backgroundColor: '#2d6a4f', color: '#fff' }}>
                      ×{item.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--t-border-soft)' }}>
            <p className="text-xs" style={{ color: 'var(--t-text-soft)' }}>
              {t.itemsTicked(checkedItems.size, groceryItems.length)}
            </p>
            <button
              onClick={() => {
                const text = groceryItems.map((item, i) => `${checkedItems.has(i) ? '✓' : '○'} ${item.name}${item.count > 1 ? ` ×${item.count}` : ''}`).join('\n')
                navigator.clipboard.writeText(text).then(() => alert(t.copied))
              }}
              className="text-xs px-3 py-1.5 rounded-lg font-medium"
              style={{ backgroundColor: 'var(--t-primary-pale)', color: 'var(--t-primary)' }}>
              {t.copyList}
            </button>
          </div>
        </Modal>
      )}

      {/* Meal Edit Modal */}
      {mealEditForm && (
        <Modal title="✏️ Modifier le repas" onClose={() => setMealEditForm(null)} wide>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>Nom</label>
              <input value={mealEditForm.name}
                onChange={e => setMealEditForm(f => f ? { ...f, name: e.target.value } : f)}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>Type</label>
                <select value={mealEditForm.type}
                  onChange={e => setMealEditForm(f => f ? { ...f, type: e.target.value } : f)}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }}>
                  {['breakfast','main','snack','smoothie'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>Temps</label>
                <input value={mealEditForm.time}
                  onChange={e => setMealEditForm(f => f ? { ...f, time: e.target.value } : f)}
                  placeholder="10 min"
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>Protéines</label>
                <input value={mealEditForm.protein}
                  onChange={e => setMealEditForm(f => f ? { ...f, protein: e.target.value } : f)}
                  placeholder="25g"
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>Calories</label>
                <input value={mealEditForm.kcal}
                  onChange={e => setMealEditForm(f => f ? { ...f, kcal: e.target.value } : f)}
                  placeholder="450 kcal"
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.ingredients}</label>
              <textarea value={mealEditForm.ingredients}
                onChange={e => setMealEditForm(f => f ? { ...f, ingredients: e.target.value } : f)}
                rows={3} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: 'var(--t-border-soft)' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.howToPrepare}</label>
              <textarea value={mealEditForm.prep}
                onChange={e => setMealEditForm(f => f ? { ...f, prep: e.target.value } : f)}
                rows={3} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: 'var(--t-border-soft)' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>💡 Tip</label>
              <textarea value={mealEditForm.tip}
                onChange={e => setMealEditForm(f => f ? { ...f, tip: e.target.value } : f)}
                rows={2} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: 'var(--t-border-soft)' }} />
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={e => { toggleFav(mealEditForm.id, e); }}
              className="px-4 py-2.5 rounded-xl text-sm font-medium"
              style={{ backgroundColor: favoriteMeals.has(mealEditForm.id) ? '#fde8ec' : 'var(--t-item-bg)', color: favoriteMeals.has(mealEditForm.id) ? '#c0303e' : 'var(--t-text-muted)' }}>
              {favoriteMeals.has(mealEditForm.id) ? '❤️' : '🤍'}
            </button>
            <button onClick={() => { deleteMeal(mealEditForm.id); setMealEditForm(null) }}
              className="px-4 py-2.5 rounded-xl text-sm font-medium"
              style={{ backgroundColor: '#fde8ec', color: '#c0303e' }}>
              {t.removeMeal}
            </button>
            <button onClick={saveMealEdit}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold"
              style={{ background: 'linear-gradient(135deg,#2d6a4f,#40916c)', color: '#fff' }}>
              ✓ Sauvegarder
            </button>
          </div>
        </Modal>
      )}

      {/* Add / Edit Recipe Modal */}
      {modal && (
        <Modal title={editing ? t.editRecipe : t.newRecipe} onClose={() => setModal(false)} wide>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.title}</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.description}</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: 'var(--t-border-soft)' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.ingredientsLine}</label>
              <textarea value={form.ingredients} onChange={e => setForm(f => ({ ...f, ingredients: e.target.value }))} rows={4} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: 'var(--t-border-soft)' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.instructions}</label>
              <textarea value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} rows={4} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: 'var(--t-border-soft)' }} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[{ label: t.prepMin, key: 'prepTime' }, { label: t.cookMin, key: 'cookTime' }, { label: t.servings, key: 'servings' }].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{label}</label>
                  <input type="number" value={(form as Record<string, string>)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.category}</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }}>
                  {['breakfast', 'lunch', 'dinner', 'snack'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={() => setModal(false)} className="btn-glass btn-glass-neutral flex-1 py-2.5 rounded-xl text-sm font-medium">{t.cancel}</button>
            <button onClick={save} disabled={saving} className="btn-glass btn-glass-green flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60">
              {saving ? t.saving : t.saveRecipe}
            </button>
          </div>
        </Modal>
      )}

      {/* Week Grocery Modal */}
      {weekGroceryModal && (
        <Modal title={t.weekGrocery} onClose={() => setWeekGroceryModal(false)} wide>
          <p className="text-xs mb-4" style={{ color: 'var(--t-text-soft)' }}>
            {t.groceryTip(weekGroceryItems.length)}
          </p>
          <div className="space-y-1.5">
            {weekGroceryItems.map((item, i) => {
              const checked = weekChecked.has(i)
              return (
                <button key={i} onClick={() => setWeekChecked(prev => { const next = new Set(prev); if (next.has(i)) next.delete(i); else next.add(i); return next })}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                  style={{ backgroundColor: 'var(--t-item-bg)' }}>
                  <div className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: checked ? '#2d6a4f' : 'var(--t-card-bg)', borderColor: checked ? '#2d6a4f' : 'var(--t-border-soft)' }}>
                    {checked && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <span className="text-sm flex-1" style={{ color: checked ? 'var(--t-text-soft)' : 'var(--t-text-main)', textDecoration: checked ? 'line-through' : 'none' }}>
                    {item.name}
                  </span>
                  {item.count > 1 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{ backgroundColor: '#2d6a4f', color: '#fff' }}>
                      ×{item.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--t-border-soft)' }}>
            <p className="text-xs" style={{ color: 'var(--t-text-soft)' }}>{t.itemsTicked(weekChecked.size, weekGroceryItems.length)}</p>
            <button
              onClick={() => {
                const text = weekGroceryItems.map((item, i) => `${weekChecked.has(i) ? '✓' : '○'} ${item.name}${item.count > 1 ? ` ×${item.count}` : ''}`).join('\n')
                navigator.clipboard.writeText(text).then(() => alert(t.copied))
              }}
              className="text-xs px-3 py-1.5 rounded-lg font-medium"
              style={{ backgroundColor: 'var(--t-primary-pale)', color: 'var(--t-primary)' }}>
              {t.copyList}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Week Cell Detail Modal ── */}
      {weekCellDetail && (() => {
        const entry = weekCellDetail
        const hardcoded = entry.id.startsWith('m') ? MEALS.find(m => `m${m.id}` === entry.id) : null
        const recipe    = entry.id.startsWith('r') ? recipes.find(r => `r${r.id}` === entry.id) : null
        const meal      = hardcoded ? getMeal(hardcoded) : null

        return (
          <Modal title={entry.name} onClose={() => setWeekCellDetail(null)} wide>
            {meal ? (
              <div className="space-y-4">
                {/* Stats */}
                <div className="flex flex-wrap gap-2">
                  {[{ icon: '💪', val: meal.protein }, { icon: '🔥', val: meal.kcal }, { icon: '⏱', val: meal.time }].map(s => (
                    <span key={s.icon} className="text-xs px-3 py-1.5 rounded-full font-medium"
                      style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>
                      {s.icon} {s.val}
                    </span>
                  ))}
                </div>
                {/* Ingredients */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--t-text-soft)' }}>🧺 Ingrédients</p>
                  <div className="space-y-1.5">
                    {splitIngredients(meal.ingredients).map((ing, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--t-text-main)' }}>
                        <span style={{ color: 'var(--t-primary)' }}>•</span> {ing}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Prep */}
                {meal.prep && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--t-text-soft)' }}>👨‍🍳 Préparation</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--t-text-main)' }}>{meal.prep}</p>
                  </div>
                )}
                {/* Tip */}
                {meal.tip && (
                  <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: 'var(--t-item-bg)' }}>
                    <p className="text-xs font-bold mb-1" style={{ color: 'var(--t-primary)' }}>💡 Tip</p>
                    <p className="text-sm" style={{ color: 'var(--t-text-muted)' }}>{meal.tip}</p>
                  </div>
                )}
              </div>
            ) : recipe ? (
              <div className="space-y-4">
                {/* Stats */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>
                    ⏱ {recipe.prepTime + recipe.cookTime} min
                  </span>
                  <span className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>
                    👤 {recipe.servings} pers.
                  </span>
                </div>
                {/* Description */}
                {recipe.description && (
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--t-text-muted)' }}>{recipe.description}</p>
                )}
                {/* Ingredients */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--t-text-soft)' }}>🧺 Ingrédients</p>
                  <div className="space-y-1.5">
                    {(() => {
                      let ings: string[] = []
                      try { ings = JSON.parse(recipe.ingredients) } catch { ings = recipe.ingredients.split(/\n|\s\+\s/).filter(Boolean) }
                      return ings.map((ing, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--t-text-main)' }}>
                          <span style={{ color: 'var(--t-primary)' }}>•</span> {ing}
                        </div>
                      ))
                    })()}
                  </div>
                </div>
                {/* Instructions */}
                {recipe.instructions && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--t-text-soft)' }}>👨‍🍳 Instructions</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--t-text-main)' }}>{recipe.instructions}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm py-4 text-center" style={{ color: 'var(--t-text-muted)' }}>Repas personnalisé — aucun détail disponible.</p>
            )}
          </Modal>
        )
      })()}

      {/* ── VIDEOS TAB ── */}
      {tab === 'videos' && (
        <FoodVideoTab
          videos={foodVideos}
          adding={addingFV}
          form={fvForm}
          urlStatus={fvUrlStatus}
          typeMeta={TYPE_META}
          onStartAdd={() => { setFvForm({ name: '', url: '', types: [] }); setFvUrlStatus('idle'); setAddingFV(true) }}
          onCancelAdd={() => setAddingFV(false)}
          onFormChange={f => { setFvForm(f); if (f.url !== fvForm.url) setFvUrlStatus('idle') }}
          onCheckUrl={() => {
            const ok = /tiktok\.com\/@[\w.]+\/video\/\d+|vm\.tiktok\.com\/[\w]+/i.test(fvForm.url)
            setFvUrlStatus(ok ? 'ok' : 'bad')
          }}
          onConfirm={async () => {
            if (!fvForm.name.trim() || fvUrlStatus !== 'ok') return
            const res = await fetch('/api/food-videos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: fvForm.name.trim(), url: fvForm.url.trim(), types: fvForm.types }),
            })
            const created = await res.json()
            setFoodVideos(prev => [...prev, created])
            setAddingFV(false)
          }}
          onDelete={async (id) => {
            await fetch(`/api/food-videos/${id}`, { method: 'DELETE' })
            setFoodVideos(prev => prev.filter(v => String(v.id) !== String(id)))
          }}
        />
      )}

      {/* ── BUY LIST TAB ── */}
      {tab === 'list' && (
        <div className="space-y-4">

          {/* Add button / inline form */}
          {!buyAdding ? (
            <div className="flex gap-2">
              <button
                onClick={() => { setBuyAdding(true); setTimeout(() => buyInputRef.current?.focus(), 50) }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg,#2d6a4f,#40916c)', color: '#fff' }}>
                <span className="text-lg leading-none">+</span> Ajouter un article
              </button>
              {buyItems.length > 0 && (
                <>
                  <button
                    onClick={() => {
                      const text = '🛒 Liste de courses\n\n' + buyItems.map(i => `${i.checked ? '✓' : '○'} ${i.text}`).join('\n')
                      navigator.clipboard.writeText(text).then(() => {
                        setBuyCopied(true)
                        setTimeout(() => setBuyCopied(false), 2000)
                      })
                    }}
                    className="px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-95 whitespace-nowrap"
                    style={{ backgroundColor: buyCopied ? '#2d6a4f' : 'var(--t-item-bg)', color: buyCopied ? '#fff' : 'var(--t-text-muted)' }}>
                    {buyCopied ? '✓ Copié !' : '📋 Copier'}
                  </button>
                  {buyItems.some(i => i.checked) && (
                    <button
                      onClick={() => saveBuy(buyItems.map(i => ({ ...i, checked: false })))}
                      className="px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-95 whitespace-nowrap"
                      style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>
                      ↺ Reset
                    </button>
                  )}
                  <button
                    onClick={forceSyncToCloud}
                    disabled={syncingCloud}
                    className="px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-95 whitespace-nowrap"
                    style={{ backgroundColor: syncDone ? '#d8f3dc' : 'var(--t-item-bg)', color: syncDone ? '#2d6a4f' : 'var(--t-text-muted)' }}>
                    {syncingCloud ? '⏳' : syncDone ? '✓ Sync !' : '☁️ Sync'}
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <input
                ref={buyInputRef}
                value={buyInput}
                onChange={e => setBuyInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addBuyItem(); if (e.key === 'Escape') { setBuyAdding(false); setBuyInput('') } }}
                placeholder="Ex: Oats, tuna, eggs..."
                className="flex-1 px-4 py-3 rounded-2xl border text-sm outline-none"
                style={{ backgroundColor: 'var(--t-card-bg)', borderColor: 'var(--t-primary)', color: 'var(--t-text-main)' }}
              />
              <button onClick={addBuyItem}
                className="px-4 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg,#2d6a4f,#40916c)', color: '#fff' }}>
                ✓ OK
              </button>
              <button onClick={() => { setBuyAdding(false); setBuyInput('') }}
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-all active:scale-95"
                style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>
                ✕
              </button>
            </div>
          )}

          {/* List */}
          {buyItems.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: 'var(--t-item-bg)' }}>
              <p className="text-4xl mb-3">🛒</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--t-text-muted)' }}>Liste vide</p>
              <p className="text-xs mt-1" style={{ color: 'var(--t-text-soft)' }}>Clique sur + pour ajouter un article</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {buyItems.map((item, i) => (
                <div key={i}
                  className="rounded-2xl transition-all overflow-hidden"
                  style={{ backgroundColor: item.checked ? 'var(--t-bg-soft)' : 'var(--t-card-bg)', border: '1px solid', borderColor: item.checked ? 'var(--t-border)' : 'var(--t-border-soft)' }}>

                  {/* Main row */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    {/* Checkbox */}
                    <button onClick={() => { toggleBuyItem(i); setBuyConfirmIdx(null) }}
                      className="w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-all"
                      style={{ borderColor: item.checked ? '#2d6a4f' : 'var(--t-border-soft)', backgroundColor: item.checked ? '#2d6a4f' : 'transparent' }}>
                      {item.checked && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="2,6 5,9 10,3"/></svg>}
                    </button>
                    {/* Text */}
                    <span className="flex-1 text-sm" style={{ color: item.checked ? 'var(--t-text-soft)' : 'var(--t-text-main)', textDecoration: item.checked ? 'line-through' : 'none' }}>
                      {item.text}
                    </span>
                    {/* Delete trigger */}
                    <button
                      onClick={() => setBuyConfirmIdx(buyConfirmIdx === i ? null : i)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all"
                      style={{ backgroundColor: buyConfirmIdx === i ? '#fde8ec' : 'var(--t-item-bg)', color: buyConfirmIdx === i ? '#c0303e' : 'var(--t-text-soft)', fontSize: 13 }}>
                      🗑
                    </button>
                  </div>

                  {/* Confirm delete row */}
                  {buyConfirmIdx === i && (
                    <div className="flex items-center gap-2 px-4 pb-3">
                      <p className="flex-1 text-xs font-medium" style={{ color: '#c0303e' }}>Supprimer cet article ?</p>
                      <button onClick={() => deleteBuyItem(i)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95"
                        style={{ backgroundColor: '#c0303e', color: '#fff' }}>
                        Oui, supprimer
                      </button>
                      <button onClick={() => setBuyConfirmIdx(null)}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95"
                        style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>
                        Annuler
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Clear checked */}
              {buyItems.some(i => i.checked) && (
                <button onClick={clearCheckedBuy}
                  className="w-full py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95 mt-2"
                  style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>
                  🗑 Effacer les cochés ({buyItems.filter(i => i.checked).length})
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Food video types (reuses existing food categories) ─────────────────────────
const FOOD_VIDEO_TYPES = [
  { key: 'breakfast', label: 'Breakfast', emoji: '☀️' },
  { key: 'main',      label: 'Plat',      emoji: '🍽️' },
  { key: 'snack',     label: 'Snack',     emoji: '🍎' },
  { key: 'smoothie',  label: 'Smoothie',  emoji: '🥤' },
]

type FoodVideoEntry = { id: number | string; name: string; url: string; types: string[] }

function FoodVideoTab({
  videos, adding, form, urlStatus, typeMeta,
  onStartAdd, onCancelAdd, onFormChange, onCheckUrl, onConfirm, onDelete,
}: {
  videos: FoodVideoEntry[]
  adding: boolean
  form: { name: string; url: string; types: string[] }
  urlStatus: 'idle' | 'ok' | 'bad'
  typeMeta: Record<string, { label: string; emoji: string; color: string; bg: string }>
  onStartAdd: () => void
  onCancelAdd: () => void
  onFormChange: (f: { name: string; url: string; types: string[] }) => void
  onCheckUrl: () => void
  onConfirm: () => void
  onDelete: (id: number | string) => void
}) {
  const [filter, setFilter] = useState<string | null>(null)
  const filtered = filter ? videos.filter(v => v.types?.includes(filter)) : videos

  if (videos.length === 0 && !adding) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-5">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
          style={{ backgroundColor: '#d8f3dc' }}>
          🎬
        </div>
        <div className="text-center">
          <p className="font-bold text-base" style={{ color: 'var(--t-text-main)' }}>Aucune vidéo food</p>
          <p className="text-sm mt-1" style={{ color: 'var(--t-text-soft)' }}>Ajoute ta première recette TikTok</p>
        </div>
        <button
          onClick={onStartAdd}
          className="w-14 h-14 rounded-full text-3xl font-bold flex items-center justify-center shadow-lg active:scale-95"
          style={{ backgroundColor: '#2d6a4f', color: '#fff' }}
        >+</button>
      </div>
    )
  }

  return (
    <div>
      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: 'none' }}>
        <button
          onClick={() => setFilter(null)}
          className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ backgroundColor: filter === null ? 'var(--t-primary)' : 'var(--t-item-bg)', color: filter === null ? '#fff' : 'var(--t-text-muted)' }}
        >
          Tout ({videos.length})
        </button>
        {FOOD_VIDEO_TYPES.map(ft => {
          const count = videos.filter(v => v.types?.includes(ft.key)).length
          if (count === 0) return null
          const meta = typeMeta[ft.key]
          return (
            <button key={ft.key}
              onClick={() => setFilter(filter === ft.key ? null : ft.key)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1"
              style={{
                backgroundColor: filter === ft.key ? meta.color : meta.bg,
                color: filter === ft.key ? '#fff' : meta.color,
              }}
            >
              {ft.emoji} {ft.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(v => (
          <FoodVideoCard key={v.id} video={v} typeMeta={typeMeta} onDelete={onDelete} />
        ))}

        {adding ? (
          <div className="col-span-full sm:col-span-1">
            <FoodAddVideoCard
              form={form}
              urlStatus={urlStatus}
              onChange={onFormChange}
              onCheck={onCheckUrl}
              onConfirm={onConfirm}
              onCancel={onCancelAdd}
            />
          </div>
        ) : (
          <button
            onClick={onStartAdd}
            className="rounded-2xl border-2 border-dashed flex items-center justify-center active:scale-95 min-h-[120px] sm:min-h-[180px]"
            style={{ borderColor: 'var(--t-border-soft)', backgroundColor: 'var(--t-item-bg)' }}
          >
            <span className="text-4xl font-bold" style={{ color: '#2d6a4f' }}>+</span>
          </button>
        )}
      </div>

      {filtered.length === 0 && filter && (
        <p className="text-center text-sm py-10" style={{ color: '#a07850' }}>Aucune vidéo pour ce type.</p>
      )}
    </div>
  )
}

function FoodVideoCard({ video, typeMeta, onDelete }: {
  video: FoodVideoEntry
  typeMeta: Record<string, { label: string; emoji: string; color: string; bg: string }>
  onDelete: (id: number | string) => void
}) {
  const [hover, setHover] = useState(false)
  const firstType = video.types?.[0]
  const meta = firstType ? typeMeta[firstType] : null

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-md"
      style={{ minHeight: 180, backgroundColor: meta?.bg ?? 'var(--t-item-bg)', border: `2px solid ${meta?.color ?? '#2d6a4f'}22` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Color top bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: meta?.color ?? '#2d6a4f' }} />

      {/* Type tags */}
      {video.types?.length > 0 && (
        <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[calc(100%-3rem)]">
          {video.types.map(tk => {
            const m = typeMeta[tk]
            return m ? (
              <span key={tk} className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ backgroundColor: m.color, color: '#fff' }}>
                {m.emoji} {m.label}
              </span>
            ) : null
          })}
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col items-center justify-center gap-3 p-4 pt-10 pb-4 min-h-[180px]">
        <p className="font-bold text-sm text-center leading-tight px-2" style={{ color: 'var(--t-text-main)' }}>{video.name}</p>
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-full flex items-center justify-center text-lg shadow-md active:scale-95"
          style={{ backgroundColor: meta?.color ?? '#2d6a4f', color: '#fff' }}
        >▶</a>
      </div>

      {/* Delete */}
      <button
        onClick={() => { if (confirm('Supprimer cette vidéo ?')) onDelete(video.id) }}
        className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
        style={{ backgroundColor: 'rgba(192,48,62,0.85)', color: '#fff', opacity: hover ? 1 : 0.5 }}
      >×</button>
    </div>
  )
}

function FoodAddVideoCard({ form, urlStatus, onChange, onCheck, onConfirm, onCancel }: {
  form: { name: string; url: string; types: string[] }
  urlStatus: 'idle' | 'ok' | 'bad'
  onChange: (f: { name: string; url: string; types: string[] }) => void
  onCheck: () => void
  onConfirm: () => void
  onCancel: () => void
}) {
  const canConfirm = form.name.trim().length > 0 && urlStatus === 'ok'

  const toggleType = (key: string) => {
    const next = form.types.includes(key) ? form.types.filter(t => t !== key) : [...form.types, key]
    onChange({ ...form, types: next })
  }

  return (
    <div className="rounded-2xl border-2 shadow-lg flex flex-col overflow-hidden w-full"
      style={{ borderColor: '#40916c', backgroundColor: 'var(--t-card-bg)' }}>
      <div className="h-1 w-full" style={{ backgroundColor: '#2d6a4f' }} />

      <div className="flex flex-col gap-3 p-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--t-text-muted)' }}>Nom de la recette</label>
          <input
            value={form.name}
            onChange={e => onChange({ ...form, name: e.target.value })}
            placeholder="ex. Pancakes protéinés"
            className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-green-300"
            style={{ borderColor: 'var(--t-border-soft)' }}
            autoFocus
          />
        </div>

        {/* URL */}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--t-text-muted)' }}>Lien TikTok</label>
          <div className="flex gap-2">
            <input
              value={form.url}
              onChange={e => onChange({ ...form, url: e.target.value })}
              placeholder="https://tiktok.com/@user/video/…"
              className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-green-300"
              style={{ borderColor: urlStatus === 'ok' ? '#40916c' : urlStatus === 'bad' ? '#c0303e' : 'var(--t-border-soft)' }}
              onKeyDown={e => { if (e.key === 'Enter') onCheck() }}
            />
            <button onClick={onCheck}
              className="px-3 py-2 rounded-xl text-xs font-bold shrink-0"
              style={{ backgroundColor: '#1a3a1a', color: '#74c69d' }}>✓</button>
          </div>
          {urlStatus === 'ok' && <p className="text-xs mt-1 font-medium" style={{ color: '#2d6a4f' }}>✓ Lien valide</p>}
          {urlStatus === 'bad' && <p className="text-xs mt-1 font-medium" style={{ color: '#c0303e' }}>✗ URL TikTok invalide</p>}
        </div>

        {/* Type multi-select */}
        <div>
          <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--t-text-muted)' }}>Catégorie</label>
          <div className="flex flex-wrap gap-2">
            {FOOD_VIDEO_TYPES.map(ft => {
              const active = form.types.includes(ft.key)
              return (
                <button key={ft.key} type="button" onClick={() => toggleType(ft.key)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: active ? '#2d6a4f' : 'var(--t-item-bg)',
                    color: active ? '#fff' : 'var(--t-text-muted)',
                    border: active ? '2px solid #2d6a4f' : '2px solid var(--t-border-soft)',
                  }}>
                  {ft.emoji} {ft.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>Annuler</button>
          <button onClick={onConfirm} disabled={!canConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40"
            style={{ backgroundColor: canConfirm ? '#2d6a4f' : '#ccc', color: '#fff' }}>
            Ajouter ▶
          </button>
        </div>
      </div>
    </div>
  )
}
