'use client'

import { motion, MotionValue, useTransform } from 'motion/react';
import ScaleToFit from '@/components/elements/ScaleToFit/ScaleToFit';
import VersionControlTitle from '../../DevelopmentVersionControl/VersionControlTitle/VersionControlTitle';

interface Props{
  holdProgress      : MotionValue<number>;  // 0 to 1 while face 3 is pinned: branch grows from its origin to the bottom edge
  exitProgress      : MotionValue<number>;  // 0 to 1 as the unpinned cube scrolls up: box fades away, branch continues out
  branchOffsetX     : number;               // px from the face's center to the Version Control main branch below
  connectorLength   : number;               // px from the face's bottom edge to the top of that main branch
}

const branchWidth = 5;

const VersionFace = ({
  holdProgress,
  exitProgress,
  branchOffsetX,
  connectorLength
}: Props) => {

  const originScale     = useTransform(holdProgress, [0, 0.3], [0, 1]);
  const faceLineScale   = useTransform(holdProgress, [0.2, 1], [0, 1]);
  const connectorScale  = useTransform(exitProgress, [0.1, 0.55], [0, 1]); // Grows as the box outline fades (see ProcessCube)

  return(<>
    {/* Title (upper part of the face) */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '28%' }}>
      <ScaleToFit padTop={24}>
        <VersionControlTitle />
      </ScaleToFit>
    </div>

    {/* Main branch start: origin commit, line down to the bottom edge, then on to the Version Control section */}
    <div style={{ position: 'absolute', top: '76%', bottom: '-4px', left: `calc(50% + ${branchOffsetX}px)`, width: 0 }}>
      <motion.div
        style={{
          position: 'absolute', top: 15, left: -branchWidth / 2,
          width: branchWidth, height: 'calc(100% - 15px)',
          backgroundColor: 'black',
          transformOrigin: 'top', scaleY: faceLineScale
        }}
      />
      <motion.div
        style={{
          position: 'absolute', top: 'calc(100% - 2px)', left: -branchWidth / 2,   // Overlaps the face line slightly so there's no seam
          width: branchWidth, height: connectorLength + 2,
          backgroundColor: 'black',
          transformOrigin: 'top', scaleY: connectorScale
        }}
      />
      <motion.svg
        width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', top: 0, left: -15, scale: originScale }}
      >
        <circle cx="15" cy="15" r="10.5" stroke="black" strokeWidth="7" fill="#F9F7F4" />
      </motion.svg>
    </div>
  </>)
}

export default VersionFace;
