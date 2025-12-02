import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

interface TouchControlsProps {
  onLeftStart: () => void;
  onLeftEnd: () => void;
  onRightStart: () => void;
  onRightEnd: () => void;
  onJump: () => void;
}

export function TouchControls({
  onLeftStart,
  onLeftEnd,
  onRightStart,
  onRightEnd,
  onJump,
}: TouchControlsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 pointer-events-none z-50">
      <div className="flex justify-between items-end max-w-lg mx-auto">
        {/* Movement buttons */}
        <div className="flex gap-2 pointer-events-auto">
          <Button
            variant="control"
            size="controlLg"
            onTouchStart={(e) => {
              e.preventDefault();
              onLeftStart();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              onLeftEnd();
            }}
            onMouseDown={onLeftStart}
            onMouseUp={onLeftEnd}
            onMouseLeave={onLeftEnd}
            className="select-none"
          >
            <ArrowLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="control"
            size="controlLg"
            onTouchStart={(e) => {
              e.preventDefault();
              onRightStart();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              onRightEnd();
            }}
            onMouseDown={onRightStart}
            onMouseUp={onRightEnd}
            onMouseLeave={onRightEnd}
            className="select-none"
          >
            <ArrowRight className="h-8 w-8" />
          </Button>
        </div>

        {/* Jump button */}
        <div className="pointer-events-auto">
          <Button
            variant="control"
            size="controlLg"
            onTouchStart={(e) => {
              e.preventDefault();
              onJump();
            }}
            onMouseDown={onJump}
            className="select-none bg-primary/30 border-primary/50"
          >
            <ArrowUp className="h-8 w-8" />
          </Button>
        </div>
      </div>
    </div>
  );
}
