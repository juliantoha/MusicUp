# PianoTales Collections Migration

This migration adds all 48 pieces across 4 collections to the PianoTales series.

## What's Added

### Collections (4 total)

1. **Foundations Twelve** (Primary Collection)
   - The essential nursery rhymes and first songs
   - 12 pieces

2. **Games & Classroom Classics**
   - Interactive songs for group activities
   - 12 pieces

3. **Rhyme & Motion Twelve**
   - Action songs that get kids moving
   - 12 pieces

4. **Folk Journeys & Anthems**
   - Timeless folk songs and American classics
   - 12 pieces

### Pieces (48 total)

All pieces include:
- Title
- Composer information
- Year composed
- Order within collection
- 3 difficulty stages (Stage 1, 2, and 3)

**Total database entries:**
- 4 collections
- 48 pieces
- 144 piece stages (48 pieces × 3 stages each)

## How to Run

### Option 1: Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Create a new query
4. Copy and paste the contents of `016_add_pianotales_collections.sql`
5. Click "Run"

### Option 2: Supabase CLI
```bash
supabase db execute -f sql/016_add_pianotales_collections.sql
```

### Option 3: Direct psql
```bash
psql -h your-project.supabase.co -U postgres -d postgres -f sql/016_add_pianotales_collections.sql
```

## Verification

After running the migration, verify the data with these queries:

### Check Collections
```sql
SELECT c.title, c.order_index, c.is_primary
FROM collections c
JOIN series s ON c.series_id = s.id
WHERE s.slug = 'pianotales'
ORDER BY c.order_index;
```

Expected: 4 collections

### Check Pieces Count
```sql
SELECT c.title, COUNT(p.id) as piece_count
FROM collections c
JOIN series s ON c.series_id = s.id
LEFT JOIN pieces p ON p.collection_id = c.id
WHERE s.slug = 'pianotales'
GROUP BY c.title, c.order_index
ORDER BY c.order_index;
```

Expected: 12 pieces per collection

### Check All Pieces
```sql
SELECT
  c.title as collection,
  p.title as piece,
  p.composer,
  p.year_composed,
  p.order_index
FROM pieces p
JOIN collections c ON p.collection_id = c.id
JOIN series s ON c.series_id = s.id
WHERE s.slug = 'pianotales'
ORDER BY c.order_index, p.order_index;
```

Expected: 48 pieces total

### Check Piece Stages
```sql
SELECT
  COUNT(*) as total_stages,
  COUNT(DISTINCT piece_id) as pieces_with_stages
FROM piece_stages ps
JOIN pieces p ON ps.piece_id = p.id
JOIN collections c ON p.collection_id = c.id
JOIN series s ON c.series_id = s.id
WHERE s.slug = 'pianotales';
```

Expected: 144 total stages, 48 pieces with stages

## Song List by Collection

### Collection 1: Foundations Twelve
1. ABC (Alphabet Song)
2. Twinkle, Twinkle, Little Star
3. Old MacDonald Had a Farm
4. Row, Row, Row Your Boat
5. Baa, Baa, Black Sheep
6. Mary Had a Little Lamb
7. London Bridge Is Falling Down
8. The Farmer in the Dell
9. Ring Around the Rosie
10. This Old Man
11. Hickory Dickory Dock
12. Happy Birthday to You

### Collection 2: Games & Classroom Classics
13. The Muffin Man
14. Pat-a-Cake
15. Pease Porridge Hot
16. Pop Goes the Weasel
17. B-I-N-G-O
18. The More We Get Together
19. She'll Be Coming 'Round the Mountain
20. Yankee Doodle
21. I've Been Working on the Railroad
22. Skip to My Lou
23. Little Bo-Peep
24. Three Blind Mice

### Collection 3: Rhyme & Motion Twelve
25. Itsy Bitsy Spider
26. John Jacob Jingleheimer Schmidt
27. The Green Grass Grew All Around
28. Michael Finnegan
29. The Old Gray Mare
30. Did You Ever See a Lassie?
31. Shoo Fly, Don't Bother Me
32. Hot Cross Buns
33. Three Little Kittens
34. Teddy Bear, Teddy Bear
35. Engine, Engine Number Nine
36. Here We Go Looby Loo

### Collection 4: Folk Journeys & Anthems
37. Camptown Races
38. Home on the Range
39. Oh My Darling, Clementine
40. My Bonnie Lies Over the Ocean
41. Alouette
42. Frère Jacques (Are You Sleeping?)
43. Michael, Row the Boat Ashore
44. Take Me Out to the Ball Game
45. America the Beautiful
46. The Star-Spangled Banner
47. You're a Grand Old Flag
48. Brahms' Lullaby (Cradle Song)

## Next Steps

After running this migration, you'll be able to:
1. Browse PianoTales pieces in the library
2. Book concerts using PianoTales collections
3. Download sheet music and audio for each piece at all 3 difficulty levels

## Notes

- All piece stages have placeholder PDF and audio paths in the format:
  - PDFs: `scores/{piece_id}/stage-{1,2,3}.pdf`
  - Audio: `audio/{piece_id}/stage-{1,2,3}.mp3`
- You'll need to upload the actual files to Supabase Storage at these paths
- The migration uses `ON CONFLICT DO NOTHING` so it's safe to run multiple times
