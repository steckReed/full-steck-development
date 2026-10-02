import { AnimationSequence } from '@/types/types';
import { AnimationDefinition
        ,AnimationScope
        } from 'motion/react';
import { useRef, useEffect } from 'react';

const useAnimationSequence = (
  scope: AnimationScope<any>,
  animate: (...args: any[]) => any,
  animationSequence: AnimationSequence[],
  startAnimOn: Map<string, boolean>
) => {
  const previousShouldStartAnimation = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    async function runAnimationSequence(eleAnimSequence: AnimationSequence, eleRef: string) {
      if (eleAnimSequence.animations) {
        for (const step of eleAnimSequence.animations) {
          if (step.animate) {
            await animate(eleRef, step.animate, step.transition);
          }
        }
      }
    }

    animationSequence.forEach((eleAnimSequence, index) => {
      const eleRef = (eleAnimSequence?.id) ?(`#${eleAnimSequence.id}`) :(scope.current)

      // Validate that animStartOn is set correctly
      if (!eleAnimSequence.animStartOn || !startAnimOn.has(eleAnimSequence.animStartOn)) {
        console.warn(`Warning: Please set \`animStartOn\` when using useAnimationSequence\nIssue Element: ${eleRef}\nUsed Start: ${eleAnimSequence.animStartOn}`);
        return;
      }

      const shouldStartAnimation  = startAnimOn.get(eleAnimSequence.animStartOn) ?? false;
      const previousState         = previousShouldStartAnimation.current[index] || false;
      
      if (shouldStartAnimation !== previousState) {
        // Update the previous state for this specific element's animation sequence
        previousShouldStartAnimation.current[index] = shouldStartAnimation;

          
        // Handle transitioning from false to true (scrolling down)
        if (shouldStartAnimation) {
          if (eleAnimSequence.initial) {
            animate(eleRef, eleAnimSequence.initial as AnimationDefinition);
            
          } else {
            animate(eleRef, { opacity: 1 });
          }

          runAnimationSequence(eleAnimSequence, eleRef);
        }

        // Handle transitioning from true to false (scrolling up)
        else {
          if (eleAnimSequence.exit) {
            animate(eleRef, eleAnimSequence.exit);

          } else if (eleAnimSequence.initial) {
            animate(eleRef, eleAnimSequence.initial as AnimationDefinition);
            
          } else {
            animate(eleRef, { opacity: 0 });
          }
        }
        
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationSequence, startAnimOn]);
};

export default useAnimationSequence;


