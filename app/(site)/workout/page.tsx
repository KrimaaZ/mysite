'use client'

import { useEffect, useMemo, useState } from 'react'
import Modal from '@/components/Modal'
import { useLang } from '@/lib/lang'

// ─── Types ────────────────────────────────────────────────────────────────────
type ExCard = {
  id: number; type: string; name: string; muscle: string; equipment: string
  description: string; steps: string[]
  levels: { novice: string; beginner: string; intermediate: string; advanced: string; elite: string }
}
type LogExercise = { name: string; sets: number; reps: string; notes: string }
type Session = { id: number; type: string; title: string; date: string; exercises: string; notes: string | null }

// ─── Exercise Library Data ────────────────────────────────────────────────────
const EXERCISES: ExCard[] = [
  // ── PULL (1–15) ──────────────────────────────────────────────────────────────
  { id:1,  type:'PULL', name:'Pull-up',             muscle:'Back & Biceps',   equipment:'Bar',
    description:'King of back exercises. Builds width and lat thickness using only your bodyweight.',
    steps:['Hang from bar, hands slightly wider than shoulder-width, palms away.','Engage core, pull elbows down and back until chest meets bar.','Lower slowly to full dead hang — do not shorten the range.'],
    levels:{ novice:'2×3 reps with resistance band assistance — full range of motion only', beginner:'3×5 reps — 2 min rest, controlled 3s descent', intermediate:'4×8 reps — add 2s pause at top', advanced:'4×12 reps — +5 kg weight belt, 60s rest', elite:'5×15 reps — +10 kg weight belt, 30s rest' }},
  { id:2,  type:'PULL', name:'Chin-up',             muscle:'Biceps & Back',   equipment:'Bar',
    description:'Supinated grip pull-up that emphasizes biceps more than standard pull-ups.',
    steps:['Hang with palms facing you, hands shoulder-width.','Pull yourself up driving elbows toward hips.','Lower with full control back to dead hang.'],
    levels:{ novice:'2×3 reps, band assist if needed', beginner:'3×6 reps — 90s rest', intermediate:'4×10 reps — slow descent 3s', advanced:'4×12 reps — +5 kg', elite:'5×15 reps — L-sit position throughout' }},
  { id:3,  type:'PULL', name:'Lat Pulldown',        muscle:'Lats',            equipment:'Cable Machine',
    description:'Machine alternative to pull-ups that isolates the latissimus dorsi effectively.',
    steps:['Sit, thighs under pads. Grip bar wider than shoulder-width.','Pull bar to upper chest, elbows drive straight down.','Resist the weight on the way back up — 3 sec return.'],
    levels:{ novice:'3×10 reps at 50% max — learn the path', beginner:'3×12 reps at 60% max', intermediate:'4×10 reps at 75% max, controlled return', advanced:'4×10 reps at 85% max, 3s negative', elite:'5×8 reps at 90%+ max, drop set on last set' }},
  { id:4,  type:'PULL', name:'Barbell Row',         muscle:'Mid Back',        equipment:'Barbell',
    description:'Compound back builder that adds thickness to the entire upper back and traps.',
    steps:['Hinge at hips, back parallel to floor, grip just outside shoulder-width.','Pull bar to lower chest / navel, lead with elbows.','Lower bar with control, maintain flat back throughout.'],
    levels:{ novice:'3×8 reps light weight — prioritize flat back', beginner:'3×10 reps at 60% max', intermediate:'4×8 reps at 75% max', advanced:'4×6 reps at 85% max, pause at top', elite:'5×5 reps at 90% max, explosive pull' }},
  { id:5,  type:'PULL', name:'Dumbbell Row',        muscle:'Lats & Rhomboids',equipment:'Dumbbell',
    description:'Unilateral row that corrects left/right strength imbalances and builds lat depth.',
    steps:['Place one knee and hand on bench, back flat. Hold dumbbell in free hand.','Row dumbbell to hip, elbow close to body.','Lower slowly, allow full shoulder stretch at bottom.'],
    levels:{ novice:'3×8 per side — light weight', beginner:'3×10 per side', intermediate:'4×12 per side — pronation at top', advanced:'4×10 per side — heavy, 2s hold at top', elite:'5×12 per side — max weight, 1 min rest' }},
  { id:6,  type:'PULL', name:'Cable Row',           muscle:'Mid & Lower Back',equipment:'Cable Machine',
    description:'Constant-tension row that keeps back muscles under load throughout the full movement.',
    steps:['Sit upright, feet on platform, slight knee bend. Grip V-bar or wide bar.','Pull handle to navel, keep torso upright, squeeze shoulder blades.','Extend arms fully, feel the stretch before the next rep.'],
    levels:{ novice:'3×12 at light load — torso upright only', beginner:'3×12 at moderate load', intermediate:'4×10 at 75% max', advanced:'4×8 at 85% max, 2s pause at contraction', elite:'5×8 at 90%+, super-set with lat pulldown' }},
  { id:7,  type:'PULL', name:'Face Pull',           muscle:'Rear Delts & Traps',equipment:'Cable Machine',
    description:'Corrective and hypertrophy exercise for rear delts and external rotators — prevents imbalances.',
    steps:['Set cable at face height. Grip rope with both hands, palms in.','Pull rope toward face, splitting hands apart at the end.','Return slowly with full control.'],
    levels:{ novice:'3×15 very light — feel the rear delt activate', beginner:'3×15 light — full split', intermediate:'4×15 moderate — external rotation at end', advanced:'4×20 moderate — no momentum', elite:'5×20 heavy — super-set with pressing work' }},
  { id:8,  type:'PULL', name:'T-Bar Row',           muscle:'Mid Back & Lats', equipment:'Barbell',
    description:'Loaded bent-over row that allows heavier weights and builds the thick inner back.',
    steps:['Straddle a loaded barbell in a corner. Bend over with flat back.','Grip handles or wrap towel around bar. Row to chest.','Lower with control — do not round lower back.'],
    levels:{ novice:'3×8 bodyweight first to learn posture', beginner:'3×8 light plate', intermediate:'4×8 two plates', advanced:'4×6 three plates', elite:'5×5 max load — belt recommended' }},
  { id:9,  type:'PULL', name:'Deadlift',            muscle:'Full Posterior Chain',equipment:'Barbell',
    description:'The most effective compound movement for overall strength — works back, glutes, hamstrings, and core.',
    steps:['Bar over mid-foot, hip-width stance. Grip just outside legs.','Brace core hard. Push floor away, keeping bar close to body.','Lock out hips at top. Lower bar to floor by hinging at hips.'],
    levels:{ novice:'3×5 reps with empty bar or light load — form first', beginner:'3×5 at bodyweight on bar', intermediate:'4×4 at 1.5× bodyweight', advanced:'4×3 at 2× bodyweight', elite:'5×2 at 2.5× bodyweight — competition form' }},
  { id:10, type:'PULL', name:'Romanian Deadlift',   muscle:'Hamstrings & Glutes',equipment:'Barbell',
    description:'Hip hinge movement targeting hamstrings and glutes with a strong stretch at the bottom.',
    steps:['Stand holding bar at hip height, slight knee bend.','Push hips back, bar slides down thighs until hamstring stretch.','Drive hips forward to return — squeeze glutes at top.'],
    levels:{ novice:'3×10 light — learn hinge pattern', beginner:'3×10 moderate', intermediate:'4×10 at 60% deadlift max', advanced:'4×8 at 75% deadlift max, 3s descent', elite:'5×6 at 85%+ deadlift max' }},
  { id:11, type:'PULL', name:'Barbell Curl',        muscle:'Biceps',          equipment:'Barbell',
    description:'Classic mass-building curl. Full range of motion produces maximum bicep stretch and contraction.',
    steps:['Stand, shoulder-width grip, elbows pinned at sides.','Curl bar to chin, fully supinating wrists at top.','Lower slowly — do not let elbows drift forward.'],
    levels:{ novice:'3×10 empty bar — supination focus', beginner:'3×12 light', intermediate:'4×10 moderate, 2s hold at top', advanced:'4×8 heavy, 3s lower', elite:'5×6 max + 1 drop set each' }},
  { id:12, type:'PULL', name:'Hammer Curl',         muscle:'Brachialis & Biceps',equipment:'Dumbbell',
    description:'Neutral-grip curl that develops the brachialis, adding thickness to the upper arm.',
    steps:['Hold dumbbells at sides, neutral grip (thumbs forward).','Curl both (or alternate) up without rotating wrist.','Squeeze at top, lower with control.'],
    levels:{ novice:'3×12 light each side', beginner:'3×12 moderate', intermediate:'4×10 heavy — alternating', advanced:'4×8 very heavy — pause at top', elite:'5×8 max — incline seated variation' }},
  { id:13, type:'PULL', name:'Incline Dumbbell Curl',muscle:'Long Head Biceps',equipment:'Dumbbell',
    description:'Performed on incline bench, placing the bicep in a deep stretch for maximum hypertrophy.',
    steps:['Set bench to 45–60°. Sit back, arms hanging straight down.','Curl dumbbells up, keeping upper arms stationary.','Lower all the way — full stretch is the key.'],
    levels:{ novice:'3×10 light — prioritize the stretch', beginner:'3×12 moderate', intermediate:'4×10 moderate-heavy', advanced:'4×8 heavy — 4s lower', elite:'5×8 max weight — peak contraction hold' }},
  { id:14, type:'PULL', name:'Reverse Curl',        muscle:'Brachialis & Forearms',equipment:'Barbell',
    description:'Pronated grip curl that builds forearm mass and the often-neglected brachialis.',
    steps:['Hold bar with overhand (pronated) grip, shoulder width.','Curl bar up keeping wrists neutral.','Lower fully — wrists stay straight throughout.'],
    levels:{ novice:'3×12 very light — wrist position focus', beginner:'3×15 light', intermediate:'4×12 moderate', advanced:'4×10 moderate-heavy', elite:'5×10 heavy — E-Z bar variation' }},
  { id:15, type:'PULL', name:'Rear Delt Fly',       muscle:'Rear Delts',      equipment:'Dumbbell',
    description:'Isolation exercise for posterior deltoids — essential for shoulder balance and posture.',
    steps:['Hinge at hips 90°, holding light dumbbells, palms facing in.','Raise arms out to sides, leading with elbows, squeeze rear delts.','Lower with control to starting position.'],
    levels:{ novice:'3×15 very light — feel the rear delt only', beginner:'3×15 light', intermediate:'4×15 moderate', advanced:'4×12 moderate-heavy — no momentum', elite:'5×15 — cable or band variation for peak contraction' }},

  // ── PUSH (16–30) ─────────────────────────────────────────────────────────────
  { id:16, type:'PUSH', name:'Bench Press',         muscle:'Chest',           equipment:'Barbell',
    description:'The fundamental chest movement. Builds pec mass and pressing strength.',
    steps:['Lie on bench, eyes under bar. Grip 1.5× shoulder-width.','Lower bar to nipple line, elbows 75°, controlled descent.','Drive bar up and slightly back to start, full lockout.'],
    levels:{ novice:'3×8 empty bar — learn the path and arch', beginner:'3×10 light weight', intermediate:'4×8 at 70% max', advanced:'4×6 at 80%+, competition pause at chest', elite:'5×3 at 90%+ — periodized peaking program' }},
  { id:17, type:'PUSH', name:'Incline Bench Press', muscle:'Upper Chest',     equipment:'Barbell',
    description:'Angled variation targeting the clavicular head of the pec for a fuller upper chest.',
    steps:['Set bench at 30–45°. Grip slightly closer than flat bench.','Lower bar to upper chest, elbows slightly forward.','Press up and slightly back — squeeze at lockout.'],
    levels:{ novice:'3×10 light — upper chest activation cue', beginner:'3×10 moderate', intermediate:'4×8 at 70% flat bench max', advanced:'4×6 at 80%+', elite:'5×5 at 85%+ — drop set finish' }},
  { id:18, type:'PUSH', name:'Dumbbell Flye',       muscle:'Chest (stretch)', equipment:'Dumbbell',
    description:'Isolation movement creating a deep chest stretch for hypertrophy and muscle fiber recruitment.',
    steps:['Lie flat, dumbbells above chest, slight elbow bend.','Lower arms in wide arc until deep chest stretch.','Bring dumbbells back up in same arc — squeeze chest at top.'],
    levels:{ novice:'3×12 very light — feel the stretch only', beginner:'3×12 light', intermediate:'4×12 moderate — 2s stretch hold', advanced:'4×10 heavy — cable flye variation', elite:'5×10 heavy — incline cable flye, peak contraction squeeze' }},
  { id:19, type:'PUSH', name:'Push-up',             muscle:'Chest & Triceps', equipment:'Bodyweight',
    description:'The most accessible chest exercise — can be done anywhere and scaled in infinite ways.',
    steps:['Hands slightly wider than shoulder-width, body straight from head to heels.','Lower chest to 1 cm from floor, elbows at 45° angle.','Push up explosively to full lockout — squeeze chest at top.'],
    levels:{ novice:'3×5 on knees — perfect form before progressing', beginner:'3×10 full push-up', intermediate:'4×15 — add 2s pause at bottom', advanced:'4×20 — weighted vest or feet elevated', elite:'5×20+ weighted — clap push-up finisher' }},
  { id:20, type:'PUSH', name:'Diamond Push-up',     muscle:'Triceps',         equipment:'Bodyweight',
    description:'Close-grip push-up variation that isolates the triceps more than any other pressing movement.',
    steps:['Form a diamond with thumbs and index fingers, placed at sternum.','Lower chest to hands, keeping elbows in tight.','Press up focusing entirely on the triceps.'],
    levels:{ novice:'3×5 on knees — build tricep base', beginner:'3×8 full', intermediate:'4×12', advanced:'4×15 — feet elevated', elite:'5×15 — weighted vest + slow tempo' }},
  { id:21, type:'PUSH', name:'Overhead Press',      muscle:'Shoulders',       equipment:'Barbell',
    description:'The primary shoulder mass builder. Develops the medial and anterior deltoid.',
    steps:['Bar in front rack or from floor. Grip just outside shoulder-width.','Press bar straight up, tucking elbows forward at bottom.','Lock out overhead, bar slightly behind ear at top.'],
    levels:{ novice:'3×8 empty bar — strict form, no leg drive', beginner:'3×10 light', intermediate:'4×8 moderate', advanced:'4×6 heavy — controlled descent', elite:'5×5 max load — push press last set' }},
  { id:22, type:'PUSH', name:'Arnold Press',        muscle:'Full Deltoid',    equipment:'Dumbbell',
    description:'Rotational shoulder press invented by Arnold. Hits all 3 deltoid heads in one movement.',
    steps:['Hold dumbbells at shoulder height, palms toward face.','Press up while rotating palms to face away at lockout.','Reverse the rotation on the way down — full range.'],
    levels:{ novice:'3×10 light — master the rotation', beginner:'3×12 light-moderate', intermediate:'4×10 moderate', advanced:'4×8 heavy — slow rotation', elite:'5×8 heavy — 3s lower' }},
  { id:23, type:'PUSH', name:'Lateral Raise',       muscle:'Medial Deltoid',  equipment:'Dumbbell',
    description:'Isolation exercise that builds shoulder width by targeting the side delt.',
    steps:['Hold dumbbells at sides, slight forward lean.','Raise arms to sides to shoulder height — lead with elbows.','Lower slowly, do not let them fall.'],
    levels:{ novice:'3×15 very light — feel medial delt only, no momentum', beginner:'3×15 light', intermediate:'4×15 moderate — cable variation', advanced:'4×20 moderate — 1.5 rep method', elite:'5×20 — seated heavy + drop set' }},
  { id:24, type:'PUSH', name:'Front Raise',         muscle:'Anterior Deltoid',equipment:'Dumbbell',
    description:'Targets the front of the shoulder — do not overdo this if you press regularly.',
    steps:['Hold dumbbells at thighs, slight elbow bend.','Raise one or both arms to shoulder height in front.','Lower slowly.'],
    levels:{ novice:'3×12 light', beginner:'3×12 moderate', intermediate:'4×12 — plate variation', advanced:'4×10 heavy alternating', elite:'5×10 — cable version for constant tension' }},
  { id:25, type:'PUSH', name:'Tricep Dip',          muscle:'Triceps & Chest', equipment:'Bodyweight',
    description:'Compound movement for triceps and lower chest. Can be heavily loaded with belt.',
    steps:['Hold parallel bars, arms straight, slight forward lean for chest.','Lower until upper arms parallel to floor — feel chest/tricep stretch.','Press back up to full lockout.'],
    levels:{ novice:'3×5 with feet assisted on bench', beginner:'3×10 bodyweight', intermediate:'4×12 bodyweight', advanced:'4×8 + 10 kg dip belt', elite:'5×8 + 20 kg — slow negatives' }},
  { id:26, type:'PUSH', name:'Skull Crusher',       muscle:'Triceps',         equipment:'Barbell',
    description:'Lying tricep extension with maximum stretch on the long head of the triceps.',
    steps:['Lie on bench, hold E-Z bar or straight bar above chest.','Lower bar toward forehead by bending elbows only.','Extend arms back to start — lock out.'],
    levels:{ novice:'3×12 very light — elbow stability focus', beginner:'3×12 light', intermediate:'4×10 moderate', advanced:'4×8 heavy — 3s descent', elite:'5×8 — super-set with close-grip bench' }},
  { id:27, type:'PUSH', name:'Cable Tricep Pushdown',muscle:'Triceps',        equipment:'Cable Machine',
    description:'Best isolation exercise for triceps — constant cable tension throughout the movement.',
    steps:['Stand at high cable with rope or straight bar. Grip handles.','Push down until arms straight, elbows locked at sides.','Allow controlled return — feel the stretch.'],
    levels:{ novice:'3×15 light — learn elbow position', beginner:'3×15 moderate', intermediate:'4×12 heavy — rope variation for peak contraction', advanced:'4×10 heavy — 1.5 rep method', elite:'5×12 heavy — super-set variation' }},
  { id:28, type:'PUSH', name:'Overhead Tricep Ext.',muscle:'Long Head Triceps',equipment:'Dumbbell',
    description:'Overhead extension maximally stretches the long head — most important part for arm size.',
    steps:['Hold one heavy dumbbell with both hands overhead.','Lower it behind head by bending elbows only.','Press back up to full lockout.'],
    levels:{ novice:'3×12 light', beginner:'3×12 moderate', intermediate:'4×10 moderate-heavy', advanced:'4×8 heavy — cable overhead version', elite:'5×8 max — seated + rear delt engagement' }},
  { id:29, type:'PUSH', name:'Decline Bench Press', muscle:'Lower Chest',     equipment:'Barbell',
    description:'Decline angle shifts emphasis to the lower pec for a complete chest development.',
    steps:['Lock ankles under pads, lie at 15–30° decline.','Lower bar to lower chest, elbows at 75°.','Press up to full lockout.'],
    levels:{ novice:'3×10 light', beginner:'3×10 moderate', intermediate:'4×8 at 75% flat max', advanced:'4×6 at 85%+', elite:'5×5 max — pause at chest' }},
  { id:30, type:'PUSH', name:'Cable Crossover',     muscle:'Chest (inner)',   equipment:'Cable Machine',
    description:'Adduction-based chest exercise that creates peak contraction impossible with free weights.',
    steps:['Set cables at shoulder height or above. Stand in middle.','Pull both handles toward each other in an arcing motion.','Cross hands at end — squeeze inner chest hard.'],
    levels:{ novice:'3×15 light — feel chest adduction', beginner:'3×15 moderate', intermediate:'4×12 heavy', advanced:'4×10 heavy — different angles each set', elite:'5×12 — tri-set with flyes and bench' }},

  // ── ABS & LEGS (31–45) ───────────────────────────────────────────────────────
  { id:31, type:'ABS_LEGS', name:'Squat',             muscle:'Quads & Glutes',   equipment:'Barbell',
    description:'The king of leg exercises. Builds total lower body strength and mass.',
    steps:['Bar on upper traps, feet shoulder-width, toes slightly out.','Sit back and down until thighs parallel — knees track toes.','Drive through heels to stand, full lockout at top.'],
    levels:{ novice:'3×10 bodyweight — depth first', beginner:'3×10 light barbell', intermediate:'4×8 at 70% max', advanced:'4×5 at 85% max', elite:'5×3 at 90%+ — belted, periodized' }},
  { id:32, type:'ABS_LEGS', name:'Bulgarian Split Squat',muscle:'Quads & Glutes',equipment:'Dumbbell',
    description:'Best single-leg exercise for quad and glute hypertrophy — expect serious DOMS.',
    steps:['Rear foot on bench, front foot 2 steps forward.','Lower rear knee toward floor — front shin stays vertical.','Drive through front heel to stand.'],
    levels:{ novice:'3×8 per side bodyweight — balance focus', beginner:'3×10 per side light DB', intermediate:'4×10 per side moderate DB', advanced:'4×8 heavy DB — slow descent', elite:'5×8 barbell version — belt' }},
  { id:33, type:'ABS_LEGS', name:'Leg Press',          muscle:'Quads',           equipment:'Machine',
    description:'Machine squat alternative allowing heavier loads without spinal compression.',
    steps:['Sit in machine, feet high and wide for glutes, or low/narrow for quads.','Lower platform to 90° knee bend — never lock knees under load.','Press to near lockout.'],
    levels:{ novice:'3×12 light — full range of motion', beginner:'3×15 moderate', intermediate:'4×12 heavy', advanced:'4×10 very heavy — slow 4s descent', elite:'5×10 max — 1.5 rep method' }},
  { id:34, type:'ABS_LEGS', name:'Lunge',              muscle:'Quads & Glutes',  equipment:'Dumbbell',
    description:'Functional unilateral movement for legs. Improves balance and corrects asymmetries.',
    steps:['Step forward 2 feet. Back knee drops toward floor.','Front thigh parallel to floor, front shin vertical.','Push off front foot to return, or step through into walking lunge.'],
    levels:{ novice:'3×10 per leg bodyweight', beginner:'3×10 per leg light DB', intermediate:'4×12 per leg moderate', advanced:'4×10 per leg heavy — reverse lunge', elite:'5×12 per leg — barbell or weighted vest' }},
  { id:35, type:'ABS_LEGS', name:'Hip Thrust',         muscle:'Glutes',          equipment:'Barbell',
    description:'Peak glute activation exercise — nothing builds the posterior chain like hip thrusts.',
    steps:['Shoulder blades on bench edge, barbell on hips with pad.','Lower hips to floor, feet flat, shoulder-width.','Drive hips up hard, squeeze glutes at lockout — body forms a table.'],
    levels:{ novice:'3×15 bodyweight on floor — bridge variation', beginner:'3×15 light bar on bench', intermediate:'4×12 two plates', advanced:'4×10 three plates — 1s pause at top', elite:'5×8 max load — single leg variation' }},
  { id:36, type:'ABS_LEGS', name:'Leg Curl',           muscle:'Hamstrings',      equipment:'Machine',
    description:'Isolation exercise for the hamstrings — essential for knee health and leg balance.',
    steps:['Lie face down (or seated). Position ankle pad just above heel.','Curl legs up toward glutes through full range.','Lower slowly — 3s return.'],
    levels:{ novice:'3×12 light — full ROM', beginner:'3×15 moderate', intermediate:'4×12 heavy', advanced:'4×10 heavy — 3s negative', elite:'5×10 — single leg variation' }},
  { id:37, type:'ABS_LEGS', name:'Calf Raise',         muscle:'Calves',          equipment:'Machine/Bodyweight',
    description:'Specific calf development. High reps and full range of motion are key.',
    steps:['Stand with balls of feet on edge of step or platform.','Lower heels as far as possible — full stretch.','Rise up on toes as high as possible — full contraction.'],
    levels:{ novice:'3×15 bodyweight — feel the full stretch', beginner:'3×20 bodyweight', intermediate:'4×20 weighted — seated or standing', advanced:'4×25 heavy — 2s hold at top', elite:'5×20+ — single leg, weighted, slow tempo' }},
  { id:38, type:'ABS_LEGS', name:'Plank',              muscle:'Core',            equipment:'Bodyweight',
    description:'The most functional core exercise. Trains anti-extension and full-body tension.',
    steps:['Forearms on floor, elbows under shoulders, body straight.','Squeeze glutes, quads, and core simultaneously.','Breathe in and out slowly — do not let hips sag or rise.'],
    levels:{ novice:'3×20s — build daily', beginner:'3×40s', intermediate:'4×60s', advanced:'4×90s — add plate on back', elite:'5×2 min — RKC plank variation (max tension)' }},
  { id:39, type:'ABS_LEGS', name:'Crunch',             muscle:'Upper Abs',       equipment:'Bodyweight',
    description:'Classic ab isolation exercise targeting the upper rectus abdominis.',
    steps:['Lie on back, knees bent, hands behind head lightly.','Crunch shoulder blades off floor — do not pull neck.','Squeeze abs at top, lower slowly.'],
    levels:{ novice:'3×15 — slow and controlled only', beginner:'3×20', intermediate:'4×25 — add resistance', advanced:'4×20 weighted plate on chest', elite:'5×15 cable crunch — heavy' }},
  { id:40, type:'ABS_LEGS', name:'Russian Twist',      muscle:'Obliques',        equipment:'Bodyweight',
    description:'Rotational core exercise that targets the obliques and improves rotational strength.',
    steps:['Sit at 45°, knees bent, feet slightly off floor.','Clasp hands or hold weight — rotate torso left and right.','Touch floor with hands on each side for full rep.'],
    levels:{ novice:'3×10 per side, feet on floor', beginner:'3×15 per side, feet elevated', intermediate:'4×15 per side + 4 kg plate', advanced:'4×20 per side + 8 kg', elite:'5×15 per side + 15 kg — slam variation' }},
  { id:41, type:'ABS_LEGS', name:'Hanging Leg Raise',  muscle:'Lower Abs & Hip Flexors',equipment:'Bar',
    description:'The best exercise for lower abs and hip flexors. Requires significant core strength.',
    steps:['Hang from pull-up bar with dead hang.','Raise both legs to 90° or beyond — control the swing.','Lower slowly — do not drop.'],
    levels:{ novice:'3×5 — bent knee raise version', beginner:'3×10 bent knee', intermediate:'4×10 straight legs', advanced:'4×12 straight — toes to bar', elite:'5×15 — L-sit hold + raises' }},
  { id:42, type:'ABS_LEGS', name:'Mountain Climbers',  muscle:'Core & Cardio',   equipment:'Bodyweight',
    description:'Dynamic core exercise that combines planking with cardio for functional fitness.',
    steps:['Start in high plank, hands under shoulders.','Drive one knee toward chest while other leg stays extended.','Alternate legs rapidly — keep hips level.'],
    levels:{ novice:'3×20s slow', beginner:'3×30s moderate', intermediate:'4×40s fast', advanced:'4×60s — cross-body variation', elite:'5×60s max speed — weighted vest' }},
  { id:43, type:'ABS_LEGS', name:'Ab Wheel',           muscle:'Full Core',       equipment:'Ab Wheel',
    description:'One of the hardest core exercises. Trains the entire anterior core under heavy load.',
    steps:['Kneel with wheel under shoulders.','Roll out slowly, keeping core braced and back flat.','Pull back by contracting abs — do not use hip flexors.'],
    levels:{ novice:'3×5 partial rollouts — do not go full range yet', beginner:'3×8 with wall stop', intermediate:'4×10 full range from knees', advanced:'4×8 standing rollout from plates', elite:'5×10 standing full rollout' }},
  { id:44, type:'ABS_LEGS', name:'Side Plank',         muscle:'Obliques & Core', equipment:'Bodyweight',
    description:'Anti-lateral flexion exercise essential for spinal stability and oblique strength.',
    steps:['Lie on side, forearm on floor, elbow under shoulder.','Raise hips until body forms a straight line.','Hold position, breathing continuously.'],
    levels:{ novice:'3×20s per side', beginner:'3×30s per side', intermediate:'4×45s per side', advanced:'4×60s per side — with hip dip', elite:'5×60s per side — elevated feet + reach under' }},
  { id:45, type:'ABS_LEGS', name:'Dead Bug',           muscle:'Deep Core',       equipment:'Bodyweight',
    description:'Anti-extension core exercise that teaches full-body coordination and spinal bracing.',
    steps:['Lie on back, arms straight up, knees at 90°.','Lower opposite arm/leg toward floor while pressing lower back down.','Return to start before switching sides.'],
    levels:{ novice:'3×5 per side — lower back must stay glued to floor', beginner:'3×8 per side', intermediate:'4×10 per side — add 2s hold', advanced:'4×10 per side — straight leg variation', elite:'5×10 per side — cable resistance version' }},

  // ── CARDIO (46–60) ───────────────────────────────────────────────────────────
  { id:46, type:'CARDIO', name:'Sprint Intervals',     muscle:'Full Body',       equipment:'None',
    description:'High-intensity sprint training that burns fat, builds speed and improves VO2 max rapidly.',
    steps:['Warm up 5 min at easy jog.','Sprint at 90–100% effort for 20–30s.','Walk or slow jog for 60–90s recovery — repeat.'],
    levels:{ novice:'4 rounds × 20s sprint — full walk recovery', beginner:'6 rounds × 20s — 60s walk', intermediate:'8 rounds × 30s — 45s walk', advanced:'10 rounds × 30s — 30s walk', elite:'12 rounds × 30s — 20s walk — hill sprints' }},
  { id:47, type:'CARDIO', name:'Jump Rope',            muscle:'Full Body',       equipment:'Jump Rope',
    description:'One of the best cardio tools — burns 800+ kcal/hr and improves coordination and rhythm.',
    steps:['Hold handles at hip height, rope behind heels.','Turn rope with wrists only — minimal arm movement.','Jump just high enough to clear rope — land softly on balls of feet.'],
    levels:{ novice:'3×30s basic jumps — rest 1 min', beginner:'3×60s — rest 60s', intermediate:'5×60s — 30s rest, add alternate feet', advanced:'5×2 min — double unders', elite:'10 min continuous — triple unders or speed rope' }},
  { id:48, type:'CARDIO', name:'Burpees',              muscle:'Full Body',       equipment:'None',
    description:'The most efficient full-body conditioning exercise. Combines push-up, jump, and plank.',
    steps:['Stand, then jump feet back to plank — perform push-up.','Jump feet forward to hands, stand and jump up — hands overhead.','Land softly and repeat immediately.'],
    levels:{ novice:'3×5 — step back/forward instead of jumping', beginner:'3×8 — full movement', intermediate:'4×10 — 30s rest', advanced:'5×15 — 20s rest', elite:'5×20 — under 30s each set' }},
  { id:49, type:'CARDIO', name:'Box Jump',             muscle:'Legs & Explosiveness',equipment:'Box',
    description:'Plyometric jump that builds explosive lower body power and fast-twitch muscle fibers.',
    steps:['Stand 30 cm from box. Swing arms back.','Explode upward, driving arms and knees up.','Land softly on box with both feet. Step down — do not jump down.'],
    levels:{ novice:'3×5 onto low box 30 cm', beginner:'3×8 onto 40 cm box', intermediate:'4×6 onto 60 cm', advanced:'4×6 onto 70–80 cm', elite:'5×5 onto 90+ cm — depth jump variation' }},
  { id:50, type:'CARDIO', name:'High Knees',           muscle:'Core & Hip Flexors',equipment:'None',
    description:'Running in place with maximum knee drive — improves running mechanics and burns calories fast.',
    steps:['Stand tall, core tight.','Drive alternating knees up to hip height or higher.','Pump arms in opposition — fast rhythmic pace.'],
    levels:{ novice:'3×20s — moderate pace', beginner:'3×30s — faster', intermediate:'4×40s', advanced:'5×45s — arms raised overhead', elite:'5×60s max pace — resistance bands at ankles' }},
  { id:51, type:'CARDIO', name:'Jump Squat',           muscle:'Quads & Glutes', equipment:'None',
    description:'Plyometric lower body exercise combining squat strength with explosive power.',
    steps:['Squat to parallel, arms back.','Explode upward reaching arms overhead.','Land softly, immediately sink into next squat.'],
    levels:{ novice:'3×8 — partial squat, small jump', beginner:'3×10 — full squat depth', intermediate:'4×12 — continuous rhythm', advanced:'4×15 — +5 kg vest', elite:'5×15 — +10 kg vest or barbell' }},
  { id:52, type:'CARDIO', name:'Jumping Jacks',        muscle:'Full Body',      equipment:'None',
    description:'Classic cardio staple. Good warm-up and active recovery movement.',
    steps:['Stand, arms at sides.','Jump feet apart, raise arms overhead simultaneously.','Return to start — keep rhythm consistent.'],
    levels:{ novice:'3×20', beginner:'3×40', intermediate:'4×60', advanced:'4×80 — weighted vest', elite:'5×100 — as fast as possible' }},
  { id:53, type:'CARDIO', name:'Battle Ropes',         muscle:'Upper Body & Core',equipment:'Ropes',
    description:'Explosive upper body cardio that builds arm endurance and core stability simultaneously.',
    steps:['Hold one rope end in each hand, slight squat position.','Create waves by alternating arms up and down rapidly.','Keep waves large and consistent — stay in squat.'],
    levels:{ novice:'3×15s — alternating waves', beginner:'3×20s', intermediate:'4×30s — double waves', advanced:'5×40s — slams + waves', elite:'5×60s — max effort, multi-pattern' }},
  { id:54, type:'CARDIO', name:'Stair Climbing',       muscle:'Glutes & Cardio',  equipment:'Stairs',
    description:'Step-by-step cardio that doubles as glute and quad training. Low impact on joints.',
    steps:['Find stairs or step machine. Start slow to warm up.','Take one step at a time, push through full foot.','Skip steps for added glute activation.'],
    levels:{ novice:'10 min steady pace', beginner:'15 min moderate', intermediate:'20 min — fast pace or every-other-step', advanced:'30 min — weighted vest', elite:'45 min — double steps, weighted vest, no handrails' }},
  { id:55, type:'CARDIO', name:'Cycling',              muscle:'Legs & Cardio',   equipment:'Bike',
    description:'Low-impact cardio that builds aerobic base without joint stress. Ideal for recovery days.',
    steps:['Set bike height — leg should be nearly straight at bottom of pedal.','Start at easy resistance, build into zone 2 heart rate.','Maintain consistent cadence 75–90 RPM.'],
    levels:{ novice:'15 min at easy pace — zone 2 HR', beginner:'20 min moderate', intermediate:'30 min with 5 min hard intervals', advanced:'45 min — hill sprints every 5 min', elite:'60 min — structured interval program' }},
  { id:56, type:'CARDIO', name:'Bear Crawl',           muscle:'Full Body Core',  equipment:'None',
    description:'Primal movement pattern training coordination, core, and shoulder stability.',
    steps:['On hands and feet, knees hovering 5 cm off floor.','Move forward: right hand + left foot simultaneously.','Keep back flat, do not rotate hips — slow is harder.'],
    levels:{ novice:'3×10m — slow and controlled', beginner:'3×15m', intermediate:'4×20m — backward variation', advanced:'4×20m — with push-up at each end', elite:'5×30m — weighted vest + lateral variation' }},
  { id:57, type:'CARDIO', name:'Rowing Machine',       muscle:'Full Body',       equipment:'Rowing Machine',
    description:'Full-body cardio machine — 60% legs, 20% core, 20% arms. Zero joint impact.',
    steps:['Catch position: shins vertical, arms extended, lean slightly forward.','Drive legs first, then swing body back, then pull handle to sternum.','Return in reverse order: arms, body, legs.'],
    levels:{ novice:'10 min at easy pace — learn the sequence', beginner:'15 min moderate', intermediate:'5×3 min hard / 1 min easy', advanced:'4×5 min at 85% max effort', elite:'2000m time trial — then program accordingly' }},
  { id:58, type:'CARDIO', name:'Ski Jumps',            muscle:'Legs & Core',     equipment:'None',
    description:'Lateral plyometric hops that build hip abductor strength and agility.',
    steps:['Stand on one leg, slight bend.','Jump laterally to opposite leg, landing softly.','Immediately jump back — minimize ground contact time.'],
    levels:{ novice:'3×10 per side — slow with pause', beginner:'3×15 per side continuous', intermediate:'4×20 per side — speed focus', advanced:'5×25 per side — distance focus', elite:'5×30 per side — weighted vest' }},
  { id:59, type:'CARDIO', name:'HIIT Circuit',         muscle:'Full Body',       equipment:'None',
    description:'Rotating station circuit at maximum intensity. Best time-efficient fat-burning session.',
    steps:['Choose 4–6 exercises. Set timer: 40s work / 20s rest.','Go all-out on each exercise — this is supposed to be hard.','Rest 2 min after each full round.'],
    levels:{ novice:'2 rounds × 4 exercises × 20s work', beginner:'3 rounds × 4 exercises × 30s work', intermediate:'4 rounds × 5 exercises × 40s work', advanced:'5 rounds × 6 exercises × 45s work', elite:'6 rounds × 6 exercises × 50s work / 10s rest' }},
  { id:60, type:'CARDIO', name:'Running — Steady State',muscle:'Full Body & Cardio',equipment:'None',
    description:'Aerobic base building. Zone 2 running is the foundation of all endurance and fat metabolism.',
    steps:['Start with 5 min walk/easy jog warm-up.','Run at a pace where you can hold a conversation — zone 2.','End with 5 min easy cool-down and stretch.'],
    levels:{ novice:'15 min run/walk intervals — 1 min run, 2 min walk', beginner:'20 min continuous easy run', intermediate:'30 min at zone 2 heart rate', advanced:'45 min — include 3×2 min tempo surges', elite:'60 min+ — structured base build or tempo run' }},
]

// ─── Constants ───────────────────────────────────────────────────────────────
const TYPES = ['PULL', 'PUSH', 'ABS_LEGS', 'CARDIO']
const TYPE_INFO_STATIC: Record<string, { emoji: string; color: string }> = {
  PULL:     { emoji: '🔙', color: '#2d6a4f' },
  PUSH:     { emoji: '🔛', color: '#6b4226' },
  ABS_LEGS: { emoji: '🦵', color: '#40916c' },
  CARDIO:   { emoji: '🏃', color: '#a07850' },
}
const LEVELS = ['novice', 'beginner', 'intermediate', 'advanced', 'elite'] as const
const emptyLogForm = { type: 'PULL', title: '', date: new Date().toISOString().split('T')[0], notes: '' }
const emptyLogEx = { name: '', sets: 3, reps: '8-10', notes: '' }

// ─── Exercise Card Component ──────────────────────────────────────────────────
function ExCard({
  ex, isFav, onFav, onEdit, t,
}: {
  ex: ExCard; isFav: boolean; onFav: () => void; onEdit: () => void
  t: ReturnType<typeof useLang>['t']
}) {
  const [step, setStep] = useState(0)
  const [level, setLevel] = useState<typeof LEVELS[number]>('beginner')
  const info = TYPE_INFO_STATIC[ex.type]
  const levelKeys = LEVELS
  const levelLabels = [t.levelNovice, t.levelBeginner, t.levelIntermediate, t.levelAdvanced, t.levelElite]

  return (
    <div className="rounded-2xl border-2 flex flex-col overflow-hidden shadow-sm"
      style={{ backgroundColor: '#fff', borderColor: '#e8dcc8' }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: info.color }}>{info.emoji} {ex.type}</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#f0e8d8', color: '#8b5e3c' }}>{ex.equipment}</span>
          </div>
          <h3 className="font-bold text-sm leading-tight" style={{ color: '#1a3a1a' }}>{ex.name}</h3>
          <p className="text-xs mt-0.5" style={{ color: '#a07850' }}>{ex.muscle}</p>
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={onEdit} className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
            style={{ backgroundColor: '#f0e8d8', color: '#8b5e3c' }}>✏️</button>
          <button onClick={onFav} className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
            style={{ backgroundColor: isFav ? '#fde8ec' : '#f0e8d8' }}>
            <span style={{ fontSize: 14 }}>{isFav ? '❤️' : '🤍'}</span>
          </button>
        </div>
      </div>

      {/* Step Carousel */}
      <div className="mx-4 mb-2 rounded-xl p-3 relative" style={{ backgroundColor: '#f9f5ef', minHeight: 88 }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold" style={{ color: '#2d6a4f' }}>{t.stepLabel} {step + 1}/{ex.steps.length}</span>
          <div className="flex gap-1">
            <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
              className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center disabled:opacity-30"
              style={{ backgroundColor: '#d8f3dc', color: '#2d6a4f' }}>‹</button>
            <button onClick={() => setStep(s => Math.min(ex.steps.length - 1, s + 1))} disabled={step === ex.steps.length - 1}
              className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center disabled:opacity-30"
              style={{ backgroundColor: '#d8f3dc', color: '#2d6a4f' }}>›</button>
          </div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: '#6b4226' }}>{ex.steps[step]}</p>
        {/* Dots */}
        <div className="flex gap-1 mt-2">
          {ex.steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className="w-1.5 h-1.5 rounded-full transition-all"
              style={{ backgroundColor: i === step ? '#2d6a4f' : '#c4a882' }} />
          ))}
        </div>
      </div>

      {/* Level Tabs */}
      <div className="px-4 pb-2">
        <div className="flex gap-1 overflow-x-auto pb-1 mb-2" style={{ scrollbarWidth: 'none' }}>
          {levelKeys.map((lk, i) => (
            <button key={lk} onClick={() => setLevel(lk)}
              className="px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0"
              style={{ backgroundColor: level === lk ? info.color : '#f0e8d8', color: level === lk ? '#fff' : '#6b4226' }}>
              {levelLabels[i].split(' ')[0]}
            </button>
          ))}
        </div>
        <p className="text-xs leading-relaxed rounded-xl p-2.5" style={{ backgroundColor: '#f0faf2', color: '#2d6a4f' }}>
          {levelLabels[levelKeys.indexOf(level)]} — {ex.levels[level]}
        </p>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function WorkoutPage() {
  const { t } = useLang()

  const TYPE_INFO: Record<string, { label: string; emoji: string; color: string }> = {
    PULL:     { label: t.pullDay,  emoji: '🔙', color: '#2d6a4f' },
    PUSH:     { label: t.pushDay,  emoji: '🔛', color: '#6b4226' },
    ABS_LEGS: { label: t.absLegs,  emoji: '🦵', color: '#40916c' },
    CARDIO:   { label: t.cardio,   emoji: '🏃', color: '#a07850' },
  }

  // ── Main tab ────────────────────────────────────────────────────────────────
  const [mainTab, setMainTab] = useState<'library' | 'log' | 'week'>('library')

  // ── Library state ──────────────────────────────────────────────────────────
  const [libCat, setLibCat] = useState('PULL')
  const [libFilter, setLibFilter] = useState<'all' | 'favs'>('all')
  const [favExercises, setFavExercises] = useState<Set<number>>(new Set())
  const [editEx, setEditEx] = useState<ExCard | null>(null)
  const [customNotes, setCustomNotes] = useState<Record<number, string>>({})
  const [noteInput, setNoteInput] = useState('')

  // ── Log state ──────────────────────────────────────────────────────────────
  const [logCat, setLogCat] = useState('PULL')
  const [sessions, setSessions] = useState<Session[]>([])
  const [logModal, setLogModal] = useState(false)
  const [logForm, setLogForm] = useState(emptyLogForm)
  const [logExercises, setLogExercises] = useState<{ name: string; sets: number; reps: string; notes: string }[]>([{ ...emptyLogEx }])
  const [editingLog, setEditingLog] = useState<number | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [logSaving, setLogSaving] = useState(false)

  // ── Week plan state ────────────────────────────────────────────────────────
  const [weekDay, setWeekDay] = useState(0)
  const [weekPlan, setWeekPlan] = useState<Record<string, number[]>>({})
  const [pickModal, setPickModal] = useState(false)
  const [pickCat, setPickCat] = useState('PULL')
  const [doneSets, setDoneSets] = useState<Set<string>>(new Set()) // "day-exId"

  // ── Load ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      setFavExercises(new Set(JSON.parse(localStorage.getItem('favEx') || '[]')))
      setCustomNotes(JSON.parse(localStorage.getItem('exNotes') || '{}'))
      setWeekPlan(JSON.parse(localStorage.getItem('weekWorkout') || '{}'))
      setDoneSets(new Set(JSON.parse(localStorage.getItem('exDone') || '[]')))
    } catch {}
  }, [])

  const loadSessions = (type?: string) =>
    fetch(`/api/workout${type ? `?type=${type}` : ''}`).then(r => r.json()).then(setSessions)
  useEffect(() => { if (mainTab === 'log') loadSessions(logCat) }, [logCat, mainTab])

  // ── Library helpers ────────────────────────────────────────────────────────
  const filteredLib = useMemo(() =>
    EXERCISES.filter(e => e.type === libCat && (libFilter === 'all' || favExercises.has(e.id))),
    [libCat, libFilter, favExercises])

  const toggleFav = (id: number) => {
    const next = new Set(favExercises)
    if (next.has(id)) next.delete(id); else next.add(id)
    setFavExercises(next); localStorage.setItem('favEx', JSON.stringify([...next]))
  }

  const openEdit = (ex: ExCard) => {
    setEditEx(ex); setNoteInput(customNotes[ex.id] || '')
  }
  const saveNote = () => {
    if (!editEx) return
    const next = { ...customNotes, [editEx.id]: noteInput }
    setCustomNotes(next); localStorage.setItem('exNotes', JSON.stringify(next)); setEditEx(null)
  }

  // ── Log helpers ────────────────────────────────────────────────────────────
  const openLogAdd = () => { setLogForm({ ...emptyLogForm, type: logCat }); setLogExercises([{ ...emptyLogEx }]); setEditingLog(null); setLogModal(true) }
  const openLogEdit = (s: Session) => {
    setLogForm({ type: s.type, title: s.title, date: s.date, notes: s.notes || '' })
    setLogExercises(JSON.parse(s.exercises)); setEditingLog(s.id); setLogModal(true)
  }
  const saveLog = async () => {
    setLogSaving(true)
    await fetch(editingLog ? `/api/workout/${editingLog}` : '/api/workout', { method: editingLog ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...logForm, exercises: logExercises }) })
    await loadSessions(logCat); setLogModal(false); setLogSaving(false)
  }
  const delLog = async (id: number) => {
    if (!confirm(t.deleteSession)) return
    await fetch(`/api/workout/${id}`, { method: 'DELETE' }); loadSessions(logCat)
  }
  const generateAI = async () => {
    setAiLoading(true)
    try {
      const r = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'workout', data: { sessionType: logForm.type } }) })
      const data = await r.json()
      setLogForm(f => ({ ...f, title: data.title || f.title, notes: data.notes || f.notes }))
      if (data.exercises?.length) setLogExercises(data.exercises)
    } catch { alert(t.aiFailed) }
    setAiLoading(false)
  }
  const addLogEx = () => setLogExercises(ex => [...ex, { ...emptyLogEx }])
  const removeLogEx = (i: number) => setLogExercises(ex => ex.filter((_, j) => j !== i))
  const updateLogEx = (i: number, k: string, v: string | number) =>
    setLogExercises(ex => ex.map((e, j) => j === i ? { ...e, [k]: v } : e))

  // ── Week helpers ───────────────────────────────────────────────────────────
  const dayKey = t.days[weekDay]
  const dayExIds = weekPlan[dayKey] || []
  const dayExercises = EXERCISES.filter(e => dayExIds.includes(e.id))

  const addToDay = (id: number) => {
    const cur = weekPlan[dayKey] || []
    if (cur.includes(id)) return
    const next = { ...weekPlan, [dayKey]: [...cur, id] }
    setWeekPlan(next); localStorage.setItem('weekWorkout', JSON.stringify(next))
  }
  const removeFromDay = (id: number) => {
    const next = { ...weekPlan, [dayKey]: (weekPlan[dayKey] || []).filter(i => i !== id) }
    setWeekPlan(next); localStorage.setItem('weekWorkout', JSON.stringify(next))
  }
  const clearDay = () => {
    const next = { ...weekPlan }; delete next[dayKey]
    setWeekPlan(next); localStorage.setItem('weekWorkout', JSON.stringify(next))
    const cleaned = new Set([...doneSets].filter(k => !k.startsWith(dayKey + '-')))
    setDoneSets(cleaned); localStorage.setItem('exDone', JSON.stringify([...cleaned]))
  }
  const toggleDone = (exId: number) => {
    const key = `${dayKey}-${exId}`
    const next = new Set(doneSets)
    if (next.has(key)) next.delete(key); else next.add(key)
    setDoneSets(next); localStorage.setItem('exDone', JSON.stringify([...next]))
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1a3a1a' }}>💪 Workout</h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: '#8b5e3c' }}>{t.workoutSubtitle}</p>
        </div>
        {mainTab === 'log' && (
          <button onClick={openLogAdd} className="btn-glass btn-glass-green px-4 py-2.5 rounded-xl text-sm font-medium">{t.logBtn}</button>
        )}
        {mainTab === 'week' && (
          <button onClick={() => setPickModal(true)} className="btn-glass btn-glass-green px-4 py-2.5 rounded-xl text-sm font-medium">{t.addToDay}</button>
        )}
      </div>

      {/* Main Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {([['library', t.libraryTab], ['log', t.workoutLogTab], ['week', t.workoutWeekTab]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setMainTab(key)}
            className="px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all"
            style={{ backgroundColor: mainTab === key ? '#2d6a4f' : '#f0e8d8', color: mainTab === key ? '#fff' : '#6b4226' }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── LIBRARY TAB ──────────────────────────────────────────────────────── */}
      {mainTab === 'library' && (
        <>
          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-3" style={{ scrollbarWidth: 'none' }}>
            {TYPES.map(tp => {
              const info = TYPE_INFO[tp]
              return (
                <button key={tp} onClick={() => setLibCat(tp)}
                  className="px-3 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap flex items-center gap-1 transition-all"
                  style={{ backgroundColor: libCat === tp ? info.color : '#f0e8d8', color: libCat === tp ? '#fff' : '#6b4226' }}>
                  {info.emoji} {info.label}
                </button>
              )
            })}
          </div>

          {/* All / Favs sub-filter */}
          <div className="flex gap-2 mb-5">
            {(['all', 'favs'] as const).map(f => (
              <button key={f} onClick={() => setLibFilter(f)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{ backgroundColor: libFilter === f ? '#c0303e' : '#fde8ec', color: libFilter === f ? '#fff' : '#c0303e' }}>
                {f === 'all' ? t.allExercises : '❤️ Favs'}
              </button>
            ))}
            <span className="text-xs ml-auto self-center" style={{ color: '#a07850' }}>{filteredLib.length} exercises</span>
          </div>

          {filteredLib.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: '#f9f5ef', color: '#a07850' }}>
              <p className="text-4xl mb-2">❤️</p>
              <p className="font-medium text-sm">{t.noFavExercises}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLib.map(ex => (
                <ExCard key={ex.id} ex={ex} isFav={favExercises.has(ex.id)}
                  onFav={() => toggleFav(ex.id)} onEdit={() => openEdit(ex)} t={t} />
              ))}
            </div>
          )}

          {/* Favs section per category */}
          {libFilter === 'all' && favExercises.size > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-base font-semibold" style={{ color: '#1a3a1a' }}>❤️ Favorites — {TYPE_INFO[libCat]?.label}</h2>
                <div className="flex-1 h-px" style={{ backgroundColor: '#e8dcc8' }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {EXERCISES.filter(e => e.type === libCat && favExercises.has(e.id)).map(ex => (
                  <ExCard key={ex.id} ex={ex} isFav={true}
                    onFav={() => toggleFav(ex.id)} onEdit={() => openEdit(ex)} t={t} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── LOG TAB ──────────────────────────────────────────────────────────── */}
      {mainTab === 'log' && (
        <>
          <div className="flex gap-2 overflow-x-auto pb-1 mb-5" style={{ scrollbarWidth: 'none' }}>
            {TYPES.map(tp => {
              const info = TYPE_INFO[tp]
              return (
                <button key={tp} onClick={() => setLogCat(tp)}
                  className="px-3 sm:px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex items-center gap-1.5 transition-all"
                  style={{ backgroundColor: logCat === tp ? info.color : '#f0e8d8', color: logCat === tp ? '#fff' : '#6b4226' }}>
                  {info.emoji} {info.label}
                </button>
              )
            })}
          </div>
          {sessions.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: '#f9f5ef', color: '#a07850' }}>
              <p className="text-4xl mb-2">{TYPE_INFO[logCat]?.emoji}</p>
              <p className="font-medium text-sm">{t.noSessions(TYPE_INFO[logCat]?.label ?? '')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map(s => {
                const exs = JSON.parse(s.exercises) as { name: string; sets: number; reps: string; notes: string }[]
                const info = TYPE_INFO[s.type]
                return (
                  <div key={s.id} className="rounded-2xl border-2 p-4 shadow-sm" style={{ backgroundColor: '#fff', borderColor: '#e8dcc8' }}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: info?.color }}>{info?.emoji} {info?.label}</span>
                        <h3 className="font-semibold text-base mt-1.5" style={{ color: '#1a3a1a' }}>{s.title}</h3>
                        <p className="text-xs mt-0.5" style={{ color: '#a07850' }}>{s.date}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => openLogEdit(s)} className="text-xs px-2 py-1 rounded-lg" style={{ color: '#8b5e3c', backgroundColor: '#f0e8d8' }}>{t.edit}</button>
                        <button onClick={() => delLog(s.id)} className="text-xs px-2 py-1 rounded-lg" style={{ color: '#c0303e', backgroundColor: '#fde8ec' }}>{t.del}</button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {exs.map((ex, i) => (
                        <div key={i} className="flex items-center gap-2 py-1.5 px-3 rounded-xl" style={{ backgroundColor: '#f9f5ef' }}>
                          <span className="font-medium text-sm flex-1 truncate" style={{ color: '#1a3a1a' }}>{ex.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: '#d8f3dc', color: '#2d6a4f' }}>{ex.sets}×{ex.reps}</span>
                        </div>
                      ))}
                    </div>
                    {s.notes && <p className="text-xs mt-2 italic" style={{ color: '#a07850' }}>{s.notes}</p>}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* ── WEEK PLAN TAB ─────────────────────────────────────────────────────── */}
      {mainTab === 'week' && (
        <>
          {/* Day selector */}
          <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {t.days.map((day, i) => {
              const planned = (weekPlan[day] || []).length
              return (
                <button key={day} onClick={() => setWeekDay(i)}
                  className="flex-1 min-w-[42px] flex flex-col items-center py-2.5 px-1 rounded-xl text-xs font-medium transition-all relative"
                  style={{ backgroundColor: weekDay === i ? '#2d6a4f' : '#f0e8d8', color: weekDay === i ? '#fff' : '#6b4226' }}>
                  {day}
                  {planned > 0 && (
                    <span className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: weekDay === i ? '#74c69d' : '#40916c', fontSize: '9px' }}>{planned}</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Day exercises */}
          {dayExercises.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: '#f9f5ef', color: '#a07850' }}>
              <p className="text-4xl mb-2">📅</p>
              <p className="font-medium text-sm px-4">{t.workoutWeekEmpty}</p>
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-3">
                <button onClick={clearDay} className="text-xs px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#fde8ec', color: '#c0303e' }}>{t.clearDay}</button>
              </div>
              <div className="space-y-3">
                {dayExercises.map(ex => {
                  const doneKey = `${dayKey}-${ex.id}`
                  const isDone = doneSets.has(doneKey)
                  const info = TYPE_INFO_STATIC[ex.type]
                  return (
                    <div key={ex.id} className="rounded-2xl border-2 p-4 flex items-center gap-3 transition-all"
                      style={{ backgroundColor: isDone ? '#f0faf2' : '#fff', borderColor: isDone ? '#2d6a4f' : '#e8dcc8' }}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: info.color }}>{info.emoji}</span>
                          <span className="font-semibold text-sm truncate" style={{ color: isDone ? '#52b788' : '#1a3a1a', textDecoration: isDone ? 'line-through' : 'none' }}>{ex.name}</span>
                        </div>
                        <p className="text-xs" style={{ color: '#a07850' }}>{ex.muscle} · {ex.equipment}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button onClick={() => toggleDone(ex.id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                          style={{ backgroundColor: isDone ? '#d8f3dc' : '#f0faf2', color: '#2d6a4f' }}>
                          {isDone ? '✓' : t.markExDone}
                        </button>
                        <button onClick={() => removeFromDay(ex.id)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                          style={{ backgroundColor: '#fde8ec', color: '#c0303e' }}>×</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </>
      )}

      {/* ── Edit Exercise Modal ─────────────────────────────────────────────── */}
      {editEx && (
        <Modal title={t.editExercise} onClose={() => setEditEx(null)}>
          <div className="mb-2">
            <p className="font-semibold text-sm mb-1" style={{ color: '#1a3a1a' }}>{editEx.name}</p>
            <p className="text-xs mb-4" style={{ color: '#a07850' }}>{editEx.muscle} · {editEx.equipment}</p>
            <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>{t.personalNotes}</label>
            <textarea value={noteInput} onChange={e => setNoteInput(e.target.value)} rows={4}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none"
              style={{ borderColor: '#d4c5a9' }}
              placeholder="Your custom notes, cues, weight used..." />
          </div>
          {customNotes[editEx.id] && (
            <p className="text-xs italic mb-3 px-2 py-1.5 rounded-lg" style={{ backgroundColor: '#f9f5ef', color: '#a07850' }}>
              Previously saved: {customNotes[editEx.id]}
            </p>
          )}
          <div className="flex gap-2 mt-4">
            <button onClick={() => setEditEx(null)} className="btn-glass btn-glass-neutral flex-1 py-2.5 rounded-xl text-sm font-medium">{t.cancel}</button>
            <button onClick={saveNote} className="btn-glass btn-glass-green flex-1 py-2.5 rounded-xl text-sm font-medium">{t.saveNotes}</button>
          </div>
        </Modal>
      )}

      {/* ── Pick Exercise Modal (Week Plan) ────────────────────────────────── */}
      {pickModal && (
        <Modal title={t.pickExercise} onClose={() => setPickModal(false)} wide>
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: 'none' }}>
            {TYPES.map(tp => {
              const info = TYPE_INFO[tp]
              return (
                <button key={tp} onClick={() => setPickCat(tp)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1 transition-all"
                  style={{ backgroundColor: pickCat === tp ? info.color : '#f0e8d8', color: pickCat === tp ? '#fff' : '#6b4226' }}>
                  {info.emoji} {info.label}
                </button>
              )
            })}
          </div>
          <div className="space-y-2">
            {EXERCISES.filter(e => e.type === pickCat).map(ex => {
              const already = (weekPlan[dayKey] || []).includes(ex.id)
              return (
                <div key={ex.id} className="flex items-center gap-3 p-3 rounded-xl border"
                  style={{ backgroundColor: already ? '#f0faf2' : '#f9f5ef', borderColor: already ? '#2d6a4f' : '#e8dcc8' }}>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm" style={{ color: '#1a3a1a' }}>{ex.name}</p>
                    <p className="text-xs" style={{ color: '#a07850' }}>{ex.muscle} · {ex.equipment}</p>
                  </div>
                  <button
                    onClick={() => { addToDay(ex.id); }}
                    disabled={already}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium disabled:opacity-40"
                    style={{ backgroundColor: already ? '#d8f3dc' : '#2d6a4f', color: '#fff' }}>
                    {already ? '✓' : '+'}
                  </button>
                </div>
              )
            })}
          </div>
        </Modal>
      )}

      {/* ── Log Session Modal ───────────────────────────────────────────────── */}
      {logModal && (
        <Modal title={editingLog ? t.editSession : t.logSession} onClose={() => setLogModal(false)} wide>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>{t.type}</label>
                <select value={logForm.type} onChange={e => setLogForm(f => ({ ...f, type: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#d4c5a9' }}>
                  {TYPES.map(tp => <option key={tp} value={tp}>{TYPE_INFO[tp].label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>{t.date}</label>
                <input type="date" value={logForm.date} onChange={e => setLogForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#d4c5a9' }} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>{t.sessionTitle}</label>
              <input value={logForm.title} onChange={e => setLogForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Heavy Push Day" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#d4c5a9' }} />
            </div>
            <button onClick={generateAI} disabled={aiLoading} className="w-full py-2.5 rounded-xl text-sm font-medium disabled:opacity-60" style={{ backgroundColor: '#f0e8d8', color: '#6b4226' }}>
              {aiLoading ? t.aiGenerating : t.aiSuggest}
            </button>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium" style={{ color: '#6b4226' }}>{t.exercises}</label>
                <button onClick={addLogEx} className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: '#d8f3dc', color: '#2d6a4f' }}>+ Add</button>
              </div>
              <div className="space-y-2">
                {logExercises.map((ex, i) => (
                  <div key={i} className="rounded-xl p-2 space-y-2" style={{ backgroundColor: '#f9f5ef' }}>
                    <div className="flex gap-2">
                      <input value={ex.name} onChange={e => updateLogEx(i, 'name', e.target.value)} placeholder={t.exerciseName}
                        className="flex-1 px-2.5 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#d4c5a9', backgroundColor: '#fff' }} />
                      <button onClick={() => removeLogEx(i)} className="px-2 py-1 rounded-lg text-xs" style={{ color: '#c0303e', backgroundColor: '#fde8ec' }}>×</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input type="number" value={ex.sets} onChange={e => updateLogEx(i, 'sets', Number(e.target.value))} placeholder={t.sets} className="px-2.5 py-2 rounded-lg border text-sm outline-none text-center" style={{ borderColor: '#d4c5a9', backgroundColor: '#fff' }} />
                      <input value={ex.reps} onChange={e => updateLogEx(i, 'reps', e.target.value)} placeholder={t.reps} className="px-2.5 py-2 rounded-lg border text-sm outline-none text-center" style={{ borderColor: '#d4c5a9', backgroundColor: '#fff' }} />
                      <input value={ex.notes} onChange={e => updateLogEx(i, 'notes', e.target.value)} placeholder={t.notes} className="px-2.5 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#d4c5a9', backgroundColor: '#fff' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>{t.sessionNotes}</label>
              <textarea value={logForm.notes} onChange={e => setLogForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: '#d4c5a9' }} />
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={() => setLogModal(false)} className="btn-glass btn-glass-neutral flex-1 py-2.5 rounded-xl text-sm font-medium">{t.cancel}</button>
            <button onClick={saveLog} disabled={logSaving} className="btn-glass btn-glass-green flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60">
              {logSaving ? t.saving : t.saveSession}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
