/**
 * Exercise library source data.
 *
 * Deliberately a curated subset rather than the full 146-row `exercises`
 * table from the app. A page per exercise only earns rankings if it says
 * something worth reading: the one-line descriptions in exercises-seed.sql
 * would produce 146 thin pages and drag the whole domain down. These 33 cover
 * every lift referenced by the training guides, so no internal link dead-ends.
 */

export type Exercise = {
  slug: string;
  name: string;
  /** Alternate names people actually search for. Rendered as "Also known as". */
  aliases: string[];
  muscleGroup: MuscleGroup;
  primary: string[];
  secondary: string[];
  equipment: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  mechanics: 'Compound' | 'Isolation';
  /** One-sentence summary used for meta description and card copy. */
  summary: string;
  setup: string[];
  execution: string[];
  mistakes: { title: string; detail: string }[];
  programming: { sets: string; reps: string; rest: string; note: string };
  variations: string[];
  faq: { q: string; a: string }[];
};

export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Shoulders'
  | 'Legs'
  | 'Arms'
  | 'Core';

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'Chest',
  'Back',
  'Shoulders',
  'Legs',
  'Arms',
  'Core',
];

export const exercises: Exercise[] = [
  // ── CHEST ──────────────────────────────────────────────────────────────
  {
    slug: 'barbell-bench-press',
    name: 'Barbell Bench Press',
    aliases: ['Bench Press', 'Flat Bench Press'],
    muscleGroup: 'Chest',
    primary: ['Pectoralis major'],
    secondary: ['Anterior deltoid', 'Triceps brachii'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    mechanics: 'Compound',
    summary:
      'The benchmark upper-body pressing lift, and the most reliable way to load the chest heavily.',
    setup: [
      'Lie flat with your eyes directly under the bar.',
      'Pull your shoulder blades down and back, and hold them there: this is the position you press from.',
      'Plant both feet flat and drive them into the floor to create a stable arch through your upper back.',
      'Grip slightly wider than shoulder-width, wrists stacked over your forearms rather than bent back.',
    ],
    execution: [
      'Unrack the bar and bring it over your mid-chest with your arms locked.',
      'Lower under control to the base of your sternum, elbows tucked to roughly 45–75° from your torso.',
      'Touch the chest without bouncing, then drive the bar up and slightly back toward your face.',
      'Lock out without letting your shoulder blades roll forward off the bench.',
    ],
    mistakes: [
      {
        title: 'Flaring the elbows to 90°',
        detail:
          'Elbows straight out to the sides puts the shoulder in its most vulnerable position and shortens the pec\'s effective leverage. Tuck to around 45–75°.',
      },
      {
        title: 'Losing the upper back',
        detail:
          'If your shoulder blades unpack as you press, you lose your platform and the shoulder takes load the chest should be carrying. Retract before you unrack and hold it for every rep.',
      },
      {
        title: 'Bouncing off the chest',
        detail:
          'A bounce uses tendon elasticity to get through the hardest part of the lift, which is exactly the part you want to train. Touch and press.',
      },
      {
        title: 'Feet moving',
        detail:
          'Shuffling feet means you have no leg drive and no stable base. Set them once, drive them down, leave them.',
      },
    ],
    programming: {
      sets: '3–5',
      reps: '4–8 for strength, 8–12 for size',
      rest: '2–3 min',
      note: 'Leave 1–2 reps in reserve on your heavy sets. Bench is the lift where grinding to failure most often costs you a shoulder.',
    },
    variations: [
      'Incline Barbell Press: more upper chest',
      'Close-Grip Bench Press: more triceps',
      'Dumbbell Bench Press: greater range of motion, easier on the shoulders',
      'Floor Press: limits range of motion for lifters with shoulder pain',
    ],
    faq: [
      {
        q: 'How wide should my bench press grip be?',
        a: 'Slightly wider than shoulder-width, such that your forearms are roughly vertical when the bar touches your chest. Wider shortens the range of motion but stresses the shoulder more; narrower shifts work to the triceps.',
      },
      {
        q: 'Should I arch my back when benching?',
        a: 'A moderate arch from squeezing your shoulder blades together and driving your feet down is correct and safe: it stabilises the shoulder. An extreme arch that lifts your lower back well off the bench is a powerlifting technique for reducing range of motion, not a general recommendation.',
      },
      {
        q: 'Why does my shoulder hurt when I bench?',
        a: 'Usually flared elbows, an unstable shoulder blade position, or too much pressing volume relative to pulling volume. Tuck the elbows, retract and hold the shoulder blades, and make sure your weekly rowing sets at least match your pressing sets.',
      },
    ],
  },
  {
    slug: 'incline-barbell-press',
    name: 'Incline Barbell Press',
    aliases: ['Incline Bench Press'],
    muscleGroup: 'Chest',
    primary: ['Upper pectoralis major'],
    secondary: ['Anterior deltoid', 'Triceps brachii'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    mechanics: 'Compound',
    summary:
      'Bench press angled to bias the clavicular head of the chest: the part that builds the shelf under the collarbone.',
    setup: [
      'Set the bench to 30–45°. Steeper than 45° turns it into a shoulder press.',
      'Retract your shoulder blades into the pad and keep them there.',
      'Grip slightly wider than shoulder-width.',
      'Feet flat, braced.',
    ],
    execution: [
      'Unrack and position the bar over your upper chest.',
      'Lower to just below the collarbone, elbows tucked to about 45°.',
      'Press back up in a straight line over the same point.',
      'Keep the shoulder blades pinned throughout.',
    ],
    mistakes: [
      {
        title: 'Bench angle too steep',
        detail:
          'Past 45° the front delt takes over and the chest contribution falls sharply. 30° is plenty for most lifters.',
      },
      {
        title: 'Touching too low',
        detail:
          'Bringing the bar to mid-chest on an incline puts the shoulder in an awkward extended position. Touch high, just under the collarbone.',
      },
      {
        title: 'Treating it like flat bench weight',
        detail:
          'You will press meaningfully less on an incline. Chasing your flat bench numbers here ends in poor technique.',
      },
    ],
    programming: {
      sets: '3–4',
      reps: '6–12',
      rest: '2–3 min',
      note: 'Works well as a primary press on a second weekly chest session, or as the follow-up to flat bench.',
    },
    variations: [
      'Incline Dumbbell Press: bigger stretch, independent arms',
      'Low-incline (15–20°): a middle ground between flat and incline',
    ],
    faq: [
      {
        q: 'What incline is best for upper chest?',
        a: 'Around 30°. Research and practice both point to 30–45° maximising upper-pec involvement, with front-delt takeover increasing sharply beyond that.',
      },
      {
        q: 'Should I do incline before or after flat bench?',
        a: 'Whichever you want to prioritise goes first, while you are fresh. If your upper chest is lagging, lead with incline.',
      },
    ],
  },
  {
    slug: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    aliases: ['Incline DB Press'],
    muscleGroup: 'Chest',
    primary: ['Upper pectoralis major'],
    secondary: ['Anterior deltoid', 'Triceps brachii'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    mechanics: 'Compound',
    summary:
      'Upper-chest pressing with a longer range of motion than the barbell and no bar to limit how deep you go.',
    setup: [
      'Bench at 30–45°.',
      'Sit with the dumbbells on your thighs, then kick them up one at a time as you lie back.',
      'Shoulder blades retracted, feet planted.',
      'Start with the dumbbells at shoulder level, palms facing forward.',
    ],
    execution: [
      'Press up and slightly inward until the dumbbells are nearly touching over your upper chest.',
      'Do not clash them together: keep tension on the chest.',
      'Lower under control until you feel a stretch across the chest, roughly level with your shoulders.',
      'Keep your elbows at about 45° from your torso.',
    ],
    mistakes: [
      {
        title: 'Going too heavy to control the descent',
        detail:
          'The value of dumbbells is the stretch at the bottom. If you are dropping into it rather than lowering, you are getting the fatigue without the stimulus.',
      },
      {
        title: 'Pressing in an arc that ends behind the head',
        detail:
          'Press over the upper chest, not over your face. Drifting back shifts the load to the front delt.',
      },
      {
        title: 'Elbows flaring wide at the bottom',
        detail: 'Deep stretch plus wide elbows is where shoulder injuries happen. Keep the tuck.',
      },
    ],
    programming: {
      sets: '3–4',
      reps: '8–12',
      rest: '2 min',
      note: 'Excellent as a primary press for lifters with cranky shoulders: the free path lets each arm find its own groove.',
    },
    variations: [
      'Neutral-grip incline press: palms facing each other, shoulder-friendly',
      'Flat Dumbbell Press: mid and lower chest emphasis',
    ],
    faq: [
      {
        q: 'Is incline dumbbell press better than incline barbell?',
        a: 'For hypertrophy, dumbbells have an edge: greater range of motion and each arm works independently so the stronger side cannot compensate. The barbell allows more absolute load, which suits strength work.',
      },
      {
        q: 'How do I get heavy dumbbells into position safely?',
        a: 'Sit upright with a dumbbell resting on each thigh, then kick one knee up at a time as you lean back, letting the momentum bring the dumbbell to your shoulder. Reverse it to finish: do not just drop them.',
      },
    ],
  },
  {
    slug: 'cable-flye',
    name: 'Cable Flye',
    aliases: ['Cable Fly', 'Cable Crossover'],
    muscleGroup: 'Chest',
    primary: ['Pectoralis major'],
    secondary: ['Anterior deltoid'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    mechanics: 'Isolation',
    summary:
      'Chest isolation with constant tension through the whole range: the cable keeps loading the muscle where dumbbells stop.',
    setup: [
      'Set both pulleys to roughly shoulder height for a mid-chest flye.',
      'Take a handle in each hand and step forward into a staggered stance.',
      'Lean slightly forward from the hips with a soft bend in the elbows.',
    ],
    execution: [
      'Bring your hands together in a wide hugging arc in front of your chest.',
      'Squeeze at the point where your hands meet, and let them cross slightly for a stronger contraction.',
      'Return slowly, opening the arms until you feel a stretch across the chest.',
      'Keep the elbow angle fixed: it is a flye, not a press.',
    ],
    mistakes: [
      {
        title: 'Bending and straightening the elbows',
        detail:
          'That turns the movement into a pressing motion and hands the work to the triceps. Set the elbow angle at the start and hold it.',
      },
      {
        title: 'Going too heavy',
        detail:
          'Excess weight forces the shoulders to help and shortens your range. Flyes are a feel exercise: pick a weight you control at the stretch.',
      },
      {
        title: 'Stopping at the midline',
        detail:
          'The chest is fully shortened when your arms cross past centre. Letting the handles cross adds range that dumbbells physically cannot.',
      },
    ],
    programming: {
      sets: '3',
      reps: '12–15',
      rest: '45–60 s',
      note: 'An accessory, not a main lift. Run it after your pressing work, and take these close to failure: the fatigue cost is low.',
    },
    variations: [
      'High-to-low cable flye: lower chest',
      'Low-to-high cable flye: upper chest',
      'Pec Deck, same job, more stable, less setup',
    ],
    faq: [
      {
        q: 'Cable flye or dumbbell flye?',
        a: 'Cables, for most purposes. A dumbbell flye loses almost all tension at the top because the resistance is vertical while the muscle is shortening horizontally. Cables keep tension across the entire range.',
      },
      {
        q: 'What height should the pulleys be?',
        a: 'Shoulder height for overall chest, high for a downward arc emphasising the lower chest, low for an upward arc emphasising the upper chest.',
      },
    ],
  },
  {
    slug: 'chest-dip',
    name: 'Chest Dip',
    aliases: ['Dips', 'Parallel Bar Dip'],
    muscleGroup: 'Chest',
    primary: ['Lower pectoralis major'],
    secondary: ['Triceps brachii', 'Anterior deltoid'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    mechanics: 'Compound',
    summary:
      'One of the best lower-chest builders, and a movement that scales from assisted to heavily weighted.',
    setup: [
      'Grip parallel bars slightly wider than shoulder-width and press up to a locked-out start.',
      'Lean your torso forward about 30°: this is what makes it a chest dip rather than a triceps dip.',
      'Cross your ankles behind you and brace your core.',
    ],
    execution: [
      'Lower under control until your shoulders are just below your elbows.',
      'Keep the forward lean throughout: do not let your torso come upright as you descend.',
      'Let your elbows travel out slightly rather than staying pinned to your sides.',
      'Press back up, squeezing the chest at the top.',
    ],
    mistakes: [
      {
        title: 'Going too deep',
        detail:
          'Descending until your shoulders are well below your elbows puts the shoulder capsule under heavy load in a compromised position. Shoulders slightly below elbow height is deep enough.',
      },
      {
        title: 'Staying upright',
        detail:
          'An upright torso makes this a triceps exercise. If you want chest, lean forward and keep leaning.',
      },
      {
        title: 'Shrugging at the bottom',
        detail:
          'Letting your shoulders rise toward your ears at the bottom means you have lost scapular control. Keep the shoulders depressed.',
      },
    ],
    programming: {
      sets: '3–4',
      reps: '8–12',
      rest: '2 min',
      note: 'Add weight with a dip belt once you pass 12 clean bodyweight reps. Use an assisted dip machine or band if you cannot yet do 5.',
    },
    variations: [
      'Assisted dip: machine or band',
      'Weighted dip: dip belt',
      'Ring dip: significantly harder, more stabiliser demand',
    ],
    faq: [
      {
        q: 'Are dips bad for your shoulders?',
        a: 'Dips are hard on the shoulder only when taken too deep or performed with poor scapular control. Stopping when your shoulders reach just below elbow height keeps the joint in a safe range. If they hurt regardless, a deficit push-up or a decline press is a reasonable substitute.',
      },
      {
        q: 'How do I make dips target chest instead of triceps?',
        a: 'Lean your torso forward roughly 30°, widen your grip slightly, and let your elbows drift out rather than staying tucked. An upright torso with tucked elbows is the triceps version.',
      },
    ],
  },
  {
    slug: 'dumbbell-pullover',
    name: 'Dumbbell Pullover',
    aliases: ['Pullover'],
    muscleGroup: 'Chest',
    primary: ['Pectoralis major', 'Latissimus dorsi'],
    secondary: ['Triceps brachii', 'Serratus anterior'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    mechanics: 'Compound',
    summary:
      'An old-school movement that loads the chest and lats in a deep overhead stretch few other exercises reach.',
    setup: [
      'Lie along or across a flat bench with your upper back supported.',
      'Hold a single dumbbell with both hands cupped under the top plate.',
      'Start with the dumbbell over your chest, elbows slightly bent.',
    ],
    execution: [
      'Lower the dumbbell back over and behind your head in an arc.',
      'Go until you feel a strong stretch through the chest and lats: do not force past comfortable range.',
      'Pull back over your chest along the same arc.',
      'Keep the elbow angle fixed throughout.',
    ],
    mistakes: [
      {
        title: 'Bending the elbows to pull',
        detail: 'That turns it into a clumsy triceps extension. Fixed, slightly bent elbows.',
      },
      {
        title: 'Arching the lower back to gain range',
        detail:
          'The range should come from the shoulders, not the spine. Keep your ribs down and your core braced.',
      },
      {
        title: 'Too much weight',
        detail:
          'This is a stretch-loaded movement in a vulnerable overhead position. Moderate weight, full control.',
      },
    ],
    programming: {
      sets: '3',
      reps: '12–15',
      rest: '60 s',
      note: 'Best used as a finisher on chest or back day. Excellent for lifters who struggle to feel their lats.',
    },
    variations: [
      'Cable pullover (standing, rope): constant tension, easier on the shoulder',
      'Cross-bench pullover: hips lower, greater stretch',
    ],
    faq: [
      {
        q: 'Is the pullover a chest or back exercise?',
        a: 'Both, and which one dominates depends on execution. Elbows tucked closer and a focus on driving through the armpit emphasises the lats; elbows wider with a chest-focused squeeze emphasises the pecs.',
      },
    ],
  },

  // ── BACK ───────────────────────────────────────────────────────────────
  {
    slug: 'deadlift',
    name: 'Deadlift',
    aliases: ['Conventional Deadlift', 'Barbell Deadlift'],
    muscleGroup: 'Back',
    primary: ['Erector spinae', 'Gluteus maximus', 'Hamstrings'],
    secondary: ['Latissimus dorsi', 'Trapezius', 'Forearms', 'Quadriceps'],
    equipment: 'Barbell',
    difficulty: 'Advanced',
    mechanics: 'Compound',
    summary:
      'The heaviest lift most people will ever perform, and the most complete expression of posterior chain strength.',
    setup: [
      'Stand with the bar over mid-foot, roughly an inch from your shins.',
      'Hinge at the hips and grip just outside your legs.',
      'Drop your hips until your shins touch the bar, chest up, back flat.',
      'Take the slack out of the bar (pull up on it until you hear the plates settle) before you pull.',
    ],
    execution: [
      'Push the floor away with your legs rather than pulling with your back.',
      'Keep the bar in contact with your legs the whole way up.',
      'Hips and shoulders rise together, if your hips shoot up first, the weight is too heavy or your brace failed.',
      'Lock out by squeezing the glutes. Do not lean back or hyperextend.',
      'Lower by hinging the hips back first, then bending the knees once the bar passes them.',
    ],
    mistakes: [
      {
        title: 'Rounding the lower back',
        detail:
          'A rounded lumbar spine under maximal load is the highest-risk position in the gym. If your back rounds before the bar leaves the floor, reduce the weight and work on your brace and hip mobility.',
      },
      {
        title: 'Bar drifting away from the shins',
        detail:
          'Every centimetre the bar sits forward of mid-foot dramatically increases the load on your lower back. Keep it dragging up your legs.',
      },
      {
        title: 'Hips rising first',
        detail:
          'This turns the lift into a stiff-legged good morning. Think about pushing your feet through the floor rather than lifting your chest.',
      },
      {
        title: 'Hyperextending at lockout',
        detail:
          'Leaning back at the top adds nothing and compresses the lumbar spine. Stand tall, squeeze glutes, stop.',
      },
    ],
    programming: {
      sets: '2–4',
      reps: '3–6',
      rest: '3–4 min',
      note: 'Deadlifts cost more recovery than any other lift. Most people need only one heavy deadlift session a week, and lower total volume than they use on squats.',
    },
    variations: [
      'Sumo Deadlift: wider stance, more quad and hip, shorter range',
      'Romanian Deadlift: hamstring focused, no floor reset',
      'Trap Bar Deadlift: more upright torso, easier on the lower back',
      'Deficit Deadlift: standing on a plate to increase range',
    ],
    faq: [
      {
        q: 'How often should I deadlift?',
        a: 'Once a week is enough for most lifters, and plenty for anyone pulling heavy. The deadlift produces more systemic fatigue per set than any other lift, so extra frequency usually costs more in recovery than it returns in progress.',
      },
      {
        q: 'Should I use straps for deadlifts?',
        a: 'Use them once your grip is what fails rather than your back and legs, usually on higher-rep or heavier volume sets. Pull your top working sets without straps to keep building grip, and strap up for the rest.',
      },
      {
        q: 'Is it OK to round your upper back when deadlifting?',
        a: 'A small amount of upper-back rounding is common among experienced lifters and is far lower risk than lumbar rounding, because the thoracic spine tolerates flexion better. The lower back should stay neutral regardless.',
      },
    ],
  },
  {
    slug: 'barbell-row',
    name: 'Barbell Row',
    aliases: ['Bent-Over Row', 'Pendlay Row'],
    muscleGroup: 'Back',
    primary: ['Latissimus dorsi', 'Rhomboids', 'Middle trapezius'],
    secondary: ['Posterior deltoid', 'Biceps brachii', 'Erector spinae'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    mechanics: 'Compound',
    summary:
      'The heaviest horizontal pull available, and the best single counterweight to a heavy bench press.',
    setup: [
      'Stand with feet hip-width, bar over mid-foot.',
      'Hinge at the hips until your torso is around 15–45° above horizontal, knees softly bent.',
      'Grip just outside shoulder-width, overhand.',
      'Brace hard: your lower back holds this position for the whole set.',
    ],
    execution: [
      'Pull the bar to your lower chest or upper abdomen.',
      'Lead with your elbows and drive them back past your torso.',
      'Squeeze your shoulder blades together at the top.',
      'Lower under control without letting your torso rise.',
    ],
    mistakes: [
      {
        title: 'Standing up as you pull',
        detail:
          'Using hip extension to help the bar up is the most common row error. The torso angle should be identical at the start and end of every rep.',
      },
      {
        title: 'Pulling to the wrong place',
        detail:
          'Rowing to the chest hits upper back; rowing to the navel hits lats. Rowing to nowhere in particular hits neither well. Pick one.',
      },
      {
        title: 'Rounding the lower back',
        detail:
          'A loaded hinge held for 8 reps is demanding. If your back rounds mid-set, the weight is too heavy.',
      },
      {
        title: 'Curling the bar up with the arms',
        detail:
          'If your biceps fail before your back, you are pulling with your arms. Think about driving the elbows back, not lifting the hands.',
      },
    ],
    programming: {
      sets: '3–4',
      reps: '6–10',
      rest: '2–3 min',
      note: 'Match or exceed your weekly bench press sets with rowing sets. Pressing volume without pulling volume is how shoulders end up rounded forward.',
    },
    variations: [
      'Pendlay Row: bar resets on the floor each rep, strict and explosive',
      'Underhand (Yates) Row: more lat and bicep involvement',
      'Chest-Supported Row: removes the lower back entirely',
      'Dumbbell Row, one arm at a time, greater range',
    ],
    faq: [
      {
        q: 'How bent over should I be for barbell rows?',
        a: 'Between 15° and 45° above horizontal. Closer to horizontal is stricter and targets the back harder; more upright allows heavier weight but lets your hips assist. Pick an angle and keep it constant within a set.',
      },
      {
        q: 'Barbell row or dumbbell row?',
        a: 'Barbell rows allow more total load and are more time-efficient. Dumbbell rows give a greater range of motion and stop your stronger side compensating. Most good programmes include both.',
      },
    ],
  },
  {
    slug: 'pull-up',
    name: 'Pull Up',
    aliases: ['Pullup', 'Chin Up (underhand variation)'],
    muscleGroup: 'Back',
    primary: ['Latissimus dorsi'],
    secondary: ['Biceps brachii', 'Rhomboids', 'Middle trapezius', 'Forearms'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    mechanics: 'Compound',
    summary:
      'The vertical pull that builds back width, and the clearest bodyweight strength benchmark there is.',
    setup: [
      'Grip the bar overhand, slightly wider than shoulder-width.',
      'Hang with your arms fully extended but your shoulders active, not slack.',
      'Brace your core and cross your ankles or hold your legs slightly forward.',
    ],
    execution: [
      'Begin by depressing your shoulder blades: pull them down before you bend your arms.',
      'Drive your elbows down and back toward your ribs.',
      'Pull until your chin clears the bar, chest tracking toward it.',
      'Lower under control to a full hang. No dropping.',
    ],
    mistakes: [
      {
        title: 'Starting the pull with the arms',
        detail:
          'If you bend your elbows before your shoulder blades move, your biceps do the work and your lats never fully engage. Scapula first, always.',
      },
      {
        title: 'Half reps',
        detail:
          'Stopping short of a full hang at the bottom or the chin at the top cuts out the range where most of the growth is. Full range, fewer reps.',
      },
      {
        title: 'Kipping to hit a number',
        detail:
          'Swinging your legs to generate momentum makes the number bigger and the stimulus smaller. If you need momentum, use band assistance instead.',
      },
    ],
    programming: {
      sets: '3–4',
      reps: 'AMRAP, or 5–10 weighted',
      rest: '2–3 min',
      note: 'Once you can do 12 clean reps, add weight with a dip belt rather than chasing higher rep counts.',
    },
    variations: [
      'Chin Up: underhand grip, more biceps, usually stronger',
      'Neutral-Grip Pull Up: palms facing, shoulder-friendly',
      'Band-Assisted Pull Up, for building up to your first rep',
      'Weighted Pull Up: dip belt or weight vest',
    ],
    faq: [
      {
        q: 'How do I get my first pull up?',
        a: 'Train three things: band-assisted pull-ups for the pattern, slow negatives (jump to the top and lower over 5 seconds) for strength through the range, and lat pulldowns for volume. Most people get there within eight to twelve weeks.',
      },
      {
        q: 'Pull ups or chin ups for back?',
        a: 'Both build the lats well. The overhand pull-up involves slightly less biceps and slightly more upper back; the underhand chin-up lets you handle more weight and hits biceps harder. Rotate between them.',
      },
      {
        q: 'Why can I do lat pulldowns but not pull ups?',
        a: 'Pulldowns are usually performed at well under bodyweight and the machine stabilises you. If you can pulldown your bodyweight for reps but cannot do a pull-up, the gap is stabilisation and grip: train the negatives.',
      },
    ],
  },
  {
    slug: 'lat-pulldown',
    name: 'Lat Pulldown',
    aliases: ['Pulldown'],
    muscleGroup: 'Back',
    primary: ['Latissimus dorsi'],
    secondary: ['Biceps brachii', 'Rhomboids', 'Middle trapezius'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    mechanics: 'Compound',
    summary:
      'The scalable vertical pull, same movement pattern as a pull-up, with load you can dial to any level.',
    setup: [
      'Set the thigh pad snug so you are not lifted off the seat.',
      'Grip the bar wider than shoulder-width, overhand.',
      'Sit tall, then lean back roughly 15–20° and hold that angle.',
    ],
    execution: [
      'Depress your shoulder blades first, then pull.',
      'Drive your elbows down toward your ribs, bringing the bar to your upper chest.',
      'Squeeze at the bottom without letting your torso lean back further.',
      'Return slowly to full extension, allowing the shoulder blades to rise at the top.',
    ],
    mistakes: [
      {
        title: 'Leaning back progressively through the set',
        detail:
          'Starting upright and finishing almost horizontal means you are turning a pulldown into a row to move more weight. Set your angle and hold it.',
      },
      {
        title: 'Pulling behind the neck',
        detail:
          'Behind-the-neck pulldowns force the shoulder into extreme external rotation for no additional benefit. Pull to the chest.',
      },
      {
        title: 'Not letting the shoulders rise at the top',
        detail:
          'Full lat lengthening requires the scapula to travel upward at the top of each rep. Cutting that out costs you the stretched portion of the range.',
      },
    ],
    programming: {
      sets: '3–4',
      reps: '10–15',
      rest: '90 s–2 min',
      note: 'Ideal as the higher-rep vertical pull on a volume day, with pull-ups as the heavy version earlier in the week.',
    },
    variations: [
      'Close neutral-grip pulldown: more mid-back, shoulder-friendly',
      'Underhand pulldown: more biceps and lower lat',
      'Single-arm cable pulldown: fixes side-to-side imbalances',
    ],
    faq: [
      {
        q: 'How wide should my lat pulldown grip be?',
        a: 'Around 1.5 times shoulder-width. Excessively wide grips shorten the range of motion without adding lat activation, and stress the shoulder more.',
      },
      {
        q: 'Are lat pulldowns as good as pull ups?',
        a: 'Close, for hypertrophy. Pull-ups demand more stabilisation and core involvement, but pulldowns allow precise load selection and easier progressive overload, which matters more for building muscle than the stabilisation difference does.',
      },
    ],
  },
  {
    slug: 'seated-cable-row',
    name: 'Seated Cable Row',
    aliases: ['Cable Row', 'Low Row'],
    muscleGroup: 'Back',
    primary: ['Rhomboids', 'Middle trapezius', 'Latissimus dorsi'],
    secondary: ['Posterior deltoid', 'Biceps brachii'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    mechanics: 'Compound',
    summary:
      'Horizontal pulling with constant tension and no lower-back cost: the row you can do heavy volume on.',
    setup: [
      'Sit with feet braced on the platform, knees softly bent.',
      'Grip the handle and sit tall with your chest up.',
      'Arms extended, torso roughly vertical.',
    ],
    execution: [
      'Pull the handle to your lower ribs, driving the elbows straight back.',
      'Squeeze the shoulder blades together at the end of the pull.',
      'Return under control, letting your shoulder blades protract at full extension.',
      'Keep your torso still: no rocking forward and back.',
    ],
    mistakes: [
      {
        title: 'Rowing with the torso',
        detail:
          'Swinging your upper body back and forth turns the row into a lower-back exercise with a handle attached. Lock the torso and move only your arms and shoulder blades.',
      },
      {
        title: 'Shrugging',
        detail:
          'If your traps rise toward your ears you are pulling too high. Keep the shoulders down and pull to the lower ribs.',
      },
      {
        title: 'Cutting the stretch',
        detail:
          'Letting the shoulder blades come forward at full extension is part of the movement, not sloppy form. Just do not round the lower back to reach further.',
      },
    ],
    programming: {
      sets: '3–4',
      reps: '10–15',
      rest: '90 s',
      note: 'Because it costs almost nothing in lower-back fatigue, this is the row to add volume with when your barbell rows are already taxing.',
    },
    variations: [
      'Wide-grip cable row: more upper back and rear delt',
      'Single-arm cable row: greater range, fixes imbalances',
      'Chest-supported machine row, same benefit, even more stable',
    ],
    faq: [
      {
        q: 'Should I use a wide or narrow grip on cable rows?',
        a: 'A narrow neutral grip pulled to the lower ribs emphasises the lats. A wide grip pulled higher, to the sternum, emphasises the rhomboids and rear delts. Both are worth programming.',
      },
    ],
  },
  {
    slug: 'dumbbell-row',
    name: 'Dumbbell Row',
    aliases: ['One-Arm Row', 'Single-Arm Dumbbell Row'],
    muscleGroup: 'Back',
    primary: ['Latissimus dorsi', 'Rhomboids'],
    secondary: ['Posterior deltoid', 'Biceps brachii'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    mechanics: 'Compound',
    summary:
      'Unilateral rowing with the longest range of motion of any row, and no way for your strong side to cover for your weak one.',
    setup: [
      'Place one knee and the same-side hand on a bench.',
      'Plant the other foot on the floor, slightly back.',
      'Let the dumbbell hang at arm\'s length, shoulder relaxed downward.',
      'Keep your back flat and roughly parallel to the floor.',
    ],
    execution: [
      'Pull the dumbbell to your hip, elbow tracking close to your side.',
      'Drive the elbow past your torso and squeeze at the top.',
      'Lower fully, letting your shoulder blade travel forward at the bottom.',
      'Keep your torso square: do not rotate to gain height.',
    ],
    mistakes: [
      {
        title: 'Rotating the torso to finish the rep',
        detail:
          'Twisting turns a back exercise into a rotational one and usually means the weight is too heavy. Keep both shoulders level.',
      },
      {
        title: 'Rowing to the armpit',
        detail:
          'Pulling high and wide shifts work to the rear delt and upper traps. For lats, pull to the hip with the elbow close.',
      },
      {
        title: 'Short range at the bottom',
        detail:
          'Letting the arm fully extend and the shoulder blade protract at the bottom is where the stretch is. Do not cut it.',
      },
    ],
    programming: {
      sets: '3',
      reps: '10–15 each side',
      rest: '90 s',
      note: 'Run your weaker side first and match its reps on the strong side, that is how imbalances actually close.',
    },
    variations: [
      'Chest-supported dumbbell row: removes lower back and torso rotation',
      'Kroc row: high-rep, heavy, straps on, deliberately less strict',
      'Meadows row: landmine setup, strong stretch',
    ],
    faq: [
      {
        q: 'Should I row to my hip or my chest?',
        a: 'To the hip with a tucked elbow for lats; toward the chest with a wider elbow for upper back and rear delts. Most programmes benefit from including both.',
      },
    ],
  },
  {
    slug: 'face-pull',
    name: 'Face Pull',
    aliases: ['Rope Face Pull'],
    muscleGroup: 'Back',
    primary: ['Posterior deltoid', 'Rhomboids', 'Middle trapezius'],
    secondary: ['External rotators', 'Lower trapezius'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    mechanics: 'Isolation',
    summary:
      'The single best insurance policy against the shoulder problems that heavy pressing creates.',
    setup: [
      'Set a cable to roughly face height with a rope attachment.',
      'Grip the rope with both hands, thumbs pointing back toward you.',
      'Step back until there is tension, feet staggered.',
    ],
    execution: [
      'Pull the rope toward your face, separating your hands as you go.',
      'Finish with your hands beside your ears and your elbows high, in an external-rotation position.',
      'Squeeze the rear delts and mid-back for a beat.',
      'Return under control without letting your shoulders roll forward.',
    ],
    mistakes: [
      {
        title: 'Too much weight',
        detail:
          'Heavy face pulls become rows. If you are leaning back or your elbows drop below shoulder height, halve the weight.',
      },
      {
        title: 'No external rotation',
        detail:
          'Pulling the rope straight to your face without separating your hands misses the rotator cuff work that makes this exercise valuable.',
      },
      {
        title: 'Elbows dropping',
        detail:
          'Elbows should stay at or above shoulder height throughout. Dropped elbows turn it into a high row.',
      },
    ],
    programming: {
      sets: '3',
      reps: '15–20',
      rest: '45 s',
      note: 'Nearly impossible to overdo. Two to four sets on every upper-body day is reasonable, particularly if you bench heavily.',
    },
    variations: [
      'Band face pull, same movement, usable anywhere',
      'Prone incline rear delt row: bench-supported alternative',
    ],
    faq: [
      {
        q: 'How often should I do face pulls?',
        a: 'Every upper-body session is fine. They use light loads, target muscles that are almost universally undertrained, and produce very little systemic fatigue.',
      },
      {
        q: 'Do face pulls fix rounded shoulders?',
        a: 'They help by strengthening the rear delts, mid-traps and external rotators that pull the shoulders back. Posture is also driven by pressing-to-pulling volume ratio and time spent seated, so face pulls alone are not a complete fix.',
      },
    ],
  },
  {
    slug: 'rear-delt-flye',
    name: 'Rear Delt Flye',
    aliases: ['Reverse Flye', 'Bent-Over Lateral Raise'],
    muscleGroup: 'Shoulders',
    primary: ['Posterior deltoid'],
    secondary: ['Rhomboids', 'Middle trapezius'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    mechanics: 'Isolation',
    summary:
      'Direct rear-delt work: the head of the shoulder almost everyone neglects and everyone needs.',
    setup: [
      'Hinge forward at the hips until your torso is close to parallel with the floor, or lie chest-down on an incline bench.',
      'Hold a light dumbbell in each hand, arms hanging, palms facing each other.',
      'Soft bend in the elbows, held constant.',
    ],
    execution: [
      'Raise the dumbbells out to the sides in a wide arc.',
      'Lead with your elbows, not your hands.',
      'Stop when your arms are level with your torso.',
      'Lower slowly under control.',
    ],
    mistakes: [
      {
        title: 'Using far too much weight',
        detail:
          'The rear delt is small. Heavy dumbbells turn this into a jerky row driven by the traps and lower back.',
      },
      {
        title: 'Squeezing the shoulder blades together',
        detail:
          'That recruits the rhomboids and takes work away from the rear delt. Let the shoulder blades stay relatively still and move at the shoulder joint.',
      },
      {
        title: 'Swinging upright to start each rep',
        detail:
          'If your torso rises as you lift, you are using momentum. Chest-supported on an incline bench removes the temptation entirely.',
      },
    ],
    programming: {
      sets: '3',
      reps: '15–20',
      rest: '45 s',
      note: 'Go lighter than feels right and focus on the contraction. This is a feel exercise, not a load exercise.',
    },
    variations: [
      'Chest-supported incline rear delt flye: strictest version',
      'Cable rear delt flye: constant tension',
      'Reverse pec deck: most stable, easiest to overload',
    ],
    faq: [
      {
        q: 'Why can I not feel my rear delts?',
        a: 'Almost always too much weight, or squeezing the shoulder blades so the rhomboids take over. Halve the load, lie chest-down on an incline bench, and think about moving your upper arm rather than lifting the dumbbell.',
      },
    ],
  },

  // ── SHOULDERS ──────────────────────────────────────────────────────────
  {
    slug: 'overhead-press',
    name: 'Overhead Press',
    aliases: ['Military Press', 'Standing Barbell Press', 'OHP'],
    muscleGroup: 'Shoulders',
    primary: ['Anterior deltoid', 'Lateral deltoid'],
    secondary: ['Triceps brachii', 'Upper trapezius', 'Core'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    mechanics: 'Compound',
    summary:
      'The most honest measure of upper-body pressing strength: nothing to lie on and nowhere to hide.',
    setup: [
      'Set the bar at upper-chest height in a rack, or clean it from the floor.',
      'Grip just outside shoulder-width, elbows slightly in front of the bar.',
      'Bar resting on your front delts, wrists stacked over forearms.',
      'Feet hip-width, glutes and core braced hard.',
    ],
    execution: [
      'Pull your head back slightly so the bar has a clear path.',
      'Press straight up, not forward.',
      'As the bar passes your forehead, push your head back through and finish with the bar over your mid-foot.',
      'Lock out with the bar directly above your shoulders and ears.',
      'Lower under control to the front delts.',
    ],
    mistakes: [
      {
        title: 'Pressing around the head instead of past it',
        detail:
          'Leaning back to make room for the bar loads the lower back. Move your head out of the way instead.',
      },
      {
        title: 'Finishing with the bar in front',
        detail:
          'At lockout the bar should be over the middle of your foot, not out in front of your face. Push the head through.',
      },
      {
        title: 'No glute and core brace',
        detail:
          'A loose midsection turns a strict press into a standing back extension. Squeeze glutes and brace before you press.',
      },
      {
        title: 'Wrists bent back',
        detail:
          'A collapsed wrist wastes force and hurts. Keep the bar stacked over the forearm bones.',
      },
    ],
    programming: {
      sets: '3–4',
      reps: '5–8',
      rest: '2–3 min',
      note: 'Progress will be slow: 1.25 kg jumps are normal and worth buying micro-plates for. The press adds weight roughly half as fast as the bench.',
    },
    variations: [
      'Seated Barbell Press: removes leg drive, stricter',
      'Push Press: leg drive to overload the top end',
      'Dumbbell Shoulder Press: greater range, independent arms',
      'Z-Press: seated on the floor, brutal core demand',
    ],
    faq: [
      {
        q: 'Why is my overhead press so much weaker than my bench?',
        a: 'That is normal: a typical ratio is around 60–65% of your bench. The press has no bench to drive against, a much smaller base of support, and a shorter set of prime movers.',
      },
      {
        q: 'Standing or seated overhead press?',
        a: 'Standing builds more usable strength and demands real core stability. Seated allows more weight and isolates the shoulders more directly. Standing is the better default; seated is a good second pressing movement.',
      },
    ],
  },
  {
    slug: 'dumbbell-shoulder-press',
    name: 'Dumbbell Shoulder Press',
    aliases: ['Dumbbell Overhead Press', 'Seated DB Press'],
    muscleGroup: 'Shoulders',
    primary: ['Anterior deltoid', 'Lateral deltoid'],
    secondary: ['Triceps brachii', 'Upper trapezius'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    mechanics: 'Compound',
    summary:
      'Overhead pressing with a natural arm path and a deeper start position than the barbell allows.',
    setup: [
      'Sit on a bench with the backrest just past vertical, or stand.',
      'Bring the dumbbells to shoulder height, palms facing forward.',
      'Elbows slightly in front of your torso rather than flared straight out.',
      'Brace your core and keep your ribs down.',
    ],
    execution: [
      'Press up and slightly inward until the dumbbells nearly meet overhead.',
      'Keep your wrists stacked over your elbows throughout.',
      'Lower under control to shoulder height or slightly below.',
      'Do not let your lower back arch as you press.',
    ],
    mistakes: [
      {
        title: 'Elbows flared straight out to the sides',
        detail:
          'A slight forward angle is stronger and far kinder to the shoulder joint than pressing in a perfectly frontal plane.',
      },
      {
        title: 'Arching the lower back',
        detail:
          'Turning a shoulder press into an incline press by arching means the weight is too heavy. Ribs down, glutes tight.',
      },
      {
        title: 'Clashing the dumbbells at the top',
        detail:
          'Banging them together lets you rest at lockout. Stop just short and keep tension.',
      },
    ],
    programming: {
      sets: '3–4',
      reps: '8–12',
      rest: '2 min',
      note: 'A good primary press on a volume day, or the follow-up to a heavy barbell press.',
    },
    variations: [
      'Standing dumbbell press: more core demand',
      'Neutral-grip (hammer) press: shoulder-friendly',
      'Arnold press: adds rotation through the range',
    ],
    faq: [
      {
        q: 'Dumbbell or barbell shoulder press?',
        a: 'Barbell allows more absolute load and is the better strength lift. Dumbbells allow a deeper start, a more natural arm path, and stop your stronger side compensating, which generally makes them the better hypertrophy choice.',
      },
    ],
  },
  {
    slug: 'lateral-raise',
    name: 'Lateral Raise',
    aliases: ['Side Raise', 'Dumbbell Lateral Raise'],
    muscleGroup: 'Shoulders',
    primary: ['Lateral deltoid'],
    secondary: ['Anterior deltoid', 'Upper trapezius'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    mechanics: 'Isolation',
    summary:
      'The only exercise that directly loads the side delt, and the one that actually makes shoulders look wide.',
    setup: [
      'Stand with a light dumbbell in each hand at your sides.',
      'Slight forward lean from the hips, soft bend in the elbows.',
      'Shoulders down, away from your ears.',
    ],
    execution: [
      'Raise the dumbbells out to the sides, leading with your elbows.',
      'Stop at shoulder height: no higher.',
      'Keep your pinky slightly higher than your thumb at the top.',
      'Lower slowly, resisting the whole way down.',
    ],
    mistakes: [
      {
        title: 'Swinging the weight up',
        detail:
          'Momentum from the hips is the default failure mode here. If your torso moves, drop the weight: this is a small muscle and it needs a small load.',
      },
      {
        title: 'Shrugging',
        detail:
          'Letting the traps take over defeats the purpose. Keep your shoulders pressed down and stop at shoulder height.',
      },
      {
        title: 'Raising above shoulder height',
        detail:
          'Past horizontal the traps take over from the side delt. Higher is not better here.',
      },
      {
        title: 'Leading with the hands',
        detail:
          'Think about lifting your elbows, not your hands. Leading with the hands turns it into a front-delt movement.',
      },
    ],
    programming: {
      sets: '3–5',
      reps: '12–20',
      rest: '45 s',
      note: 'Respond well to high frequency and high volume. Adding these to every upper-body day is one of the highest-return changes most lifters can make.',
    },
    variations: [
      'Cable lateral raise: constant tension, better at the bottom',
      'Leaning lateral raise: hold a rack and lean away for more range',
      'Lying incline lateral raise: loads the stretched position',
    ],
    faq: [
      {
        q: 'How heavy should lateral raises be?',
        a: 'Much lighter than most people use. If you cannot pause at the top with control, it is too heavy. Many strong lifters do their best work here with 6–10 kg.',
      },
      {
        q: 'Why do I feel lateral raises in my traps?',
        a: 'Usually raising above shoulder height, shrugging as you lift, or going too heavy. Keep the shoulder actively depressed, stop at horizontal, and reduce the load.',
      },
    ],
  },

  // ── LEGS ───────────────────────────────────────────────────────────────
  {
    slug: 'back-squat',
    name: 'Back Squat',
    aliases: ['Barbell Squat', 'Squat'],
    muscleGroup: 'Legs',
    primary: ['Quadriceps', 'Gluteus maximus'],
    secondary: ['Adductors', 'Hamstrings', 'Erector spinae', 'Core'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    mechanics: 'Compound',
    summary:
      'The most complete lower-body exercise, and the one that carries the most total training value per set.',
    setup: [
      'Set the bar at roughly upper-chest height in the rack.',
      'Place the bar across your upper traps (high bar) or rear delts (low bar).',
      'Squeeze your shoulder blades together to create a shelf.',
      'Unrack, step back two steps, feet shoulder-width with toes turned out 15–30°.',
      'Brace: big breath into the belly, tighten the whole midsection.',
    ],
    execution: [
      'Break at the hips and knees together.',
      'Descend until your hip crease passes below the top of your knee.',
      'Keep your knees tracking over your toes: let them travel forward, that is normal.',
      'Drive up through the middle of your foot, hips and shoulders rising at the same rate.',
      'Stand tall and re-brace before the next rep.',
    ],
    mistakes: [
      {
        title: 'Knees caving inward',
        detail:
          'Usually weak glutes or too much weight. Think about screwing your feet into the floor and pushing your knees out as you rise.',
      },
      {
        title: 'Hips shooting up first',
        detail:
          'Turns the squat into a good morning and loads your lower back. Keep your chest up and drive your hips forward as well as up.',
      },
      {
        title: 'Cutting depth',
        detail:
          'Quarter squats let you load enormous weight and build very little. Hip crease below knee, or the set does not count.',
      },
      {
        title: 'Losing the brace mid-set',
        detail:
          'Breathe and re-brace at the top of every rep, not once at the start of the set.',
      },
    ],
    programming: {
      sets: '3–5',
      reps: '5–8 for strength, 8–12 for size',
      rest: '3 min',
      note: 'Squats are the highest-fatigue leg movement. Two sessions a week is plenty for most, with only one of them genuinely heavy.',
    },
    variations: [
      'Front Squat: more quad, more upright, less lower back',
      'Low-Bar Squat: more hip and posterior chain, heavier loads',
      'Box Squat: teaches sitting back, consistent depth',
      'Safety Bar Squat: kinder to shoulders and elbows',
    ],
    faq: [
      {
        q: 'How deep should I squat?',
        a: 'At minimum until your hip crease drops below the top of your knee. Deeper is fine and generally better for the quads and glutes, provided your lower back stays neutral and your heels stay down.',
      },
      {
        q: 'Should my knees go past my toes?',
        a: 'Yes, for most people. Knees travelling forward of the toes is a normal part of a deep squat, particularly for taller lifters and front squats. Forcing the knees back shifts the load onto your lower back.',
      },
      {
        q: 'High bar or low bar squat?',
        a: 'High bar sits on the traps, keeps the torso more upright and emphasises the quads. Low bar sits on the rear delts, involves more hip drive and allows heavier weights. High bar is the better default for general training; low bar suits powerlifting.',
      },
    ],
  },
  {
    slug: 'front-squat',
    name: 'Front Squat',
    aliases: ['Barbell Front Squat'],
    muscleGroup: 'Legs',
    primary: ['Quadriceps'],
    secondary: ['Gluteus maximus', 'Core', 'Upper back'],
    equipment: 'Barbell',
    difficulty: 'Advanced',
    mechanics: 'Compound',
    summary:
      'Squatting with the bar in front, which forces an upright torso and shifts the work firmly onto the quads.',
    setup: [
      'Set the bar on your front delts, not your collarbones.',
      'Use a clean grip (fingers under the bar, elbows high) or a cross-arm grip.',
      'Elbows point forward and stay high: this is what keeps the bar in place.',
      'Feet shoulder-width, toes slightly out.',
    ],
    execution: [
      'Descend with a vertical torso, letting the knees travel forward.',
      'Go to full depth: front squats allow more depth than back squats for most people.',
      'Keep your elbows up throughout. Dropping them drops the bar.',
      'Drive up through mid-foot, staying upright.',
    ],
    mistakes: [
      {
        title: 'Elbows dropping',
        detail:
          'The single point of failure. As elbows drop, the torso pitches forward and the bar rolls off. Fight to keep them high all the way up.',
      },
      {
        title: 'Resting the bar on the collarbones',
        detail:
          'Painful and unstable. The bar sits on the muscle shelf of your front delts, with your hands only guiding it.',
      },
      {
        title: 'Wrist pain from a rigid clean grip',
        detail:
          'You do not need to hold the bar tightly: fingertips are enough. If wrist mobility is limiting, use straps or a cross-arm grip.',
      },
    ],
    programming: {
      sets: '3–4',
      reps: '6–10',
      rest: '2–3 min',
      note: 'Expect roughly 80–85% of your back squat. Excellent as the main lift on a second weekly leg session.',
    },
    variations: [
      'Cross-arm grip front squat: easier on the wrists',
      'Goblet Squat: the accessible entry point to the same pattern',
      'Zercher Squat: bar in the elbow crease, extreme core demand',
    ],
    faq: [
      {
        q: 'Why do my wrists hurt on front squats?',
        a: 'You are gripping the bar too tightly and trying to hold it with your hands. The bar rests on your front delts: your fingers only stop it rolling. Loosen to a fingertip grip, or use a cross-arm or strap grip.',
      },
      {
        q: 'Are front squats better than back squats for quads?',
        a: 'Yes, front squats bias the quads more because the upright torso reduces hip contribution. Back squats allow heavier loading and more total lower-body work, so most programmes benefit from both.',
      },
    ],
  },
  {
    slug: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    aliases: ['RDL', 'Stiff-Leg Deadlift'],
    muscleGroup: 'Legs',
    primary: ['Hamstrings', 'Gluteus maximus'],
    secondary: ['Erector spinae', 'Forearms'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    mechanics: 'Compound',
    summary:
      'The best hamstring builder in the gym, and the movement that teaches the hip hinge better than anything else.',
    setup: [
      'Start standing, holding the bar at hip height with an overhand grip.',
      'Feet hip-width, knees softly bent, and they stay at that same bend throughout.',
      'Shoulders back, lats engaged, bar touching your thighs.',
    ],
    execution: [
      'Push your hips straight back, letting the bar slide down your thighs.',
      'Keep your back flat and your shins near vertical.',
      'Descend until you feel a strong stretch in the hamstrings, usually around mid-shin.',
      'Drive your hips forward to return, squeezing the glutes at the top.',
    ],
    mistakes: [
      {
        title: 'Turning it into a squat',
        detail:
          'Bending the knees more as you descend removes the hamstring stretch entirely. Set the knee angle at the start and do not change it.',
      },
      {
        title: 'Chasing the floor',
        detail:
          'The depth is determined by your hamstring flexibility, not by the plates touching down. Stop when your back would otherwise round.',
      },
      {
        title: 'Letting the bar drift forward',
        detail:
          'The bar should stay in contact with your legs the whole way. Any gap multiplies the load on your lower back.',
      },
      {
        title: 'Hyperextending at the top',
        detail:
          'Finish standing tall with glutes squeezed. Leaning back adds nothing but lumbar compression.',
      },
    ],
    programming: {
      sets: '3–4',
      reps: '8–12',
      rest: '2–3 min',
      note: 'Control the eccentric, three seconds down is not too slow. The stretch under load is where the hamstring growth comes from.',
    },
    variations: [
      'Dumbbell RDL: easier to learn, greater range',
      'Single-leg RDL: balance and unilateral strength',
      'Snatch-grip RDL: wider grip, more upper back and range',
    ],
    faq: [
      {
        q: 'What is the difference between a Romanian deadlift and a conventional deadlift?',
        a: 'The RDL starts at the top and never returns to the floor, keeps the knees fixed in a soft bend, and targets the hamstrings through a loaded stretch. The conventional deadlift starts from the floor, involves substantially more knee bend and quad, and is a heavier full-body lift.',
      },
      {
        q: 'How low should I go on RDLs?',
        a: 'Until you feel a strong hamstring stretch and no further, for most people that is somewhere between just below the knee and mid-shin. The moment your lower back starts to round, you have gone too far.',
      },
    ],
  },
  {
    slug: 'leg-press',
    name: 'Leg Press',
    aliases: ['45-Degree Leg Press'],
    muscleGroup: 'Legs',
    primary: ['Quadriceps', 'Gluteus maximus'],
    secondary: ['Hamstrings', 'Adductors'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    mechanics: 'Compound',
    summary:
      'Heavy quad loading with no spinal compression and no balance demand: the best way to add leg volume after squats.',
    setup: [
      'Sit with your back and hips flat against the pad.',
      'Feet shoulder-width on the platform, mid-foot placement.',
      'Knees tracking in line with your toes.',
      'Release the safeties and take the weight.',
    ],
    execution: [
      'Lower the platform under control until your knees reach roughly 90° or slightly deeper.',
      'Stop before your lower back lifts off the pad.',
      'Press through your whole foot back to near lockout.',
      'Do not fully lock the knees out under load.',
    ],
    mistakes: [
      {
        title: 'Lower back rounding off the pad',
        detail:
          'Going too deep causes the pelvis to tuck, which loads the lumbar spine in flexion under heavy weight. This is the main injury risk on the leg press. Stop before it happens.',
      },
      {
        title: 'Locking out hard',
        detail:
          'Snapping the knees straight under a heavy load stresses the joint for no benefit. Stop just short.',
      },
      {
        title: 'Hands on the knees',
        detail:
          'Pushing your knees with your hands is a sign the weight is too heavy. Hold the handles.',
      },
      {
        title: 'Loading it for ego',
        detail:
          'The leg press flatters everyone because there is no stabilisation demand. Quarter reps with eight plates build less than full reps with four.',
      },
    ],
    programming: {
      sets: '3–4',
      reps: '10–15',
      rest: '2 min',
      note: 'Ideal for adding quad volume after squats, when your lower back is already fatigued but your legs have more to give.',
    },
    variations: [
      'High foot placement: more glutes and hamstrings',
      'Low foot placement: more quads',
      'Single-leg press: fixes imbalances',
      'Hack Squat: similar pattern, more upright',
    ],
    faq: [
      {
        q: 'How deep should I go on leg press?',
        a: 'As deep as you can go while keeping your lower back flat against the pad. For most people that is around 90° of knee bend or slightly past. The moment your hips start to curl up, you have exceeded your useful range.',
      },
      {
        q: 'Is leg press as good as squats?',
        a: 'Not as a replacement: squats train stabilisation, core and the whole posterior chain in a way the leg press cannot. As a supplement for adding quad volume without further taxing your lower back, it is excellent.',
      },
    ],
  },
  {
    slug: 'leg-curl',
    name: 'Leg Curl',
    aliases: ['Hamstring Curl', 'Lying Leg Curl', 'Seated Leg Curl'],
    muscleGroup: 'Legs',
    primary: ['Hamstrings'],
    secondary: ['Calves'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    mechanics: 'Isolation',
    summary:
      'The only common exercise that trains the hamstrings through knee flexion: a function hinges do not cover.',
    setup: [
      'Adjust the machine so the knee joint lines up with the machine\'s pivot.',
      'Set the pad just above your heels, on the Achilles.',
      'Hold the handles and keep your hips pressed down.',
    ],
    execution: [
      'Curl your heels toward your glutes.',
      'Squeeze at the top for a beat.',
      'Lower slowly: the eccentric matters more here than the concentric.',
      'Keep your hips flat throughout.',
    ],
    mistakes: [
      {
        title: 'Lifting the hips to help',
        detail:
          'Hips rising off the pad means the weight is too heavy and the glutes are assisting. Keep them pinned.',
      },
      {
        title: 'Rushing the negative',
        detail:
          'Letting the weight slam back cuts out the eccentric, which is where most hamstring adaptation comes from. Three seconds down.',
      },
      {
        title: 'Misaligned knee pivot',
        detail:
          'If the machine\'s axis does not match your knee, the resistance curve is wrong and the joint takes shear. Spend the ten seconds adjusting it.',
      },
    ],
    programming: {
      sets: '3–4',
      reps: '10–15',
      rest: '60 s',
      note: 'Hamstrings work at both the hip and knee. RDLs cover the hip; leg curls cover the knee. You need both.',
    },
    variations: [
      'Seated leg curl: hip flexed, greater hamstring stretch, generally more effective',
      'Lying leg curl: hip extended',
      'Nordic curl: bodyweight eccentric, extremely demanding',
    ],
    faq: [
      {
        q: 'Seated or lying leg curl?',
        a: 'Seated, if you have to choose. The flexed hip position places the hamstrings under greater stretch, and training a muscle in its lengthened position tends to produce more growth.',
      },
      {
        q: 'Do I need leg curls if I do Romanian deadlifts?',
        a: 'Yes. The hamstrings both extend the hip and flex the knee. RDLs train hip extension only: leg curls are the knee-flexion half of the job.',
      },
    ],
  },
  {
    slug: 'leg-extension',
    name: 'Leg Extension',
    aliases: ['Knee Extension', 'Quad Extension'],
    muscleGroup: 'Legs',
    primary: ['Quadriceps'],
    secondary: [],
    equipment: 'Machine',
    difficulty: 'Beginner',
    mechanics: 'Isolation',
    summary:
      'Pure quad isolation, and the only common movement that fully loads the rectus femoris at short lengths.',
    setup: [
      'Adjust the seat so your knee lines up with the machine\'s pivot point.',
      'Set the ankle pad just above your feet, on the lower shin.',
      'Sit back into the seat and hold the handles.',
    ],
    execution: [
      'Extend your knees until your legs are straight.',
      'Pause and squeeze at the top.',
      'Lower slowly to a full stretch.',
      'Keep your hips and lower back in contact with the seat.',
    ],
    mistakes: [
      {
        title: 'Swinging the weight up',
        detail:
          'Using momentum defeats the point of an isolation exercise. If you are bouncing out of the bottom, reduce the load.',
      },
      {
        title: 'Lifting the hips off the seat',
        detail: 'Means the weight is too heavy. Stay seated and reduce it.',
      },
      {
        title: 'Cutting the range at the bottom',
        detail:
          'The stretched position is valuable. Let the weight come all the way down under control.',
      },
    ],
    programming: {
      sets: '3',
      reps: '12–20',
      rest: '60 s',
      note: 'A finisher, not a main lift. Take these close to failure: the fatigue cost is low and the quads respond well.',
    },
    variations: [
      'Single-leg extension: fixes imbalances',
      'Paused extension: 2 s hold at the top',
      'Sissy Squat: bodyweight alternative with a big stretch',
    ],
    faq: [
      {
        q: 'Are leg extensions bad for your knees?',
        a: 'For healthy knees, no. Older concerns about shear force were based on studies of injured or reconstructed knees. If you have existing knee pain, reduce the range at the top and keep the load moderate.',
      },
    ],
  },
  {
    slug: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    aliases: ['Rear-Foot Elevated Split Squat', 'RFESS'],
    muscleGroup: 'Legs',
    primary: ['Quadriceps', 'Gluteus maximus'],
    secondary: ['Hamstrings', 'Adductors', 'Core'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    mechanics: 'Compound',
    summary:
      'The most effective single-leg exercise there is, and the most unpleasant, which is why it works.',
    setup: [
      'Stand about a stride length in front of a bench.',
      'Place the top of your rear foot on the bench behind you.',
      'Front foot far enough forward that your shin stays near vertical at the bottom.',
      'Hold dumbbells at your sides, torso upright.',
    ],
    execution: [
      'Lower straight down by bending the front knee.',
      'Descend until your rear knee is just above the floor.',
      'Keep the weight in your front foot: the rear leg is for balance, not drive.',
      'Push through your front heel and mid-foot to stand.',
    ],
    mistakes: [
      {
        title: 'Front foot too close to the bench',
        detail:
          'Your knee ends up far over your toes and the front ankle takes the strain. Step further forward.',
      },
      {
        title: 'Pushing off the back foot',
        detail:
          'The rear leg is a kickstand. If you are driving through it, you have turned a single-leg exercise into a bad lunge.',
      },
      {
        title: 'Leaning forward excessively',
        detail:
          'A slight forward lean shifts emphasis toward the glutes and is fine. Folding at the waist is not.',
      },
    ],
    programming: {
      sets: '3',
      reps: '8–12 each leg',
      rest: '90 s–2 min',
      note: 'Start with bodyweight. These are humbling: most people who squat heavy struggle with 12 clean bodyweight reps per side.',
    },
    variations: [
      'Barbell Bulgarian split squat: heavier loading',
      'Front-foot elevated: more range and stretch',
      'Walking Lunge: similar pattern, more conditioning',
    ],
    faq: [
      {
        q: 'How far should my front foot be from the bench?',
        a: 'Far enough that at the bottom of the rep your front shin is roughly vertical and your knee sits over your mid-foot. Too close hammers the knee; too far turns it into a hip-dominant lunge.',
      },
      {
        q: 'Why are Bulgarian split squats so hard?',
        a: 'One leg carries the entire load while also stabilising against a narrow base, and the rear leg gives almost no assistance. The stabilisation demand is what makes them both difficult and effective.',
      },
    ],
  },
  {
    slug: 'hip-thrust',
    name: 'Hip Thrust',
    aliases: ['Barbell Hip Thrust', 'Glute Bridge (floor variation)'],
    muscleGroup: 'Legs',
    primary: ['Gluteus maximus'],
    secondary: ['Hamstrings', 'Quadriceps'],
    equipment: 'Barbell',
    difficulty: 'Beginner',
    mechanics: 'Compound',
    summary:
      'The most direct glute loading available, hitting peak tension exactly where the glutes are strongest.',
    setup: [
      'Sit on the floor with your upper back against a bench, just below the shoulder blades.',
      'Roll a loaded barbell over your hips, with a pad.',
      'Feet flat, shoulder-width, positioned so your shins are vertical at the top.',
      'Tuck your chin and keep your ribs down.',
    ],
    execution: [
      'Drive through your heels and extend your hips until your torso is parallel with the floor.',
      'Squeeze the glutes hard at the top for a beat.',
      'Keep your chin tucked and your ribs down: do not arch your lower back to gain height.',
      'Lower under control without resting the bar on the floor.',
    ],
    mistakes: [
      {
        title: 'Hyperextending the lower back',
        detail:
          'The most common error. If your ribs flare and your back arches at the top, your lumbar spine is doing what your glutes should. Posterior pelvic tilt at lockout, ribs down.',
      },
      {
        title: 'Feet too close or too far',
        detail:
          'Shins should be vertical at the top. Too close and the quads take over; too far and the hamstrings do.',
      },
      {
        title: 'Bench too high or too low',
        detail:
          'The bench edge should sit just below your shoulder blades so you can pivot around it cleanly.',
      },
    ],
    programming: {
      sets: '3–4',
      reps: '8–15',
      rest: '2 min',
      note: 'You can load these heavily. A 2-second squeeze at the top is worth more than adding another plate.',
    },
    variations: [
      'Single-leg hip thrust: unilateral, no barbell needed',
      'Glute bridge: floor-based, shorter range, easy entry',
      'B-stance hip thrust: most of the unilateral benefit with more stability',
    ],
    faq: [
      {
        q: 'Do hip thrusts build glutes better than squats?',
        a: 'They load the glutes more directly and place peak tension at full hip extension, where squats provide almost none. Squats load the glutes hardest in the stretched position. They complement each other rather than compete.',
      },
      {
        q: 'Why does my lower back hurt on hip thrusts?',
        a: 'Almost always hyperextending at the top. Tuck your chin, keep your ribs pulled down, and finish the movement with a posterior pelvic tilt rather than a lumbar arch.',
      },
    ],
  },
  {
    slug: 'calf-raise',
    name: 'Calf Raise',
    aliases: ['Standing Calf Raise', 'Seated Calf Raise'],
    muscleGroup: 'Legs',
    primary: ['Gastrocnemius', 'Soleus'],
    secondary: [],
    equipment: 'Machine',
    difficulty: 'Beginner',
    mechanics: 'Isolation',
    summary:
      'Direct calf work, and one of the few exercises where a full stretch matters more than the weight on the bar.',
    setup: [
      'Position the balls of your feet on the edge of the platform.',
      'Heels hanging free with room to drop below the platform.',
      'Legs straight for standing raises (gastrocnemius), knees bent for seated (soleus).',
    ],
    execution: [
      'Lower your heels as far below the platform as your ankles allow.',
      'Pause in the stretch for a beat.',
      'Rise onto your toes as high as you can.',
      'Pause and squeeze at the top before lowering slowly.',
    ],
    mistakes: [
      {
        title: 'Bouncing through the range',
        detail:
          'The calves store and release a lot of elastic energy. Fast reps use the Achilles tendon rather than the muscle. Pause at both ends.',
      },
      {
        title: 'Partial range',
        detail:
          'Short choppy reps with heavy weight is the single reason most people\'s calves never grow. Full stretch, full contraction.',
      },
      {
        title: 'Only training straight-legged',
        detail:
          'The soleus sits under the gastrocnemius and is only properly trained with a bent knee. Seated calf raises are not optional if you want complete calves.',
      },
    ],
    programming: {
      sets: '4–5',
      reps: '10–15 standing, 15–20 seated',
      rest: '45–60 s',
      note: 'Calves tolerate and need high frequency. Three sessions a week is reasonable, and a 2-second pause in the stretch beats adding weight.',
    },
    variations: [
      'Seated calf raise: soleus',
      'Standing calf raise: gastrocnemius',
      'Leg press calf raise: no dedicated machine required',
      'Single-leg calf raise: bodyweight, fixes imbalances',
    ],
    faq: [
      {
        q: 'Why won\'t my calves grow?',
        a: 'Usually partial range of motion and bouncing. The calves are used to walking all day, so they need a genuinely challenging stimulus: full stretch at the bottom, a pause, a full contraction at the top, and enough weekly volume, often 12–20 sets.',
      },
      {
        q: 'Standing or seated calf raises?',
        a: 'Both. The gastrocnemius crosses the knee so it is trained with a straight leg (standing); the soleus does not, so it needs a bent knee (seated). Training only one leaves half the calf untrained.',
      },
    ],
  },

  // ── ARMS ───────────────────────────────────────────────────────────────
  {
    slug: 'barbell-curl',
    name: 'Barbell Curl',
    aliases: ['Standing Barbell Curl'],
    muscleGroup: 'Arms',
    primary: ['Biceps brachii'],
    secondary: ['Brachialis', 'Forearms'],
    equipment: 'Barbell',
    difficulty: 'Beginner',
    mechanics: 'Isolation',
    summary:
      'The heaviest biceps loading available, and the simplest way to progressively overload the arms.',
    setup: [
      'Stand with feet hip-width, holding a barbell with an underhand grip at shoulder width.',
      'Elbows tucked at your sides, arms extended.',
      'Shoulders back, core braced.',
    ],
    execution: [
      'Curl the bar up by bending at the elbow only.',
      'Keep your elbows pinned to your sides: they should not travel forward.',
      'Squeeze at the top without letting the bar drift toward your chest.',
      'Lower slowly to full extension.',
    ],
    mistakes: [
      {
        title: 'Swinging the torso',
        detail:
          'Using your lower back to heave the weight up is the classic curl error. If your hips move, the weight is too heavy.',
      },
      {
        title: 'Elbows drifting forward',
        detail:
          'Letting your elbows travel forward at the top turns the movement into a front raise and removes tension from the biceps.',
      },
      {
        title: 'Stopping short at the bottom',
        detail:
          'Full extension is where the biceps are loaded in a stretched position. Half-range curls with more weight build less.',
      },
    ],
    programming: {
      sets: '3',
      reps: '8–12',
      rest: '60–90 s',
      note: 'Biceps get substantial indirect work from every row and pull-up. Six to ten direct sets a week is plenty for most.',
    },
    variations: [
      'EZ-bar curl: kinder to the wrists',
      'Preacher curl: strict, eliminates swing',
      'Cable curl: constant tension',
      'Drag curl: elbows travel back, more long head',
    ],
    faq: [
      {
        q: 'Straight bar or EZ bar for curls?',
        a: 'The straight bar keeps the forearm fully supinated, which slightly increases biceps activation. The EZ bar is far kinder to the wrists and elbows. If straight-bar curls cause wrist pain, the EZ bar is the better long-term choice.',
      },
      {
        q: 'How much do biceps get worked by back exercises?',
        a: 'A great deal: rows and pull-ups involve heavy elbow flexion under load. That is why 6–10 sets of direct biceps work a week is usually sufficient alongside a normal pulling programme.',
      },
    ],
  },
  {
    slug: 'incline-dumbbell-curl',
    name: 'Incline Dumbbell Curl',
    aliases: ['Incline Curl'],
    muscleGroup: 'Arms',
    primary: ['Biceps brachii (long head)'],
    secondary: ['Brachialis'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    mechanics: 'Isolation',
    summary:
      'Curling from a reclined position puts the biceps long head under a stretch no other curl achieves.',
    setup: [
      'Set a bench to roughly 45–60°.',
      'Sit back with your shoulders against the pad and let your arms hang straight down.',
      'Palms facing forward, shoulders relaxed back.',
    ],
    execution: [
      'Curl the dumbbells up without letting your elbows travel forward.',
      'Squeeze at the top.',
      'Lower slowly all the way to a full hang: this stretch is the entire point.',
      'Keep your shoulders pinned to the bench.',
    ],
    mistakes: [
      {
        title: 'Letting the shoulders roll forward',
        detail:
          'If your shoulders come off the pad, the stretch on the long head disappears. Keep them back throughout.',
      },
      {
        title: 'Cutting the bottom of the range',
        detail:
          'The reason to do this exercise is the stretched position. Stopping short makes it a worse standing curl.',
      },
      {
        title: 'Too much weight',
        detail:
          'The stretched position is mechanically weak. Expect to use noticeably less than on standing curls.',
      },
    ],
    programming: {
      sets: '3',
      reps: '10–15',
      rest: '60 s',
      note: 'Pair with a shortened-position curl like a preacher or cable curl to cover the whole strength curve.',
    },
    variations: [
      'Single-arm incline curl: more focus per side',
      'Bench angle 45° vs 60°: steeper is a bigger stretch',
    ],
    faq: [
      {
        q: 'What angle is best for incline curls?',
        a: 'Around 45–60°. Flatter increases the stretch but becomes hard on the shoulder; steeper reduces the stretch and moves toward a standard seated curl.',
      },
    ],
  },
  {
    slug: 'hammer-curl',
    name: 'Hammer Curl',
    aliases: ['Neutral-Grip Curl'],
    muscleGroup: 'Arms',
    primary: ['Brachialis', 'Brachioradialis'],
    secondary: ['Biceps brachii'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    mechanics: 'Isolation',
    summary:
      'The neutral-grip curl that builds the brachialis: the muscle that pushes the biceps up and makes arms look thick.',
    setup: [
      'Stand holding dumbbells at your sides, palms facing each other.',
      'Elbows tucked, shoulders back, core braced.',
    ],
    execution: [
      'Curl the dumbbells up keeping the palms facing each other throughout.',
      'Elbows stay pinned at your sides.',
      'Squeeze at the top.',
      'Lower under control to full extension.',
    ],
    mistakes: [
      {
        title: 'Rotating the wrists',
        detail:
          'If your palms turn upward as you curl, you are doing a standard curl. The neutral grip is what shifts work to the brachialis.',
      },
      {
        title: 'Swinging',
        detail:
          'Hammer curls allow heavier weight than supinated curls, which tempts people into heaving. Keep the torso still.',
      },
    ],
    programming: {
      sets: '3',
      reps: '10–15',
      rest: '45–60 s',
      note: 'The brachialis sits underneath the biceps: developing it pushes the biceps up and increases apparent arm size more than biceps work alone.',
    },
    variations: [
      'Cross-body hammer curl: greater brachialis emphasis',
      'Rope cable hammer curl: constant tension',
      'Seated hammer curl: removes swing',
    ],
    faq: [
      {
        q: 'Are hammer curls better than regular curls?',
        a: 'They train different muscles rather than being better or worse. Hammer curls emphasise the brachialis and brachioradialis; supinated curls emphasise the biceps brachii. A complete arm programme includes both.',
      },
    ],
  },
  {
    slug: 'cable-curl',
    name: 'Cable Curl',
    aliases: ['Cable Bicep Curl'],
    muscleGroup: 'Arms',
    primary: ['Biceps brachii'],
    secondary: ['Brachialis', 'Forearms'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    mechanics: 'Isolation',
    summary:
      'Curling against a cable keeps tension on the biceps at every point in the range, including the top.',
    setup: [
      'Set a cable to the lowest position with a straight or EZ bar attachment.',
      'Stand a step back from the pulley so there is tension at full extension.',
      'Elbows tucked, shoulders back.',
    ],
    execution: [
      'Curl the bar up, keeping the elbows fixed at your sides.',
      'Squeeze hard at the top: unlike free weights, there is still tension there.',
      'Lower slowly to full extension without letting the stack touch down.',
    ],
    mistakes: [
      {
        title: 'Standing too close to the pulley',
        detail:
          'Standing directly under the cable means there is no tension at the bottom. Step back so the cable pulls at an angle.',
      },
      {
        title: 'Letting the stack rest between reps',
        detail:
          'The advantage of cables is continuous tension. Touching the stack down each rep gives it away.',
      },
    ],
    programming: {
      sets: '3',
      reps: '12–15',
      rest: '45 s',
      note: 'A good final biceps exercise: the constant tension makes it an effective finisher after heavier barbell work.',
    },
    variations: [
      'Rope cable curl: allows supination at the top',
      'High cable curl: peak contraction emphasis',
      'Single-arm cable curl: fixes imbalances',
    ],
    faq: [
      {
        q: 'Cable curls or dumbbell curls?',
        a: 'Cables keep tension constant through the whole range, including the top where dumbbells lose almost all resistance. Dumbbells allow a heavier absolute load and a more natural path. Using both is the practical answer.',
      },
    ],
  },
  {
    slug: 'triceps-pushdown',
    name: 'Triceps Pushdown',
    aliases: ['Cable Pushdown', 'Rope Pushdown'],
    muscleGroup: 'Arms',
    primary: ['Triceps brachii (lateral and medial heads)'],
    secondary: [],
    equipment: 'Cable',
    difficulty: 'Beginner',
    mechanics: 'Isolation',
    summary:
      'The most reliable triceps isolation movement: easy to load, easy to progress, hard to do badly.',
    setup: [
      'Set a cable at head height with a rope or straight bar.',
      'Stand upright, a small step back from the pulley.',
      'Elbows tucked at your sides, forearms roughly parallel to the floor.',
    ],
    execution: [
      'Push down by extending the elbows only.',
      'Keep your elbows pinned: they should not travel forward or flare out.',
      'Fully extend and squeeze at the bottom. If using a rope, separate the ends.',
      'Return under control until your forearms are just past parallel.',
    ],
    mistakes: [
      {
        title: 'Elbows drifting forward',
        detail:
          'Once the elbows move, your lats and shoulders join in. Keep the upper arm completely still: only the forearm moves.',
      },
      {
        title: 'Leaning over the weight',
        detail:
          'Using bodyweight to push the stack down means the weight is too heavy. Stand tall.',
      },
      {
        title: 'Not extending fully',
        detail:
          'The triceps are only fully contracted at complete elbow extension. Lock out every rep.',
      },
    ],
    programming: {
      sets: '3',
      reps: '10–15',
      rest: '45–60 s',
      note: 'Trains the lateral and medial heads well but leaves the long head short. Pair it with an overhead extension.',
    },
    variations: [
      'Rope pushdown: allows a stronger contraction',
      'Straight bar pushdown: heavier loading',
      'Single-arm reverse-grip pushdown: medial head emphasis',
    ],
    faq: [
      {
        q: 'Rope or bar for pushdowns?',
        a: 'The rope lets your hands separate at the bottom for a stronger contraction; the bar allows more weight. Rope for higher-rep work, bar when you want to load heavily.',
      },
      {
        q: 'Do pushdowns work the whole triceps?',
        a: 'No. With the arm at your side, the long head is not lengthened, so pushdowns emphasise the lateral and medial heads. Overhead extensions are needed to train the long head properly.',
      },
    ],
  },
  {
    slug: 'overhead-triceps-extension',
    name: 'Overhead Triceps Extension',
    aliases: ['Overhead Extension', 'French Press'],
    muscleGroup: 'Arms',
    primary: ['Triceps brachii (long head)'],
    secondary: [],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    mechanics: 'Isolation',
    summary:
      'The only common triceps movement that puts the long head under a genuine stretch, which is most of the muscle.',
    setup: [
      'Sit or stand holding a dumbbell with both hands, or use a rope on a low cable.',
      'Press the weight overhead with your arms extended.',
      'Elbows pointing forward, close to your head.',
      'Ribs down, core braced.',
    ],
    execution: [
      'Lower the weight behind your head by bending only at the elbows.',
      'Descend until you feel a strong stretch in the triceps.',
      'Keep the upper arms vertical: do not let the elbows flare wide.',
      'Extend back to lockout and squeeze.',
    ],
    mistakes: [
      {
        title: 'Elbows flaring out',
        detail:
          'Flared elbows shorten the range and reduce long-head involvement. Keep them close to your head, pointing forward.',
      },
      {
        title: 'Arching the lower back',
        detail:
          'Holding weight overhead tempts the ribs to flare. Brace the core and keep the ribcage down.',
      },
      {
        title: 'Too heavy',
        detail:
          'The stretched overhead position is mechanically weak and hard on the elbows. Moderate loads, full control.',
      },
    ],
    programming: {
      sets: '3',
      reps: '10–15',
      rest: '60 s',
      note: 'The long head makes up roughly two thirds of triceps mass, and only gets fully trained with the arm overhead. Do not skip this in favour of pushdowns.',
    },
    variations: [
      'Cable overhead extension: constant tension, easier on the elbows',
      'Single-arm dumbbell extension: greater range',
      'Skull crusher: lying variant, partial long-head stretch',
    ],
    faq: [
      {
        q: 'Why do overhead extensions hurt my elbows?',
        a: 'Usually too much weight in a mechanically weak position, or flaring the elbows. Reduce the load, keep the elbows close to your head, and switch to a cable version, which has a gentler resistance curve at the stretched point.',
      },
      {
        q: 'Are overhead extensions necessary?',
        a: 'If you want complete triceps development, yes. The long head crosses the shoulder joint, so it is only fully lengthened when the arm is overhead: pushdowns leave it comparatively untrained.',
      },
    ],
  },

  // ── CORE ───────────────────────────────────────────────────────────────
  {
    slug: 'hanging-leg-raise',
    name: 'Hanging Leg Raise',
    aliases: ['Hanging Knee Raise'],
    muscleGroup: 'Core',
    primary: ['Rectus abdominis', 'Hip flexors'],
    secondary: ['Obliques', 'Forearms'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    mechanics: 'Compound',
    summary:
      'The most effective bodyweight ab exercise, and one that trains grip and shoulder stability at the same time.',
    setup: [
      'Hang from a pull-up bar with an overhand grip, arms straight.',
      'Engage your shoulders: do not hang completely slack.',
      'Legs together, body still.',
    ],
    execution: [
      'Curl your pelvis upward as you raise your legs: the pelvic tilt is the actual ab work.',
      'Raise until your thighs are at least parallel to the floor, higher if you can.',
      'Lower slowly under control, resisting the swing.',
      'Pause at the bottom before the next rep.',
    ],
    mistakes: [
      {
        title: 'Swinging',
        detail:
          'Using momentum to kick the legs up removes the abs almost entirely. Pause at the bottom of every rep.',
      },
      {
        title: 'Only raising the legs',
        detail:
          'If your pelvis stays neutral and only your hips flex, you are training hip flexors, not abs. Curl the pelvis toward your ribcage.',
      },
      {
        title: 'Dropping down fast',
        detail:
          'The lowering phase is where much of the work is. Take three seconds.',
      },
    ],
    programming: {
      sets: '3',
      reps: '10–15',
      rest: '60 s',
      note: 'Progress from bent knees to straight legs to toes-to-bar. Once 15 straight-leg reps are easy, add a dumbbell between your feet.',
    },
    variations: [
      'Hanging knee raise: easier entry point',
      'Captain\'s chair leg raise: removes grip as a limiter',
      'Toes-to-bar: full range progression',
    ],
    faq: [
      {
        q: 'Hanging leg raises or crunches?',
        a: 'Hanging leg raises, for most purposes. They train the abs through a longer range under greater load, and add grip and shoulder stability work. Crunches are a reasonable option if grip strength is the limiting factor.',
      },
      {
        q: 'Why do I feel leg raises in my hip flexors?',
        a: 'Because you are flexing at the hip without curling the pelvis. The abs tilt the pelvis posteriorly, if that is not happening, the hip flexors do all the work. Focus on rolling your pelvis up toward your ribs.',
      },
    ],
  },
];

export const bySlug = (slug: string) => exercises.find((e) => e.slug === slug);

export const byMuscleGroup = (group: MuscleGroup) =>
  exercises.filter((e) => e.muscleGroup === group);
