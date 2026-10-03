import { Box } from '@mui/material';
import { tagChipMap } from '@/data/projects';

interface Props{
  tags: string[];
}

const TagChips = ({ tags }: Props) => {

  return(
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
      {tags.map((tag) => {
        const chipData = tagChipMap[tag];
        return chipData ? (
          <span
            key={tag}
            style={{
              backgroundColor: chipData.color,
              color: 'white',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            {chipData.label}
          </span>
        ) : null;
      })}
    </Box>
  )
};

export default TagChips;
